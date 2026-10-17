import { cn } from '@shared/lib';
import { Icon, type IconName } from './Icon';

const GOLD_TILE_SIZE = {
  sm: { box: 'size-11 rounded-[14px]', icon: 25 },
  lg: { box: 'size-14 rounded-[18px]', icon: 31 },
  xl: { box: 'size-[84px] rounded-[26px]', icon: 46 },
} as const;

/** An icon on a gold tile (design `.gtile`): gradient stroke over a soft gold ground. */
export function GoldTile({
  icon,
  size = 'sm',
  className,
}: {
  icon: IconName;
  size?: keyof typeof GOLD_TILE_SIZE;
  className?: string;
}) {
  const s = GOLD_TILE_SIZE[size];
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center border bg-tile', s.box, className)}
    >
      <Icon name={icon} tone="gold" size={s.icon} weight={size === 'xl' ? 3 : undefined} />
    </span>
  );
}

/**
 * A store's initial on a tile (design `.stile`): stores have no logos, so the first letter of the
 * name stands in, the same everywhere a store appears. `gold` is the store page's own big tile.
 */
export function InitialTile({
  name,
  size = 52,
  tone = 'plain',
  className,
}: {
  name: string;
  size?: number;
  tone?: 'plain' | 'gold';
  className?: string;
}) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? '·';
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.34),
        fontSize: Math.round(size * 0.38),
      }}
      className={cn(
        'grid shrink-0 place-items-center leading-none font-medium',
        tone === 'gold'
          ? 'bg-grad text-gold-ink shadow-gold'
          : 'border border-border-strong bg-surface-raised text-gold',
        className,
      )}
    >
      {initial}
    </span>
  );
}

const AVATAR_SIZE = {
  sm: 'size-[38px] text-sm',
  md: 'size-11 text-base',
  lg: 'size-[68px] text-2xl',
};

/** A person's initial on the gold disc (design `.avatar`). */
export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string;
  size?: keyof typeof AVATAR_SIZE;
  className?: string;
}) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? '·';
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-grad font-semibold text-gold-ink',
        AVATAR_SIZE[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}
