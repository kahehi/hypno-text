'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedbackBubble() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#fb-bubble')
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSubmit = () => {
    if (!msg.trim()) return;
    setSubmitted(true);
  };

  const inputClass = cn(
    'w-full rounded-lg border px-3 py-2 text-sm transition-all outline-none',
    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700',
    'text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
    'focus:ring-2 focus:ring-sage-400 focus:border-transparent'
  );

  return (
    <>
      <button
        id="fb-bubble"
        onClick={() => setOpen(o => !o)}
        aria-label="Feedback"
        className={cn(
          'fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full',
          'bg-sage-600 hover:bg-sage-700 text-white shadow-xl',
          'flex items-center justify-center transition-all duration-200',
          'hover:scale-110 active:scale-95'
        )}
      >
        <MessageCircle size={22} strokeWidth={1.8} />
      </button>

      <div
        ref={modalRef}
        className={cn(
          'fixed bottom-24 right-7 z-50 w-80 rounded-2xl overflow-hidden',
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          'shadow-2xl transition-all duration-200 origin-bottom-right',
          open
            ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
            : 'opacity-0 scale-95 pointer-events-none translate-y-2'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Feedback & Ideen
          </p>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="text-4xl">✓</div>
              <p className="font-semibold text-sage-700 dark:text-sage-400">Danke fürs Feedback!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Jede Rückmeldung hilft, Hypno Text besser zu machen.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stars */}
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Bewertung</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={cn(
                          'transition-colors',
                          i <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dein Name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Nachricht <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Was denkst du? Was fehlt? Was könnte besser sein?"
                  rows={3}
                  className={cn(inputClass, 'resize-none')}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!msg.trim()}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
                  'bg-sage-600 text-white hover:bg-sage-700',
                  !msg.trim() && 'opacity-40 cursor-not-allowed'
                )}
              >
                Feedback senden →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
