import { useMemo, useState } from 'react';
import { ArrowDownToLine, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import { DatasetSummary } from './components/dataset/DatasetSummary';
import { UploadDialog } from './components/dataset/UploadDialog';
import { FilterBuilder } from './components/filters/FilterBuilder';
import { ColumnPicker } from './components/table/ColumnPicker';
import { DataTable } from './components/table/DataTable';
import { RecordDialog } from './components/table/RecordDialog';
import { Button } from './components/ui/Button';
import { SearchInput } from './components/ui/SearchInput';
import { Pagination } from './components/ui/Pagination';
import { useDataset } from './hooks/useDataset';
import { useDebounce } from './hooks/useDebounce';
import { queryRows } from './lib/filters';
import { serializeCSV } from './lib/csv';
import { downloadText, formatNumber } from './lib/utils';

function Explorer({ dataset }) {
  const [filters, setFilters] = useState([]);
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(() => dataset.columns.map((column) => column.id));
  const [selectedRow, setSelectedRow] = useState(null);
  const results = useMemo(() => queryRows({ rows: dataset.rows, columns: dataset.columns, filters, mode, search: debouncedSearch, sort }), [dataset, filters, mode, debouncedSearch, sort]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(results.length / pageSize)));
  const pageRows = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const columns = dataset.columns.filter((column) => visibleColumns.includes(column.id));
  const applyFilters = (next, nextMode) => { setFilters(next); setMode(nextMode); setPage(1); };
  const resetView = () => { setSearch(''); setFilters([]); setMode('all'); setSort(null); setPage(1); };
  const exportView = () => {
    try {
      downloadText(serializeCSV(columns, results), `${dataset.name.replace(/\.csv$/i, '')}_filtered.csv`);
      toast.success(`Exported ${formatNumber(results.length)} rows`);
    } catch { toast.error('Export failed. Please try again.'); }
  };
  const changeSort = (columnId) => {
    setSort((current) => current?.columnId === columnId ? current.direction === 'asc' ? { columnId, direction: 'desc' } : null : { columnId, direction: 'asc' });
    setPage(1);
  };
  return <>
    <DatasetSummary dataset={dataset} />
    <FilterBuilder columns={dataset.columns} filters={filters} mode={mode} onApply={applyFilters} />
    <section className="panel" aria-label="Dataset records">
      <div className="table-title"><h2 className="text-base font-semibold">Records <span className="ml-2 text-sm font-normal text-muted" aria-live="polite">{formatNumber(results.length)} of {formatNumber(dataset.rows.length)}</span></h2></div>
      <div className="table-toolbar">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} pending={search !== debouncedSearch} />
        <div className="flex flex-wrap items-center gap-2">
          {(search || filters.length > 0 || sort) && <Button size="sm" variant="ghost" onClick={resetView}><RotateCcw size={15} />Reset</Button>}
          <ColumnPicker columns={dataset.columns} visibleColumns={visibleColumns} onChange={setVisibleColumns} />
          <Button size="sm" onClick={exportView} disabled={!results.length}><ArrowDownToLine size={16} />Export CSV</Button>
        </div>
      </div>
      <DataTable columns={columns} rows={pageRows} sort={sort} onSort={changeSort} onOpenRow={setSelectedRow} onReset={resetView} totalColumns={dataset.columns.length} />
      <Pagination page={currentPage} pageSize={pageSize} total={results.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
    </section>
    <RecordDialog row={selectedRow} columns={dataset.columns} onClose={() => setSelectedRow(null)} />
  </>;
}

export default function App() {
  const { dataset, loading, error, loadSample, upload } = useDataset();
  const [uploadOpen, setUploadOpen] = useState(false);
  return <AppShell onUpload={() => setUploadOpen(true)}>
    {loading && !dataset ? <div className="panel flex min-h-80 items-center justify-center gap-3" role="status"><span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />Loading CSV...</div>
      : dataset ? <Explorer key={dataset.id} dataset={dataset} />
      : <section className="panel flex min-h-80 flex-col items-center justify-center p-6 text-center"><FileSpreadsheet size={36} className="text-muted" /><h2 className="mt-4 text-lg font-semibold">Upload a CSV file</h2>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}<Button className="mt-5" onClick={loadSample} loading={loading}>Load sample CSV</Button></section>}
    {loading && dataset && <div role="status" className="loading-toast"><span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />Loading CSV...</div>}
    <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={upload} onLoadSample={loadSample} />
  </AppShell>;
}
