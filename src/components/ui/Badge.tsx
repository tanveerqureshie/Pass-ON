'use client';

import React from 'react';
import clsx from 'clsx';

type Tone = 'red' | 'dark' | 'gray' | 'green' | 'blue' | 'amber' | 'violet' | 'outline';

const tones: Record<Tone, string> = {
  red: 'bg-brand-600 text-white',
  dark: 'bg-ink-950 text-white',
  gray: 'bg-ink-100 text-ink-700',
  green: 'bg-emerald-500 text-white',
  blue: 'bg-sky-500 text-white',
  amber: 'bg-amber-400 text-ink-950',
  violet: 'bg-violet-500 text-white',
  outline: 'border border-ink-300 bg-white text-ink-700',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: 'sm' | 'md';
}

export function Badge({ tone = 'gray', size = 'md', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-semibold tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        tones[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
