'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'node_modules/react-i18next';
import { addNamespaceBundle, hasNamespaceBundle } from '@shared/i18n';

export interface NamespaceBundles {
  en: Record<string, unknown>;
  ar: Record<string, unknown>;
}

/**
 * Loads a feature's translation namespace on first use and registers both locales at once, so
 * switching languages later never needs a second fetch. `isReady` gates first render so no raw
 * translation key is ever painted (ADR-006/ADR-007).
 */
export function useNamespaceTranslation(ns: string, loader: () => Promise<NamespaceBundles>) {
  const { t, i18n } = useTranslation(ns);
  const locale = i18n.language as 'en' | 'ar';
  const [isReady, setIsReady] = useState(() => hasNamespaceBundle(ns, locale));

  useEffect(() => {
    // Already covered by the lazy initial state above — nothing to subscribe to.
    if (isReady) return;

    let cancelled = false;

    void loader().then((bundles) => {
      if (cancelled) return;
      addNamespaceBundle(ns, 'en', bundles.en);
      addNamespaceBundle(ns, 'ar', bundles.ar);
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [ns, isReady, loader]);

  return { t, isReady };
}
