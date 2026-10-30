import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatNumber } from '../../lib/utils';

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pages = [...new Set([1, pageCount, page - 1, page, page + 1])]
    .filter((number) => number > 0 && number <= pageCount)
    .sort((a, b) => a - b);
  return (
    <div className="pagination">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span>
          Showing{' '}
          <strong className="font-medium text-ink">
            {total ? formatNumber((page - 1) * pageSize + 1) : 0}–
            {formatNumber(Math.min(page * pageSize, total))}
          </strong>{' '}
          of <strong className="font-medium text-ink">{formatNumber(total)}</strong> rows
        </span>
        <label className="flex items-center gap-2">
          Rows per page{' '}
          <select
            className="page-size"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <nav aria-label="Table pagination" className="flex items-center gap-1">
        <button
          type="button"
          className="page-button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((number, index) => (
          <span key={number} className="contents">
            {index > 0 && number - pages[index - 1] > 1 && (
              <span className="px-1 text-muted">…</span>
            )}
            <button
              type="button"
              className={cn('page-button', page === number && 'page-active')}
              aria-current={page === number ? 'page' : undefined}
              aria-label={`Page ${number}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </span>
        ))}
        <button
          type="button"
          className="page-button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
