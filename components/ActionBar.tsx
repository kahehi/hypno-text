'use client';

import { useState } from 'react';
import { Check, ClipboardList } from 'lucide-react';
import type { OutputVariant } from '@/types';

interface Props {
  variants: OutputVariant[];
}

export default function ActionBar({ variants }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    const text = variants
      .map(v => `## ${v.label}\n\n${v.content}`)
      .join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopyAll}
      className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <ClipboardList size={14} />}
      {copied ? 'Kopiert' : 'Alle kopieren'}
    </button>
  );
}
