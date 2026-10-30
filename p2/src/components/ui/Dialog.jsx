import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dialog({ open, onClose, title, description, children, className }) {
  const ref = useRef(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      aria-describedby={description ? `${id}-description` : undefined}
      className={cn('dialog', className)}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={id} className="text-xl font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p id={`${id}-description`} className="mt-2 text-sm leading-6 text-muted">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          className="icon-button shrink-0"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={19} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
