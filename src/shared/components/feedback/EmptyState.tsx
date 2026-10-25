import type { ReactNode } from 'react';
import { cn } from '@shared/lib';
import { Button, Icon, type IconName } from '@shared/components/ui';

export interface EmptyStateProps {
  /** One line telling the user what to do next: never a bare "nothing here". */
  message: string;
  title?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  /** Escape hatch for an action that has to be a link rather than a button. */
  action?: ReactNode;
  /** The heading level of the title, so it fits the page outline. */
  titleAs?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/**
 * EmptyState (design `.empty`): a gold glyph in a soft orb, a display-face title, one line of
 * guidance and one action.
 */
export function EmptyState({
  message,
  title,
  icon = 'package',
  actionLabel,
  onAction,
  action,
  titleAs: Title = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3.5 px-7 py-10 text-center lg:py-20',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-[120px] place-items-center rounded-full border border-border-strong bg-surface bg-[radial-gradient(circle_at_50%_35%,var(--color-gold-soft),transparent_70%)] text-gold"
      >
        <Icon name={icon} size={44} />
      </span>
      {title ? (
        <Title className="font-display text-2xl leading-[1.3] font-normal text-foreground">
          {title}
        </Title>
      ) : null}
      <p className="max-w-[34ch] text-[15px] leading-[1.7] text-foreground-soft">{message}</p>
      {action ??
        (actionLabel && onAction ? (
          <Button variant="gold" onClick={onAction} className="mt-1">
            {actionLabel}
          </Button>
        ) : null)}
    </div>
  );
}
