/**
 * `<input type="datetime-local">` speaks "2026-08-11T18:30" — wall-clock time with no zone —
 * while mazad-api's @IsDateString() wants a real instant. These two convert between them via the
 * browser's own zone, so a seller scheduling "6:30pm" gets 6:30pm where they are standing.
 */

/** ISO instant → the local wall-clock string the input expects. */
export function toDateTimeInputValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** Local wall-clock string → ISO instant. Empty in, empty out; the schema catches that. */
export function fromDateTimeInputValue(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
