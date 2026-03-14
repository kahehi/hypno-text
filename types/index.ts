export interface CaseInput {
  // Fallbasis
  caseTitle: string;
  clientInitials?: string;
  clientAge?: string;
  context: string;

  // Inhalt
  concern: string;
  goal: string;
  hypotheses?: string;
  resources?: string;
  observations?: string;
  notes?: string;

  // Trancestruktur
  inductionMinutes?: number;   // Einleitung in Trance
  suggestionMinutes?: number;  // Suggestion / Hauptteil
  exitMinutes?: number;        // Ausleitung
}

export interface OutputVariant {
  id: string;
  label: string;
  type: 'summary' | 'reflection' | 'ericksonian' | 'sessionfocus';
  content: string;
}

export interface KnowledgeChunk {
  id: string;
  sourceFile: string;
  text: string;
  keywords: string[];
  index: number;
}

export interface KnowledgeIndex {
  version: number;
  lastIndexed: string;
  totalFiles: number;
  totalChunks: number;
  files: string[];
  chunks: KnowledgeChunk[];
}

export interface SigristApproach {
  name: string;           // e.g. "Ressourcenaktivierung"
  rationale: string;      // Warum dieser Ansatz für den Fall
  keyPatterns: string[];  // Sprachliche Leitprinzipien
  metaphorSuggestion: string; // Mögliches Bild / Metapher
}

export interface GenerationResponse {
  variants: OutputVariant[];
  usedChunks: KnowledgeChunk[];
  sigristApproach?: SigristApproach;
  tranceKeywords?: string;
  error?: string;
}

export interface KnowledgeStatusData {
  totalFiles: number;
  totalChunks: number;
  lastIndexed: string | null;
  files: string[];
}
