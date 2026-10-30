import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));
export const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(value);
export const humanize = (value) =>
  value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
export const formatBytes = (bytes) =>
  bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

export function downloadText(text, filename, type = 'text/csv;charset=utf-8;') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
