import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@shared/lib';
import { FIELD_LABEL, fieldControl } from './field-styles';
import { FieldMessage, describedBy } from './FieldMessage';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  error?: string;
  /** Shown under the field when there's no error: the two never appear together. */
  hint?: string;
  /** Leading blank option. Omit on a field that always has a value. */
  placeholder?: string;
  isLabelHidden?: boolean;
}

/**
 * Select: the Input field in a picker's clothing. A native `<select>` underneath, because that
 * opens the system picker on phones and a screen reader and a keyboard already know it.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, hint, placeholder, isLabelHidden = false, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className={cn(FIELD_LABEL, isLabelHidden && 'sr-only')}>
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={describedBy(selectId, error, hint)}
          className={cn(
            fieldControl({ hasError: !!error }),
            // Room for the chevron on the trailing side, which flips with the writing direction.
            'h-14 appearance-none pe-11',
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
          className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-muted-foreground"
        >
          <Icon name="caret-down" size={16} />
        </span>
      </div>
      <FieldMessage id={selectId} error={error} hint={hint} />
    </div>
  );
});
