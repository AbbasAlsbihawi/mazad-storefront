import { Spinner } from '@shared/components/ui';

export function PageLoader() {
  return (
    <div className="flex min-h-40 items-center justify-center p-8">
      <Spinner className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}
