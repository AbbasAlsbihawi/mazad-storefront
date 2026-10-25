'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { IconButton } from './Icon';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  /** A line under the title. */
  description?: ReactNode;
  children: ReactNode;
  /** Pinned under the scrolling body: the slide to bid, an apply button. */
  footer?: ReactNode;
  /** Desktop dialog width: md 520px (filters, buy now), lg 560px (bid and rating sheets). */
  width?: 'md' | 'lg';
  /** Hide the visible title (the caller draws its own heading); it still names the dialog. */
  isTitleHidden?: boolean;
  className?: string;
}

/**
 * Sheet (design `.sheet`): a bottom sheet on phones and a centred dialog from 960px. Built on the
 * native modal <dialog>, so focus is trapped in it, the page behind is inert and Escape closes it;
 * a tap on the scrim closes it too. The page underneath stops scrolling while it is open.
 */
export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'md',
  isTitleHidden = false,
  className,
}: SheetProps) {
  const { t } = useTranslation('common');
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
    if (!isOpen && dialog.open) dialog.close();
    return () => {
      if (isOpen) document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        'fixed m-0 flex-col overflow-hidden bg-surface p-0 text-foreground open:flex',
        'backdrop:bg-scrim backdrop:backdrop-blur-[3px]',
        // phone: a bottom sheet
        'inset-x-0 top-auto bottom-0 max-h-[calc(100dvh-44px)] w-full max-w-none rounded-t-sheet border-t border-border-strong',
        'motion-safe:open:animate-sheet-up',
        // desktop: a centred dialog
        'lg:inset-0 lg:m-auto lg:max-h-[92dvh] lg:rounded-3xl lg:border lg:motion-safe:open:animate-pop',
        width === 'lg' ? 'lg:w-[560px]' : 'lg:w-[520px]',
        className,
      )}
    >
      <div className="flex shrink-0 flex-col gap-2 px-5 pt-2.5 lg:px-7 lg:pt-7">
        <span
          aria-hidden
          className="h-[5px] w-[42px] self-center rounded-full bg-surface-high lg:hidden"
        />
        <div className="flex items-start justify-between gap-3">
          <div className={cn('grid min-w-0 gap-1 pt-2', isTitleHidden && 'sr-only')}>
            <h2 id={titleId} className="text-h2 font-medium">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-[13px] text-foreground-soft">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            name="x"
            label={t('dialog.close')}
            size={40}
            onClick={onClose}
            className="ms-auto shrink-0"
          />
        </div>
      </div>
      <div className="no-scrollbar grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-5 pt-4 pb-5 lg:px-7">
        {children}
      </div>
      {footer ? (
        <div className="shrink-0 border-t border-border px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] lg:px-7 lg:pb-7">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
