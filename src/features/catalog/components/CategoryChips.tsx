import { Chip } from '@shared/components/ui';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { CategoryNode } from '../types/catalog.types';

export interface CategoryChipsProps {
  categories: CategoryNode[];
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
}

// Category names arrive already localized (mazad-api picks nameEn/nameAr server-side from
// Accept-Language for /categories, unlike /auctions) — render `category.name` directly.
export function CategoryChips({ categories, selectedId, onSelect }: CategoryChipsProps) {
  const { t } = useCatalogTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <Chip isActive={!selectedId} onClick={() => onSelect(undefined)}>
        {t('browse.filters.all')}
      </Chip>
      {categories.map((category) => (
        <Chip
          key={category.id}
          isActive={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </Chip>
      ))}
    </div>
  );
}
