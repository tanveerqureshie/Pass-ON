'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Global toast notification. Reads toastMessage from AppContext.
 * Tone is inferred from the message content.
 */
export function Toast() {
  const { toastMessage } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3300);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!toastMessage || !visible) return null;

  const negative = /(required|rejected|removed|error|fail|not |cannot |blocked)/i.test(toastMessage);
  const warning = /(pending|review|soon|note)/i.test(toastMessage);
  const Icon = negative ? XCircle : warning ? AlertTriangle : CheckCircle2;
  const accent = negative ? 'text-red-400' : warning ? 'text-amber-300' : 'text-emerald-300';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-6" aria-live="polite">
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-ink-950/95 px-4 py-3.5 text-sm font-medium text-white shadow-lift backdrop-blur animate-fade-up">
        <Icon className={`h-5 w-5 shrink-0 ${accent}`} />
        <p className="leading-snug">{toastMessage}</p>
      </div>
    </div>
  );
}
