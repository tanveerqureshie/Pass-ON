'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'soft' | 'danger' | 'darkOutline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none ' +
  'rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white dark:bg-white dark:text-black shadow-chip hover:bg-brand-700 dark:hover:bg-neutral-200 active:bg-brand-800 active:scale-[0.98]',
  dark:
    'bg-ink-950 text-white shadow-chip hover:bg-ink-800 active:bg-ink-900 active:scale-[0.98]',
  outline:
    'btn-neu text-ink-900 hover:text-ink-950 active:scale-[0.98]',
  darkOutline:
    'border border-ink-950 bg-white text-ink-950 shadow-chip hover:bg-ink-950 hover:text-white active:scale-[0.98]',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-950 active:scale-[0.98]',
  soft:
    'btn-neu text-brand-700 hover:text-brand-800 active:scale-[0.98]',
  danger:
    'bg-red-600 text-white shadow-chip hover:bg-red-700 active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px] rounded-2xl',
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  variant?: Variant;
  size?: Size;
  href?: string;
  target?: string;
  rel?: string;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = clsx(base, variants[variant], sizes[size], block && 'w-full', className);

  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel');
    if (external || href.startsWith('#')) {
      return (
        <a href={href} className={classes} target={rest.target} rel={rest.rel}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} target={rest.target} rel={rest.rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
