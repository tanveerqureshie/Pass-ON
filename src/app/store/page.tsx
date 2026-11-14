'use client';

import React, { useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Laptop,
  NotebookPen,
  ShoppingBag,
  BedDouble,
  Shirt,
  Star,
  ArrowRight,
  ChevronDown,
  X,
  Clock,
} from 'lucide-react';
import { STORE_PRODUCTS, STORE_CATEGORIES, discountPercent } from '@/lib/data/store';
import { ProductCard } from '@/components/store/ProductCard';
import { SectionHeader, EmptyState } from '@/components/ui/Common';
import clsx from 'clsx';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  books: BookOpen,
  electronics: Laptop,
  stationery: NotebookPen,
  carry: ShoppingBag,
  room: BedDouble,
  wardrobe: Shirt,
};

const SORTS = [
  { id: 'featured', label: 'Featured first' },
  { id: 'price_asc', label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'discount', label: 'Biggest discount' },
  { id: 'rating', label: 'Top rated' },
] as const;

function StorePageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [categoryId, setCategoryId] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('featured');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    setCategoryId(searchParams.get('category') || 'all');
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const products = useMemo(() => {
    let list = [...STORE_PRODUCTS];
    if (categoryId !== 'all') list = list.filter((p) => p.categoryId === categoryId);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        list.sort((a, b) => discountPercent(b) - discountPercent(a));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort(
          (a, b) =>
            (b.badges.includes('featured') ? 1 : 0) - (a.badges.includes('featured') ? 1 : 0) ||
            b.rating - a.rating
        );
    }
    return list;
  }, [categoryId, query, sort]);

  const activeCategory = STORE_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <div>
      {/* Store hero banner */}
      <section className="relative isolate overflow-hidden bg-ink-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/store/store-banner.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/70" />
        <div className="relative container-x py-16 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur">
            <ShoppingBag className="h-3.5 w-3.5 text-brand-400" /> The Official Pass ON Store
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Everything a student needs,{' '}
            <span className="text-brand-400">fairly priced.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
            Quality-checked gadgets, stationery, books and official merch — delivered to your campus or picked up
            on your way to class. Free delivery over ₹999.
          </p>

          {/* Search */}
          <div className="mt-7 flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 shadow-lift">
            <Search className="ml-3 h-4.5 w-4.5 shrink-0 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, categories…"
              className="w-full bg-transparent py-2.5 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-400"
              aria-label="Search store products"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {STORE_PRODUCTS.length === 0 ? (
        /* ── Store launching soon ── */
        <section className="section">
          <div className="container-x">
            <div className="card-3d glass-card relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-10 text-center backdrop-blur-xl sm:p-16">
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 animate-float-slow rounded-full bg-brand-600/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 animate-float-slower rounded-full bg-brand-600/10 blur-3xl" />
              <div className="relative mx-auto max-w-lg">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-600 text-white shadow-lift">
                  <ShoppingBag className="h-7 w-7" />
                </span>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-700">
                  <Clock className="h-3.5 w-3.5" /> Launching Soon
                </span>
                <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
                  Our Store is almost here
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500 sm:text-base">
                  Quality-checked gadgets, stationery, books and official Pass ON merch — fairly priced and
                  delivered to your campus. We&apos;re stocking the shelves right now.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/explore"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brand-500"
                  >
                    Explore the Marketplace <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex h-12 items-center rounded-full border border-ink-200 bg-white px-7 text-sm font-bold text-ink-800 transition hover:border-ink-300 hover:bg-ink-50"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
       {/* Category chips + sort */}
      <section className="sticky top-[68px] z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-3 py-3">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setCategoryId('all')}
              className={clsx(
                'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition',
                categoryId === 'all'
                  ? 'bg-ink-950 text-white'
                  : 'border border-ink-200 bg-ink-50 text-ink-700 hover:border-ink-300 hover:bg-white'
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" /> All Products
            </button>
            {STORE_CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c.id] || ShoppingBag;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={clsx(
                    'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition',
                    categoryId === c.id
                      ? 'bg-brand-600 text-white'
                      : 'border border-ink-200 bg-ink-50 text-ink-700 hover:border-ink-300 hover:bg-white'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {c.name}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-ink-200 bg-white px-4 text-xs font-bold text-ink-800 transition hover:border-ink-300"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{SORTS.find((s) => s.id === sort)?.label}</span>
              <ChevronDown className={clsx('h-3.5 w-3.5 text-ink-400 transition', sortOpen && 'rotate-180')} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full z-40 mt-2 w-56 animate-pop-in overflow-hidden rounded-2xl border border-ink-200 bg-white py-1.5 shadow-lift">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSort(s.id);
                        setSortOpen(false);
                      }}
                      className={clsx(
                        'flex w-full items-center justify-between px-4 py-2 text-left text-xs font-semibold transition',
                        sort === s.id ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="section">
        <div className="container-x">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-950">
                {activeCategory ? activeCategory.name : 'All Products'}
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                {products.length} product{products.length === 1 ? '' : 's'}
                {activeCategory ? ` · ${activeCategory.tagline}` : ' · student-approved picks from the Pass ON store'}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No products found"
              description={
                query
                  ? `Nothing matches "${query}" in this category. Try different keywords or browse everything we stock.`
                  : 'This category is being restocked. Browse our other shelves in the meantime.'
              }
              actionHref="/store"
              actionLabel="View All Products"
            />
          )}

          {/* Marketplace cross-link */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-ink-200 bg-white">
            <div className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Star className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-extrabold text-ink-950 sm:text-2xl">
                Looking for pre-loved & free items instead?
              </h3>
              <p className="max-w-lg text-sm leading-relaxed text-ink-500">
                The Pass ON marketplace connects you directly with verified students selling, lending and giving
                away textbooks, lab gear and more — at zero commission.
              </p>
              <Link
                href="/explore"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-950 px-6 text-sm font-bold text-white transition hover:bg-ink-800"
              >
                Explore the Marketplace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="container-x section" />}>
      <StorePageContent />
    </Suspense>
  );
}
