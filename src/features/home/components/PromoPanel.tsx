import Link from 'next/link';
import { buttonVariants, Icon } from '@shared/components/ui';

export interface PromoPanelProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

/** The tinted panel under the search row — the one piece of promotional surface on the home feed. */
export function PromoPanel({ title, subtitle, ctaLabel, ctaHref }: PromoPanelProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-primary-tint p-4">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="text-title-3 font-extrabold text-foreground">{title}</p>
        <p className="text-footnote text-muted-foreground">{subtitle}</p>
        <Link href={ctaHref} className={`${buttonVariants({ size: 'md' })} mt-2`}>
          {ctaLabel}
        </Link>
      </div>
      <span className="inline-flex size-21 shrink-0 items-center justify-center rounded-lg bg-primary/22 text-primary">
        <Icon name="gavel" size={38} />
      </span>
    </div>
  );
}
