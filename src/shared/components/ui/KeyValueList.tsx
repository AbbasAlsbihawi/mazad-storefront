import type { ReactNode } from 'react';
import { cn } from '@shared/lib';

export interface KeyValueRow {
  key: string;
  label: ReactNode;
  value: ReactNode;
  /** The total row: heavier type. */
  isTotal?: boolean;
}

/** Label/value rows split by hairlines (design `.kv`): delivery and payment, order totals, rules. */
export function KeyValueList({ rows, className }: { rows: KeyValueRow[]; className?: string }) {
  return (
    <dl className={cn('grid', className)}>
      {rows.map((row) => (
        <div
          key={row.key}
          className={cn(
            'flex items-baseline justify-between gap-3 border-t border-border py-3 text-sm first:border-t-0',
            row.isTotal && 'text-base font-semibold',
          )}
        >
          <dt className={row.isTotal ? 'text-foreground' : 'text-foreground-soft'}>{row.label}</dt>
          <dd className="text-end">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
