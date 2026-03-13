'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputVariant } from '@/types';

interface Props {
  variants: OutputVariant[];
  caseTitle: string;
}

function formatDateISO() {
  return new Date().toISOString().split('T')[0];
}

async function exportPdf(content: string, filename: string, title: string, subtitle?: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageW - margin * 2;
  let y = margin;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(60, 80, 60);
  doc.text('Hypno Text', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('Hypnotherapeutischer Schreib- und Reflexionsassistent', margin, y);
  y += 6;
  doc.text(`Datum: ${formatDateISO()}`, margin, y);
  y += 10;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(title, margin, y);
  y += 7;

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, margin, y);
    y += 7;
  }

  // Divider
  doc.setDrawColor(200, 200, 190);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const lines = content.split('\n');
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }

    if (line.startsWith('## ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(60, 90, 60);
      const wrapped = doc.splitTextToSize(line.slice(3), maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 6 + 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
    } else if (line.trim() === '') {
      y += 4;
    } else {
      const wrapped = doc.splitTextToSize(line, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5.5;
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Hypno Text – Seite ${i} von ${pageCount}`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
}

export default function PdfExportMenu({ variants, caseTitle }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleExportSingle = async (variant: OutputVariant) => {
    setOpen(false);
    const typeMap: Record<string, string> = {
      summary: 'kurzfassung',
      reflection: 'fallreflexion',
      ericksonian: 'erickson',
      sessionfocus: 'sitzungsfokus',
    };
    const slug = typeMap[variant.type] || variant.type;
    await exportPdf(
      variant.content,
      `hypno-text-${slug}-${formatDateISO()}.pdf`,
      variant.label,
      caseTitle
    );
  };

  const handleExportAll = async () => {
    setOpen(false);
    const combined = variants
      .map(v => `## ${v.label}\n\n${v.content}`)
      .join('\n\n\n');
    await exportPdf(
      combined,
      `hypno-text-komplett-${formatDateISO()}.pdf`,
      'Alle Ausgaben',
      caseTitle
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
      >
        <Download size={14} />
        PDF Export
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 min-w-52 overflow-hidden">
          {variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => handleExportSingle(variant)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {variant.label}
            </button>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleExportAll}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-sage-700 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/30 transition-colors"
            >
              Alle Varianten (komplett)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
