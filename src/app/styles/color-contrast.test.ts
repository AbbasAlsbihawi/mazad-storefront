import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.1 AA text contrast (1.4.3) for the colour tokens in globals.css, in both themes: 4.5:1 for
 * normal-size text. axe flagged the muted labels (timestamps, captions), the accent links and
 * white text on the primary and status fills; these pairs keep them from regressing.
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

function oklchToRgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return lin.map((x) => {
    const v = Math.min(1, Math.max(0, x));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  }) as Rgb;
}

function parse(value: string): Rgb {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  const digits = hex?.[1];
  if (digits) return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16) / 255) as Rgb;
  const ok = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(value);
  if (ok) return oklchToRgb(Number(ok[1]), Number(ok[2]), Number(ok[3]));
  throw new Error(`unparsed colour ${value}`);
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
  const a = luminance(color(fg));
  const b = luminance(color(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const light = tokens(':root');
const dark = { ...light, ...tokens("[data-theme='dark']") };

const SURFACES = ['background', 'surface', 'surface-raised'];
// Unread notifications and selected rows sit on the primary tint, so the secondary text there too.
const TEXT_ON_SURFACES: [string, string][] = [
  ...['muted-foreground', 'foreground-soft', 'accent', 'primary-text', 'destructive'].flatMap(
    (fg) => SURFACES.map((bg): [string, string] => [fg, bg]),
  ),
  ['muted-foreground', 'primary-tint'],
  ['foreground-soft', 'primary-tint'],
  ['primary-text', 'primary-tint'],
];
const ON_FILL: [string, string][] = [
  ['primary-foreground', 'primary'],
  ['live-foreground', 'live'],
  ['info-foreground', 'info'],
  ['warning-foreground', 'warning'],
  ['destructive-foreground', 'destructive'],
];

describe.each([
  ['light', light],
  ['dark', dark],
] as const)('%s theme colour tokens meet WCAG AA 4.5:1', (_name, theme) => {
  it.each(TEXT_ON_SURFACES)('%s text on %s', (fg, bg) => {
    expect(contrast(theme, fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(ON_FILL)('%s on %s', (fg, bg) => {
    expect(contrast(theme, fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
