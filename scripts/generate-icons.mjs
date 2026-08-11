/*
 * Rasterises the Mazad mark into the PNG set the web app manifest and iOS need.
 *
 * The mark itself is the same geometry as shared/components/ui/Logo.tsx (design system,
 * `assets/logo-mark.svg`) — kept in sync by hand, since a home-screen icon is a build artefact
 * rather than something the app renders. White on brand blue: the mark's usual blue-on-white
 * disappears against a light wallpaper, and white is one of the three colours the mark is
 * allowed to take.
 *
 * Run with `npm run icons:generate` after changing the mark or the brand colour.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// --color-primary, light theme. globals.css states it in hex already, so no conversion needed.
const BRAND = '#678af5';

/*
 * The mark sits off-centre in its own 64pt grid — the stroke-adjusted bounds are x 10..58,
 * y 14..46, so its centre is (34, 30) against the grid's (32, 32). Nudging it back matters at
 * icon sizes, where an off-centre glyph reads as a mistake rather than as style.
 */
const MARK_OFFSET_X = -2;
const MARK_OFFSET_Y = 2;

/**
 * @param {number} scale Fraction of the grid the mark occupies. 1 keeps the logo's own
 *   proportions; maskable icons need it smaller so a circular crop can't clip the mark.
 */
function markSvg(size, scale = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BRAND}"/>
  <g transform="translate(32 32) scale(${scale}) translate(${MARK_OFFSET_X - 32} ${MARK_OFFSET_Y - 32})">
    <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="42" cy="30" r="12"/>
      <path d="M30 42H14"/>
    </g>
  </g>
</svg>`;
}

const ICONS = [
  { file: 'favicon.png', size: 32 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  // iOS ignores the manifest and masks this itself, so it must be opaque and full-bleed.
  { file: 'apple-touch-icon.png', size: 180 },
  // Android crops maskable icons to whatever shape the launcher uses; only the middle 80% is
  // guaranteed to survive, and the mark is wide enough to need more headroom than that.
  { file: 'icon-maskable-512.png', size: 512, scale: 0.8 },
];

await mkdir(PUBLIC_DIR, { recursive: true });

await Promise.all(
  ICONS.map(async ({ file, size, scale }) => {
    const png = await sharp(Buffer.from(markSvg(size, scale)))
      .png()
      .toBuffer();
    await writeFile(join(PUBLIC_DIR, file), png);
    console.log(`${file} — ${size}x${size}`);
  }),
);
