'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import NoticeBanner from '@/components/NoticeBanner';
import CaseForm from '@/components/CaseForm';
import OutputTabs from '@/components/OutputTabs';
import FeedbackBubble from '@/components/FeedbackBubble';
import type { CaseInput, GenerationResponse } from '@/types';
import { useTheme } from '@/lib/theme-context';

const FEATURES = [
  { label: 'Fallreflexion',      desc: 'Strukturiert & hypothesenbasiert' },
  { label: 'Trancetext',         desc: 'Passiv, ericksonian, atmend' },
  { label: 'Sitzungsfokus',      desc: 'Therapeutische Stoßrichtungen' },
  { label: 'Wissensbasis',       desc: 'Lokale PDFs als Kontext' },
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

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="hero-atmosphere relative overflow-hidden min-h-[72vh] flex flex-col justify-center">

        {/* Animated ambient orb */}
        <div
          className="hero-orb absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 65% at 68% 30%, rgba(50, 110, 65, 0.18) 0%, transparent 65%)',
          }}
        />

        {/* Decorative hypnotic rings — top right */}
        <div className="absolute -top-24 -right-24 w-[620px] h-[620px] opacity-[0.055] pointer-events-none select-none">
          <svg viewBox="0 0 620 620" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[40, 85, 130, 178, 228, 282, 340, 400, 462].map(r => (
              <circle key={r} cx="310" cy="310" r={r} stroke="white" strokeWidth="0.8" />
            ))}
            <line x1="310" y1="0"   x2="310" y2="620" stroke="white" strokeWidth="0.5" opacity="0.4" />
            <line x1="0"   y1="310" x2="620" y2="310" stroke="white" strokeWidth="0.5" opacity="0.4" />
            <line x1="0"   y1="0"   x2="620" y2="620" stroke="white" strokeWidth="0.4" opacity="0.25" />
            <line x1="620" y1="0"   x2="0"   y2="620" stroke="white" strokeWidth="0.4" opacity="0.25" />
          </svg>
        </div>

        {/* Thin accent line — left edge */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-sage-600/40 to-transparent" />

        {/* Bottom fade to page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-warm-50 dark:from-gray-950 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-28">

          {/* Overline */}
          <p className="anim-0 text-[0.62rem] font-medium tracking-[0.28em] uppercase text-sage-400/80 mb-7">
            Hypnotherapeutischer Schreib- und Reflexionsassistent
          </p>

          {/* Main heading */}
          <h1 className="anim-1 font-display font-light leading-[1.06] tracking-tight mb-8"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)', color: '#f0ece4' }}>
            Worte, die<br />
            <em className="not-italic"
                style={{ color: '#c8b97a' }}>
              zwischen den Zeilen
            </em><br />
            wirken.
          </h1>

          {/* Subtitle */}
          <p className="anim-2 font-light leading-relaxed mb-14"
             style={{ color: 'rgba(240, 236, 228, 0.6)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', maxWidth: '36rem' }}>
            Aus Fallinformationen entstehen vier durchdachte Textvarianten —
            von der klinischen Fallreflexion bis zum ericksonianischen Trancetext.
          </p>

          {/* Feature row */}
          <div className="anim-3 flex flex-wrap gap-x-10 gap-y-4">
            {FEATURES.map(({ label, desc }) => (
              <div key={label} className="group">
                <div className="text-[0.72rem] font-medium text-white/55 tracking-wide mb-0.5 group-hover:text-white/75 transition-colors">
                  {label}
                </div>
                <div className="text-[0.65rem] text-white/28 tracking-wide">
                  {desc}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="anim-4 mt-20 flex items-center gap-3 text-white/25">
            <div className="w-6 h-px bg-white/20" />
            <span className="text-[0.6rem] tracking-[0.2em] uppercase">Fallerfassung</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
              <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Form section ─────────────────────────────────────────────────────── */}
      <main className="bg-warm-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-7">

          <NoticeBanner />

          <div className="max-w-2xl mx-auto">
            <CaseForm onGenerate={handleGenerate} loading={loading} />
          </div>

          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-5 py-4 flex gap-3 items-start">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">Fehler</p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div id="results" className="max-w-2xl mx-auto">
              <OutputTabs result={result} caseTitle={caseTitle} />
            </div>
          )}
        </div>
      </main>

      <FeedbackBubble />
    </div>
  );
}
