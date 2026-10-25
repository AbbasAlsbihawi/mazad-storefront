import type { ButtonHTMLAttributes, ReactNode, SVGProps } from 'react';
import { cn } from '@shared/lib';
import {
  BIDOOM_ICON_ALIASES,
  BIDOOM_ICON_PATHS,
  PHOSPHOR_ICON_PATHS,
  type BidoomIconBase,
} from './icon-paths';

/**
 * Names the screens used before the Bidoom set, mapped onto it so every existing call site keeps
 * drawing a glyph from the one sheet.
 */
const LEGACY_ALIASES = {
  'badge-check': 'shield',
  'chevron-down': 'caret-down',
  'chevron-left': 'caret-left',
  'chevron-right': 'caret-right',
  'credit-card': 'card',
  ellipsis: 'dots',
  'layout-grid': 'grid',
  'map-pin': 'pin',
  'share-2': 'share',
  'shopping-bag': 'bag',
  'sliders-horizontal': 'sliders',
  'trash-2': 'trash',
  'trending-up': 'rising',
  'user-round': 'user',
} as const satisfies Record<string, BidoomIconBase>;

type PhosphorName = keyof typeof PHOSPHOR_ICON_PATHS;

export type IconName =
  BidoomIconBase | keyof typeof BIDOOM_ICON_ALIASES | keyof typeof LEGACY_ALIASES | PhosphorName;

const ALIASES: Record<string, BidoomIconBase> = { ...BIDOOM_ICON_ALIASES, ...LEGACY_ALIASES };

function isPhosphor(name: string): name is PhosphorName {
  return name in PHOSPHOR_ICON_PATHS;
}

/** Resolves any accepted name to its glyph in the sheet. */
export function resolveIconName(name: IconName): BidoomIconBase | PhosphorName {
  if (isPhosphor(name)) return name;
  return ALIASES[name] ?? (name as BidoomIconBase);
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Point size: 24 tab bar · 20 actions · 17 list tails · 16 chips · 13 badges · 44 empty orbs. */
  size?: number;
  /** Draws the solid form (the design's `-fill` names): a filled heart, star or crown. */
  isFilled?: boolean;
  /** `gold`: the gradient stroke and soft gold fill used on tiles and section headings. */
  tone?: 'current' | 'gold';
  /** Stroke weight on the 64 grid (default 5; gold tiles use 3.8). */
  weight?: number;
  /** Accessible name; omit for decorative icons (they get aria-hidden instead). */
  label?: string;
}

export function Icon({
  name,
  size = 20,
  isFilled = false,
  tone = 'current',
  weight,
  label,
  className,
  style,
  ...props
}: IconProps) {
  const glyph = resolveIconName(name);
  const a11y = {
    role: label ? 'img' : undefined,
    'aria-label': label,
    'aria-hidden': label ? undefined : true,
    focusable: false,
  } as const;

  if (isPhosphor(glyph)) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="currentColor"
        className={cn('shrink-0', className)}
        style={style}
        {...a11y}
        dangerouslySetInnerHTML={{ __html: PHOSPHOR_ICON_PATHS[glyph] }}
        {...props}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn('bi shrink-0', isFilled && 'solid', tone === 'gold' && 'gold', className)}
      style={weight ? { ...style, ['--bw' as string]: weight } : style}
      {...a11y}
      dangerouslySetInnerHTML={{ __html: BIDOOM_ICON_PATHS[glyph] }}
      {...props}
    />
  );
}

const ICON_BUTTON_TONE = {
  /** The default round control: raised surface with a hairline. */
  surface: 'border border-border bg-surface-raised text-foreground',
  fill: 'border border-border bg-surface-raised text-foreground',
  /** Over photos: dark glass in both themes, because the photos are dark in both. */
  glass:
    'border border-[rgb(255_245_225/16%)] bg-[rgb(20_17_13/50%)] text-on-photo backdrop-blur-[14px]',
  /** The one primary action of a bar: gold gradient. */
  primary: 'bg-grad text-gold-ink shadow-gold',
  gold: 'bg-grad text-gold-ink shadow-gold',
  /** Quiet outline in gold: rail arrows, "open" affordances on rows. */
  ring: 'border border-gold-line bg-transparent text-gold',
} as const;

export type IconButtonTone = keyof typeof ICON_BUTTON_TONE;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  name: IconName;
  /** Required: an icon-only control has no visible text to name it. */
  label: string;
  tone?: IconButtonTone;
  size?: number;
  iconSize?: number;
  isFilled?: boolean;
  /** Mirrors the glyph in RTL (back chevrons, forward arrows). */
  isDirectional?: boolean;
  /** A small count over the corner (unread notifications). */
  badge?: ReactNode;
}

/** IconButton: the design's round 44px `.ib` control. */
export function IconButton({
  name,
  label,
  tone = 'surface',
  size = 44,
  iconSize,
  isFilled = false,
  isDirectional = false,
  badge,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  // With a count, the name is read from the content ("Notifications 5"), so the visible number is
  // part of the accessible name instead of contradicting an aria-label.
  const hasBadge = badge != null && badge !== false && badge !== 0 && badge !== '';
  return (
    <button
      type={type}
      aria-label={hasBadge ? undefined : label}
      style={{ width: size, height: size }}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full',
        'transition-transform duration-fast ease-ios active:scale-94',
        'disabled:pointer-events-none disabled:opacity-35',
        ICON_BUTTON_TONE[tone],
        className,
      )}
      {...props}
    >
      <Icon
        name={name}
        size={iconSize ?? (size <= 36 ? 17 : 20)}
        isFilled={isFilled}
        className={isDirectional ? 'rtl:-scale-x-100' : undefined}
      />
      {hasBadge ? <span className="sr-only">{label}</span> : null}
      <CountBadge value={badge} isAnnounced={hasBadge} />
    </button>
  );
}

/** The small count in the corner of an icon button or tab (unread, outbid). */
export function CountBadge({
  value,
  tone = 'gold',
  isAnnounced = false,
  className,
}: {
  value: ReactNode;
  tone?: 'gold' | 'alert';
  /** Read as part of the control's name; otherwise visual only (the control says it in words). */
  isAnnounced?: boolean;
  className?: string;
}) {
  if (value == null || value === false || value === 0 || value === '') return null;
  return (
    <span
      aria-hidden={isAnnounced ? undefined : true}
      className={cn(
        'absolute -end-[3px] -top-[3px] grid h-[19px] min-w-[19px] place-items-center rounded-full px-[5px]',
        'border-2 border-background font-tabular text-[11px] leading-none font-semibold',
        tone === 'gold'
          ? 'bg-gold text-gold-ink light:text-white'
          : 'bg-destructive text-destructive-foreground',
        className,
      )}
    >
      {value}
    </span>
  );
}
