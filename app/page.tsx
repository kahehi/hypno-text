'use client';

import { useState } from 'react';
import { AlertCircle, Brain, FileText, Layers, BookOpen } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import NoticeBanner from '@/components/NoticeBanner';
import CaseForm from '@/components/CaseForm';
import OutputTabs from '@/components/OutputTabs';
import KnowledgeStatus from '@/components/KnowledgeStatus';
import FeedbackBubble from '@/components/FeedbackBubble';
import type { CaseInput, GenerationResponse } from '@/types';
import { useTheme } from '@/lib/theme-context';

const FEATURES = [
  { icon: Brain, label: 'Fallreflexion', desc: 'Strukturierte hypnotherapeutische Reflexion' },
  { icon: Layers, label: 'Erickson-inspiriert', desc: 'Indirekte, metaphorische Formulierungen' },
  { icon: FileText, label: '4 Varianten', desc: 'Kurzfassung bis Sitzungsfokus' },
  { icon: BookOpen, label: 'Wissensbasis', desc: 'Lokale PDFs als Hintergrundwissen' },
];

export default function HomePage() {
  const { apiKey } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [caseTitle, setCaseTitle] = useState('');

  const handleGenerate = async (data: CaseInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCaseTitle(data.caseTitle);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _apiKey: apiKey || undefined }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Ein Fehler ist aufgetreten.');
        return;
      }

      setResult(json as GenerationResponse);

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Netzwerkfehler. Bitte prüfe deine Verbindung und API-Konfiguration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-gray-950 transition-colors">
      <AppHeader />

      {/* Hero Strip */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-snug mb-3">
              Professionelle Texte.<br />
              <span className="text-sage-600 dark:text-sage-400">Ressourcenorientiert. Indirekt.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Trage die Fallinformationen ein und erhalte vier durchdachte Textvarianten –
              von der prägnanten Kurzfassung bis zur ericksonianischen Formulierung.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-7 h-7 rounded-lg bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-sage-600 dark:text-sage-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <NoticeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <CaseForm onGenerate={handleGenerate} loading={loading} />
          </div>
          <div className="space-y-4">
            <KnowledgeStatus />

            {/* Tips card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
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
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-5 py-4 flex gap-3 items-start">
            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Fehler</p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div id="results">
            <OutputTabs result={result} caseTitle={caseTitle} />
          </div>
        )}
      </main>

      <FeedbackBubble />
    </div>
  );
}
