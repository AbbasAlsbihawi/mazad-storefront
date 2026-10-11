import type { ReactNode } from 'react';
import { Card, CardContent, SectionHeader } from '@shared/components/ui';
import { cn } from '@shared/lib';

/** One stacked section of the auction page: a heading over a card. */
export function DetailSection({
  title,
  action,
  children,
  testId,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <section className="mt-6" data-testid={testId}>
      <SectionHeader title={title} action={action} />
      <Card>
        <CardContent className="flex flex-col gap-3 text-subhead">{children}</CardContent>
      </Card>
    </section>
  );
}

/** Label at the start, value at the end; `isStrong` for a total. */
export function DetailRow({
  label,
  value,
  isStrong = false,
  testId,
}: {
  label: ReactNode;
  value: ReactNode;
  isStrong?: boolean;
  testId?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3" data-testid={testId}>
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          'text-end text-foreground tabular-nums',
          isStrong ? 'font-bold' : 'font-medium',
        )}
      >
        {value}
      </span>
    </div>
  );
}
