'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = 'between',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  align?: 'between' | 'center';
}) {
  if (align === 'center') {
    return (
      <div className="mx-auto mb-10 max-w-2xl text-center">
        {eyebrow && <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">{description}</p>}
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-ink-500 sm:text-base">{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-ink-300 bg-white px-5 text-sm font-bold text-ink-900 shadow-chip transition hover:border-ink-400 hover:bg-ink-50"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-100 text-ink-400">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-lg font-extrabold text-ink-950">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-ink-500">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
