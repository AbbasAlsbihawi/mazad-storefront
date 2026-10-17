'use client';

import { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** `danger` for deletions; `gold` for money actions (the slide's accessible alternative). */
  tone?: 'gold' | 'danger';
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A small modal question with two answers. Native <dialog>: focus moves into it (to Cancel, the
 * safe answer), the page behind is inert, Escape cancels.
 */
export function ConfirmDialog({
  isOpen,
  title,
  body,
  confirmLabel,
  cancelLabel,
  tone = 'gold',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation('common');
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={body ? bodyId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className={cn(
        'fixed inset-0 m-auto w-[min(420px,calc(100vw-40px))] rounded-3xl border border-border-strong bg-surface p-6 text-foreground',
        'backdrop:bg-scrim backdrop:backdrop-blur-[3px] motion-safe:open:animate-pop',
      )}
    >
      <h2 id={titleId} className="text-h2 font-medium">
        {title}
      </h2>
      {body ? (
        <p id={bodyId} className="mt-2 text-sm leading-[1.7] text-foreground-soft">
          {body}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-end gap-2.5">
        {/* Cancel comes first in the DOM so it takes the initial focus. */}
        <Button variant="soft" size="sm" autoFocus onClick={onCancel}>
          {cancelLabel ?? t('dialog.cancel')}
        </Button>
        <Button
          variant={tone === 'danger' ? 'dangerLine' : 'gold'}
          size="sm"
          isLoading={isPending}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
