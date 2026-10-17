import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@shared/lib';
import { FIELD_LABEL, fieldControl } from './field-styles';
import { FieldMessage, describedBy } from './FieldMessage';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  /** Shown under the field when there's no error: the two never appear together. */
  hint?: string;
  isLabelHidden?: boolean;
}

/** Textarea: Input's multiline sibling, same label/error/hint contract, four rows by default. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, isLabelHidden = false, rows = 4, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={textareaId} className={cn(FIELD_LABEL, isLabelHidden && 'sr-only')}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={describedBy(textareaId, error, hint)}
        className={cn(
          fieldControl({ hasError: !!error }),
          'min-h-[110px] resize-y py-3.5 leading-[1.7]',
          className,
        )}
        {...props}
      />
      <FieldMessage id={textareaId} error={error} hint={hint} />
    </div>
  );
});
