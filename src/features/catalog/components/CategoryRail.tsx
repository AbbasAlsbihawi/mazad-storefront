'use client';

import { ROUTES } from '@shared/constants';
import { CategoryTile } from '@shared/components/ios';
import { Skeleton } from '@shared/components/ui';
import { getCategoryIcon } from '@shared/lib';
import { useCategories } from '../hooks/useCategories';

/**
 * The horizontally scrolling category shortcuts on the home feed. Lives in catalog because it
 * owns the categories query; the home route composes it in (see AGENTS.md rule 1 — features
 * never import each other).
 */
export function CategoryRail() {
  const categories = useCategories();

  if (categories.isPending) return <CategoryRailSkeleton />;
  if (!categories.data?.length) return null;

  return (
    <div className="no-scrollbar -mx-gutter flex gap-2.5 overflow-x-auto px-gutter">
      {categories.data.map((category) => (
        <CategoryTile
          key={category.id}
          label={category.name}
          icon={getCategoryIcon(category.slug)}
          href={`${ROUTES.auctions}?categoryId=${category.id}`}
        />
      ))}
    </div>
  );
}

function CategoryRailSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="no-scrollbar -mx-gutter flex gap-2.5 overflow-x-auto px-gutter">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex w-19 shrink-0 flex-col items-center gap-2">
          <Skeleton radius="lg" className="size-15" />
          <Skeleton radius="sm" className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
