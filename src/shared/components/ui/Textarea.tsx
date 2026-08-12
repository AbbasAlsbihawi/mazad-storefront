import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@shared/lib';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  /** Shown under the field when there's no error — the two never appear together. */
  hint?: string;
  isLabelHidden?: boolean;
}

/** Textarea — Input's multiline sibling, same label/error/hint contract, four rows by default. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, isLabelHidden = false, rows = 4, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={textareaId}
        className={cn(
          'text-footnote font-semibold text-foreground-soft',
          isLabelHidden && 'sr-only',
        )}
      >
        {label}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          'rounded-md border border-border bg-surface px-3.5 py-3 text-body text-foreground',
          'placeholder:text-muted-foreground',
          // Vertical only: a horizontally resizable field can be dragged past the phone column.
          'resize-y',
          'transition-colors duration-fast ease-ios focus:border-primary',
          'disabled:bg-fill disabled:text-foreground-disabled',
          error && 'border-destructive',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-footnote text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-footnote text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
