'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Wrench,
  Laptop,
  Home,
  Bike,
  Palette,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Tag,
  Search,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CollegeSlider } from '@/components/home/CollegeSlider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/Common';

const CATEGORY_ITEMS = [
  { id: 'academic', name: 'Academic Materials', icon: BookOpen, desc: 'Textbooks, Notes & PYQs' },
  { id: 'lab-equipment', name: 'Engineering & Lab', icon: Wrench, desc: 'Drafters, Aprons & Practical Kits' },
  { id: 'electronics', name: 'Electronics & Gadgets', icon: Laptop, desc: 'Scientific Calculators & Tech' },
  { id: 'hostel-essentials', name: 'Hostel Essentials', icon: Home, desc: 'Kettles, Mattresses, Study Lamps' },
  { id: 'mobility', name: 'Cycles & Mobility', icon: Bike, desc: 'Campus Bicycles & Accessories' },
  { id: 'design-arts', name: 'Design & Supplies', icon: Palette, desc: 'Drawing Boards & Art Sheets' },
];

const FILTER_TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'academic', label: 'Books & Notes' },
  { id: 'lab-equipment', label: 'Engineering & Lab' },
  { id: 'electronics', label: 'Electronics & Tech' },
  { id: 'hostel-essentials', label: 'Hostel' },
  { id: 'free', label: 'Free Giveaways' },
];

