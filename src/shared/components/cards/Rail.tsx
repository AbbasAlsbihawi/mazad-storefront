'use client';

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@shared/lib';
import { IconButton, SectionHeader, SeeAllLink, type IconName } from '@shared/components/ui';

export interface RailProps {
  title: ReactNode;
  icon?: IconName;
  seeAll?: { href: string; label: string };
  /** Accessible name of the scrolling list. Defaults to the title when that is a string. */
  label?: string;
  children: ReactNode;
  /** Width of each item: lot cards are 176px on phones and 210px from 960px. */
  itemClassName?: string;
  className?: string;
}

/**
 * A sideways rail (design `.rail`): swipe on phones; on desktop, arrows beside "See all". The edge
 * with more to show fades out, so it is clear the row continues.
 */
export function Rail({
  title,
  icon,
  seeAll,
  label,
  children,
  itemClassName,
  className,
}: RailProps) {
  const { t } = useTranslation('common');
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const list = ref.current;
    if (!list) return;
    // scrollLeft runs negative in RTL; the magnitude is what matters.
    const position = Math.abs(list.scrollLeft);
    const max = list.scrollWidth - list.clientWidth;
    setEdges({ atStart: position <= 2, atEnd: position >= max - 2 });
  }, []);

  useEffect(() => {
    measure();
    const list = ref.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  function step(direction: 1 | -1) {
    const list = ref.current;
    if (!list) return;
    const isRtl = getComputedStyle(list).direction === 'rtl';
    list.scrollBy({
      left: direction * list.clientWidth * 0.8 * (isRtl ? -1 : 1),
      behavior: 'smooth',
    });
  }

  const listLabel = label ?? (typeof title === 'string' ? title : undefined);

  return (
    <section className={cn('grid gap-3.5', className)}>
      <SectionHeader
        title={title}
        icon={icon}
        action={
          <span className="flex items-center gap-3">
            {seeAll ? <SeeAllLink href={seeAll.href}>{seeAll.label}</SeeAllLink> : null}
            <span className="hidden gap-2 lg:inline-flex">
              <IconButton
                name="caret-right"
                tone="ring"
                size={36}
                iconSize={16}
                className="ltr:[&>svg]:-scale-x-100"
                label={t('rail.previous')}
                disabled={edges.atStart}
                onClick={() => step(-1)}
              />
              <IconButton
                name="caret-left"
                tone="ring"
                size={36}
                iconSize={16}
                className="ltr:[&>svg]:-scale-x-100"
                label={t('rail.next')}
                disabled={edges.atEnd}
                onClick={() => step(1)}
              />
            </span>
          </span>
        }
      />
      <ul
        ref={ref}
        aria-label={listLabel}
        onScroll={measure}
        className={cn(
          'no-scrollbar rail-fade -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 lg:mx-0 lg:snap-none lg:px-0',
        )}
        style={{
          ['--fs' as string]: edges.atStart ? '0px' : '44px',
          ['--fe' as string]: edges.atEnd ? '0px' : '44px',
        }}
      >
        {Children.map(children, (child) =>
          child == null || child === false ? null : (
            <li className={cn('w-44 shrink-0 snap-start lg:w-[210px]', itemClassName)}>{child}</li>
          ),
        )}
      </ul>
    </section>
  );
}
