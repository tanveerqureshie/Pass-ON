'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BookOpen, Wrench, Laptop, Home, ArrowRight, Layers, LayoutGrid } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  academic: BookOpen,
  'lab-equipment': Wrench,
  electronics: Laptop,
  'hostel-essentials': Home,
};

export default function CategoriesPage() {
  const { categories, listings } = useApp();

  const getItemCount = (categoryId: string) =>
    listings.filter((l) => l.categoryId === categoryId).length;

  return (
    <div className="py-8">
      <div className="container-x space-y-8">
        {/* Page header */}
        <div className="rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-700">
              <LayoutGrid className="h-3 w-3" /> Campus Catalog Directory
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
              Campus Categories
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Every category is tailored to Delhi engineering degree requirements — from 1st-year Applied Sciences
              &amp; Engineering Graphics to final-year major project components and hostel essentials.
            </p>
          </div>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((cat, index) => {
            const Icon = ICONS[cat.id] || Layers;
            const count = getItemCount(cat.id);

            return (
              <div
                key={cat.id}
                className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift sm:p-7"
              >
                <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-5.5 w-5.5" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-ink-950">{cat.name}</h2>
                      <span className="text-xs font-medium text-ink-500">
                        {count} {count === 1 ? 'item available' : 'items available'}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold text-ink-600">
                    #{index + 1}
                  </span>
                </div>

                <p className="my-5 text-sm leading-relaxed text-ink-600">{cat.description}</p>

                <div className="mb-5 flex-1">
                  <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-ink-400">
                    Verified Subcategories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/explore?category=${cat.id}&q=${encodeURIComponent(sub)}`}
                        className="rounded-lg border border-ink-200 bg-[#f7f7f8] px-3 py-1.5 text-xs font-medium text-ink-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-ink-100 pt-4">
                  <Link
                    href={`/explore?category=${cat.id}`}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-chip transition hover:bg-brand-700"
                  >
                    Browse All {cat.name}
                    <ArrowRight className="h-4 w-4" />
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