export default function HomePage() {
  const router = useRouter();
  const { listings, colleges } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const activeListings = useMemo(() => listings.filter((l) => l.status === 'active'), [listings]);

  /* Student products — filtered and sorted by newest */
  const studentListings = useMemo(() => {
    let filtered = [...activeListings];
    if (activeFilter === 'free') {
      filtered = filtered.filter((l) => l.listingType === 'free');
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter((l) => l.categoryId === activeFilter);
    }
    return filtered
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 10);
  }, [activeListings, activeFilter]);

  /* Marquee names — every college on the network, doubled for a seamless loop */
  const marqueeNames = useMemo(
    () => [
      ...colleges.map((c) => ({ short: c.short_name, name: c.name })),
      ...colleges.map((c) => ({ short: c.short_name, name: c.name })),
    ],
    [colleges]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#020617] bg-notebook-grid min-h-screen text-ink-950 dark:text-slate-100 transition-colors duration-300">
      {/* ───────────────────────────── Hero: Elevated & Framed Showcase Stage ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-[#f8fafc] dark:from-slate-900/90 dark:via-slate-950 dark:to-[#020617] pt-16 pb-16 sm:pt-24 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800 shadow-[0_12px_30px_-15px_rgba(37,99,235,0.12)] transition-colors">
        {/* Subtle notebook grid inside hero for texture */}
        <div className="pointer-events-none absolute inset-0 bg-notebook-grid opacity-60" />

        {/* Ambient mesh lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-300/30 dark:bg-blue-600/15 blur-3xl animate-hero-mesh" />
        <div className="pointer-events-none absolute -right-20 top-12 h-96 w-96 rounded-full bg-indigo-300/25 dark:bg-indigo-600/15 blur-3xl animate-hero-mesh-reverse" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-white/40 dark:bg-blue-900/10 blur-3xl" />

        <div className="container-x relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Campus Network Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Delhi Campus Network • 11 Colleges</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink-950 dark:text-white leading-[1.08]">
              Pass It On.{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Save More.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-ink-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Seniors&apos; textbooks, gadgets and hostel essentials find their next owner — verified, free to use and zero commission.
            </p>

            {/* Floating Hero Search Bar with Deep Visible Drop Shadow */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 mx-auto max-w-2xl relative flex items-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.14),0_4px_12px_-2px_rgba(15,23,42,0.06)] hover:border-blue-400 transition-all group"
            >
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, notes, lab gear, drafters, PYQs, calculators on any campus..."
                className="w-full bg-transparent px-3 py-2 text-sm text-ink-950 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-lg active:scale-95"
              >
                Search Items
              </button>
            </form>

            {/* 3 CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/explore"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-7 text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Campus Items
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-7 text-sm font-bold shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                Pass On an Item
              </Link>
              <Link
                href="/store"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-7 text-sm font-bold shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                Shop Our Store
              </Link>
            </div>

            {/* 3 Perks */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 text-xs sm:text-sm font-bold text-ink-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 bg-white dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                Verified enrollment IDs
              </span>
              <span className="inline-flex items-center gap-2 bg-white dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <Tag className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                Zero fees, zero commission
              </span>
              <span className="inline-flex items-center gap-2 bg-white dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <MessageCircle className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                WhatsApp handovers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── College name marquee (all campuses) ───────────── */}
      <Reveal>
        <section aria-label="Colleges on the Pass ON network" className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-3.5 backdrop-blur-sm transition-colors shadow-xs">
          <div className="marquee-mask overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
              {marqueeNames.map((c, i) => (
                <span key={`${c.short}-${i}`} className="flex items-center gap-10">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-xs font-black tracking-wider text-blue-700 dark:text-blue-400">{c.short}</span>
                    <span className="hidden text-[11px] font-medium text-ink-400 dark:text-slate-400 md:inline">{c.name}</span>
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─────────────── 3D College Cards Slider (Smooth Drag) ───────────── */}
      <Reveal>
        <CollegeSlider colleges={colleges} />
      </Reveal>

      {/* ─────────────── Explore Categories (Deep Visible Drop Shadows) ──────────── */}
      <section className="section py-12 sm:py-16">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
                  Explore Categories
                </h2>
                <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
                  Select a category to browse textbooks, practical instruments, engineering drafters, and hostel gear.
                </p>
              </div>
              <Link
                href="/categories"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition underline underline-offset-4"
              >
                All Categories →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {CATEGORY_ITEMS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.id}`}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl glass-neu transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 mb-3 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-ink-950 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                    <span className="mt-1 text-[10px] text-ink-400 dark:text-slate-400 line-clamp-1">
                      {cat.desc}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────── Students' Products — Live Listings with Tabs ────────────── */}
      <section className="section pt-0">
        <div className="container-x">
          <Reveal>
            <SectionHeader
              eyebrow="Straight from students"
              title="Student Products"
              description="Real textbooks, gadgets and essentials listed by verified students across every Delhi campus in the network."
              actionHref="/explore"
              actionLabel="Explore All Items"
            />
          </Reveal>

          {/* Filter Tabs Row */}
          <Reveal delay={40}>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 shadow-sm'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {studentListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
              {studentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-neu p-12 text-center">
              <p className="text-sm font-semibold text-ink-500 dark:text-slate-400">
                No items found for this category right now. Be the first to list one!
              </p>
              <Link
                href="/sell"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 transition"
              >
                Pass On an Item
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────────── Safety & Community (Trust Cards) ───────────────────────────── */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Reveal delay={0}>
              <div className="rounded-2xl glass-neu p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900 shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-extrabold text-ink-950 dark:text-slate-100">Campus-Verified Only</h3>
                <p className="mt-1 text-xs text-ink-500 dark:text-slate-400 leading-relaxed">
                  Only students with genuine college enrollment IDs can sign in, post items, or initiate handovers.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl glass-neu p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900 shadow-xs">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-extrabold text-ink-950 dark:text-slate-100">Zero Fees, Zero Commission</h3>
                <p className="mt-1 text-xs text-ink-500 dark:text-slate-400 leading-relaxed">
                  Every rupee goes straight to the student. Pass ON charges no listing fees, buyer cuts, or middleman fees.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-2xl glass-neu p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900 shadow-xs">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-extrabold text-ink-950 dark:text-slate-100">Direct WhatsApp / IG Chat</h3>
                <p className="mt-1 text-xs text-ink-500 dark:text-slate-400 leading-relaxed">
                  Connect 1-on-1 with campus peers and decide on your favorite canteen or library handover spot.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── Final CTA Banner ─────────────────────────── */}
      <section className="section py-14">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-14 text-center text-white shadow-2xl sm:px-14 border border-blue-400/30">
              {/* Ambient floating blobs */}
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 animate-hero-mesh rounded-full bg-blue-400/25 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 animate-hero-mesh-reverse rounded-full bg-indigo-300/20 blur-3xl" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                  Something on your shelf someone on this campus needs?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                  List it in under two minutes and let it pass on. Textbooks, calculators, cycles, lab gear — if it
                  helped you pass, pass it on to a junior.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                  <Link
                    href="/sell"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white text-blue-700 hover:bg-blue-50 px-7 text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Pass On an Item <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/explore"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-7 text-sm font-bold text-white transition hover:border-white/80 hover:bg-white/20"
                  >
                    Browse the Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
