'use client';

import { useState } from 'react';
import { Loader2, RotateCcw, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CaseInput } from '@/types';
import DemoCaseButton from './DemoCaseButton';

const CONTEXT_OPTIONS = [
  'Ambulante Praxis',
  'Online-Sitzung',
  'Stationäre Einrichtung',
  'Gruppenarbeit',
  'Erstgespräch',
  'Folgegespräch',
  'Einzelsetting',
  'Supervision',
];

const EMPTY_CASE: CaseInput = {
  caseTitle: '',
  clientInitials: '',
  clientAge: '',
  context: '',
  concern: '',
  goal: '',
  hypotheses: '',
  resources: '',
  observations: '',
  notes: '',
};

interface Props {
  onGenerate: (data: CaseInput) => void;
  loading: boolean;
}

const inputBase = cn(
  'w-full rounded-lg border px-3 py-2.5 text-sm transition-all resize-none outline-none',
  'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700',
  'text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
  'focus:ring-2 focus:ring-sage-400 focus:border-transparent'
);

const labelBase = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function CaseForm({ onGenerate, loading }: Props) {
  const [form, setForm] = useState<CaseInput>(EMPTY_CASE);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [customContext, setCustomContext] = useState('');
  const [ageValue, setAgeValue] = useState<number>(0); // 0 = not set
  const [inductionMin, setInductionMin] = useState<number>(10);
  const [suggestionMin, setSuggestionMin] = useState<number>(15);
  const [exitMin, setExitMin] = useState<number>(5);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleContext = (opt: string) => {
    setSelectedContexts(prev => {
      const next = prev.includes(opt) ? prev.filter(c => c !== opt) : [...prev, opt];
      return next;
    });
  };

  const buildContextString = () => {
    const parts = [...selectedContexts];
    if (customContext.trim()) parts.push(customContext.trim());
    return parts.join(', ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contextStr = buildContextString();
    const ageStr = ageValue > 0 ? String(ageValue) : '';
    onGenerate({
      ...form,
      context: contextStr,
      clientAge: ageStr,
      inductionMinutes: inductionMin,
      suggestionMinutes: suggestionMin,
      exitMinutes: exitMin,
    });
  };

  const handleReset = () => {
    setForm(EMPTY_CASE);
    setSelectedContexts([]);
    setCustomContext('');
    setAgeValue(0);
    setInductionMin(10);
    setSuggestionMin(15);
    setExitMin(5);
  };

  const handleDemoLoad = (data: CaseInput) => {
    setForm(data);
    // Parse context back to checkboxes
    if (data.context) {
      const matched = CONTEXT_OPTIONS.filter(opt => data.context.includes(opt));
      setSelectedContexts(matched);
      const remaining = data.context
        .split(',')
        .map(s => s.trim())
        .filter(s => s && !CONTEXT_OPTIONS.includes(s))
        .join(', ');
      setCustomContext(remaining);
    }
    if (data.clientAge) {
      const n = parseInt(data.clientAge);
      if (!isNaN(n)) setAgeValue(n);
    }
  };

  const isValid = form.caseTitle && form.concern && form.goal;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SectionCard title="Fallbasis">
        <div className="space-y-4">
          <div>
            <label className={labelBase}>
              Fallbezeichnung <span className="text-sage-500">*</span>
            </label>
            <input
              type="text"
              name="caseTitle"
              value={form.caseTitle}
              onChange={handleChange}
              placeholder="z.B. Erstgespräch Schlafproblematik, Sitzung 3 Angst"
              className={inputBase}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>
                Klient <span className="text-gray-400 font-normal text-xs">(Initialen)</span>
              </label>
              <input
                type="text"
                name="clientInitials"
                value={form.clientInitials || ''}
                onChange={handleChange}
                placeholder="z.B. M.K."
                className={inputBase}
              />
            </div>

            <div>
              <label className={labelBase}>
                Alter{' '}
                <span className="text-gray-400 font-normal text-xs">
                  {ageValue > 0 ? `(${ageValue} Jahre)` : '(nicht angegeben)'}
                </span>
              </label>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={1}
                  value={ageValue}
                  onChange={e => setAgeValue(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-sage-600 bg-gray-200 dark:bg-gray-600"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8 text-right shrink-0">
                  {ageValue > 0 ? ageValue : '–'}
                </span>
              </div>
            </div>
          </div>

          {/* Context Checkboxes */}
          <div>
            <label className={labelBase}>Setting / Kontext</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CONTEXT_OPTIONS.map(opt => {
                const active = selectedContexts.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleContext(opt)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                      active
                        ? 'bg-sage-600 text-white border-sage-600'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-sage-400 hover:text-sage-700 dark:hover:text-sage-400'
                    )}
                  >
                    <span
                      className={cn(
                        'w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] shrink-0',
                        active ? 'bg-white border-white text-sage-700' : 'border-current'
                      )}
                    >
                      {active && '✓'}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customContext}
              onChange={e => setCustomContext(e.target.value)}
              placeholder="Sonstiges / eigene Angabe…"
              className={inputBase}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Fallinhalt">
        <div className="space-y-4">
          <div>
            <label className={labelBase}>
              Anliegen / Symptomatik <span className="text-sage-500">*</span>
            </label>
            <textarea
              name="concern"
              value={form.concern}
              onChange={handleChange}
              placeholder="Beschreibe das Anliegen des Klienten, beobachtbare Symptome, Hauptthema…"
              rows={4}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>
              Zielsetzung <span className="text-sage-500">*</span>
            </label>
            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Was möchte der Klient erreichen? Welche Richtung wurde vereinbart?"
              rows={3}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Hypothesen / vermutete Dynamiken</label>
            <textarea
              name="hypotheses"
              value={form.hypotheses || ''}
              onChange={handleChange}
              placeholder="Denkbare Zusammenhänge, Muster, mögliche Hintergründe (hypothetisch formulieren)…"
              rows={3}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Ressourcen / Schutzfaktoren</label>
            <textarea
              name="resources"
              value={form.resources || ''}
              onChange={handleChange}
              placeholder="Stärken, Unterstützung, positive Erlebnisse, Kompetenzen…"
              rows={3}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Beobachtungen / Sprache / Verhalten</label>
            <textarea
              name="observations"
              value={form.observations || ''}
              onChange={handleChange}
              placeholder="Körperhaltung, Sprachmuster, auffällige Formulierungen, nonverbale Signale…"
              rows={3}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelBase}>Zusatznotizen</label>
            <textarea
              name="notes"
              value={form.notes || ''}
              onChange={handleChange}
              placeholder="Sonstiges, besondere Hinweise, Vereinbarungen…"
              rows={2}
              className={inputBase}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Trancestruktur">
        <div className="space-y-5">
          {[
            { label: 'Einleitung in Trance', value: inductionMin, set: setInductionMin, min: 2, max: 25, unit: 'Min.' },
            { label: 'Suggestion / Hauptteil', value: suggestionMin, set: setSuggestionMin, min: 5, max: 45, unit: 'Min.' },
            { label: 'Ausleitung', value: exitMin, set: setExitMin, min: 2, max: 15, unit: 'Min.' },
          ].map(({ label, value, set, min, max, unit }) => (
            <div key={label}>
              <label className={labelBase}>
                {label}{' '}
                <span className="text-gray-400 font-normal text-xs">
                  ({value} {unit})
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={1}
                  value={value}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-sage-600 bg-gray-200 dark:bg-gray-600"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right shrink-0">
                  {value} Min
                </span>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Gesamtdauer: ca. {inductionMin + suggestionMin + exitMin} Minuten
          </p>
        </div>
      </SectionCard>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <DemoCaseButton onLoad={handleDemoLoad} />
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <RotateCcw size={14} />
            Leeren
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !isValid}
          className={cn(
            'flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm',
            'bg-sage-600 text-white hover:bg-sage-700',
            (loading || !isValid) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generiere…
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Generieren
            </>
          )}
        </button>
      </div>
    </form>
  );
}
