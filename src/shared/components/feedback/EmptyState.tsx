import type { ReactNode } from 'react';
import { Button, Icon, type IconName } from '@shared/components/ui';

export interface EmptyStateProps {
  /** One line telling the user what to do next — never a bare "nothing here". */
  message: string;
  title?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  /** Escape hatch for an action that has to be a link rather than a button. */
  action?: ReactNode;
}

/** EmptyState — tinted glyph, title, one line of guidance, one action. */
export function EmptyState({
  message,
  title,
  icon = 'package',
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-8 py-12 text-center">
      <span className="mb-1 inline-flex size-16 items-center justify-center rounded-xl bg-fill">
        <Icon name={icon} size={28} className="text-muted-foreground" />
      </span>
      {title ? <p className="text-title-3 font-bold text-foreground">{title}</p> : null}
      <p className="max-w-70 text-subhead text-muted-foreground">{message}</p>
      {action ??
        (actionLabel && onAction ? (
          <Button variant="tinted" onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        ) : null)}
    </div>
  );
}
