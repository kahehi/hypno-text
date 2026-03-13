import type { CaseInput, KnowledgeChunk } from '@/types';

// ─── System roles ─────────────────────────────────────────────────────────────

const SYSTEM_REFLECTIVE = `Du bist ein professioneller Schreib- und Reflexionsassistent für hypnotherapeutische Arbeit. Du formulierst ressourcenorientiert, vorsichtig, indirekt und professionell. Du stellst keine medizinischen Diagnosen, gibst keine Heilversprechen und machst keine definitiven pathologischen Aussagen. Du formulierst beobachtend, hypothesenbasiert und strukturierend.

Bevorzugte Formulierungen: "es zeigt sich", "es lässt sich vermuten", "möglicherweise", "denkbar wäre", "es könnte darauf hindeuten", "im Erleben des Klienten scheint".

Nicht erlaubt: medizinische Diagnosen, Heilversprechen, Krisenintervention, Medikamentenempfehlungen, definitive pathologisierende Aussagen.`;

const SYSTEM_SIGRIST = `Du bist ein erfahrener Hypnotherapeut, der im Stil von Tom Sigrist schreibt. Deine Trancetexte sind vollständig passiv, niemals direktiv. Du formulierst ausschließlich einladend, permissiv und beobachtend. Die Sprache ist weich, rhythmisch und folgt dem natürlichen Atem- und Erleben des Klienten.

Kernprinzipien deiner Sprache nach Tom Sigrist:
- Vollständige Passivität: Kein Imperativ. Niemals "entspann dich", "atme tief", "schließ die Augen".
- Stattdessen: "…und es könnte sein, dass…", "…vielleicht bemerkt ein Teil von dir…", "…und dein Unbewusstes weiß bereits…"
- Das Unbewusste wird direkt und respektvoll adressiert als eigenständige, weise Instanz.
- Pacing & Leading: erst beschreiben was ist, dann behutsam einladen in eine neue Richtung.
- Eingebettete Suggestionen: Veränderung klingt wie eine neutrale, fast beiläufige Beobachtung.
- Naturbilder, Jahreszeiten, Wasser, Wurzeln, Licht als Metaphernpool.
- Zeitverzerrung und Dissoziation werden sanft eingeladen, nie verordnet.
- Verknüpfende Konjunktionen: "…und während…", "…und genau dann…", "…und je mehr…, desto mehr…"
- Präsuppositionen: "…wenn du bemerkst, wie sich etwas verändert…" setzt Veränderung voraus.
- Permissive Sprache: "…darf…", "…kann wenn es möchte…", "…ganz in deinem Tempo…", "…auf deine ganz eigene Art und Weise…"
- Zirkuläre Formulierungen, die sich selbst vertiefen.
- Sprache die "zwischen den Zeilen" wirkt – der bewusste Verstand muss nicht verstehen.

Absolut verboten: Imperative, Diagnosesprache, direkte Befehle, Versprechen von Wirkungen, Pathologisierungen.`;

const SYSTEM_SIGRIST_APPROACH = `Du bist ein erfahrener Hypnotherapeut im Stil von Tom Sigrist. Deine Aufgabe ist es, anhand von Fallinformationen den am besten passenden therapeutischen Ansatz aus Tom Sigrists Methodenspektrum zu identifizieren und knapp zu begründen.

Tom Sigrists Hauptansätze:
1. Ressourcenaktivierung – Zugang zu inneren Stärken und vergessenen Potenzialen
2. Metaphernarbeit – Heilende Geschichten, Symbole und Naturbilder
3. Utilisation – Das Einbeziehen dessen was der Klient mitbringt (Symptome, Widerstände, Bilder)
4. Zukunftsprojektion – Pseudo-Orientierung in der Zeit, Vorwegnehmen des Zielzustands
5. Altersregression zu Ressourcen – Rückkehr zu Erlebnissen innerer Stärke
6. Symptomverschreibung – Paradoxe Nutzung des Symptoms als Ressource
7. Dissoziation & Beobachterposition – Schützende Distanz zum belastenden Erleben
8. Teilearbeit – Dialog mit inneren Anteilen und unbewussten Aspekten
9. Körperanker & Verkörperung – Somatische Ressourcen und körperliche Empfindungen

Antworte ausschließlich als valides JSON-Objekt ohne Markdown-Blöcke.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCaseContext(input: CaseInput): string {
  return [
    `Fallbezeichnung: ${input.caseTitle}`,
    input.clientInitials ? `Klient: ${input.clientInitials}` : null,
    input.clientAge ? `Alter: ${input.clientAge}` : null,
    input.context ? `Kontext/Setting: ${input.context}` : null,
    `Anliegen/Symptomatik: ${input.concern}`,
    `Zielsetzung: ${input.goal}`,
    input.hypotheses ? `Hypothesen/Dynamiken: ${input.hypotheses}` : null,
    input.resources ? `Ressourcen/Schutzfaktoren: ${input.resources}` : null,
    input.observations ? `Beobachtungen/Sprache: ${input.observations}` : null,
    input.notes ? `Zusatznotizen: ${input.notes}` : null,
  ].filter(Boolean).join('\n');
}

function formatKnowledgeContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return '';
  const excerpts = chunks.map((c, i) => `[${i + 1}] ${c.text.slice(0, 400)}`).join('\n\n');
  return `\n\nHintergrundwissen (stilistisch einfließen lassen, nicht direkt zitieren):\n${excerpts}`;
}

function formatTranceStructure(input: CaseInput): string {
  const parts: string[] = [];
  if (input.inductionMinutes) parts.push(`Einleitung in Trance: ca. ${input.inductionMinutes} Minuten`);
  if (input.suggestionMinutes) parts.push(`Suggestion / Hauptteil: ca. ${input.suggestionMinutes} Minuten`);
  if (input.exitMinutes) parts.push(`Ausleitung: ca. ${input.exitMinutes} Minuten`);
  if (parts.length === 0) return '';
  return `\nGewünschte Trancestruktur:\n${parts.join('\n')}`;
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

export function buildSummaryPrompt(input: CaseInput, chunks: KnowledgeChunk[]) {
  return {
    system: SYSTEM_REFLECTIVE,
    user: `Erstelle eine professionelle Kurzfassung des folgenden Falls in einem einzigen kompakten, fachlichen Absatz. Formuliere beobachtend und hypothesenbasiert.

