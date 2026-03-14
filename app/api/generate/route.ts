import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { CaseInput, GenerationResponse, OutputVariant, SigristApproach } from '@/types';
import { getRelevantChunks } from '@/lib/knowledge';
import {
  buildSummaryPrompt,
  buildReflectionPrompt,
  buildEricksonianPrompt,
  buildSessionFocusPrompt,
  buildSigristApproachPrompt,
  buildTranceStichwortPrompt,
} from '@/lib/prompts';

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  });
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

async function generateText(
  system: string,
  user: string,
  maxTokens = 1500
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  });
  return response.choices[0]?.message?.content || '';
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Generates a trance text and extends it in a loop until the target word count
// is reached (max 3 extension rounds, threshold 88% of target).
async function generateTranceText(
  system: string,
  user: string,
  targetWords: number,
  maxTokens: number
): Promise<string> {
  let text = await generateText(system, user, maxTokens);
  let wordCount = countWords(text);

  let rounds = 0;
  while (wordCount < targetWords * 0.88 && rounds < 3) {
    const missing = targetWords - wordCount;
    const extTokens = Math.min(4000, Math.ceil(missing * 1.6));

    // Use only the last ~200 words as context to keep the prompt lean
    const tail = text.trim().split(/\s+/).slice(-200).join(' ');

    const continuation = await generateText(
      system,
      `Setze diesen Trancetext nahtlos fort. Es fehlen noch ${missing} Wörter bis zur Gesamtvorgabe von ${targetWords} Wörtern. Vertiefe bestehende Bilder, kreise zu früheren Empfindungen zurück, verweile länger. Kein neuer Abschnittstitel – fließende Fortsetzung im selben Stil.\n\n[…] ${tail}`,
      extTokens
    );

    text = text + '\n\n' + continuation;
    wordCount = countWords(text);
    rounds++;
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body as CaseInput;

    if (!input.caseTitle || !input.concern || !input.goal) {
      return NextResponse.json(
        { error: 'Bitte Fallbezeichnung, Anliegen und Zielsetzung ausfüllen.' },
        { status: 400 }
      );
    }

    const searchQuery = [
      input.concern,
      input.goal,
      input.hypotheses || '',
      input.context,
    ].join(' ');

    const relevantChunks = getRelevantChunks(searchQuery, 6);

    const gen = (system: string, user: string) => generateText(system, user);

    const sp  = buildSummaryPrompt(input, relevantChunks);
    const rp  = buildReflectionPrompt(input, relevantChunks);
    const ep  = buildEricksonianPrompt(input, relevantChunks);
    const sfp = buildSessionFocusPrompt(input, relevantChunks);
    const sap = buildSigristApproachPrompt(input);
    const skp = buildTranceStichwortPrompt(input);

    // Trancetext: ~1.4 Tokens/Wort (Deutsch) × 1.4 Puffer für die erste Generation, mind. 2000
    const tranceMaxTokens = Math.min(8000, Math.max(2000, Math.ceil(ep.totalWords * 1.4 * 1.4)));

    const [summaryText, reflectionText, ericksonText, sessionText, approachRaw, tranceKeywords] = await Promise.all([
      gen(sp.system, sp.user),
      gen(rp.system, rp.user),
      generateTranceText(ep.system, ep.user, ep.totalWords, tranceMaxTokens),
      gen(sfp.system, sfp.user),
      gen(sap.system, sap.user),
      gen(skp.system, skp.user),
    ]);

    let sigristApproach: SigristApproach | undefined;
    try {
      sigristApproach = JSON.parse(approachRaw) as SigristApproach;
    } catch {
      // approach parsing failed — omit from response
    }

    const variants: OutputVariant[] = [
      { id: 'summary', label: 'Kurzfassung', type: 'summary', content: summaryText },
      { id: 'reflection', label: 'Fachliche Fallreflexion', type: 'reflection', content: reflectionText },
      { id: 'ericksonian', label: 'Trancetext (Ericksonian)', type: 'ericksonian', content: ericksonText },
      { id: 'sessionfocus', label: 'Sitzungsfokus', type: 'sessionfocus', content: sessionText },
    ];

    const response: GenerationResponse = { variants, usedChunks: relevantChunks, sigristApproach, tranceKeywords: tranceKeywords || undefined };
    return NextResponse.json(response);
  } catch (err) {
    console.error('Generate error:', err);
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
