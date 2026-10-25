import { numberLocale } from './money';

/** Arabic dates use the Iraqi month names and Western digits: 17 تشرين الأول 2026, 4:05 م. */
const DATE_TIME_OPTIONS: Record<'en' | 'ar', Intl.DateTimeFormatOptions> = {
  en: { dateStyle: 'medium', timeStyle: 'short' },
  ar: { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' },
};

const DATE_OPTIONS: Record<'en' | 'ar', Intl.DateTimeFormatOptions> = {
  en: { dateStyle: 'medium' },
  ar: { day: 'numeric', month: 'long', year: 'numeric' },
};

export function formatDateTime(iso: string, locale: 'en' | 'ar'): string {
  return new Intl.DateTimeFormat(numberLocale(locale), DATE_TIME_OPTIONS[locale]).format(
    new Date(iso),
  );
}

export function formatDate(iso: string, locale: 'en' | 'ar'): string {
  return new Intl.DateTimeFormat(numberLocale(locale), DATE_OPTIONS[locale]).format(new Date(iso));
}

/** A clock time on its own (bid history rows, "today 9:31"). */
export function formatTime(iso: string, locale: 'en' | 'ar'): string {
  return new Intl.DateTimeFormat(numberLocale(locale), {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

/**
 * The day part of a countdown. English keeps the compact `3d`; Arabic gets the word with its
 * number agreement, by the CLDR Arabic plural categories: one يوم, two يومان, few (3–10) أيام,
 * many (11–99) يومًا, other (100, 101, …) يوم. `3d` reads as a stray Latin letter in Arabic (beta
 * device check, 2026-10-08). Digits stay Western like the clock (see formatDuration).
 */
function dayPart(days: number, locale: 'en' | 'ar'): string {
  if (locale === 'en') return `${days}d`;
  if (days === 1) return 'يوم';
  if (days === 2) return 'يومان';
  const lastTwo = days % 100;
  if (lastTwo >= 3 && lastTwo <= 10) return `${days} أيام`;
  if (lastTwo >= 11) return `${days} يومًا`;
  return `${days} يوم`;
}

/**
 * `12:34:56` under a day, `3d 04:12:00` (Arabic `3 أيام 04:12:00`) at or beyond one day. Clamps
 * negative input to zero. Digits are Western and tabular on purpose: Arabic-Indic digits would
 * make a ticking countdown jitter in width.
 */
export function formatDuration(ms: number, locale: 'en' | 'ar' = 'en'): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${dayPart(days, locale)} ${clock}` : clock;
}
