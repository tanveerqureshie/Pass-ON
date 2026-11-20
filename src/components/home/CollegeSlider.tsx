'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, Train, ArrowRight, Sparkles, Building2 } from 'lucide-react';
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
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Mouse drag handlers for smooth slide with mouse
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
    const walk = (x - startX.current) * 1.5; // Smooth 1.5x drag ratio
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  // Prevent link navigation if user was dragging
  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
    }
  }, []);

  return (
    <section className="relative py-12 sm:py-16 bg-[#FFF8F0]/80 dark:bg-[#080f12]/80 border-b border-cream-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Campus Network Directory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
              Explore Delhi College Campuses
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-slate-400 max-w-xl">
              Swipe or drag horizontally to inspect student handover hubs, metro connectivity, placements, and live campus listings.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 px-3 py-1 rounded-full border border-cream-300 dark:border-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Drag to explore
            </span>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition underline underline-offset-4"
            >
              All 11 Campuses →
            </Link>
          </div>
        </div>

        {/* 3D Neumorphic & Glassmorphic College Cards Slider Track */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-8 pt-3 sm:mx-0 sm:px-0 select-none touch-pan-x cursor-grab ${
            isGrabbing ? 'cursor-grabbing' : ''
          }`}
          style={{ scrollBehavior: isGrabbing ? 'auto' : 'smooth' }}
        >
          {colleges.map((college) => {
            const collegeImg = college.image || `/colleges/${college.short_name}.jpeg`;

            return (
              <div
                key={college.id}
                className="group relative flex w-[300px] sm:w-[340px] shrink-0 flex-col rounded-3xl glass-neu overflow-hidden transition-all duration-300 hover:-translate-y-2"
              >
                {/* College Photo with Glassmorphism overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
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
                    <span className="rounded-full bg-teal-600 text-white px-2.5 py-0.5 text-xs font-black tracking-wide shadow-md">
                      {college.short_name}
                    </span>
                    <span className="rounded-full bg-white/85 backdrop-blur-md border border-white/70 text-ink-800 px-2.5 py-0.5 text-[11px] font-bold shadow-sm">
                      {college.category}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white/95">
                      <MapPin className="h-3.5 w-3.5 text-teal-300 shrink-0" />
                      <span className="truncate">{college.location}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body with Neumorphic Surface */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-ink-950 dark:text-white leading-snug line-clamp-1 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {college.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {college.description}
                    </p>
                  </div>

                  {/* Feature Highlights: Placements & Connectivity */}
                  <div className="space-y-2 pt-2 border-t border-white/60 dark:border-white/10 text-xs">
                    {/* Placements */}
                    {college.placements && (
                      <div className="flex items-center gap-2 text-ink-700 dark:text-slate-300 bg-teal-50/70 dark:bg-teal-950/60 rounded-xl px-2.5 py-1.5 border border-teal-100/70 dark:border-teal-800">
                        <TrendingUp className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate">
                          <strong className="font-bold text-teal-900 dark:text-teal-200">{college.placements.highest}</strong> Highest CTC
                          {college.placements.average ? ` • avg ${college.placements.average}` : ''}
                        </span>
                      </div>
                    )}

                    {/* Connectivity */}
                    {college.connectivity && (
                      <div className="flex items-center gap-2 text-ink-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 rounded-xl px-2.5 py-1.5 border border-cream-300 dark:border-slate-700">
                        <Train className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate text-[11px] font-medium text-ink-600 dark:text-slate-300">
                          {college.connectivity}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action: Small Explore Campus Button */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-ink-400">
                      {college.branches.length} Tech Branches
                    </span>
                    <Link
                      href={`/college/${college.slug}`}
                      onClick={handleLinkClick}
                      className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-md transition hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      <span>Explore Campus</span>
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
