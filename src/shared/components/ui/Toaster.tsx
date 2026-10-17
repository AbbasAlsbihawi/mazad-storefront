'use client';

import { useEffect } from 'react';
import { useToastStore, type Toast } from '@shared/store';
import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

const VARIANT: Record<Toast['variant'], { icon: IconName; tone: string }> = {
  success: { icon: 'check-circle', tone: 'bg-live-soft text-live' },
  error: { icon: 'warning', tone: 'bg-destructive-soft text-destructive' },
  info: { icon: 'bell', tone: 'bg-info-soft text-info' },
  bid: { icon: 'gavel', tone: 'bg-gold-soft text-gold' },
};

/**
 * Toaster (design `.toast`): glass pills that drop from the top, under the phone's status area,
 * and to the end side under the header on desktop.
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-[max(12px,env(safe-area-inset-top))] z-60 flex flex-col items-center gap-2 px-5',
        'lg:top-24 lg:items-end lg:px-10',
      )}
    >
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
        'pointer-events-auto flex w-full max-w-[400px] items-center gap-3 rounded-full',
        'border border-glass-line bg-glass px-3 py-2.5 shadow-card backdrop-glass',
        'motion-safe:animate-toast-in',
      )}
    >
      <span
        className={cn(
          'inline-flex size-[38px] shrink-0 items-center justify-center rounded-full',
          variant.tone,
        )}
      >
        <Icon name={variant.icon} size={19} />
      </span>
      <span className="min-w-0 flex-1 pe-2">
        <span className="block text-sm font-semibold text-foreground">{toast.message}</span>
        {toast.detail ? (
          <span className="block text-[12.5px] text-foreground-soft">{toast.detail}</span>
        ) : null}
      </span>
    </div>
  );
}
