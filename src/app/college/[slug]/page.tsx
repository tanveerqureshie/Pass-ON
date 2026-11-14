'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { PackageSearch, MapPin, Check, ArrowLeft, Filter, PlusCircle, Landmark, Gift, GitBranch, CalendarDays } from 'lucide-react';
import clsx from 'clsx';

export default function CollegeDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const { colleges, listings, selectedCollegeId, setSelectedCollegeId } = useApp();

  const college = colleges.find((c) => c.slug === slug || c.id === slug);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  if (!college) {
    return (
      <div className="section container-x">
        <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-ink-300 bg-white p-12 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink-100 text-ink-400">
            <Landmark className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-950">College Not Found</h1>
          <p className="mt-2 text-sm text-ink-500">
            The requested college does not exist in our Delhi campus directory.
          </p>
          <Link
            href="/colleges"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-950 px-6 text-sm font-bold text-white transition hover:bg-ink-800"
          >
            Back to College Directory
          </Link>
        </div>
      </div>
    );
  }

  const isSelected = college.id === selectedCollegeId;

  const collegeListings = listings.filter((l) => {
    if (l.collegeId !== college.id) return false;
    if (selectedBranch !== 'all' && l.department !== selectedBranch) return false;
    return true;
  });

  const freeCount = listings.filter((l) => l.collegeId === college.id && l.listingType === 'free').length;

  return (
    <div className="py-8">
      <div className="container-x space-y-7">
        {/* Back */}
        <div>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 transition hover:text-brand-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to All Campuses
          </Link>
        </div>

        {/* College banner */}
        <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
          {/* Brand strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-700 to-ink-950" />

          <div className="p-6 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 border-b border-ink-100 pb-6 md:flex-row md:items-center">
              <div className="max-w-2xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-extrabold text-ink-950">
                    {college.short_name}
                  </span>
                  <span className="rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 text-xs font-semibold text-ink-700">
                    {college.category} Campus
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
                      <Check className="h-3.5 w-3.5" /> Your Active Campus
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
                  {college.name}
                </h1>

                <div className="flex items-center gap-2 text-xs font-medium text-ink-500">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
                  <span>{college.location}</span>
                </div>

                {college.description && (
                  <p className="pt-1 text-sm leading-relaxed text-ink-600">{college.description}</p>
                )}
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2.5 md:w-auto">
                <button
                  onClick={() => setSelectedCollegeId(college.id)}
                  disabled={isSelected}
                  className={clsx(
                    'w-full rounded-xl px-4 py-2.5 text-xs font-bold shadow-chip transition',
                    isSelected
                      ? 'cursor-default bg-brand-50 text-brand-700'
                      : 'border border-ink-300 bg-white text-ink-900 hover:border-ink-400 hover:bg-ink-50'
                  )}
                >
                  {isSelected ? '✓ Current Campus' : 'Set as My College'}
                </button>
                <Link
                  href="/sell"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-chip transition hover:bg-brand-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post Item at {college.short_name}
                </Link>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-4 pt-6 text-center sm:grid-cols-4">
              {[
                { label: 'Active Items', value: listings.filter((l) => l.collegeId === college.id).length, icon: PackageSearch, tone: 'text-brand-600' },
                { label: 'Free Giveaways', value: freeCount, icon: Gift, tone: 'text-emerald-600' },
                { label: 'Branches Covered', value: college.branches.length, icon: GitBranch, tone: 'text-ink-950' },
                { label: 'Est. Year', value: college.establishedYear || '1999', icon: CalendarDays, tone: 'text-ink-950' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-ink-200 bg-[#f7f7f8] p-4">
                  <s.icon className={`mx-auto mb-1.5 h-4.5 w-4.5 ${s.tone}`} />
                  <span className="block font-display text-xl font-extrabold text-ink-950">{s.value}</span>
                  <span className="mt-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-ink-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Branch pills */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-ink-200 bg-white p-4 shadow-card">
          <span className="mr-2 flex items-center gap-1 text-xs font-extrabold text-ink-900">
            <Filter className="h-3.5 w-3.5 text-brand-600" />
            Branch:
          </span>
          <button
            onClick={() => setSelectedBranch('all')}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-xs font-bold transition-all',
              selectedBranch === 'all'
                ? 'bg-ink-950 text-white shadow-chip'
                : 'border border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100'
            )}
          >
            All Branches ({college.branches.length})
          </button>
          {college.branches.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-bold transition-all',
                selectedBranch === b
                  ? 'bg-brand-600 text-white shadow-chip'
                  : 'border border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100'
              )}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-ink-100 pb-2">
            <h2 className="font-display text-lg font-extrabold text-ink-950">
              Listings at {college.short_name} ({collegeListings.length})
            </h2>
            <span className="text-xs font-semibold text-ink-500">
              {selectedBranch !== 'all' ? `Filtered by ${selectedBranch}` : 'All Departments'}
            </span>
          </div>

          {collegeListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-12 text-center">
              <p className="font-display text-base font-extrabold text-ink-950">
                No listings currently posted for{' '}
                {selectedBranch !== 'all' ? selectedBranch : college.short_name}.
              </p>
              <p className="mt-1.5 text-sm text-ink-500">
                Be the first verified senior to pass down textbooks or calculators to juniors here!
              </p>
              <Link
                href="/sell"
                className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-xs font-bold text-white transition hover:bg-brand-700"
              >
                Post First Item at {college.short_name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {collegeListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
