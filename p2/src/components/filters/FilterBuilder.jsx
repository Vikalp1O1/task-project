import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { createFilterSchema, defaultOperator, needsValue, OPERATORS, TYPE_OPERATORS } from '../../lib/filters';

function FilterRow({ index, columns, control, register, setValue, onRemove, error }) {
  const current = useWatch({ control, name: `filters.${index}` });
  const column = columns.find((item) => item.id === current?.columnId) || columns[0];
  const valueId = `filter-value-${index}`;
  return <div>
    <div className="filter-row">
      <label className="filter-field"><span>Column</span>
        <select className="field" aria-label={`Filter ${index + 1} column`} {...register(`filters.${index}.columnId`)} onChange={(event) => {
          const next = columns.find((item) => item.id === event.target.value);
          setValue(`filters.${index}`, { columnId: next.id, operator: defaultOperator(next.type), value: next.type === 'boolean' ? 'true' : '' }, { shouldDirty: true });
        }}>{columns.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      </label>
      <label className="filter-field"><span>Condition</span>
        <select className="field" aria-label={`Filter ${index + 1} condition`} {...register(`filters.${index}.operator`)}>{TYPE_OPERATORS[column.type].map((operator) => <option key={operator} value={operator}>{OPERATORS[operator]}</option>)}</select>
      </label>
      <label className="filter-field"><span>Value</span>
        {needsValue(current?.operator) ? column.type === 'boolean' ? <select className="field" aria-label={`Filter ${index + 1} value`} {...register(`filters.${index}.value`)}><option value="true">True</option><option value="false">False</option></select>
          : <input id={valueId} className={cn('field', error?.value && 'border-red-500')} type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'} step={column.type === 'number' ? 'any' : undefined} aria-label={`Filter ${index + 1} value`} aria-invalid={Boolean(error?.value)} aria-describedby={error?.value ? `${valueId}-error` : undefined} placeholder={column.type === 'number' ? 'Enter number' : 'Enter value'} {...register(`filters.${index}.value`)} />
          : <span className="flex h-11 items-center text-sm text-muted">Not required</span>}
      </label>
      <button type="button" className="icon-button filter-remove" onClick={onRemove} aria-label={`Remove filter ${index + 1}`} title="Remove filter"><X size={19} /></button>
    </div>
    {error && <p id={`${valueId}-error`} role="alert" className="mt-2 text-sm text-red-700">{error.value?.message || error.columnId?.message || error.operator?.message}</p>}
  </div>;
}

export function FilterBuilder({ columns, filters, mode, onApply }) {
  const schema = useMemo(() => createFilterSchema(columns), [columns]);
  const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { filters, mode } });
  const { fields, append, remove } = useFieldArray({ control, name: 'filters' });
  useEffect(() => { reset({ filters, mode }); }, [filters, mode, reset]);
  const addFilter = () => {
    const column = columns.find((item) => item.key === 'brand') || columns[0];
    append({ columnId: column.id, operator: defaultOperator(column.type), value: column.type === 'boolean' ? 'true' : '' });
  };
  const clear = () => { reset({ filters: [], mode: 'all' }); onApply([], 'all'); };
  return <section className="panel" aria-label="Filter builder">
    <div className="panel-heading"><h2 className="text-base font-semibold">Filters{filters.length > 0 && <span className="ml-2 text-sm font-normal text-muted">({filters.length})</span>}</h2><Button size="sm" onClick={addFilter} disabled={fields.length >= 20}><Plus size={16} />Add filter</Button></div>
    {fields.length > 0 && <form onSubmit={handleSubmit((data) => onApply(data.filters, data.mode))} className="border-t border-line p-4 sm:p-5">
      <div className="space-y-4">{fields.map((field, index) => <FilterRow key={field.id} index={index} columns={columns} control={control} register={register} setValue={setValue} error={errors.filters?.[index]} onRemove={() => remove(index)} />)}</div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">Match<select className="inline-select" aria-label="Combine filters" {...register('mode')}><option value="all">All filters</option><option value="any">Any filter</option></select></label>
        <div className="flex items-center gap-2"><Button size="sm" variant="ghost" onClick={clear}>Clear all</Button><Button size="sm" variant="primary" type="submit">Apply filters</Button></div>
      </div>
    </form>}
    {fields.length === 0 && filters.length > 0 && (
      <div className="border-t border-line p-4 sm:p-5 flex items-center justify-between">
        <p className="text-sm text-muted">Active filter was removed.</p>
        <Button size="sm" variant="primary" onClick={clear}>Apply removal</Button>
      </div>
    )}
  </section>;
}
