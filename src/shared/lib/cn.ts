import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge only knows Tailwind's default scale. The design's named text sizes (text-h1,
 * text-price-lg, …) would otherwise read as colours and drop a real colour class beside them
 * (e.g. `text-gold text-price-lg` lost the gold), so they are registered as font sizes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'display-lg',
            'h1',
            'h1-lg',
            'h2',
            'h3',
            'section',
            'section-lg',
            'price-lg',
            'large-title',
            'title-1',
            'title-2',
            'title-3',
            'headline',
            'body',
            'callout',
            'subhead',
            'footnote',
            'caption',
            'caption-2',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
