import type { KnowledgeChunk } from '@/types';

export function scoreChunk(chunk: KnowledgeChunk, queryTerms: string[]): number {
  if (queryTerms.length === 0) return 0;

  const chunkText = chunk.text.toLowerCase();
  const chunkKeywords = chunk.keywords.map(k => k.toLowerCase());

  let score = 0;

  for (const term of queryTerms) {
    const termLower = term.toLowerCase();
    // Direct text match
    const occurrences = (chunkText.match(new RegExp(termLower, 'g')) || []).length;
    score += occurrences * 2;
    // Keyword match (bonus)
    if (chunkKeywords.includes(termLower)) {
      score += 3;
    }
  }

  // Normalize by query length
  return score / queryTerms.length;
}

export function findRelevantChunks(
  chunks: KnowledgeChunk[],
  query: string,
  topK = 6
): KnowledgeChunk[] {
  if (chunks.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-züäöa-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);

  if (queryTerms.length === 0) {
    return chunks.slice(0, topK);
  }

  const scored = chunks.map(chunk => ({
    chunk,
    score: scoreChunk(chunk, queryTerms),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter(item => item.score > 0)
    .slice(0, topK)
    .map(item => item.chunk);
}
