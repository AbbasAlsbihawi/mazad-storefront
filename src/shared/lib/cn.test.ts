import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('keeps a colour beside a named design text size', () => {
    expect(cn('text-gold', 'text-price-lg')).toBe('text-gold text-price-lg');
    expect(cn('text-foreground', 'text-h1')).toBe('text-foreground text-h1');
  });

  it('still lets a later size or colour win', () => {
    expect(cn('text-h1', 'text-h2')).toBe('text-h2');
    expect(cn('text-gold', 'text-foreground')).toBe('text-foreground');
  });
});
