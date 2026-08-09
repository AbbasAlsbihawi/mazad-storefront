'use client';

import { useEffect } from 'react';
import { useToastStore, type Toast } from '@shared/store';
import { cn } from '@shared/lib';

const VARIANT_CLASSES: Record<Toast['variant'], string> = {
  success: 'border-live/40 bg-live/10 text-live',
  error: 'border-destructive/40 bg-destructive/10 text-destructive',
  info: 'border-info/40 bg-info/10 text-info',
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
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

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-md border px-4 py-3 text-sm shadow-lg',
        VARIANT_CLASSES[toast.variant],
      )}
    >
      {toast.message}
    </div>
  );
}
