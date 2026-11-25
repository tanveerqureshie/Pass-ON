'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Train,
  ArrowRight,
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    hasDragged.current = false;
    setIsGrabbing(true);
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftStart.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    setIsGrabbing(false);
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsGrabbing(false);
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
    const cardStep = 340;
    sliderRef.current.scrollBy({
      left: dir === 'left' ? -cardStep : cardStep,
      behavior: 'smooth',
    });
  };

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
    }
  }, []);

  return (
    <section
      id="campuses"
      className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-outline-soft/80 dark:border-slate-800"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-light dark:bg-slate-800 text-lavender-dark dark:text-lavender text-xs font-bold mb-2">
            <Building2 className="h-3.5 w-3.5 text-mint" />
            <span>Campus Network Directory</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main dark:text-white">
            Explore Your Campus
          </h2>
          <p className="text-text-muted dark:text-slate-400 text-sm sm:text-base mt-2">
            Swipe or select to inspect student handover hubs, metro connectivity, verified listings &amp; branch stats.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => scrollByDirection('left')}
            disabled={!canScrollLeft}
            aria-label="Previous Campuses"
            className="w-10 h-10 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-surface-muted dark:hover:bg-slate-800 text-text-main dark:text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            disabled={!canScrollRight}
            aria-label="Next Campuses"
            className="w-10 h-10 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-surface-muted dark:hover:bg-slate-800 text-text-main dark:text-white flex items-center justify-center transition-all shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            href="/colleges"
            className="text-xs sm:text-sm font-bold text-mint hover:text-mint-dark flex items-center gap-1 ml-1 sm:ml-2 group"
          >
            <span>All 11 Campuses</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Scroll Track with Real College Photos from public/colleges */}
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
        <div className="flex gap-5 sm:gap-7 py-1">
          {colleges.map((college) => {
            const collegeImg = college.image || `/colleges/${college.short_name}.jpeg`;

            return (
              <div
                key={college.id}
                className="group flex w-[80vw] xs:w-[300px] sm:w-[310px] lg:w-[305px] shrink-0 flex-col rounded-3xl bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-800 hover:border-mint/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-mint/5 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Real College Photo from public/colleges/ */}
                <div className="relative h-48 w-full overflow-hidden bg-surface-muted dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={collegeImg}
                    alt={`${college.name} campus`}
                    draggable={false}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/colleges/MAIT.jpeg';
                    }}
                  />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-text-main dark:text-white text-xs font-bold shadow-sm border border-outline-soft dark:border-slate-700">
                    {college.short_name}
                  </span>
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-lavender text-lavender-dark text-[11px] font-bold">
                    {college.category}
                  </span>
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-1.5 text-white text-[11px] font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full w-fit max-w-[calc(100%-28px)]">
                    <MapPin className="h-3.5 w-3.5 text-mint shrink-0" />
                    <span className="truncate">{college.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-text-main dark:text-white group-hover:text-mint transition-colors line-clamp-1">
                      {college.name}
                    </h3>
                    <p className="text-xs text-text-muted dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {college.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2 border-t border-outline-soft/60 dark:border-slate-800">
                    {college.placements && (
                      <div className="flex items-center justify-between text-xs bg-surface-muted dark:bg-slate-800 px-3 py-2 rounded-xl">
                        <span className="text-text-muted dark:text-slate-400 font-medium">Avg CTC</span>
                        <span className="text-mint font-bold">
                          {college.placements.average} (Max {college.placements.highest})
                        </span>
                      </div>
                    )}
                    {college.connectivity && (
                      <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-slate-400 font-medium">
                        <Train className="h-4 w-4 text-lavender-dark dark:text-lavender shrink-0" />
                        <span className="truncate">{college.connectivity}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted dark:text-slate-400">
                      {college.branches.length} Branches
                    </span>
                    <Link
                      href={`/college/${college.slug}`}
                      onClick={handleLinkClick}
                      className="px-4 py-2 rounded-full bg-mint text-white hover:bg-mint-dark text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
