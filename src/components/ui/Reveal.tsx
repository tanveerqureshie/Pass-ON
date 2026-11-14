'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'li';
}

/**
 * Scroll reveal wrapper — fades & lifts content into view once, using an
 * IntersectionObserver. Falls back to visible immediately when IO is missing.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={clsx('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
