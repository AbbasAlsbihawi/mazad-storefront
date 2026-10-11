// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { auctionJsonLd, serializeJsonLd } from './metadata';
import type { PublicAuction } from './public-data';

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);
const hostile = `</script><script>alert(document.cookie)</script> & <!-- ${LINE_SEPARATOR}${PARAGRAPH_SEPARATOR}`;

describe('serializeJsonLd', () => {
  it('never lets seller text close the script element or break a JS line', () => {
    const out = serializeJsonLd({ name: hostile });
    expect(out).not.toMatch(/[<>&]/);
    expect(out).not.toContain(LINE_SEPARATOR);
    expect(out).not.toContain(PARAGRAPH_SEPARATOR);
    expect(out.toLowerCase()).not.toContain('</script');
  });

  it('is still the same JSON once parsed', () => {
    const value = { name: hostile, nested: { list: ['a<b', 'c>d', 'e&f'] }, price: '125000' };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });

  it('escapes a hostile product name in the real auction structured data', () => {
    const auction: PublicAuction = {
      id: 'cauction1',
      status: 'LIVE',
      startingPrice: '1000.00',
      currentPrice: null,
      bidCount: 0,
      endsAt: '2026-10-20T18:00:00.000Z',
      product: {
        nameAr: hostile,
        nameEn: hostile,
        descriptionAr: hostile,
        descriptionEn: hostile,
        images: [],
      },
      store: { nameAr: 'متجر', nameEn: 'Store', city: 'Baghdad' },
    };
    const out = serializeJsonLd(auctionJsonLd('cauction1', auction));
    expect(out.toLowerCase()).not.toContain('</script');
    expect(out).not.toMatch(/[<>]/);
    expect((JSON.parse(out) as { name: string }).name).toBe(hostile);
  });
});
