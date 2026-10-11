'use client';

import { useEffect } from 'react';
import './styles/globals.css';

/**
 * The last resort, when the root layout itself failed: it replaces the whole document, so there
 * are no providers, no stored language and no i18n here. Both languages are shown, Arabic (the
 * default) first, with links that reload the app from scratch.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-background text-foreground">
        <title>حدث خطأ — Something went wrong</title>
        <main
          role="alert"
          className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-3 px-8 text-center"
        >
          <p className="text-title-3 font-bold">حدث خطأ ما.</p>
          <p className="text-subhead text-muted-foreground">
            تعذّر فتح مزاد الآن. حاول مرة أخرى بعد قليل.
          </p>
          <p className="text-title-3 font-bold" lang="en" dir="ltr">
            Something went wrong.
          </p>
          <p className="text-subhead text-muted-foreground" lang="en" dir="ltr">
            Mazad couldn&apos;t open right now. Please try again in a moment.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={retry}
              className="inline-flex h-touch items-center rounded-md bg-primary px-[18px] text-subhead font-semibold text-primary-foreground"
            >
              إعادة المحاولة · Try again
            </button>
            {/* A plain link: a full reload, since the app shell itself is what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex h-touch items-center rounded-md bg-fill px-[18px] text-subhead font-semibold text-foreground"
            >
              الرئيسية · Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
