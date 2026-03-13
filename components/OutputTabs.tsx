'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GenerationResponse } from '@/types';
import OutputCard from './OutputCard';
import PdfExportMenu from './PdfExportMenu';
import ActionBar from './ActionBar';

interface Props {
  result: GenerationResponse;
  caseTitle: string;
}

export default function OutputTabs({ result, caseTitle }: Props) {
  const [showKnowledge, setShowKnowledge] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          Generierte Ausgaben
        </h2>
        <div className="flex items-center gap-2">
          <ActionBar variants={result.variants} />
          <PdfExportMenu variants={result.variants} caseTitle={caseTitle} />
        </div>
      </div>

      {result.sigristApproach && (
        <div className="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">TS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-sage-600 dark:text-sage-400 uppercase tracking-wide">
                  Tom Sigrist — Empfohlener Ansatz
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {result.sigristApproach.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {result.sigristApproach.rationale}
              </p>
              {result.sigristApproach.keyPatterns.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Sprachliche Leitprinzipien
                  </span>
                  <ul className="mt-1.5 space-y-1">
                    {result.sigristApproach.keyPatterns.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-sage-500 mt-0.5 shrink-0">·</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.sigristApproach.metaphorSuggestion && (
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                    Metapher / Bild
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    {result.sigristApproach.metaphorSuggestion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {result.variants.map(variant => (
          <OutputCard key={variant.id} variant={variant} />
        ))}
      </div>

      {result.usedChunks.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowKnowledge(!showKnowledge)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium">
              Verwendetes Wissen ({result.usedChunks.length} Chunk{result.usedChunks.length !== 1 ? 's' : ''})
            </span>
            {showKnowledge ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showKnowledge && (
            <div className="px-5 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
              {result.usedChunks.map((chunk, i) => (
                <div key={chunk.id} className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">#{i + 1}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {chunk.sourceFile}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {chunk.text.slice(0, 350)}{chunk.text.length > 350 ? '…' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
