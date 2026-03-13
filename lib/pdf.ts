import fs from 'fs';
import path from 'path';

export async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    // Dynamic import to avoid issues with server components
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    console.error(`Error extracting text from ${filePath}:`, err);
    return '';
  }
}

export function getPdfFiles(knowledgeDir: string): string[] {
  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
    return [];
  }
  return fs
    .readdirSync(knowledgeDir)
    .filter(f => f.toLowerCase().endsWith('.pdf'))
    .map(f => path.join(knowledgeDir, f));
}
