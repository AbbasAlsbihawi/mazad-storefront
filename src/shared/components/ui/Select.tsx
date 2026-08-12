import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@shared/lib';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  error?: string;
  /** Shown under the field when there's no error — the two never appear together. */
  hint?: string;
  /** Leading blank option. Omit on a field that always has a value. */
  placeholder?: string;
  isLabelHidden?: boolean;
}

/**
 * Select — the Input field in a picker's clothing. A native `<select>` underneath, because on iOS
 * that opens the system wheel, which is the control the design system's pickers are drawn after
 * and the one a screen reader and a keyboard already know how to drive.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, hint, placeholder, isLabelHidden = false, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className={cn(
          'text-footnote font-semibold text-foreground-soft',
          isLabelHidden && 'sr-only',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'h-[50px] w-full appearance-none rounded-md border border-border bg-surface',
            // Room for the chevron on the trailing side, which flips with the writing direction.
            'ps-3.5 pe-10 text-body text-foreground',
            'transition-colors duration-fast ease-ios focus:border-primary',
            'disabled:bg-fill disabled:text-foreground-disabled',
            error && 'border-destructive',
            className,
          )}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-muted-foreground"
        >
          <Icon name="chevron-down" size={18} />
        </span>
      </div>
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
