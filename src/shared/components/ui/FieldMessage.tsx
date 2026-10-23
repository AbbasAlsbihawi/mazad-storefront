import { FIELD_ERROR, FIELD_HINT } from './field-styles';
import { Icon } from './Icon';

/** The line under a field: the error that field caused, or else its hint. Never both. */
export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} role="alert" className={FIELD_ERROR}>
        <Icon name="warning" size={15} />
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className={FIELD_HINT}>
        {hint}
      </p>
    );
  }
  return null;
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
