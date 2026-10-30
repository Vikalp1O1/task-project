import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn('button', `button-${variant}`, size === 'sm' && 'button-sm', className)}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
