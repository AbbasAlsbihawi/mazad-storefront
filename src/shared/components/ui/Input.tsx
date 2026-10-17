import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@shared/lib';
import { FIELD_LABEL, fieldControl } from './field-styles';
import { FieldMessage, describedBy } from './FieldMessage';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Shown under the field when there's no error: the two never appear together. */
  hint?: string;
  isLabelHidden?: boolean;
  /** A control inside the field's end edge (e.g. show/hide password). */
  trailing?: ReactNode;
  /** A fixed prefix at the field's start, e.g. the +964 country code. */
  leading?: ReactNode;
  /** Phone numbers, codes and passwords are Latin: the field reads left to right in both languages. */
  isLatin?: boolean;
}

/** Input: label above, 56px field, inline error or hint below (design `.field`). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    isLabelHidden = false,
    trailing,
    leading,
    isLatin = false,
    id,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className={cn(FIELD_LABEL, isLabelHidden && 'sr-only')}>
        {label}
      </label>
      <div className="relative flex" dir={isLatin ? 'ltr' : undefined}>
        {leading ? (
          <div
            className={cn(
              'pointer-events-none absolute inset-y-3 start-[18px] flex items-center pe-3',
              'border-e border-border-strong font-tabular text-foreground-soft',
            )}
          >
            {leading}
          </div>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(
            fieldControl({ hasError: !!error }),
            'h-14',
            isLatin && 'text-left font-tabular tracking-[0.02em]',
            leading ? 'ps-[90px]' : undefined,
            trailing ? 'pe-12' : undefined,
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 end-1.5 flex items-center">{trailing}</div>
        ) : null}
      </div>
      <FieldMessage id={inputId} error={error} hint={hint} />
    </div>
  );
});
