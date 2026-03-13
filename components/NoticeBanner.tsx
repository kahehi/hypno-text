import { Info } from 'lucide-react';

export default function NoticeBanner() {
  return (
    <div className="bg-warm-100 dark:bg-warm-900/20 border border-warm-200 dark:border-warm-800/50 rounded-xl px-5 py-3 flex gap-3 items-start">
      <Info size={16} className="text-warm-600 dark:text-warm-400 mt-0.5 shrink-0" />
      <p className="text-sm text-warm-700 dark:text-warm-300 leading-relaxed">
        <span className="font-medium">Hinweis:</span>{' '}
        Hypno Text unterstützt bei der Formulierung hypnotherapeutischer Arbeits- und Reflexionstexte
        und ersetzt keine medizinische oder psychotherapeutische Diagnostik.
        Die generierten Texte dienen ausschließlich als Reflexions- und Strukturierungshilfe.
      </p>
    </div>
  );
}
