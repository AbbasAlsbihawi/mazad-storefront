'use client';

import { useEffect } from 'react';
import { RouteErrorScreen } from '@shared/components/feedback';

/** A route that threw while rendering: the app's own screen inside the normal layout. */
export default function RouteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <RouteErrorScreen onRetry={retry} />;
}
