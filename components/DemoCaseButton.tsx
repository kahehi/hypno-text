'use client';

import { Sparkles } from 'lucide-react';
import type { CaseInput } from '@/types';

const DEMO_CASE: CaseInput = {
  caseTitle: 'Erstgespräch Leistungsangst',
  clientInitials: 'M.K.',
  clientAge: '34',
  context: 'Einzelsetting, ambulante hypnotherapeutische Praxis, Erstgespräch',
  concern: 'Ausgeprägte Prüfungsangst und Leistungsblockaden seit der Schulzeit. Körperliche Symptome wie Herzrasen, Schwitzen und Blackouts in Prüfungssituationen. Aktuell anstehende wichtige berufliche Zertifizierung.',
  goal: 'Mehr Gelassenheit in Leistungssituationen entwickeln, Zugang zu inneren Ressourcen und persönlicher Stärke finden. Prüfung erfolgreich ablegen.',
  hypotheses: 'Möglicherweise besteht eine ältere Konditionierung von Bewertungsangst, die in Leistungssituationen automatisch aktiviert wird. Denkbar wäre eine Verbindung mit frühen Erfahrungen von Versagensgefühlen. Es könnte darauf hindeuten, dass das innere Bild von sich selbst in Leistungssituationen noch nicht die tatsächlich vorhandenen Kompetenzen widerspiegelt.',
  resources: 'Hohe intrinsische Motivation, breites Fachwissen im Berufsfeld, unterstützendes soziales Umfeld, gute Selbstreflexionsfähigkeit, Interesse an innerer Arbeit.',
  observations: 'Spricht schnell und gedankenreich. Zeigt beim Thema Ressourcen sichtbare Aufhellung. Nutzt viele Konjunktive. Körperhaltung zunächst angespannt, löst sich im Gespräch.',
  notes: 'Erste Hypnoseerfahrung. Offene Grundhaltung. Bat ausdrücklich um ressourcenorientiertes Vorgehen.',
};

interface Props {
  onLoad: (data: CaseInput) => void;
}

export default function DemoCaseButton({ onLoad }: Props) {
  return (
    <button
      onClick={() => onLoad(DEMO_CASE)}
      className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
    >
      <Sparkles size={14} />
      Demo-Fall laden
    </button>
  );
}
