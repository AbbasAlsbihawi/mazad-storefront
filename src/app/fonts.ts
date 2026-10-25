import { Cinzel, El_Messiri, IBM_Plex_Sans_Arabic, Jost } from 'next/font/google';

/*
 * The Bidoom type system, self-hosted: next/font downloads these at build time and serves them
 * from this origin (/_next/static/media), so the page makes no request to Google and the CSP
 * needs no font host. Each exposes a CSS variable that globals.css composes into --f (body),
 * --fd (display) and --fn (numbers).
 */

/** Body text in Arabic (and Latin inside Arabic text). Not a variable font: the weights in use. */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-arabic',
});

/** Body text in English and every number (prices, countdowns, counts). */
export const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
});

/** Arabic display: headings, the featured lot's name, empty-state titles. */
export const elMessiri = El_Messiri({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-el-messiri',
});

/** English display and the BIDOOM wordmark. Only English pages use it, so it is not preloaded. */
export const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-cinzel',
});

export const FONT_VARIABLES = [
  plexArabic.variable,
  jost.variable,
  elMessiri.variable,
  cinzel.variable,
].join(' ');
