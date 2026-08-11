'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, resolveActiveTabHref } from '@shared/lib';
import { Icon } from '@shared/components/ui';
import type { TabBarItem } from './TabBar';

/**
 * FloatingTabBar — the immersive variant of the bottom chrome. A detached capsule hovering over
 * the content instead of docking to the bottom edge, so a media-led screen reads edge to edge
 * underneath it. Utility screens keep the flat `TabBar`; the two are never mixed inside one flow,
 * which is why the choice is made once at the shell rather than per screen.
 *
 * Icons only, no labels, five items max — the same HIG ceiling the docked bar honours, minus the
 * captions there is no room for at this height.
 *
 * Fixed rather than absolute: the design system specifies `position: absolute` inside a
 * `position: relative` parent, which holds when that parent *is* the scroll viewport. This app
 * scrolls the document, so `fixed` is what actually keeps the capsule hovering instead of parking
 * it at the foot of the page. The shell still marks itself relative, so an inner-scroll shell
 * would be a one-word change here.
 */
export function FloatingTabBar({ items, label }: { items: TabBarItem[]; label: string }) {
  const pathname = usePathname();
  // Resolved across the whole set, not per item: exactly one pill may be lit at a time.
  const activeHref = resolveActiveTabHref(
    items.map((item) => item.href),
    pathname,
  );

  return (
    // A full-width centring track rather than a width calc on the capsule itself: it reuses the
    // shell's own max-w-lg column, so the 16px inset is measured from the screen edge on a phone
    // and from the column edge on a desktop viewport. Clicks pass through the track's gutters.
    <div
      className={cn(
        'pointer-events-none fixed start-0 end-0 z-40 mx-auto max-w-lg px-4',
        'bottom-[calc(env(safe-area-inset-bottom)+14px)]',
      )}
    >
      <nav
        aria-label={label}
        className={cn(
          'pointer-events-auto flex items-stretch rounded-full p-1.5',
          'border border-foreground/8 bg-surface/78 shadow-float backdrop-glass',
        )}
      >
        {items.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              // Icon-only, so the label has to arrive through aria-label; title gives the same
              // text to a pointer user hovering an unfamiliar glyph.
              aria-label={item.label}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-12 min-w-0 flex-1 items-center justify-center rounded-full',
                // Only the fill animates. Sliding or growing the pill would make the bar look
                // like it is re-laying out under the thumb on every tab change.
                'transition-[background-color] duration-fast ease-ios',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground',
              )}
            >
              <span className="relative inline-flex">
                <Icon name={item.icon} size={24} isFilled={isActive && item.icon === 'heart'} />
                {item.badge ? (
                  // A dot, never a numeral — a count is unreadable at 8px, and the capsule has no
                  // caption underneath to carry it. Any truthy badge means "something is waiting".
                  <span
                    aria-hidden
                    className="absolute -top-0.5 -end-0.5 size-2 rounded-full bg-destructive"
                  />
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
