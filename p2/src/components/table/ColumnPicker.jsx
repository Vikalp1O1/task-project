import { useEffect, useRef, useState } from 'react';
import { Columns3 } from 'lucide-react';
import { Button } from '../ui/Button';

export function ColumnPicker({ columns, visibleColumns, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <Button
        size="sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="column-picker"
      >
        <Columns3 size={14} />
        Columns
        <span className="text-xs text-muted">
          {visibleColumns.length}/{columns.length}
        </span>
      </Button>
      {open && (
        <div id="column-picker" className="column-popover">
          <div className="flex items-center justify-between border-b border-line p-3">
            <p className="text-sm font-semibold">Visible columns</p>
            <button
              type="button"
              className="text-sm font-medium text-brand"
              onClick={() => onChange(columns.map((column) => column.id))}
            >
              Show all
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {columns.map((column) => (
              <label
                key={column.id}
                className="flex cursor-pointer items-center gap-3 rounded px-2 py-2.5 text-sm hover:bg-canvas"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand"
                  checked={visibleColumns.includes(column.id)}
                  disabled={visibleColumns.length === 1 && visibleColumns[0] === column.id}
                  onChange={(event) =>
                    onChange(
                      event.target.checked
                        ? [...visibleColumns, column.id]
                        : visibleColumns.filter((id) => id !== column.id),
                    )
                  }
                />
                <span className="flex-1">{column.label}</span>
              </label>
            ))}
          </div>
          <p className="border-t border-line p-3 text-xs text-muted">
            Keep at least one column visible.
          </p>
        </div>
      )}
    </div>
  );
}
