'use client';

import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, FileText, Clock } from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import type { KnowledgeStatusData } from '@/types';

export default function KnowledgeStatus() {
  const [status, setStatus] = useState<KnowledgeStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/knowledge/reindex');
      if (res.ok) setStatus(await res.json());
    } catch {}
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleReindex = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge/reindex', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStatus({ totalFiles: data.totalFiles, totalChunks: data.totalChunks, lastIndexed: data.lastIndexed, files: data.files });
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-sage-500 dark:text-sage-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Wissensbasis</span>
        </div>
        <button
          onClick={handleReindex}
          disabled={loading}
          className={cn(
            'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all',
            'bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 border border-sage-200 dark:border-sage-800 hover:bg-sage-100 dark:hover:bg-sage-900/50',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Indexiere…' : 'Neu indexieren'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{status?.totalFiles ?? 0}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">PDFs</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{status?.totalChunks ?? 0}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Chunks</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
          <div className="flex items-center justify-center">
            <Clock size={12} className="text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {status?.lastIndexed ? formatDateTime(status.lastIndexed).split(',')[0] : '–'}
          </div>
        </div>
      </div>

      {status && status.files.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {expanded ? '▲ ausblenden' : `▼ ${status.files.length} Datei(en)`}
          </button>
          {expanded && (
            <ul className="mt-2 space-y-1">
              {status.files.map(f => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <FileText size={10} className="text-gray-400" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(!status || status.totalFiles === 0) && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          PDFs in <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/knowledge</code> ablegen, dann indexieren.
        </p>
      )}
    </div>
  );
}
