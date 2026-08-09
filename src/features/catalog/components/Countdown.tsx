'use client';

import { useEffect, useState } from 'react';
import { useServerClock } from '@shared/hooks';
import { formatDuration } from '@shared/lib';

// Ticks once a second purely to force a re-render; the actual remaining time is always
// recomputed from useServerClock's offset (ADR-013), never accumulated locally.
export function Countdown({ endsAt, className }: { endsAt: string; className?: string }) {
  const { now } = useServerClock();
  const [, forceTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceTick((tick) => tick + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = new Date(endsAt).getTime() - now();
  return <span className={className}>{formatDuration(remaining)}</span>;
}
