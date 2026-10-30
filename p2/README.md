# Column — CSV Explorer

A React JSX application for the Constems AI CSV upload and dynamic filtering task. Built with Vite, Tailwind CSS, React Hook Form, Zod, Sonner toasts, and Lucide React icons.

## Run locally

Requires Node.js 22.13+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173`.

### Windows Application Control

This project uses Rollup's official WebAssembly Node package through an npm override. This avoids requiring Rollup's platform-specific `.node` binary on machines where Windows Application Control blocks native addons. The Windows policy does not need to be changed.

If you installed dependencies before this override was added, explicitly replace the existing Rollup package (npm can otherwise retain the native package at the same version):

```sh
npm install --save-dev "rollup@npm:@rollup/wasm-node@4.66.0"
npm run dev
```

Let npm update `package-lock.json`; do not edit `node_modules` or disable Windows security settings. You can verify the replacement with `node -p "require('./node_modules/rollup/package.json').name"`; it should print `@rollup/wasm-node`.

```sh
npm run test
npm run lint
npm run build
npm run preview
```

The production output is `dist/`. Deploy that folder to any static host. No API, environment variables, database, or credentials are needed.

## Requirements implemented

- Upload a CSV using a file picker or drag and drop, then display its contents in a structured table.
- Add, edit, remove, and clear multiple column filters dynamically.
- Combine filters with AND (“match all”) or OR (“match any”).
- Validate filter values with Zod and React Hook Form, with inline errors.
- Search every column using a shared search component and a reusable 300 ms debounce hook.
- Sort ascending/descending/unsorted by clicking column headers. Numbers sort numerically, and empty cells remain last.
- Paginate results with selectable page sizes, boundary-safe navigation, and accurate row counts.
- Show/hide columns, inspect complete records, and copy a record as JSON.
- Export every matching row and selected column, preserving the sort order across all pages.
- Display loading, empty, failed-import, and success states with accessible feedback and Sonner toasts.
- Responsive layout, keyboard navigation, native modal focus trapping, labeled controls, and reduced-motion support.

The exact supplied `shampoo_share_of_shelf_6441.csv` is included under `public/data/` and loads on startup. It contains **1,000 records and 27 columns**. It is marked as sample data. Importing a new dataset replaces the current view and resets its filters, search, sorting, column selection, and pagination.

## Filter behavior

| Column type | Conditions                                                                     |
| ----------- | ------------------------------------------------------------------------------ |
| Text        | Contains, does not contain, equals, not equal, starts with, empty, not empty   |
| Number      | Equal, not equal, greater than, at least, less than, at most, empty, not empty |
| ISO date    | Equal, not equal, before, after, empty, not empty                              |
| Boolean     | Equal, not equal, empty, not empty                                             |

Click **Add filter**, choose a column and condition, enter a value, and click **Apply filters**. Multiple conditions are evaluated together. Editing a draft does not change the table until applied. Active filter chips can be removed immediately. Quick filters are available for the sample dataset.

Search is case-insensitive and always narrows the combined column-filter result. Text equality and contains operations are case-insensitive and ignore surrounding whitespace. Empty values match only the explicit empty/not-empty operators; they are never silently treated as zero or false. Dates use the unambiguous `YYYY-MM-DD` format.

## Structure

```text
public/data/           Original sample CSV
src/components/
  dataset/            File upload and dataset statistics
  filters/            Dynamic, type-aware filter form
  layout/             Sidebar, header, and getting-started guide
  table/              Data table, column visibility, record dialog
  ui/                 Shared buttons, dialog, search, pagination, error boundary
src/hooks/            Dataset lifecycle and reusable debounce
src/lib/              CSV parsing/export, filter engine, formatting utilities
tests/                Parsing, query logic, debounce, and pagination tests
```

`App.jsx` coordinates view state. CSV parsing and querying are pure functions, independent of React. Derived results are memoized rather than duplicated in state. Row IDs stay stable through filtering and sorting. Async dataset loads use request versioning so stale loads cannot overwrite newer imports.

## CSV handling and limits

Papa Parse handles quoted commas, escaped quotes, embedded newlines, CRLF, BOM, and empty lines. Imports reject malformed records, missing/duplicate headers (case-insensitive), and inconsistent field counts. Values stay as original strings so identifiers retain leading zeroes. Column types are inferred from all nonempty values; mixed columns remain text. Supported automatic boolean values are `true` and `false`, ignoring case.

Limits are 10 MB, 50,000 records, and 100 columns. The table renders only the current page. Parsing and filtering happen in browser memory; for substantially larger files, a worker and virtualized or server-backed querying would be appropriate. Export escapes spreadsheet formulas; opening an exported CSV in a spreadsheet will treat formula-like strings as text.

No uploaded CSV is sent to a server, persisted to local storage, or retained after a reload. The bundled sample is fetched from the same static application host. This is intentionally a frontend application, matching the task; no authentication or backend is added.

## Suggested reviewer walkthrough

1. Load the app and confirm 1,000 rows and 27 columns.
2. Choose the **Out of stock** quick filter.
3. Add a **Region equals West** filter, then apply. Switch between all/any to compare results.
4. Search for a brand, sort a column, and move between pages.
5. Hide columns, open a record, and export the filtered view.
6. Upload a different CSV and verify its inferred types and filters.
7. Try invalid headers or an inconsistent row to see the import error.
