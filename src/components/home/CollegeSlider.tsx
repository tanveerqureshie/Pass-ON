'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  Train,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { College } from '@/lib/types';

interface CollegeSliderProps {
  colleges: College[];
}

export const CollegeSlider: React.FC<CollegeSliderProps> = ({ colleges }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);
  const animFrameId = useRef<number | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to toggle navigation buttons
  const updateScrollButtons = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [updateScrollButtons]);

  // Mouse drag handlers with requestAnimationFrame for 60/120fps smooth performance
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    hasDragged.current = false;
    setIsGrabbing(true);
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftStart.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (isDown.current) {
      isDown.current = false;
      setIsGrabbing(false);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsGrabbing(false);
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    setTimeout(() => {
      hasDragged.current = false;
    }, 60);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.35;
    if (Math.abs(walk) > 4) {
      hasDragged.current = true;
    }
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    animFrameId.current = requestAnimationFrame(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
      }
    });
  };

  const scrollByDirection = (dir: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardStep = 370;
    sliderRef.current.scrollBy({
      left: dir === 'left' ? -cardStep : cardStep,
      behavior: 'smooth',
    });
  };

  // Prevent link navigation if user was dragging
  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
    }
  }, []);

  return (
    <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#f8fafc]/90 via-blue-50/20 via-[#f1f5f9]/60 to-[#f8fafc]/90 dark:from-[#020617]/95 dark:via-blue-950/15 dark:to-[#020617]/95 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-colors">
      {/* Both the Section Header and the Slider are placed inside container-x so left and right spacing matches Explore Categories identically */}
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-3 shadow-sm backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Campus Network Directory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight">
              Explore Delhi College Campuses
            </h2>
            <p className="mt-2 text-sm sm:text-base lg:text-lg text-ink-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Swipe or drag horizontally to inspect student handover hubs, metro connectivity, placements, and live campus listings.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 self-start sm:self-auto shrink-0">
            {/* Smooth 60fps Carousel Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollByDirection('left')}
                disabled={!canScrollLeft}
                aria-label="Previous colleges"
                className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full glass-oily border-oily text-ink-700 dark:text-slate-200 shadow-sm transition-all hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByDirection('right')}
                disabled={!canScrollRight}
                aria-label="Next colleges"
                className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full glass-oily border-oily text-ink-700 dark:text-slate-200 shadow-sm transition-all hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <Link
              href="/colleges"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition underline underline-offset-4"
            >
              All 11 Campuses →
            </Link>
          </div>
        </div>

        {/* Scroll Track: inside container-x with hardware-accelerated 60fps scroll */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`w-full overflow-x-auto overscroll-x-contain no-scrollbar select-none touch-pan-x cursor-grab pb-4 pt-1 ${
            isGrabbing ? 'cursor-grabbing' : ''
          }`}
          style={{
            scrollBehavior: isGrabbing ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex gap-4 sm:gap-6 py-2">
            {colleges.map((college) => {
              const collegeImg = college.image || `/colleges/${college.short_name}.jpeg`;

              return (
                <div
                  key={college.id}
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                  }}
                  className="group relative flex w-[82vw] xs:w-[320px] sm:w-[360px] lg:w-[390px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl glass-oily border-oily transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_48px_-8px_rgba(37,99,235,0.28),0_0_24px_rgba(59,130,246,0.2)]"
                >
                  {/* College Photo with Glassmorphism overlay */}
                  <div className="relative h-44 xs:h-52 sm:h-60 w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={collegeImg}
                      alt={`${college.name} campus`}
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/colleges/MAIT.jpeg';
                      }}
                    />
                    {/* Frosted Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-blue-600/90 backdrop-blur-md text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-black tracking-wide shadow-md border border-white/20">
                        {college.short_name}
                      </span>
                      <span className="rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/70 dark:border-white/10 text-ink-800 dark:text-slate-200 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold shadow-sm">
                        {college.category}
                      </span>
                    </div>

                    {/* Bottom Image Info */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/95">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-300 shrink-0" />
                        <span className="truncate">{college.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body with Clean Elevated Surface */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-ink-950 dark:text-white leading-snug line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {college.name}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-ink-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {college.description}
                      </p>
                    </div>

                    {/* Feature Highlights: Placements & Connectivity */}
                    <div className="space-y-2 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
                      {/* Placements */}
                      {college.placements && (
                        <div className="flex items-center gap-2 text-ink-700 dark:text-slate-300 bg-blue-50/70 dark:bg-blue-950/60 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border border-blue-100/70 dark:border-blue-900">
                          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="truncate text-xs sm:text-sm">
                            <strong className="font-bold text-blue-900 dark:text-blue-200">{college.placements.highest}</strong> Highest CTC
                            {college.placements.average ? ` • avg ${college.placements.average}` : ''}
                          </span>
                        </div>
                      )}

                      {/* Connectivity */}
                      {college.connectivity && (
                        <div className="flex items-center gap-2 text-ink-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border border-slate-200 dark:border-slate-700">
                          <Train className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="truncate text-xs sm:text-sm font-medium text-ink-600 dark:text-slate-300">
                            {college.connectivity}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: Explore Campus Button */}
                    <div className="pt-2 flex items-center justify-between gap-2 sm:gap-3">
                      <span className="text-[11px] sm:text-xs font-semibold text-ink-400">
                        {college.branches.length} Tech Branches
                      </span>
                      <Link
                        href={`/college/${college.slug}`}
                        onClick={handleLinkClick}
                        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
                      >
                        <span>Explore Campus</span>
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
