'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="bg-white dark:bg-[#020617] bg-notebook-grid min-h-screen text-ink-950 dark:text-slate-100 transition-colors duration-300">
      {/* ───────────────────────────── Hero: Centered Stage with Background Illustration ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-slate-900/90 dark:via-slate-950 dark:to-[#020617] pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40 min-h-[580px] lg:min-h-[660px] flex items-center border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        {/* Subtle notebook grid inside hero for texture */}
        <div className="pointer-events-none absolute inset-0 bg-notebook-grid opacity-50" />

        {/* Ambient mesh lighting blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-300/20 dark:bg-blue-600/15 blur-3xl animate-hero-mesh" />
        <div className="pointer-events-none absolute right-0 top-12 h-96 w-96 rounded-full bg-indigo-300/20 dark:bg-indigo-600/15 blur-3xl animate-hero-mesh-reverse" />

        {/* Full-width Background Illustration (100% Edge-to-edge, zero space left and right) */}
        <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0">
          <Image
            src="/hero-exchange.png"
            alt="Campus exchange background"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center opacity-30 dark:opacity-15 select-none"
          />
          {/* Subtle gradient wash over background image to keep typography ultra-crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90 dark:from-[#020617]/85 dark:via-[#020617]/70 dark:to-[#020617]" />
        </div>

        {/* Centered Hero Content */}
        <div className="container-x relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-7">
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-950 dark:text-white leading-[1.08]">
              Pass It On.{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Save More.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
              Seniors&apos; textbooks, gadgets and hostel essentials find their next owner — verified, free to use and zero commission.
            </p>

            {/* Search Bar (Centered) */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700 p-2 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12),0_2px_6px_rgba(15,23,42,0.06)] hover:border-blue-400 transition-all group max-w-2xl mx-auto backdrop-blur-sm"
            >
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, notes, lab gear, calculators..."
                className="w-full bg-transparent px-3 py-2 text-sm text-ink-950 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-lg active:scale-95"
              >
                Search Items
              </button>
            </form>

            {/* 3 Action CTAs (Centered) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                href="/explore"
                className="group inline-flex h-11 sm:h-12 items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Campus Items
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-full bg-white/95 hover:bg-slate-50 text-slate-800 dark:bg-slate-800/95 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-6 sm:px-7 text-xs sm:text-sm font-bold shadow-sm transition hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Pass On an Item
              </Link>
              <Link
                href="/store"
                className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-full bg-white/95 hover:bg-slate-50 text-slate-800 dark:bg-slate-800/95 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-6 sm:px-7 text-xs sm:text-sm font-bold shadow-sm transition hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Shop Our Store
              </Link>
            </div>

            {/* 3 Perks (Centered) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Verified enrollment IDs
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Zero fees, zero commission
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                WhatsApp handovers
              </span>
            </div>
          </div>
        </div>
      </section>

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
