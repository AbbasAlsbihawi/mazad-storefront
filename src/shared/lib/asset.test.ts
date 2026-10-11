import { describe, expect, it } from 'vitest';
import { resolveThumbUrl } from './asset';

const ID = '0f8fad5b-d9cb-469f-a165-70867728950e';

describe('resolveThumbUrl (mirrors mazad-api)', () => {
  it("an upload's full image becomes its 300 px thumbnail", () => {
    expect(resolveThumbUrl(`https://cdn.test/assets/images/${ID}/full.webp`)).toBe(
      `https://cdn.test/assets/images/${ID}/thumb.webp`,
    );
    expect(resolveThumbUrl(`images/${ID}/full.webp`)).toMatch(
      new RegExp(`/images/${ID}/thumb\.webp$`),
    );
  });

  it('anything else keeps the full URL; nothing stays nothing', () => {
    expect(resolveThumbUrl('https://images.unsplash.com/photo-1.jpg')).toBe(
      'https://images.unsplash.com/photo-1.jpg',
    );
    expect(resolveThumbUrl(null)).toBeNull();
  });
});
