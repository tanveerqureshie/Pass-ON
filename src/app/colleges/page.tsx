'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MapPin, Check, ArrowRight, Landmark, PackageSearch } from 'lucide-react';
import clsx from 'clsx';

export default function CollegesPage() {
  const { colleges, selectedCollegeId, setSelectedCollegeId, listings } = useApp();

  const getCount = (collegeId: string) => listings.filter((l) => l.collegeId === collegeId).length;

  return (
    <div className="py-8">
      <div className="container-x space-y-8">
        {/* Header banner */}
        <div className="rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-700">
              <Landmark className="h-3 w-3" /> Campus Directory
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
              Choose Your College
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Select your primary campus to prioritise nearby canteens and libraries for quick semester handovers,
              or explore verified listings from peer colleges across Delhi.
            </p>
          </div>
        </div>

        {/* College cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {colleges.map((col) => {
            const isSelected = col.id === selectedCollegeId;
            const count = getCount(col.id);

            return (
              <div
                key={col.id}
                className={clsx(
                  'flex flex-col rounded-2xl border p-6 shadow-card transition-all',
                  isSelected
                    ? 'border-brand-300 bg-brand-50/40'
                    : 'border-ink-200 bg-white hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift'
                )}
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-amber-200 bg-amber-100/80 px-2.5 py-0.5 text-xs font-extrabold text-ink-950">
                        {col.short_name}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">
                          <Check className="h-3 w-3" /> My Campus
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500">
                      <PackageSearch className="h-3.5 w-3.5" /> {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <h3 className="mb-2 text-base font-bold leading-snug text-ink-950">{col.name}</h3>

                  <div className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                    <span>{col.location}</span>
                  </div>

                  {col.description && (
                    <p className="mb-4 text-xs leading-relaxed text-ink-500">{col.description}</p>
                  )}

                  <div className="mb-5 space-y-1.5">
                    <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-ink-400">
                      Available Branches
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {col.branches.map((b) => (
                        <span
                          key={b}
                          className="rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-600"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2 border-t border-ink-100 pt-4">
                  <button
                    onClick={() => setSelectedCollegeId(col.id)}
                    disabled={isSelected}
                    className={clsx(
                      'w-full rounded-xl px-3 py-2.5 text-xs font-bold shadow-chip transition-all',
                      isSelected
                        ? 'cursor-default bg-brand-600 text-white'
                        : 'border border-ink-300 bg-white text-ink-900 hover:border-ink-400 hover:bg-ink-50'
                    )}
                  >
                    {isSelected ? 'Active Primary College ✓' : 'Set as My College'}
                  </button>

                  <Link
                    href={`/college/${col.slug}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink-950 px-3 py-2.5 text-xs font-bold text-white shadow-chip transition hover:bg-ink-800"
                  >
                    Explore {col.short_name} Hub
                    <ArrowRight className="h-3.5 w-3.5 text-brand-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