Fallinformationen:
${formatCaseContext(input)}
${formatKnowledgeContext(chunks)}

Ausgabe: Ein einzelner prägnanter Absatz. Keine Aufzählungen. Professionelle, ressourcenorientierte Sprache.`,
  };
}

export function buildReflectionPrompt(input: CaseInput, chunks: KnowledgeChunk[]) {
  return {
    system: SYSTEM_REFLECTIVE,
    user: `Erstelle eine fachliche Fallreflexion in 3-5 strukturierten Abschnitten mit Zwischenüberschriften (z.B. Fallbild, Hypothesen, Ressourcenperspektive, Dynamiken, Therapeutische Leitlinie). Formuliere professionell, beobachtend und hypothesenbasiert.

Fallinformationen:
${formatCaseContext(input)}
${formatKnowledgeContext(chunks)}

Ausgabe: Markdown mit ## für Überschriften. Ressourcenorientiert, indirekt, professionell.`,
  };
}

export function buildEricksonianPrompt(input: CaseInput, chunks: KnowledgeChunk[]) {
  const inductMin = input.inductionMinutes ?? 10;
  const suggMin = input.suggestionMinutes ?? 15;
  const exitMin = input.exitMinutes ?? 5;
  const structure = formatTranceStructure(input);

  return {
    system: SYSTEM_SIGRIST,
    user: `Schreibe einen vollständigen Trancetext im Stil von Tom Sigrist für den folgenden Fall. Der Text ist kein Skript zum Befehl-Vorlesen, sondern ein fließender, atembarer Begleittext, der ausschließlich einlädt, beobachtet und Raum lässt.

Fallinformationen:
${formatCaseContext(input)}
${structure}
${formatKnowledgeContext(chunks)}

Gliedere den Text in drei erkennbare Phasen:

## Einleitung (ca. ${inductMin} Min.)
Sanftes Ankommen im Raum und im Moment. Naturnahes Pacing des aktuellen Erlebens. Kein Aufruf zur Entspannung – nur beobachtende, rhythmische Begleitung des Atemflusses, der Geräusche, der kleinen Empfindungen im Körper. Das Bewusstsein darf sich verabschieden, ganz in seinem eigenen Tempo.

## Suggestion / Hauptteil (ca. ${suggMin} Min.)
Kernarbeit im Trancezustand. Vollständig passiv und ressourcenorientiert. Das Unbewusste wird direkt und respektvoll als eigenständige weise Instanz adressiert. Eingebettete Suggestionen, Metaphern aus der Natur, sanfte Zeitverzerrung, einladende Dissoziation – alles nur angeboten, nie verordnet. Das Thema des Klienten fließt durch Bilder und symbolische Sprache ein, nicht durch direkte Benennung von Symptomen. Ziele entstehen als Möglichkeit im Raum, nicht als Forderung.

## Ausleitung (ca. ${exitMin} Min.)
Behutsames Zurückfinden in den Raum. Rückorientierung in Körper, Atem und Gegenwart. Würdigung des Erlebten ohne zu bewerten. Einladung, etwas mitzunehmen – was immer stimmig ist, auf die ganz eigene Art. Langsames, respektvolles Wiederauftauchen.

Wichtig: Kein einziger Imperativ. Kein "entspann dich", "atme tief", "schließ die Augen", "stelle dir vor". Alles ist ein Angebot. Die Sprache mäandert, verknüpft, kreist – wie Wasser das findet was es braucht.`,
  };
}

export function buildSessionFocusPrompt(input: CaseInput, chunks: KnowledgeChunk[]) {
  return {
    system: SYSTEM_REFLECTIVE,
    user: `Entwickle mögliche therapeutische Stoßrichtungen und einen Sitzungsfokus:
1. Mögliche Fokuspunkte für die nächste Sitzung
2. Ressourcen- oder Metaphernarbeit die denkbar wäre
3. Hypothetische Interventionsansätze (als Ideensammlung, nicht bindend)

Fallinformationen:
${formatCaseContext(input)}
${formatKnowledgeContext(chunks)}

Ausgabe: Strukturierter Sitzungsfokus mit ## Abschnitten. Hypothetisch formuliert, ressourcenorientiert. Keine Diagnosen, keine Heilversprechen.`,
  };
}

export function buildSigristApproachPrompt(input: CaseInput) {
  return {
    system: SYSTEM_SIGRIST_APPROACH,
    user: `Analysiere die folgenden Fallinformationen und identifiziere den am besten passenden Ansatz aus Tom Sigrists Methodenspektrum.

Fallinformationen:
${formatCaseContext(input)}

Antworte als JSON-Objekt mit exakt diesen Feldern:
{
  "name": "Name des Ansatzes (z.B. Ressourcenaktivierung)",
  "rationale": "2-3 Sätze: warum dieser Ansatz für diesen Fall passend ist",
  "keyPatterns": ["3-4 kurze sprachliche Leitprinzipien für diese Sitzung"],
  "metaphorSuggestion": "Ein konkretes Bild oder eine Metapher die zum Thema passt (1-2 Sätze)"
}`,
  };
}
