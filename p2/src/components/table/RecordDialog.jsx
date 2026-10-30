import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { CellValue } from './DataTable';

export function RecordDialog({ row, columns, onClose }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          Object.fromEntries(columns.map((column) => [column.key, row.cells[column.index]])),
          null,
          2,
        ),
      );
      toast.success('Record copied as JSON');
    } catch {
      toast.error('Clipboard access is unavailable in this browser.');
    }
  };
  return (
    <Dialog
      open={Boolean(row)}
      onClose={onClose}
      title={`Record #${row?.id || ''}`}
      className="record-dialog"
    >
      {row && (
        <>
          <dl className="record-grid">
            {columns.map((column) => (
              <div key={column.id} className="record-field">
                <dt className="mb-2 text-sm font-medium text-muted">
                  {column.label}
                </dt>
                <dd className="break-words text-sm">
                  <CellValue value={row.cells[column.index]} column={column} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex justify-end border-t border-line pt-4">
            <Button size="sm" onClick={copy}>
              <Copy size={13} />
              Copy as JSON
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
}

export default RecordDialog;

