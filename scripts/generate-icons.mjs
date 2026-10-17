/*
 * Rasterises the Bidoom mark into the PNG set the web app manifest, iOS and link previews need.
 *
 * The source is the brand sprite (src/shared/components/brand/brand-sprite.ts, generated from the
 * owner's logo-defs.svg): the `bd-engraved` gold plate is the app icon. A rasteriser has no CSS
 * cascade, so the sprite's custom properties are resolved to the values the engraved plate sets
 * for itself (ink #120E07 knocked out of gold #D9AA4A) before rendering.
 *
 * Run with `npm run icons:generate` after changing the mark.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');

const INK = '#120E07';
const PLATE_KNOCKOUT = '#D9AA4A';
const GROUND = '#080706';

async function spriteDefs() {
  const source = await readFile(
    join(ROOT, 'src', 'shared', 'components', 'brand', 'brand-sprite.ts'),
    'utf8',
  );
  const json = source.slice(source.indexOf('"'), source.lastIndexOf('"') + 1);
  return JSON.parse(json)
    .replace(/var\(--ko,#[0-9A-Fa-f]{6}\)/g, PLATE_KNOCKOUT)
    .replace(/var\(--af,(url\(#\w+\))\)/g, '$1')
    .replace(/var\(--wf,(url\(#\w+\))\)/g, '$1')
    .replace(/currentColor/g, INK)
    .replace(/<g style="color:#120E07;--ko:#D9AA4A">/g, '<g>');
}

/** The rounded gold plate on a transparent square (favicon, "any" icons). */
function plateSvg(defs, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 120 120">${defs}<use href="#bd-engraved" xlink:href="#bd-engraved" width="120" height="120"/></svg>`;
}

/**
 * Full-bleed gold with the mark inside the safe zone: iOS masks the touch icon itself and Android
 * crops maskable icons to the launcher's shape, so neither may carry transparent corners.
 */
function bleedSvg(defs, size, markScale) {
  const w = 72 * markScale;
  const h = 92 * markScale;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 120 120">${defs}<rect width="120" height="120" fill="url(#bdG)"/><use href="#bd-mono-flat" xlink:href="#bd-mono-flat" x="${60 - w / 2}" y="${60 - h / 2}" width="${w}" height="${h}"/></svg>`;
}

/** The link-preview card: the mark and the بيدوم wordmark on the night ground with its glow. */
function ogSvg(defs) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">${defs}
  <defs><radialGradient id="ogGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E2B23C" stop-opacity=".30"/><stop offset=".55" stop-color="#E2B23C" stop-opacity=".07"/><stop offset="1" stop-color="#E2B23C" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="${GROUND}"/>
  <ellipse cx="600" cy="315" rx="520" ry="300" fill="url(#ogGlow)"/>
  <use href="#bd-engraved" xlink:href="#bd-engraved" x="660" y="205" width="220" height="220"/>
  <use href="#bd-ar" xlink:href="#bd-ar" x="300" y="210" width="340" height="210"/>
</svg>`;
}

const defs = await spriteDefs();

const OUTPUTS = [
  { file: 'favicon.png', svg: plateSvg(defs, 32) },
  { file: 'icon-192.png', svg: plateSvg(defs, 192) },
  { file: 'icon-512.png', svg: plateSvg(defs, 512) },
  { file: 'apple-touch-icon.png', svg: bleedSvg(defs, 180, 1) },
  { file: 'icon-maskable-512.png', svg: bleedSvg(defs, 512, 0.8) },
  { file: 'og.png', svg: ogSvg(defs) },
];

await mkdir(PUBLIC_DIR, { recursive: true });

for (const { file, svg } of OUTPUTS) {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(join(PUBLIC_DIR, file), png);
  console.log(file);
}
