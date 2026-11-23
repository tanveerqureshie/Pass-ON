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
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/60 via-indigo-50/40 via-purple-50/30 to-white dark:from-slate-950 dark:via-[#030712] dark:to-[#020617] animate-gradient-mesh-flow px-0 pt-14 pb-16 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 min-h-[560px] lg:min-h-[640px] flex items-center border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        {/* Subtle notebook grid inside hero for texture */}
        <div className="pointer-events-none absolute inset-0 bg-notebook-grid opacity-60" />

        {/* Ambient Animated Flowing Mesh Gradient Lighting Orbs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-transparent blur-3xl animate-mesh-orb-1" />
        <div className="pointer-events-none absolute -right-20 top-10 h-[440px] w-[440px] sm:h-[520px] sm:w-[520px] rounded-full bg-gradient-to-bl from-indigo-500/25 via-purple-500/20 to-transparent blur-3xl animate-mesh-orb-2" />
        <div className="pointer-events-none absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-gradient-to-t from-cyan-400/20 via-blue-400/15 to-transparent blur-3xl animate-mesh-orb-3" />

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
          {/* Subtle gradient wash over background image to keep typography ultra-crisp while letting the grid shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/70 dark:from-[#020617]/50 dark:via-[#020617]/30 dark:to-[#020617]/80" />
        </div>

        {/* Centered Hero Content */}
        <div className="container-x relative z-10 w-full">
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Live Campus Badge with Staged Reveal */}
            <div className="reveal-badge inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-oily border-oily text-[11px] sm:text-xs md:text-sm font-extrabold text-blue-700 dark:text-cyan-300 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500"></span>
              </span>
              <span>Delhi&apos;s Verified Student Marketplace</span>
              <span className="hidden xs:inline text-slate-400 dark:text-slate-500">•</span>
              <span className="hidden xs:inline text-slate-600 dark:text-slate-300">11 Campuses Live</span>
            </div>

            {/* Headline with Award-Winning Kinetic Word Reveal & Iridescent Flowing Gradient */}
            <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight text-ink-950 dark:text-white leading-[1.08] sm:leading-[1.04]">
              <span className="inline-block overflow-hidden pb-1">
                <span className="reveal-word reveal-word-1 mr-2 sm:mr-3.5">Pass</span>
                <span className="reveal-word reveal-word-2 mr-2 sm:mr-3.5">It</span>
                <span className="reveal-word reveal-word-3 mr-2 sm:mr-3.5">On.</span>
              </span>{' '}
              <span className="inline-block overflow-hidden pb-1">
                <span className="reveal-word reveal-word-4 mr-2 sm:mr-3.5 bg-gradient-to-r from-blue-600 via-indigo-500 via-purple-500 to-cyan-400 dark:from-blue-400 dark:via-indigo-300 dark:via-purple-300 dark:to-cyan-300 bg-clip-text text-transparent animate-gradient-flow-fast drop-shadow-sm font-black">
                  Save
                </span>
                <span className="reveal-word reveal-word-5 bg-gradient-to-r from-blue-600 via-indigo-500 via-purple-500 to-cyan-400 dark:from-blue-400 dark:via-indigo-300 dark:via-purple-300 dark:to-cyan-300 bg-clip-text text-transparent animate-gradient-flow-fast drop-shadow-sm font-black">
                  More.
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto px-2">
              Seniors&apos; textbooks, gadgets and hostel essentials find their next owner — verified, free to use and zero commission.
            </p>

            {/* Search Bar (Centered Glassmorphism with Iridescent Oily Sheen & Neon Aura) */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-full max-w-3xl mx-auto items-center rounded-2xl glass-oily border-oily p-1.5 sm:p-2 shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12)] hover:shadow-[0_16px_40px_-4px_rgba(37,99,235,0.25),0_0_24px_rgba(6,182,212,0.2)] focus-within:shadow-[0_16px_40px_-4px_rgba(37,99,235,0.35),0_0_30px_rgba(59,130,246,0.3)] transition-shadow group"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-400 ml-2.5 sm:ml-3 shrink-0 group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, notes, lab gear, calculators..."
                className="w-full bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base text-ink-950 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 sm:px-7 py-2 sm:py-3 text-xs sm:text-sm font-extrabold shadow-md shadow-blue-500/30 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95"
              >
                Search
              </button>
            </form>

            {/* 3 Action CTAs (Centered with Neon Glow & Glassmorphism) */}
            <div className="flex flex-col w-full sm:w-auto items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 pt-2 sm:flex-row sm:flex-wrap">
              <Link
                href="/explore"
                className="group inline-flex h-11 sm:h-13 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-9 text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/25 transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Campus Items
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-11 sm:h-13 items-center justify-center gap-2 rounded-full glass-oily border-oily hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-slate-800 dark:text-slate-100 px-6 sm:px-8 text-xs sm:text-sm font-extrabold transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Pass On an Item
              </Link>
              <Link
                href="/store"
                className="inline-flex h-11 sm:h-13 items-center justify-center gap-2 rounded-full glass-oily border-oily hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-slate-800 dark:text-slate-100 px-6 sm:px-8 text-xs sm:text-sm font-extrabold transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Shop Our Store
              </Link>
            </div>

            {/* 3 Perks (Centered with Glassmorphism & Iridescent Sheen) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-[11px] sm:text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 glass-oily border-oily px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                Verified enrollment IDs
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 glass-oily border-oily px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm hover:scale-105 transition-transform duration-300">
                <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                Zero fees, zero commission
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 glass-oily border-oily px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm hover:scale-105 transition-transform duration-300">
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                WhatsApp handovers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 3D College Cards Slider (Smooth Drag, Full Width with Aligned Start) ───────────── */}
      <Reveal>
        <CollegeSlider colleges={colleges} />
      </Reveal>

      {/* ─────────────── Explore Categories (Same Container-X Padding & Glassmorphic Oily Cards) ──────────── */}
      <section className="section py-14 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight">
                  Explore Categories
                </h2>
                <p className="mt-2 text-sm sm:text-base lg:text-lg text-ink-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Select a category to browse textbooks, practical instruments, engineering drafters, and hostel gear.
                </p>
              </div>
              <Link
                href="/categories"
                className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition underline underline-offset-4"
              >
                All Categories →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
              {CATEGORY_ITEMS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.id}`}
                    className="group relative flex flex-col items-center text-center p-4 xs:p-5 sm:p-7 rounded-2xl sm:rounded-3xl glass-oily border-oily transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-8px_rgba(37,99,235,0.25),0_0_20px_rgba(59,130,246,0.2)]"
                  >
                    <span className="grid h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-blue-50/90 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-400 border border-blue-100/90 dark:border-blue-900 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-3 sm:mb-4 shadow-sm group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                      <Icon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7" />
                    </span>
                    <span className="text-xs xs:text-sm sm:text-base font-extrabold text-ink-950 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                    <span className="mt-1 sm:mt-2 text-[11px] xs:text-xs sm:text-sm text-ink-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
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

          {/* Filter Tabs Row with Glassmorphism & Neon Active Glow */}
          <Reveal delay={40}>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/50 neon-glow-blue scale-105'
                        : 'glass-oily border-oily text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {studentListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-7">
              {studentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-oily border-oily p-12 text-center">
              <p className="text-sm sm:text-base font-semibold text-ink-500 dark:text-slate-400">
                No items found for this category right now. Be the first to list one!
              </p>
              <Link
                href="/sell"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95"
              >
                Pass On an Item
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────────── Final CTA Banner (Iridescent Liquid Mesh & Neon) ─────────────────────────── */}
      <section className="section py-14 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-700 to-slate-900 bg-[length:200%_200%] animate-gradient-mesh-flow px-6 py-12 sm:px-14 sm:py-18 text-center text-white shadow-[0_25px_60px_-15px_rgba(37,99,235,0.4),0_0_35px_rgba(99,102,241,0.25)] border border-blue-400/40 border-oily">
              {/* Ambient floating blobs */}
              <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 animate-hero-mesh rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-80 w-80 animate-hero-mesh-reverse rounded-full bg-purple-500/25 blur-3xl" />
              <div className="relative max-w-3xl mx-auto space-y-4">
                <h2 className="font-display text-2xl xs:text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white leading-tight">
                  Something on your shelf someone on this campus needs?
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl leading-relaxed text-blue-100">
                  List it in under two minutes and let it pass on. Textbooks, calculators, cycles, lab gear — if it
                  helped you pass, pass it on to a junior.
                </p>
                <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/sell"
                    className="inline-flex h-12 sm:h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white text-blue-700 hover:bg-blue-50 px-8 text-sm sm:text-base font-extrabold shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Pass On an Item <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/explore"
                    className="inline-flex h-12 sm:h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-md px-8 text-sm sm:text-base font-bold text-white transition-all hover:border-white/80 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
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
