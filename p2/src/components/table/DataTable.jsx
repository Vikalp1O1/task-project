import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  CaseSensitive,
  Check,
  ChevronRight,
  Hash,
  SearchX,
  ToggleLeft,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const TYPE_ICONS = { text: CaseSensitive, number: Hash, boolean: ToggleLeft, date: CalendarDays };
const TYPE_COLORS = { text: 'text-blue-500', number: 'text-emerald-600', boolean: 'text-purple-500', date: 'text-amber-600' };

export function CellValue({ value, column }) {
  if (value.trim() === '')
    return (
      <span className="text-slate-300 font-mono" aria-label="Empty cell">
        —
      </span>
    );
  if (column.type === 'boolean')
    return (
      <span
        className={cn(
          'boolean-cell',
          value.trim().toLowerCase() === 'true' ? 'boolean-true' : 'boolean-false',
        )}
      >
        {value.trim().toLowerCase() === 'true' ? (
          <>
            <Check size={11} strokeWidth={2.5} />
            True
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            False
          </>
        )}
      </span>
    );
  if (column.key === 'region') return <span className="region-cell">{value}</span>;
  if (column.key === 'share_of_shelf_pct' && column.type === 'number')
    return (
      <span className="flex items-center gap-2.5">
        <span className="w-10 font-medium tabular-nums text-slate-800">{value}%</span>
        <span className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 shadow-2xs">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, Number(value)))}%` }}
          />
        </span>
      </span>
    );
  return (
    <span
      className={cn(
        'block max-w-[260px] truncate',
        column.type === 'number' && 'tabular-nums font-medium text-slate-900',
        (column.key.endsWith('_id') || column.key.endsWith('_code')) &&
          'font-mono text-[11px] text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-200/60 inline-block',
      )}
    >
      {value}
    </span>
  );
}

export function DataTable({ columns, rows, sort, onSort, onOpenRow, onReset, totalColumns }) {
  return (
    <div
      className="table-scroll"
      tabIndex={0}
      role="region"
      aria-label="CSV data table. Scroll horizontally for more columns."
    >
      <table className="data-table">
        <caption className="sr-only">
          CSV records. {columns.length} of {totalColumns} columns visible. Use column header buttons
          to sort.
        </caption>
        <thead>
          <tr>
            <th className="row-number-header" scope="col">
              #
            </th>
            {columns.map((column) => {
              const Icon = TYPE_ICONS[column.type];
              const iconColor = TYPE_COLORS[column.type] || 'text-slate-400';
              const active = sort?.columnId === column.id;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.id)}
                    className="table-sort"
                    aria-label={`Sort by ${column.label}`}
                    title={`${column.key} · ${column.type}`}
                  >
                    <Icon size={14} className={cn('shrink-0', iconColor)} />
                    <span className="font-semibold text-slate-800">{column.label}</span>
                    {active ? (
                      sort.direction === 'asc' ? (
                        <ArrowUp size={13} className="ml-auto text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <ArrowDown size={13} className="ml-auto text-emerald-600 stroke-[2.5]" />
                      )
                    ) : (
                      <ArrowUpDown size={12} className="ml-auto text-slate-400 hover:text-slate-700" />
                    )}
                  </button>
                </th>
              );
            })}
            <th scope="col">
              <span className="sr-only">View record</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="row-number">{row.id}</td>
              {columns.map((column) => (
                <td key={column.id} title={row.cells[column.index]}>
                  <CellValue value={row.cells[column.index]} column={column} />
                </td>
              ))}
              <td>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => onOpenRow(row)}
                  aria-label={`View record ${row.id}`}
                >
                  <ChevronRight size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="empty-table">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-muted">
            <SearchX size={23} strokeWidth={1.5} />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-slate-800">No matching records</h3>
          <p className="mt-1 text-xs text-muted">
            No rows match your current search or filter conditions.
          </p>
          <Button size="sm" className="mt-3" onClick={onReset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
