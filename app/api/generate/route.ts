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
} from '@/lib/prompts';

async function generateText(
  system: string,
  user: string,
  apiKey?: string
): Promise<string> {
  const client = new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });
  return response.choices[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { _apiKey, ...input } = body as CaseInput & { _apiKey?: string };

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

    const gen = (system: string, user: string) => generateText(system, user, _apiKey);

    const sp = buildSummaryPrompt(input, relevantChunks);
    const rp = buildReflectionPrompt(input, relevantChunks);
    const ep = buildEricksonianPrompt(input, relevantChunks);
    const sfp = buildSessionFocusPrompt(input, relevantChunks);
    const sap = buildSigristApproachPrompt(input);

    const [summaryText, reflectionText, ericksonText, sessionText, approachRaw] = await Promise.all([
      gen(sp.system, sp.user),
      gen(rp.system, rp.user),
      gen(ep.system, ep.user),
      gen(sfp.system, sfp.user),
      gen(sap.system, sap.user),
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
      { id: 'ericksonian', label: 'Trancetext (Tom Sigrist)', type: 'ericksonian', content: ericksonText },
      { id: 'sessionfocus', label: 'Sitzungsfokus', type: 'sessionfocus', content: sessionText },
    ];

    const response: GenerationResponse = { variants, usedChunks: relevantChunks, sigristApproach };
    return NextResponse.json(response);
  } catch (err) {
    console.error('Generate error:', err);
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
