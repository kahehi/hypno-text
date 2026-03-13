import { NextResponse } from 'next/server';
import { buildKnowledgeIndex, saveKnowledgeIndex, loadKnowledgeIndex } from '@/lib/knowledge';

export async function POST() {
  try {
    const index = await buildKnowledgeIndex();
    saveKnowledgeIndex(index);
    return NextResponse.json({
      success: true,
      totalFiles: index.totalFiles,
      totalChunks: index.totalChunks,
      lastIndexed: index.lastIndexed,
      files: index.files,
    });
  } catch (err) {
    console.error('Reindex error:', err);
    const message = err instanceof Error ? err.message : 'Indexierungsfehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const index = loadKnowledgeIndex();
    if (!index) {
      return NextResponse.json({
        totalFiles: 0,
        totalChunks: 0,
        lastIndexed: null,
        files: [],
      });
    }
    return NextResponse.json({
      totalFiles: index.totalFiles,
      totalChunks: index.totalChunks,
      lastIndexed: index.lastIndexed,
      files: index.files,
    });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}
