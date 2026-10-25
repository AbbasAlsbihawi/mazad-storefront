import { BrandMark } from '@shared/components/brand';

/**
 * The Bidoom mark (the engraved gold plate). Kept under its old name so existing call sites
 * render the new brand; new code uses BrandMark or BrandLockup from @shared/components/brand.
 */
export function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return <BrandMark size={size} className={className} />;
}
