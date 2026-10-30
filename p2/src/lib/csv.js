import Papa from 'papaparse';
import { humanize } from './utils';

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
const NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

function isLosslessNumber(value) {
  if (!NUMBER.test(value)) return false;
  const numeric = Number(value);
  return Number.isFinite(numeric) && (!Number.isInteger(numeric) || Number.isSafeInteger(numeric));
}

export function isISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function inferType(values) {
  const populated = values.map((value) => value.trim()).filter(Boolean);
  if (!populated.length) return 'text';
  if (populated.every((value) => /^(true|false)$/i.test(value))) return 'boolean';
  if (populated.every(isLosslessNumber)) return 'number';
  if (populated.every(isISODate)) return 'date';
  return 'text';
}

export function createDataset(text, name = 'dataset.csv', size = new Blob([text]).size) {
  if (size > MAX_FILE_BYTES) throw new Error('Please choose a CSV file smaller than 10 MB.');
  if (text.includes('\0'))
    throw new Error('Please save your CSV with UTF-8 encoding and try again.');
  const parsed = Papa.parse(text.replace(/^\uFEFF/, ''), { skipEmptyLines: 'greedy' });
  // A single-column CSV has no delimiter to detect. Papa falls back to commas;
  // this warning is harmless, while malformed quoting must still be rejected.
  const parseError = parsed.errors.find((error) => error.code !== 'UndetectableDelimiter');
  if (parseError) throw new Error(`CSV could not be parsed: ${parseError.message}`);
  if (parsed.data.length < 2)
    throw new Error('Your CSV needs a header row and at least one data row.');
  const [rawHeaders, ...rawRows] = parsed.data;
  const headers = rawHeaders.map((header) => header.trim());
  if (headers.some((header) => !header))
    throw new Error('Every column needs a column name. Check for empty column headers.');
  if (new Set(headers.map((header) => header.toLowerCase())).size !== headers.length) {
    throw new Error('Column names must be unique. Rename duplicate headers and try again.');
  }
  if (headers.length > 100) throw new Error('Please use a CSV with no more than 100 columns.');
  if (rawRows.length > 50000) throw new Error('Please use a CSV with no more than 50,000 rows.');
  const mismatch = rawRows.findIndex((row) => row.length !== headers.length);
  if (mismatch !== -1)
    throw new Error(
      `Data row ${mismatch + 1} has ${rawRows[mismatch].length} fields; expected ${headers.length}. Check commas and quoted values.`,
    );
  const columns = headers.map((key, index) => ({
    id: `col-${index}`,
    key,
    label: humanize(key),
    index,
    type: inferType(rawRows.map((row) => row[index])),
  }));
  const rows = rawRows.map((cells, index) => ({ id: index + 1, cells }));
  return { id: crypto.randomUUID(), name, size, columns, rows, loadedAt: new Date().toISOString() };
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The file could not be read. Please choose it again.'));
    reader.onload = () => {
      try {
        resolve(createDataset(reader.result, file.name, file.size));
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
}

export function serializeCSV(columns, rows) {
  // Prevent spreadsheet formula execution in exported user-supplied values.
  return Papa.unparse(
    {
      fields: columns.map((column) => column.key),
      data: rows.map((row) => columns.map((column) => row.cells[column.index])),
    },
    { escapeFormulae: true },
  );
}
