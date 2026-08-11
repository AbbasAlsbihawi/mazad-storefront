'use client';

import { useEffect } from 'react';

/**
 * Registers public/sw.js, which is what makes the app installable.
 *
 * Production only: in dev the worker would serve yesterday's hashed chunks over the top of a hot
 * reload, and the resulting "my change didn't apply" is a miserable thing to debug.
 *
 * Registration waits for `load` so it competes with nothing on the first paint — the worker is
 * only ever useful on a later visit anyway.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
        // Nothing to recover: the app works fine unregistered, it just isn't installable.
        console.error('Service worker registration failed', error);
      });
    };

    if (document.readyState === 'complete') {
      register();
      return;
    }

    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
