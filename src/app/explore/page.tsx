'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { FilterState } from '@/lib/types';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { EmptyState } from '@/components/ui/Common';
import { Search, SlidersHorizontal, PackageOpen, X, PlusCircle, Compass } from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const { listings, selectedCollegeId, selectedCollege } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get('q') || '',
    collegeId: searchParams.get('college') || 'all',
    branch: searchParams.get('branch') || 'all',
    categoryId: searchParams.get('category') || 'all',
    listingType: searchParams.get('type') || (searchParams.get('free') === 'true' ? 'free' : 'all'),
    condition: 'all',
    isFreeOnly: searchParams.get('free') === 'true',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    mode: searchParams.get('mode') === 'my_college' ? 'my_college' : 'all',
  });

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (filters.mode === 'my_college' && item.collegeId !== selectedCollegeId) return false;

        if (filters.mode === 'all' && filters.collegeId !== 'all' && item.collegeId !== filters.collegeId) return false;
        if (filters.branch !== 'all' && item.department !== filters.branch) return false;
        if (filters.categoryId !== 'all' && item.categoryId !== filters.categoryId) return false;
        if (filters.listingType !== 'all' && item.listingType !== filters.listingType) return false;
        if (filters.isFreeOnly && item.listingType !== 'free') return false;
        if (filters.condition !== 'all' && item.condition !== filters.condition) return false;
        if (filters.minPrice !== '' && item.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice !== '' && item.price > Number(filters.maxPrice)) return false;

        if (filters.searchQuery.trim() !== '') {
          const query = filters.searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesDesc = item.description.toLowerCase().includes(query);
          const matchesCollege =
            item.collegeName.toLowerCase().includes(query) || item.collegeShortName.toLowerCase().includes(query);
          const matchesDept = item.department?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc && !matchesCollege && !matchesDept) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, filters, selectedCollegeId]);

  const paginatedListings = filteredListings.slice(0, itemsPerPage);
  const hasMore = itemsPerPage < filteredListings.length;

  const resetFilters = () =>
    setFilters({
      searchQuery: '',
      collegeId: 'all',
      branch: 'all',
      categoryId: 'all',
      listingType: 'all',
      condition: 'all',
      isFreeOnly: false,
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      mode: 'all',
    });

  return (
    <div className="container-x py-8">
      {/* Page header */}
      <div className="mb-7 flex flex-col gap-5 rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-700">
              <Compass className="h-3 w-3" /> Campus Marketplace
            </span>
            {filters.mode === 'my_college' ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
                My Campus: {selectedCollege?.short_name}
              </span>
            ) : (
              <span className="rounded-full bg-ink-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink-700">
                All Delhi Colleges
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            {filters.mode === 'my_college' ? `${selectedCollege?.short_name} Listings` : 'Delhi Campuses Marketplace'}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500">
            Browse textbooks, drafters, calculators and hostel gear from verified students. Contact instantly over
            WhatsApp or Instagram.
          </p>
        </div>

        {/* Mode switcher */}
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink-200 bg-ink-100 p-1">
          <button
            onClick={() => setFilters((p) => ({ ...p, mode: 'my_college', collegeId: selectedCollegeId }))}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filters.mode === 'my_college' ? 'bg-white text-ink-950 shadow-chip' : 'text-ink-600 hover:text-ink-950'
            }`}
          >
            My College
          </button>
          <button
            onClick={() => setFilters((p) => ({ ...p, mode: 'all', collegeId: 'all' }))}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filters.mode === 'all' ? 'bg-white text-ink-950 shadow-chip' : 'text-ink-600 hover:text-ink-950'
            }`}
          >
            Explore All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search by title, equipment or campus (e.g. Casio, Lab Coat, Mathematics, Arduino)…"
          value={filters.searchQuery}
          onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
          className="w-full rounded-2xl border border-ink-200 bg-white py-3.5 pl-11 pr-11 text-sm font-medium text-ink-900 shadow-chip transition placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/15"
          aria-label="Search listings"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white py-3 text-xs font-bold text-ink-900 shadow-chip lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4 text-brand-600" />
        Filters & Sort ({filteredListings.length} items)
      </button>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-4">
        <aside className="sticky top-28 hidden lg:col-span-1 lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} totalCount={filteredListings.length} />
        </aside>

        {mobileFilterOpen && (
          <div className="lg:col-span-1">
            <FilterSidebar filters={filters} setFilters={setFilters} totalCount={filteredListings.length} />
          </div>
        )}

        <div className="space-y-7 lg:col-span-3">
          {filteredListings.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title={listings.length === 0 ? 'No campus items listed yet' : 'No listings found'}
              description={
                listings.length === 0
                  ? 'Be the first student to pass on a textbook, scientific calculator or lab coat!'
                  : 'No items match your filters. Try clearing them or switching to “Explore All Colleges”.'
              }
              actionHref={listings.length === 0 ? '/sell' : undefined}
              actionLabel={listings.length === 0 ? 'Post the First Item' : undefined}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedListings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={() => setItemsPerPage((p) => p + 6)}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-300 bg-white px-6 text-sm font-bold text-ink-900 shadow-chip transition hover:border-ink-400 hover:bg-ink-50"
                  >
                    Load More ({filteredListings.length - itemsPerPage} remaining)
                  </button>
                </div>
              )}

              {/* Sell CTA strip */}
              <div className="rounded-2xl border border-brand-200 bg-brand-50/60 px-6 py-5 sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-base font-extrabold text-ink-950">Got something to pass on?</h3>
                  <p className="mt-0.5 text-sm text-ink-600">List it once — every campus in the network can see it.</p>
                </div>
                <Link
                  href="/sell"
                  className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-bold text-white shadow-chip transition hover:bg-brand-700 sm:mt-0"
                >
                  <PlusCircle className="h-4 w-4" /> Post an Item
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container-x py-16" />}>
      <ExploreContent />
    </Suspense>
  );
}
