import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.1 AA text contrast (1.4.3) for the Bidoom colour tokens in globals.css, in both themes:
 * 4.5:1 for normal-size text. Soft washes (gold-soft, live-soft, …) are translucent, so text on
 * them is measured against the wash composited over the card surface it sits on.
 */
const css = readFileSync(join(process.cwd(), 'src', 'app', 'styles', 'globals.css'), 'utf8');

function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf('\n}', start));
  const out: Record<string, string> = {};
  for (const [, name = '', value = ''] of body.matchAll(/--color-([\w-]+):\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

type Rgb = [number, number, number];
type Rgba = { rgb: Rgb; alpha: number };

function parse(value: string): Rgba {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  const digits = hex?.[1];
  if (digits) {
    return {
      rgb: [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16) / 255) as Rgb,
      alpha: 1,
    };
  }
  const rgb = /^rgb\((\d+) (\d+) (\d+)(?: \/ (\d+)%)?\)$/.exec(value);
  if (rgb) {
    return {
      rgb: [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255],
      alpha: rgb[4] ? Number(rgb[4]) / 100 : 1,
    };
  }
  throw new Error(`unparsed colour ${value}`);
}

function over(top: Rgba, base: Rgb): Rgb {
  return top.rgb.map((c, i) => c * top.alpha + (base[i] ?? 0) * (1 - top.alpha)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const f = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(theme: Record<string, string>, fg: string, bg: string): number {
  const color = (name: string) => {
    const value = theme[name];
    if (!value) throw new Error(`missing token --color-${name}`);
    return parse(value);
  };
  // A translucent ground is a wash over the card surface; text over it is then blended too.
  const ground = over(color(bg), over(color('surface'), [0, 0, 0]));
  const text = over(color(fg), ground);
  const a = luminance(text);
  const b = luminance(ground);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const dark = tokens(':root');
const light = { ...dark, ...tokens("[data-theme='light']") };

const SURFACES = ['background', 'surface', 'surface-raised'];
const TEXT_ON_SURFACES: [string, string][] = [
  ...['foreground', 'foreground-soft', 'muted-foreground', 'gold', 'destructive', 'live'].flatMap(
    (fg) => SURFACES.map((bg): [string, string] => [fg, bg]),
  ),
  // Selected chips, rating cards and unread rows sit on the gold wash.
  ['gold', 'gold-soft'],
  ['muted-foreground', 'gold-soft'],
  ['foreground-soft', 'gold-soft'],
  // Status pills and state lines: the state colour on its own wash.
  ['live', 'live-soft'],
  ['destructive', 'destructive-soft'],
  ['warning', 'warning-soft'],
  ['info', 'info-soft'],
];
const ON_FILL: [string, string][] = [
  // The gold gradient's darkest stop is close to --color-gold-lo; ink stays readable on all of it.
  ['gold-ink', 'gold-hi'],
  ['live-foreground', 'live'],
  ['destructive-foreground', 'destructive'],
];

describe.each([
  ['dark', dark],
  ['light', light],
] as const)('%s theme colour tokens meet WCAG AA 4.5:1', (_name, theme) => {
  it.each(TEXT_ON_SURFACES)('%s text on %s', (fg, bg) => {
    expect(contrast(theme, fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(ON_FILL)('%s on %s', (fg, bg) => {
    expect(contrast(theme, fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

it('dark is the default theme: :root carries the dark ground', () => {
  expect(dark.background).toBe('#080706');
  expect(light.background).toBe('#f4eedf');
});
