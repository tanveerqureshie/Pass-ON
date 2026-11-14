'use client';

import React from 'react';
import { COMING_SOON_COLLEGES } from '@/lib/data/colleges';
import { Stethoscope, Scale, Lock, Clock } from 'lucide-react';

export const ComingSoonSection: React.FC = () => {
  return (
    <section className="my-14 overflow-hidden rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-ink-100 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-600" />
            <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-extrabold text-brand-700">
              UPCOMING EXPANSION
            </span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            Medical &amp; Law Campuses
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            Pass ON is expanding beyond engineering! Stethoscopes, anatomy atlases, bare acts, and moot court
            robes will soon be passed on between Delhi medical and legal students.
          </p>
        </div>
        <div className="shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-ink-950 px-3.5 py-2 text-xs font-bold text-white shadow-chip">
            <Clock className="h-4 w-4 text-brand-400" />
            <span>Phased Launch Q4</span>
          </div>
        </div>
      </div>

      {/* Preview cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {COMING_SOON_COLLEGES.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl border border-ink-200 bg-[#f7f7f8] p-6"
          >
            <div className="absolute right-4 top-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-bold text-ink-600">
                <Lock className="h-3 w-3 text-ink-400" />
                {item.badge}
              </span>
            </div>

            <div className="mb-4 flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ink-200 bg-white">
                {item.id === 'medical-dept' ? (
                  <Stethoscope className="h-6 w-6 text-brand-600" />
                ) : (
                  <Scale className="h-6 w-6 text-ink-700" />
                )}
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold text-ink-950">{item.title}</h3>
                <p className="text-xs font-medium text-ink-500">{item.subtitle}</p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-ink-600">{item.description}</p>

            <div className="border-t border-ink-200 pt-4">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-ink-400">
                Prospective Participating Colleges
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.examples.map((ex) => (
                  <span
                    key={ex}
                    className="rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
