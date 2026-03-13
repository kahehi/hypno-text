'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import SettingsPanel from './SettingsPanel';

export default function AppHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Hypno Text
            </h1>
            <span className="text-sm text-gray-400 dark:text-gray-500 font-light hidden sm:inline">
              Hypnotherapeutischer Schreib- und Reflexionsassistent
            </span>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Einstellungen"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
