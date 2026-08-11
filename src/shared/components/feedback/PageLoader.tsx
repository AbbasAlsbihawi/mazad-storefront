import { Spinner } from '@shared/components/ui';

/**
 * The only full-screen spinner in the system, and only for a cold route load. Anywhere the shape
 * of the incoming content is known, use skeletons instead so the swap doesn't flash.
 */
export function PageLoader() {
  return (
    <div className="flex min-h-40 items-center justify-center p-8 text-muted-foreground">
      <Spinner size={32} />
    </div>
  );
}
