'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputVariant } from '@/types';

interface Props {
  variants: OutputVariant[];
  caseTitle: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate() {
  return new Date().toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateISO() {
  return new Date().toISOString().split('T')[0];
}

function slugify(type: string) {
  const map: Record<string, string> = {
    summary: 'kurzfassung',
    reflection: 'fallreflexion',
    ericksonian: 'trancetext',
    sessionfocus: 'sitzungsfokus',
  };
  return map[type] || type;
}

// ─── PDF Export ──────────────────────────────────────────────────────────────

async function exportPdf(content: string, filename: string, variantLabel: string, caseTitle: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();
  const margin = 22;
  const maxW   = pageW - margin * 2;

  // ── Header bar ──────────────────────────────────────────────────────────
  doc.setFillColor(45, 74, 48);           // deep sage
  doc.rect(0, 0, pageW, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Hypno Text', margin, 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 210, 180);
  doc.text('Hypnotherapeutischer Schreib- und Reflexionsassistent', margin + 32, 11.5);

  // Date right-aligned
  doc.setTextColor(200, 220, 200);
  doc.text(formatDate(), pageW - margin, 11.5, { align: 'right' });

  let y = 28;

  // ── Case / variant metadata ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 50, 32);
  const titleLines = doc.splitTextToSize(variantLabel, maxW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  if (caseTitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 110, 100);
    doc.text(caseTitle, margin, y);
    y += 6;
  }

  // Divider line (sage tint)
  doc.setDrawColor(160, 190, 160);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Content ─────────────────────────────────────────────────────────────
  const lines = content.split('\n');

  for (const raw of lines) {
    const footerReserve = 18;

    // Page break guard
    if (y > pageH - footerReserve - 10) {
      doc.addPage();
      // Thin top rule on continuation pages
      doc.setFillColor(45, 74, 48);
      doc.rect(0, 0, pageW, 5, 'F');
      y = 16;
    }

    if (raw.startsWith('## ')) {
      // Extra space before heading
      y += 4;
      if (y > pageH - footerReserve - 14) { doc.addPage(); doc.setFillColor(45,74,48); doc.rect(0,0,pageW,5,'F'); y = 16; }

      // Heading pill background
      doc.setFillColor(237, 244, 237);
      const heading = raw.slice(3);
      const hLines = doc.splitTextToSize(heading, maxW - 6);
      const boxH = hLines.length * 6 + 4;
      doc.roundedRect(margin - 2, y - 4.5, maxW + 4, boxH, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(40, 80, 44);
      doc.text(hLines, margin + 1, y);
      y += boxH - 0.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(45, 45, 42);

    } else if (raw.startsWith('# ')) {
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 50, 32);
      const h1Lines = doc.splitTextToSize(raw.slice(2), maxW);
      doc.text(h1Lines, margin, y);
      y += h1Lines.length * 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(45, 45, 42);

    } else if (raw.startsWith('- ') || raw.startsWith('• ')) {
      const bullet = raw.slice(2).trim();
      const bLines = doc.splitTextToSize(bullet, maxW - 6);
      // Bullet dot
      doc.setFillColor(74, 124, 74);
      doc.circle(margin + 1, y - 1.2, 0.8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(45, 45, 42);
      doc.text(bLines, margin + 5, y);
      y += bLines.length * 5.5 + 1;

    } else if (raw.trim() === '') {
      y += 3;

    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(45, 45, 42);
      const pLines = doc.splitTextToSize(raw, maxW);
      doc.text(pLines, margin, y);
      y += pLines.length * 5.5 + 1;
    }
  }

  // ── Footer on all pages ──────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 210, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 155);
    doc.text(`Hypno Text · ${caseTitle || variantLabel}`, margin, pageH - 7);
    doc.text(`${i} / ${pageCount}`, pageW - margin, pageH - 7, { align: 'right' });
  }

  doc.save(filename);
}

// ─── DOC Export ──────────────────────────────────────────────────────────────

function markdownToWordHtml(content: string): string {
  const lines = content.split('\n');
  const parts: string[] = [];

  for (const raw of lines) {
    if (raw.startsWith('## ')) {
      parts.push(`<h2>${escHtml(raw.slice(3))}</h2>`);
    } else if (raw.startsWith('# ')) {
      parts.push(`<h1>${escHtml(raw.slice(2))}</h1>`);
    } else if (raw.startsWith('- ') || raw.startsWith('• ')) {
      parts.push(`<li>${escHtml(raw.slice(2).trim())}</li>`);
    } else if (raw.trim() === '') {
      parts.push('<p>&nbsp;</p>');
    } else {
      parts.push(`<p>${escHtml(raw)}</p>`);
    }
  }

  // Wrap consecutive <li> in <ul>
  return parts
    .join('\n')
    .replace(/(<li>.*?<\/li>\n?)+/gs, match => `<ul>\n${match}</ul>\n`);
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function exportDoc(content: string, filename: string, variantLabel: string, caseTitle: string) {
  const body = markdownToWordHtml(content);

  const html = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${escHtml(variantLabel)}</title>
<!--[if gte mso 9]>
<xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml>
<![endif]-->
<style>
  @page {
    size: A4;
    margin: 2.5cm 2.8cm;
    mso-header-margin: 1.2cm;
    mso-footer-margin: 1.2cm;
  }
  body {
    font-family: "Palatino Linotype", Palatino, Georgia, serif;
    font-size: 11pt;
    color: #2d2d2a;
    line-height: 1.65;
  }
  .doc-header {
    border-bottom: 2px solid #2d4a30;
    padding-bottom: 10pt;
    margin-bottom: 18pt;
  }
  .app-name {
    font-family: "Palatino Linotype", Palatino, Georgia, serif;
    font-size: 16pt;
    font-weight: normal;
    color: #2d4a30;
    letter-spacing: 0.03em;
    margin: 0 0 2pt 0;
  }
  .app-sub {
    font-size: 8.5pt;
    color: #7a907a;
    margin: 0 0 6pt 0;
  }
  .meta-line {
    font-size: 8pt;
    color: #9a9a94;
    margin: 0;
  }
  h1 {
    font-family: "Palatino Linotype", Palatino, Georgia, serif;
    font-size: 20pt;
    font-weight: normal;
    color: #1e3220;
    margin: 0 0 4pt 0;
    border: none;
  }
  .case-title {
    font-size: 10pt;
    color: #7a907a;
    margin: 0 0 18pt 0;
  }
  .divider {
    border: none;
    border-top: 1px solid #c7d0c7;
    margin: 0 0 18pt 0;
  }
  h2 {
    font-family: "Palatino Linotype", Palatino, Georgia, serif;
    font-size: 12pt;
    font-weight: bold;
    color: #2d4a30;
    background-color: #edf4ed;
    padding: 5pt 8pt;
    margin: 16pt 0 6pt 0;
    mso-shading: auto;
    mso-pattern: auto;
  }
  p {
    margin: 0 0 7pt 0;
    text-align: justify;
  }
  ul {
    margin: 4pt 0 10pt 0;
    padding-left: 18pt;
  }
  li {
    margin-bottom: 4pt;
    color: #2d2d2a;
  }
  li::marker {
    color: #4a7c4a;
  }
</style>
</head>
<body>

<div class="doc-header">
  <p class="app-name">Hypno Text</p>
  <p class="app-sub">Hypnotherapeutischer Schreib- und Reflexionsassistent</p>
  <p class="meta-line">Datum: ${formatDate()}</p>
</div>

<h1>${escHtml(variantLabel)}</h1>
${caseTitle ? `<p class="case-title">${escHtml(caseTitle)}</p>` : ''}
<hr class="divider" />

${body}

</body>
</html>`.trim();

  const blob = new Blob(['\uFEFF' + html], {
    type: 'application/vnd.ms-word;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Component ───────────────────────────────────────────────────────────────

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

  const handlePdf = async (variant: OutputVariant) => {
    setOpen(false);
    await exportPdf(
      variant.content,
      `hypno-text-${slugify(variant.type)}-${formatDateISO()}.pdf`,
      variant.label,
      caseTitle
    );
  };

  const handleDoc = (variant: OutputVariant) => {
    setOpen(false);
    exportDoc(
      variant.content,
      `hypno-text-${slugify(variant.type)}-${formatDateISO()}.doc`,
      variant.label,
      caseTitle
    );
  };

  const handleAllPdf = async () => {
    setOpen(false);
    const combined = variants.map(v => `## ${v.label}\n\n${v.content}`).join('\n\n\n');
    await exportPdf(
      combined,
      `hypno-text-komplett-${formatDateISO()}.pdf`,
      'Alle Varianten',
      caseTitle
    );
  };

  const handleAllDoc = () => {
    setOpen(false);
    const combined = variants.map(v => `## ${v.label}\n\n${v.content}`).join('\n\n\n');
    exportDoc(
      combined,
      `hypno-text-komplett-${formatDateISO()}.doc`,
      'Alle Varianten',
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
        Export
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden"
             style={{ minWidth: '280px' }}>

          {/* Format header */}
          <div className="flex items-center justify-end gap-1 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-auto">Variante</span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest w-14 text-center">PDF</span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest w-14 text-center">DOC</span>
          </div>

          {/* Variant rows */}
          {variants.map(variant => (
            <div key={variant.id}
                 className="flex items-center px-4 py-2.5 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate pr-3">
                {variant.label}
              </span>
              <button
                onClick={() => handlePdf(variant)}
                className="w-14 flex items-center justify-center gap-1 text-xs py-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                title={`${variant.label} als PDF`}
              >
                <FileText size={12} />
                PDF
              </button>
              <button
                onClick={() => handleDoc(variant)}
                className="w-14 flex items-center justify-center gap-1 text-xs py-1 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                title={`${variant.label} als DOC`}
              >
                <FileType size={12} />
                DOC
              </button>
            </div>
          ))}

          {/* All variants */}
          <div className="flex items-center px-4 py-2.5 bg-gray-50/80 dark:bg-gray-700/20">
            <span className="flex-1 text-xs font-medium text-gray-500 dark:text-gray-400 pr-3">
              Alle Varianten
            </span>
            <button
              onClick={handleAllPdf}
              className="w-14 flex items-center justify-center gap-1 text-xs py-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
            >
              <FileText size={12} />
              PDF
            </button>
            <button
              onClick={handleAllDoc}
              className="w-14 flex items-center justify-center gap-1 text-xs py-1 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
            >
              <FileType size={12} />
              DOC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
