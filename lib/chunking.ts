export interface TextChunk {
  text: string;
  index: number;
}

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 80;

export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): TextChunk[] {
  const sentences = text
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  const chunks: TextChunk[] = [];
  let current = '';
  let index = 0;

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > chunkSize && current.length > 0) {
      chunks.push({ text: current.trim(), index });
      index++;
      // overlap: keep last part
      const words = current.split(' ');
      const overlapWords = words.slice(Math.max(0, words.length - Math.floor(overlap / 6)));
      current = overlapWords.join(' ') + ' ' + sentence;
    } else {
      current = current ? current + ' ' + sentence : sentence;
    }
  }

  if (current.trim().length > 20) {
    chunks.push({ text: current.trim(), index });
  }

  return chunks;
}

export function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'aber', 'auch', 'ist',
    'sind', 'war', 'wird', 'werden', 'hat', 'haben', 'mit', 'von', 'zu', 'in',
    'an', 'auf', 'bei', 'nach', 'durch', 'für', 'als', 'wie', 'wenn', 'dass',
    'sich', 'es', 'er', 'sie', 'wir', 'ich', 'du', 'sie', 'ihm', 'ihr',
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'be', 'to',
    'of', 'in', 'that', 'it', 'with', 'as', 'for', 'on', 'at', 'by',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-züäöa-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w))
    .reduce((acc: string[], w) => {
      if (!acc.includes(w)) acc.push(w);
      return acc;
    }, [])
    .slice(0, 20);
}
