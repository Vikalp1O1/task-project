import { LoaderCircle, Search, X } from 'lucide-react';

export function SearchInput({
  value,
  onChange,
  pending,
  placeholder = 'Search records',
}) {
  return (
    <div className="search-input">
      <Search size={17} className="shrink-0 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search all records"
      />
      {pending && (
        <LoaderCircle size={15} className="animate-spin text-muted" aria-label="Updating results" />
      )}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="rounded p-1 text-muted hover:text-ink"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
