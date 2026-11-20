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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to All Campuses
          </Link>
        </div>

        {/* College banner */}
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-card">
          {/* Top photo banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={college.image || `/colleges/${college.short_name}.jpeg`}
              alt={`${college.name} campus`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/colleges/MAIT.jpeg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-teal-600 text-white px-3 py-1 text-xs font-black shadow-sm">
                  {college.short_name}
                </span>
                <span className="rounded-full bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold">
                  {college.category} Campus
                </span>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-bold shadow-sm">
                    <Check className="h-3.5 w-3.5" /> Your Active Campus
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {college.name}
              </h1>
              <div className="flex items-center gap-2 text-xs font-medium text-white/80 mt-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-teal-300" />
                <span>{college.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-col items-start justify-between gap-6 border-b border-cream-200 pb-6 md:flex-row md:items-center">
              <div className="max-w-2xl space-y-2">
                {college.description && (
                  <p className="text-sm leading-relaxed text-ink-600">{college.description}</p>
                )}
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2.5 md:w-auto">
                <button
                  onClick={() => setSelectedCollegeId(college.id)}
                  disabled={isSelected}
                  className={clsx(
                    'w-full rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition',
                    isSelected
                      ? 'cursor-default bg-teal-50 text-teal-800 border border-teal-200'
                      : 'border border-cream-300 bg-white text-ink-900 hover:border-teal-500 hover:bg-teal-50/50'
                  )}
                >
                  {isSelected ? '✓ Current Active Campus' : 'Set as My College'}
                </button>
                <Link
                  href="/sell"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post Item at {college.short_name}
                </Link>
              </div>
            </div>

            {/* Campus Connectivity & Placements Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Connectivity */}
              <div className="rounded-2xl border border-cream-200 bg-cream-50/60 p-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-700 mb-2">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span>Metro & Campus Connectivity</span>
                </div>
                <p className="text-sm font-semibold text-ink-900 leading-relaxed">
                  {college.connectivity || `${college.location} • Direct campus transit available`}
                </p>
                <span className="mt-2 block text-[11px] text-ink-500">
                  Physical student handovers recommended at Campus Gate 1 or Central Canteen.
                </span>
              </div>

              {/* Placements */}
              <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-700 mb-2">
                  <PackageSearch className="h-4 w-4 text-teal-600" />
                  <span>Placements & Career Overview</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <div>
                    <span className="block font-display text-xl font-black text-teal-900">
                      {college.placements?.highest || '₹40+ LPA'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Highest CTC</span>
                  </div>
                  <div>
                    <span className="block font-display text-xl font-black text-ink-900">
                      {college.placements?.average || '₹8.5 LPA'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Average CTC</span>
                  </div>
                </div>
                {college.placements?.topRecruiters && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-ink-600">
                    <span className="font-semibold text-ink-800">Top Recruiters:</span>
                    {college.placements.topRecruiters.map((r) => (
                      <span key={r} className="rounded bg-white px-1.5 py-0.5 border border-teal-100 font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-center sm:grid-cols-4">
              {[
                { label: 'Active Items', value: listings.filter((l) => l.collegeId === college.id).length, icon: PackageSearch, tone: 'text-teal-600' },
                { label: 'Free Giveaways', value: freeCount, icon: Gift, tone: 'text-emerald-600' },
                { label: 'Branches Covered', value: college.branches.length, icon: GitBranch, tone: 'text-ink-950' },
                { label: 'Est. Year', value: college.establishedYear || '1999', icon: CalendarDays, tone: 'text-ink-950' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm">
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
            <Filter className="h-3.5 w-3.5 text-teal-600" />
            Branch:
          </span>
          <button
            onClick={() => setSelectedBranch('all')}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-xs font-bold transition-all',
              selectedBranch === 'all'
                ? 'bg-teal-700 text-white shadow-chip'
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
                  ? 'bg-teal-600 text-white shadow-chip'
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
                className="mt-5 inline-flex h-10 items-center rounded-full bg-teal-600 px-5 text-xs font-bold text-white transition hover:bg-teal-700"
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
