'use client';

import { useEffect } from 'react';
import { useToastStore, type Toast } from '@shared/store';
import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

const VARIANT: Record<Toast['variant'], { icon: IconName; textClass: string; bgClass: string }> = {
  success: { icon: 'badge-check', textClass: 'text-live', bgClass: 'bg-live/14' },
  error: { icon: 'x', textClass: 'text-destructive', bgClass: 'bg-destructive/14' },
  info: { icon: 'bell', textClass: 'text-info', bgClass: 'bg-info/14' },
  bid: { icon: 'gavel', textClass: 'text-primary', bgClass: 'bg-primary/14' },
};

/** Toaster — stacks toasts under the nav bar, centered, above everything. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-60 flex flex-col items-center gap-2 px-gutter">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const variant = VARIANT[toast.variant];

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex w-full max-w-90 items-center gap-2.5 rounded-full',
        'bg-surface px-4 py-3 shadow-raised',
        'motion-safe:animate-[toast-in_var(--duration-medium)_var(--ease-ios)]',
      )}
    >
      <span
        className={cn(
          'inline-flex size-7 shrink-0 items-center justify-center rounded-full',
          variant.bgClass,
          variant.textClass,
        )}
      >
        <Icon name={variant.icon} size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-subhead font-semibold text-foreground">{toast.message}</span>
        {toast.detail ? (
          <span className="block text-footnote text-muted-foreground">{toast.detail}</span>
        ) : null}
      </span>
    </div>
  );
}
