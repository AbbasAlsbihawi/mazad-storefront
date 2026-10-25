import { cn } from '@shared/lib';

/*
 * The design's form field (`.field` / `.input`): label above, a 56px rounded field on the card
 * surface, a gold border and soft gold ring on focus, the error under the field that caused it.
 */

export const FIELD_LABEL = 'text-[13.5px] font-medium text-foreground-soft';

export function fieldControl({ hasError = false }: { hasError?: boolean } = {}) {
  return cn(
    'w-full rounded-lg border border-border-strong bg-surface px-[18px] text-[15px] text-foreground',
    'placeholder:text-muted-foreground',
    'transition-[border-color,box-shadow] duration-fast ease-ios',
    'focus:border-gold focus:shadow-[0_0_0_4px_var(--color-gold-soft)] focus-visible:outline-none',
    'disabled:bg-surface-raised disabled:text-muted-foreground',
    hasError && 'border-destructive focus:border-destructive',
  );
}

export const FIELD_HINT = 'text-[12.5px] text-muted-foreground';

export const FIELD_ERROR = 'flex items-center gap-1.5 text-[12.5px] text-destructive';
