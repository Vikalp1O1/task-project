import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createDataset, parseCSVFile } from '../lib/csv';

export function useDataset() {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const version = useRef(0);
  const sampleController = useRef(null);

  const loadSample = useCallback(async () => {
    const request = ++version.current;
    sampleController.current?.abort();
    const controller = new AbortController();
    sampleController.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${import.meta.env.BASE_URL}data/shampoo_share_of_shelf_6441.csv`,
        { signal: controller.signal },
      );
      if (!response.ok)
        throw new Error('Sample data is unavailable. Try again or upload your own CSV.');
      const next = createDataset(await response.text(), 'shampoo_share_of_shelf_6441.csv');
      if (request === version.current) setDataset({ ...next, isSample: true });
    } catch (failure) {
      if (request === version.current) {
        const message =
          failure.name === 'AbortError'
            ? 'Loading the sample timed out. Retry or upload your own CSV.'
            : failure.message;
        setError(message);
        toast.error(message);
      }
    } finally {
      clearTimeout(timeout);
      if (sampleController.current === controller) sampleController.current = null;
      if (request === version.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadSample, 0);
    return () => {
      clearTimeout(timeout);
      version.current += 1;
      sampleController.current?.abort();
    };
  }, [loadSample]);

  const upload = useCallback(async (file) => {
    const request = ++version.current;
    sampleController.current?.abort();
    setLoading(true);
    try {
      const next = await parseCSVFile(file);
      if (request === version.current) {
        setDataset({ ...next, isSample: false });
        setError('');
        toast.success('Your CSV is ready to explore', {
          description: `${next.rows.length.toLocaleString()} rows imported successfully.`,
        });
      }
    } finally {
      if (request === version.current) setLoading(false);
    }
  }, []);

  return { dataset, loading, error, loadSample, upload };
}
