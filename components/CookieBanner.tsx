'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-ok')) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-ok', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-sm',
      'border-t border-gray-700 dark:border-gray-800',
      'px-5 py-3 flex flex-wrap items-center justify-between gap-3'
    )}>
      <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
        Diese App speichert ausschliesslich technisch notwendige Einstellungen (z.&nbsp;B. Dark-Mode-Präferenz)
        lokal in deinem Browser. Es werden{' '}
        <strong className="text-gray-300 font-medium">keine Tracking-Cookies</strong>{' '}
        gesetzt und keine personenbezogenen Daten an Dritte weitergegeben.
      </p>
      <button
        onClick={accept}
        className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition-colors"
      >
        Verstanden
      </button>
    </div>
  );
}
