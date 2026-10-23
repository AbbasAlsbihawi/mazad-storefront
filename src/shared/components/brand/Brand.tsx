import { cn } from '@shared/lib';
import { BRAND_SPRITE } from './brand-sprite';

/**
 * The brand sprite, once per document (root layout). Every logo `<use>`s its symbols, and the gold
 * icon variant strokes with its biG/biF gradients, so it must be in the DOM, not display:none
 * (a hidden sprite drops its gradients in some browsers).
 */
export function BrandSprite() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable={false}
      className="pointer-events-none absolute size-0 overflow-hidden"
      dangerouslySetInnerHTML={{ __html: BRAND_SPRITE }}
    />
  );
}

/** The engraved gold plate: the square mark used as the app icon and beside the wordmark. */
export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden
      focusable={false}
      className={cn('shrink-0', className)}
    >
      <use href="#bd-engraved" />
    </svg>
  );
}

const WORDMARK = {
  /** بيدوم: El Messiri forms with the dots redrawn as the mark's diamonds. */
  ar: { viewBox: '0 0 259 160', symbol: '#bd-ar', label: 'بيدوم', ratio: 259 / 160 },
  /** BIDOOM: Cinzel capitals, the OO as two linked rings. */
  en: { viewBox: '0 0 462 96', symbol: '#bd-wm', label: 'Bidoom', ratio: 462 / 96 },
} as const;

/** One wordmark, in a given script. */
export function Wordmark({
  script,
  height,
  className,
}: {
  script: 'ar' | 'en';
  height: number;
  className?: string;
}) {
  const mark = WORDMARK[script];
  return (
    <svg
      viewBox={mark.viewBox}
      height={height}
      width={Math.round(height * mark.ratio)}
      role="img"
      aria-label={mark.label}
      focusable={false}
      className={cn('shrink-0', className)}
    >
      <use href={mark.symbol} />
    </svg>
  );
}

const LOCKUP_SIZES = {
  md: { mark: 40, ar: 36, en: 21, gap: 'gap-2.5' },
  lg: { mark: 88, ar: 72, en: 40, gap: 'gap-4' },
} as const;

/**
 * The Signature lockup: the mark with بيدوم in Arabic or BIDOOM in English. Both wordmarks are in
 * the markup and the page language picks one in CSS, so the server render is right before the
 * locale store hydrates.
 */
export function BrandLockup({
  size = 'md',
  className,
}: {
  size?: keyof typeof LOCKUP_SIZES;
  className?: string;
}) {
  const s = LOCKUP_SIZES[size];
  return (
    <span className={cn('inline-flex items-center', s.gap, className)}>
      <BrandMark size={s.mark} />
      <Wordmark script="ar" height={s.ar} className="-mb-1 en:hidden" />
      <Wordmark script="en" height={s.en} className="ar:hidden" />
    </span>
  );
}
