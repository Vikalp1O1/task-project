import { ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';

export function HelpDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="A clearer view of your data"
      description="Everything you need to explore a CSV, without leaving your browser."
    >
      <ol className="guide-list">
        <li>
          <strong>Bring your data.</strong> Upload a .csv file with a header row, or explore the
          included shampoo shelf-audit sample. Limit: 10 MB, 50,000 rows, 100 columns.
        </li>
        <li>
          <strong>Find what matters.</strong> Search all columns, or add column-specific filters.
          Numbers, dates, true/false values, and text get appropriate conditions.
        </li>
        <li>
          <strong>Combine your conditions.</strong> “Match all” requires every filter to match;
          “Match any” requires at least one. Search always narrows the result further. Apply
          filters to update the table.
        </li>
        <li>
          <strong>Make it your view.</strong> Sort a column, choose visible columns, change page
          size, or open a row for its complete record.
        </li>
        <li>
          <strong>Take your results.</strong> Export all matching rows and visible columns, in the
          current sort order. Pagination does not limit the export.
        </li>
      </ol>
      <p className="mt-5 rounded-lg bg-canvas p-3 text-xs leading-6 text-muted">
        Empty cells use a dash in the table. Text comparisons ignore capitalization. Files and
        filters reset when you refresh; uploaded data is never saved or sent to a server.
      </p>
      <Button variant="primary" className="mt-5 w-full" onClick={onClose}>
        Let’s explore
        <ArrowUpRight size={15} />
      </Button>
    </Dialog>
  );
}

export default HelpDialog;

