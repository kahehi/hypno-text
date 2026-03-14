'use client';

import { useState } from 'react';
import { Check, Copy, List, AlignLeft, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputVariant } from '@/types';

// Visual config for each trance phase
const TRANCE_PHASES: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  'einleitung': {
    label: 'Einleitung',
    color: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800',
    dot: 'bg-teal-400',
  },
  'suggestion': {
    label: 'Suggestion / Hauptteil',
    color: 'text-sage-700 dark:text-sage-300',
    bg: 'bg-sage-50 dark:bg-sage-900/20',
    border: 'border-sage-200 dark:border-sage-700',
    dot: 'bg-sage-500',
  },
  'ausleitung': {
    label: 'Ausleitung',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-400',
  },
};

function getTrancePhase(heading: string) {
  const h = heading.toLowerCase();
  if (h.includes('einleitung')) return TRANCE_PHASES['einleitung'];
  if (h.includes('suggestion') || h.includes('hauptteil')) return TRANCE_PHASES['suggestion'];
  if (h.includes('ausleitung')) return TRANCE_PHASES['ausleitung'];
  return null;
}

interface Props {
  variant: OutputVariant;
  tranceKeywords?: string;
}

function renderContent(content: string, isTrance = false) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      const heading = line.slice(3);
      const phase = isTrance ? getTrancePhase(heading) : null;

      if (phase) {
        // Extract optional duration hint like "(ca. 10 Min. → ca. 700 Wörter)" from heading
        const durationMatch = heading.match(/\[.*?\]|\(.*?\)/);
        const durationHint = durationMatch ? durationMatch[0] : null;
        const cleanLabel = heading.replace(/\[.*?\]|\(.*?\)/g, '').trim();

        return (
          <div key={i} className={cn('flex items-center gap-3 mt-7 mb-4 -mx-5 px-5 py-3 border-y', phase.bg, phase.border)}>
            <span className={cn('w-2 h-2 rounded-full shrink-0', phase.dot)} />
            <span className={cn('text-xs font-semibold uppercase tracking-widest', phase.color)}>
              {cleanLabel}
            </span>
            {durationHint && (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-1">
                {durationHint}
              </span>
            )}
          </div>
        );
      }

      return (
        <h3 key={i} className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-1">
          {heading}
        </h3>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h2 key={i} className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-1">
          {line.slice(2)}
        </h2>
      );
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <li key={i} className="ml-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {line.slice(2)}
        </li>
      );
    }
    if (line.trim() === '') {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {line}
      </p>
    );
  });
}

function renderKeywords(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h3 key={i} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-5 mb-2 first:mt-0">
          {line.slice(3)}
        </h3>
      );
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} className="flex items-start gap-2 py-1 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sage-500/60 shrink-0" />
          <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            {line.slice(2)}
          </span>
        </div>
      );
    }
    if (line.trim() === '') {
      return <div key={i} className="h-1" />;
    }
    return null;
  });
}

export default function OutputCard({ variant, tranceKeywords }: Props) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'text' | 'keywords'>('text');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(variant.content);

  const hasKeywords = variant.type === 'ericksonian' && !!tranceKeywords;
  const displayContent = hasKeywords && view === 'keywords' ? tranceKeywords! : editedContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{variant.label}</h3>

          {/* View toggle — only for trance text */}
          {hasKeywords && (
            <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                onClick={() => setView('text')}
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium transition-all',
                  view === 'text'
                    ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                )}
              >
                <AlignLeft size={11} />
                Volltext
              </button>
              <button
                onClick={() => setView('keywords')}
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium transition-all',
                  view === 'keywords'
                    ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                )}
              >
                <List size={11} />
                Stichwortliste
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!(hasKeywords && view === 'keywords') && (
            <button
              onClick={() => setIsEditing(e => !e)}
              className={cn(
                'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all',
                isEditing
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              )}
            >
              {isEditing ? <X size={12} /> : <Pencil size={12} />}
              {isEditing ? 'Fertig' : 'Bearbeiten'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all',
              copied
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            )}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Kopiert' : 'Kopieren'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 prose-hypno">
        {hasKeywords && view === 'keywords' ? (
          renderKeywords(tranceKeywords!)
        ) : isEditing ? (
          <textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            className="w-full min-h-[260px] text-sm text-gray-700 dark:text-gray-300 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-700 font-sans"
            spellCheck
          />
        ) : (
          renderContent(editedContent, variant.type === 'ericksonian')
        )}
      </div>
    </div>
  );
}
