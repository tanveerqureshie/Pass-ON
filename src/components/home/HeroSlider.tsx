'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, BadgePercent, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import clsx from 'clsx';

const AUTOPLAY_MS = 6500;

export interface HeroSlide {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  location: string;
  category: string;
  description: string;
  establishedYear?: number;
  image: string;
}

/**
 * Full-bleed, minimalist hero slider. One headline + CTAs on screen at all
 * times; the background photo crossfades between campus photos.
 */
export const HeroSlider: React.FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  const { colleges } = useApp();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(next, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, paused, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  const collegeCount = colleges.length || slides.length;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured college campuses"
      className="relative isolate w-full overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div className="relative h-[540px] sm:h-[580px] lg:h-[620px]">
        {/* Slides — pure photography, no per-slide text */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={clsx(
              'absolute inset-0 transition-opacity duration-[900ms] ease-out',
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            aria-hidden={i !== index}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt={`${s.name} campus`}
              className={clsx('h-full w-full object-cover', i === index && 'animate-kenburns')}
            />
          </div>
        ))}

        {/* Readability scrims — kept light for a clean, airy look */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="container-x absolute inset-0 flex flex-col justify-end pb-14 text-white sm:pb-16 lg:pb-20">
          <div className="max-w-3xl">
            <p
              key={`badge-${index}`}
              className="mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-3 pr-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              Delhi Campus Network · {collegeCount} Colleges
            </p>

            <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              Pass It On.
              <span className="bg-gradient-to-r from-brand-400 via-brand-400 to-brand-500 bg-clip-text text-transparent"> Save More.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Seniors' textbooks, gadgets and hostel essentials find their next owner — verified, free to use and
              zero commission.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/explore"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brand-500"
              >
                Explore Campus Items
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-ink-950 shadow-lift transition hover:-translate-y-0.5 hover:bg-ink-100"
              >
                Pass On an Item
              </Link>
              <Link
                href="/store"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
              >
                Shop Our Store
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/65">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Verified enrollment IDs</span>
              <span className="flex items-center gap-1.5"><BadgePercent className="h-4 w-4 text-amber-300" /> Zero fees, zero commission</span>
              <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-sky-300" /> WhatsApp handovers</span>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-950/30 text-white backdrop-blur-sm transition hover:border-brand-600 hover:bg-brand-600 sm:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-950/30 text-white backdrop-blur-sm transition hover:border-brand-600 hover:bg-brand-600 sm:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Pagination — visible on every screen size */}
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${s.shortName}`}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-8 bg-brand-500' : 'w-1.5 bg-white/35 hover:bg-white/70'
              )}
            />
          ))}
        </div>
        <div className="absolute bottom-5 right-6 z-10 hidden font-mono text-xs font-semibold tracking-widest text-white/50 sm:block">
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
};
