import { z } from 'zod';
import { isISODate } from './csv';

const EMPTY_OPERATORS = ['isEmpty', 'isNotEmpty'];
export const OPERATORS = {
  contains: 'Contains',
  notContains: 'Does not contain',
  equals: 'Equals',
  notEquals: 'Does not equal',
  startsWith: 'Starts with',
  gt: 'Greater than',
  gte: 'At least',
  lt: 'Less than',
  lte: 'At most',
  before: 'Before',
  after: 'After',
  isEmpty: 'Is empty',
  isNotEmpty: 'Is not empty',
};
export const TYPE_OPERATORS = {
  text: ['contains', 'notContains', 'equals', 'notEquals', 'startsWith', ...EMPTY_OPERATORS],
  number: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', ...EMPTY_OPERATORS],
  date: ['equals', 'notEquals', 'before', 'after', ...EMPTY_OPERATORS],
  boolean: ['equals', 'notEquals', ...EMPTY_OPERATORS],
};
export const needsValue = (operator) => !EMPTY_OPERATORS.includes(operator);
export const defaultOperator = (type) => (type === 'text' ? 'contains' : 'equals');

export function createFilterSchema(columns) {
  return z.object({
    mode: z.enum(['all', 'any']),
    filters: z
      .array(
        z
          .object({ columnId: z.string(), operator: z.string(), value: z.string() })
          .superRefine((filter, context) => {
            const column = columns.find((item) => item.id === filter.columnId);
            if (!column) {
              context.addIssue({ code: 'custom', path: ['columnId'], message: 'Choose a column.' });
              return;
            }
            if (!TYPE_OPERATORS[column.type].includes(filter.operator))
              context.addIssue({
                code: 'custom',
                path: ['operator'],
                message: 'Choose a valid condition.',
              });
            if (!needsValue(filter.operator)) return;
            if (!filter.value.trim())
              context.addIssue({ code: 'custom', path: ['value'], message: 'Enter a value.' });
            else if (column.type === 'number' && !Number.isFinite(Number(filter.value)))
              context.addIssue({
                code: 'custom',
                path: ['value'],
                message: 'Enter a valid number.',
              });
            else if (column.type === 'date' && !isISODate(filter.value))
              context.addIssue({
                code: 'custom',
                path: ['value'],
                message: 'Choose a valid date.',
              });
            else if (column.type === 'boolean' && !['true', 'false'].includes(filter.value))
              context.addIssue({
                code: 'custom',
                path: ['value'],
                message: 'Choose true or false.',
              });
          }),
      )
      .max(20, 'You can combine up to 20 filters.'),
  });
}

export function matchesFilter(row, filter, columns) {
  const column = columns.find((item) => item.id === filter.columnId);
  if (!column) return false;
  const raw = row.cells[column.index].trim();
  const target = filter.value.trim();
  if (filter.operator === 'isEmpty') return raw === '';
  if (filter.operator === 'isNotEmpty') return raw !== '';
  if (!raw) return false;
  const value = column.type === 'number' ? Number(raw) : raw.toLocaleLowerCase();
  const comparison = column.type === 'number' ? Number(target) : target.toLocaleLowerCase();
  switch (filter.operator) {
    case 'contains':
      return value.includes(comparison);
    case 'notContains':
      return !value.includes(comparison);
    case 'equals':
      return value === comparison;
    case 'notEquals':
      return value !== comparison;
    case 'startsWith':
      return value.startsWith(comparison);
    case 'gt':
    case 'after':
      return value > comparison;
    case 'gte':
      return value >= comparison;
    case 'lt':
    case 'before':
      return value < comparison;
    case 'lte':
      return value <= comparison;
    default:
      return false;
  }
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
export function queryRows({ rows, columns, filters = [], mode = 'all', search = '', sort = null }) {
  const term = search.trim().toLocaleLowerCase();
  const filtered = rows.filter((row) => {
    if (term && !row.cells.some((cell) => cell.toLocaleLowerCase().includes(term))) return false;
    if (!filters.length) return true;
    const evaluate = (filter) => matchesFilter(row, filter, columns);
    return mode === 'all' ? filters.every(evaluate) : filters.some(evaluate);
  });
  if (!sort) return filtered;
  const column = columns.find((item) => item.id === sort.columnId);
  if (!column) return filtered;
  return [...filtered].sort((left, right) => {
    const a = left.cells[column.index].trim();
    const b = right.cells[column.index].trim();
    if (!a || !b) return a === b ? left.id - right.id : !a ? 1 : -1;
    const order = column.type === 'number' ? Number(a) - Number(b) : collator.compare(a, b);
    return (sort.direction === 'asc' ? order : -order) || left.id - right.id;
  });
}
