import { Chip } from '@shared/components/ui';
import { useCatalogTranslation } from '../hooks/useCatalogTranslation';
import type { AuctionStatusFilter } from '../types/catalog.types';

const STATUSES: AuctionStatusFilter[] = ['live', 'upcoming', 'ended'];

export interface StatusFilterProps {
  selected?: AuctionStatusFilter;
  onSelect: (status: AuctionStatusFilter | undefined) => void;
}

export function StatusFilter({ selected, onSelect }: StatusFilterProps) {
  const { t } = useCatalogTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <Chip isActive={!selected} onClick={() => onSelect(undefined)}>
        {t('browse.filters.all')}
      </Chip>
      {STATUSES.map((status) => (
        <Chip key={status} isActive={selected === status} onClick={() => onSelect(status)}>
          {t(`browse.filters.${status}`)}
        </Chip>
      ))}
    </div>
  );
}
