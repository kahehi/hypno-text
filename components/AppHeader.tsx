'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import SettingsPanel from './SettingsPanel';

export default function AppHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span
              className={`font-display text-xl font-light tracking-wide transition-colors duration-500 ${
                scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white/90'
              }`}
            >
              Hypno Text
            </span>
            <span
              className={`text-xs font-light tracking-wide hidden sm:inline transition-colors duration-500 ${
                scrolled ? 'text-gray-400 dark:text-gray-500' : 'text-white/35'
              }`}
            >
              Hypnotherapeutischer Assistent
            </span>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              scrolled
                ? 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-white/40 hover:text-white/80 hover:bg-white/10'
            }`}
            aria-label="Einstellungen"
          >
            <Settings size={17} />
          </button>
        </div>
      </header>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
