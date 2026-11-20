'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Wrench,
  Laptop,
  Home,
  Bike,
  Palette,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Tag,
  Building2,
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

export default function HomePage() {
  const { listings, colleges, currentUser } = useApp();

  const activeListings = useMemo(() => listings.filter((l) => l.status === 'active'), [listings]);

  /* Student products — the newest items posted by real students on Pass ON */
  const studentListings = useMemo(
    () =>
      [...activeListings]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 10),
    [activeListings]
  );

  const freeCount = useMemo(
    () => activeListings.filter((l) => l.listingType === 'free').length,
    [activeListings]
  );

  /* Marquee names — every college on the network, doubled for a seamless loop */
  const marqueeNames = useMemo(
    () => [
      ...colleges.map((c) => ({ short: c.short_name, name: c.name })),
      ...colleges.map((c) => ({ short: c.short_name, name: c.name })),
    ],
    [colleges]
  );

  return (
    <div className="bg-[#FFF8F0] dark:bg-[#080f12] bg-notebook-grid min-h-screen text-ink-950 dark:text-slate-100 transition-colors duration-300">
      {/* ───────────────────────────── Hero: Elevated & Framed Showcase Stage ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#D4EEE7] via-[#E6F5F1] to-[#FFF8F0] dark:from-[#0d1d24] dark:via-[#0a161b] dark:to-[#080f12] pt-20 pb-20 sm:pt-28 sm:pb-24 border-b-2 border-teal-200/80 dark:border-teal-900/60 shadow-[0_16px_40px_-20px_rgba(15,118,110,0.15)] transition-colors">
        {/* Subtle notebook grid inside hero for texture */}
        <div className="pointer-events-none absolute inset-0 bg-notebook-grid opacity-60" />

        {/* Animated ambient mesh lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-teal-300/35 dark:bg-teal-500/15 blur-3xl animate-hero-mesh" />
        <div className="pointer-events-none absolute -right-20 top-12 h-96 w-96 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl animate-hero-mesh-reverse" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-white/40 dark:bg-teal-900/10 blur-3xl" />

        <div className="container-x relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Headline — Zero red color, elegant Teal to Emerald gradient */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink-950 dark:text-white leading-[1.06]">
              Pass It On.{' '}
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 dark:from-teal-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Save More.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-ink-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Seniors&apos; textbooks, gadgets and hostel essentials find their next owner — verified, free to use and zero commission.
            </p>

            {/* 3 CTAs — Clean Neumorphic & Glassmorphic Pill Buttons */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/explore"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-teal-700 dark:bg-teal-600 px-7 text-sm font-bold text-white shadow-md transition hover:bg-teal-800 dark:hover:bg-teal-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Campus Items
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-600 dark:bg-emerald-500 px-7 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Pass On an Item
              </Link>
              <Link
                href="/store"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/90 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 px-7 text-sm font-bold text-ink-800 dark:text-slate-100 shadow-sm backdrop-blur-md transition hover:border-teal-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5"
              >
                Shop Our Store
              </Link>
            </div>

            {/* 3 Perks — Zero Red Colors */}
            <div className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 text-xs sm:text-sm font-bold text-ink-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/80 dark:border-slate-700 shadow-xs">
                <ShieldCheck className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
                Verified enrollment IDs
              </span>
              <span className="inline-flex items-center gap-2 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/80 dark:border-slate-700 shadow-xs">
                <Tag className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                Zero fees, zero commission
              </span>
              <span className="inline-flex items-center gap-2 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/80 dark:border-slate-700 shadow-xs">
                <MessageCircle className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
                WhatsApp handovers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── College name marquee (all campuses) ───────────── */}
      <Reveal>
        <section aria-label="Colleges on the Pass ON network" className="border-b border-cream-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 py-4 backdrop-blur-sm transition-colors">
          <div className="marquee-mask overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
              {marqueeNames.map((c, i) => (
                <span key={`${c.short}-${i}`} className="flex items-center gap-10">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-xs font-black tracking-wider text-teal-900 dark:text-teal-300">{c.short}</span>
                    <span className="hidden text-[11px] font-medium text-ink-400 dark:text-slate-400 md:inline">{c.name}</span>
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─────────────── 3D College Cards Slider (Smooth Mouse/Touch Drag) ───────────── */}
      <Reveal>
        <CollegeSlider colleges={colleges} />
      </Reveal>

      {/* ─────────────── Explore Categories (Glassmorphic + Neumorphic) ──────────── */}
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
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition underline underline-offset-4"
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
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100/80 dark:border-teal-800/60 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200 mb-3 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-ink-950 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
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

      {/* ─────────────── Students' products — live listings (Wider Grid, Less Gap) ────────────── */}
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

          {studentListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
              {studentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-neu p-12 text-center">
              <p className="text-sm font-semibold text-ink-500 dark:text-slate-400">
                No items posted yet today. Be the first senior to pass something on!
              </p>
              <Link
                href="/sell"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 text-xs font-bold shadow-md transition"
              >
                Pass On an Item
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────────── Safety & Community ───────────────────────────── */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Reveal delay={0}>
              <div className="rounded-2xl glass-neu p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 mb-3 border border-teal-100 dark:border-teal-800">
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
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 mb-3 border border-teal-100 dark:border-teal-800">
                  <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-display text-base font-extrabold text-ink-950 dark:text-slate-100">Zero Fees, Zero Commission</h3>
                <p className="mt-1 text-xs text-ink-500 dark:text-slate-400 leading-relaxed">
                  Every rupee goes straight to the student. Pass ON charges no listing fees, buyer cuts, or middleman fees.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-2xl glass-neu p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 mb-3 border border-teal-100 dark:border-teal-800">
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

      {/* ───────────────────────────── Final CTA ─────────────────────────── */}
      <section className="section py-14">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 dark:from-teal-950 dark:via-teal-900 dark:to-slate-950 px-6 py-14 text-center text-white shadow-2xl sm:px-14 border border-teal-600/30">
              {/* Ambient floating blobs */}
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 animate-hero-mesh rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 animate-hero-mesh-reverse rounded-full bg-teal-300/15 blur-3xl" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                  Something on your shelf someone on this campus needs?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                  List it in under two minutes and let it pass on. Textbooks, calculators, cycles, lab gear — if it
                  helped you pass, pass it on to a junior.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/sell"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-500"
                  >
                    Pass On an Item <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/explore"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-7 text-sm font-bold text-white transition hover:border-white/80 hover:bg-white/10"
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
