import fs from 'fs';
import path from 'path';
import type { KnowledgeIndex, KnowledgeChunk } from '@/types';
import { getPdfFiles, extractTextFromPdf } from './pdf';
import { chunkText, extractKeywords } from './chunking';
import { findRelevantChunks } from './scoring';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');
const INDEX_FILE = path.join(process.cwd(), 'data', 'knowledge-index.json');

export function loadKnowledgeIndex(): KnowledgeIndex | null {
  try {
    if (!fs.existsSync(INDEX_FILE)) return null;
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(raw) as KnowledgeIndex;
  } catch {
    return null;
  }
}

export function saveKnowledgeIndex(index: KnowledgeIndex): void {
  const dataDir = path.dirname(INDEX_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

export async function buildKnowledgeIndex(): Promise<KnowledgeIndex> {
  const pdfFiles = getPdfFiles(KNOWLEDGE_DIR);
  const allChunks: KnowledgeChunk[] = [];
  const fileNames: string[] = [];
  let globalIndex = 0;

  for (const filePath of pdfFiles) {
    const fileName = path.basename(filePath);
    fileNames.push(fileName);
    const text = await extractTextFromPdf(filePath);
    if (!text) continue;

    const rawChunks = chunkText(text);
    for (const raw of rawChunks) {
      const keywords = extractKeywords(raw.text);
      allChunks.push({
        id: `${fileName}-${globalIndex}`,
        sourceFile: fileName,
        text: raw.text,
        keywords,
        index: globalIndex,
      });
      globalIndex++;
    }
  }

  const index: KnowledgeIndex = {
    version: 1,
    lastIndexed: new Date().toISOString(),
    totalFiles: pdfFiles.length,
    totalChunks: allChunks.length,
    files: fileNames,
    chunks: allChunks,
  };

  return index;
}

export function getRelevantChunks(query: string, topK = 6): KnowledgeChunk[] {
  const index = loadKnowledgeIndex();
  if (!index || index.chunks.length === 0) return [];
  return findRelevantChunks(index.chunks, query, topK);
}
