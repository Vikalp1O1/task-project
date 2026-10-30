import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileSpreadsheet, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { MAX_FILE_BYTES } from '../../lib/csv';
import { cn, formatBytes } from '../../lib/utils';

const uploadSchema = z.object({
  file: z
    .custom((value) => value instanceof File, 'Choose a CSV file.')
    .refine((file) => !file || /\.csv$/i.test(file.name), 'Only .csv files are supported.')
    .refine((file) => !file || file.size <= MAX_FILE_BYTES, 'Your file must be smaller than 10 MB.')
    .refine((file) => !file || file.size > 0, 'This file is empty.'),
});

export function UploadDialog({ open, onClose, onUpload, onLoadSample }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(uploadSchema), defaultValues: { file: undefined } });
  const file = watch('file');
  const close = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };
  const chooseFile = (next) => {
    if (next) setValue('file', next, { shouldValidate: true });
  };
  const submit = async ({ file: selected }) => {
    try {
      await onUpload(selected);
      reset();
      onClose();
    } catch (error) {
      setError('file', { message: error.message });
      toast.error('Could not import your CSV', { description: error.message });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={close}
      title="Upload CSV"
    >
      <form onSubmit={handleSubmit(submit)} className="mt-6">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          disabled={isSubmitting}
          className="sr-only"
          tabIndex={-1}
          aria-label="Select CSV file"
          onChange={(event) => {
            chooseFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (isSubmitting) return;
            if (event.dataTransfer.files.length !== 1) {
              setError('file', { message: 'Please upload one CSV file at a time.' });
              return;
            }
            chooseFile(event.dataTransfer.files[0]);
          }}
          className={cn('upload-dropzone', dragging && 'border-brand bg-brand-light')}
          aria-describedby={errors.file ? 'upload-error' : 'upload-hint'}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white text-brand">
            <UploadCloud size={24} />
          </span>
          <strong className="mt-4 text-sm font-semibold">
            Click to upload <span className="font-normal text-muted">or drag and drop</span>
          </strong>
          <span id="upload-hint" className="mt-2 text-xs text-muted">
            CSV files up to 10 MB · First row must contain column names
          </span>
        </button>
        {file && (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-line p-3">
            <FileSpreadsheet size={23} className="shrink-0 text-brand" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="mt-1 text-sm text-muted">{formatBytes(file.size)}</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Remove selected file"
              disabled={isSubmitting}
              onClick={() => setValue('file', undefined)}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {errors.file && (
          <p id="upload-error" role="alert" className="mt-3 text-sm text-red-700">
            {errors.file.message}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2 border-t border-line pt-5">
          <Button onClick={close} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            <UploadCloud size={15} />
            {isSubmitting ? 'Reading file…' : 'Import dataset'}
          </Button>
        </div>
      </form>
      <div className="mt-5 text-center text-sm text-muted">
        <button
          type="button"
          className="font-semibold text-brand underline-offset-4 hover:underline"
          disabled={isSubmitting}
          onClick={async () => {
            reset();
            onClose();
            await onLoadSample();
          }}
        >
          Load sample CSV
        </button>
      </div>
    </Dialog>
  );
}

export default UploadDialog;

