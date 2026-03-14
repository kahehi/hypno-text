'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Sun, Moon, Key, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import KnowledgeStatus from './KnowledgeStatus';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: Props) {
  const { dark, toggleDark, apiKey, setApiKey } = useTheme();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setKeyInput(apiKey);
  }, [apiKey]);

  const handleSaveKey = () => {
    setApiKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        className={cn(
          'w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl',
          'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Einstellungen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Dark Mode */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Darstellung
            </p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {dark ? (
                  <Moon size={18} className="text-sage-400" />
                ) : (
                  <Sun size={18} className="text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {dark ? 'Dark Mode aktiv' : 'Light Mode aktiv'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Farbschema der App wechseln
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDark}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none',
                  dark ? 'bg-sage-600' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300',
                    dark ? 'translate-x-6' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

          {/* API Key */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              API-Konfiguration
            </p>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  OpenAI API-Key
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Überschreibt den API-Key aus <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">.env.local</code>. Wird nur im Arbeitsspeicher gehalten – beim Schließen des Tabs gelöscht.
              </p>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className={cn(
                    'w-full pr-10 pl-3 py-2.5 rounded-lg border text-sm font-mono transition-all outline-none',
                    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700',
                    'text-gray-800 dark:text-gray-100 placeholder-gray-400',
                    'focus:ring-2 focus:ring-sage-400 focus:border-transparent'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                className={cn(
                  'flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all',
                  saved
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-sage-600 text-white hover:bg-sage-700'
                )}
              >
                {saved ? <Check size={14} /> : <Key size={14} />}
                {saved ? 'Gespeichert' : 'Speichern'}
              </button>
            </div>
          </div>

          {/* Wissensbasis */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Wissensbasis
            </p>
            <KnowledgeStatus />
          </div>

          {/* Hinweise */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Hinweise
            </p>
            <ul className="space-y-2">
              {[
                'Je mehr Kontext, desto präziser die Ausgabe',
                'Hypothesen hypothetisch formulieren – das Tool spiegelt deinen Stil',
                'Ressourcen aktiv benennen fördert ressourcenorientierte Texte',
                'PDFs in /knowledge legen und neu indexieren für Wissenseinbindung',
              ].map(tip => (
                <li key={tip} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="text-sage-400 shrink-0 mt-0.5">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
            Hypno Text ist ein lokales Tool. Falldaten werden ausschließlich zur Textgenerierung
            an die konfigurierte API übermittelt und nicht gespeichert.
          </p>
        </div>
      </div>
    </div>
  );
}
