'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Wrench,
  Laptop,
  Home,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  MapPin,
  Store as StoreIcon,
  Tag,
  Truck,
  CheckCircle2,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { HeroSlider, type HeroSlide } from '@/components/home/HeroSlider';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/Common';
import { STORE_CATEGORIES, formatINR } from '@/lib/data/store';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  academic: BookOpen,
  'lab-equipment': Wrench,
  electronics: Laptop,
  'hostel-essentials': Home,
};

/* Campus photos — the owner-supplied set in /public/colleges */
const HERO_SLIDE_CONFIG: Array<{ id: string; image: string }> = [
  { id: 'mait', image: '/colleges/MAIT.jpeg' },
  { id: 'msit', image: '/colleges/MSIT.jpeg' },
  { id: 'bvcoe', image: '/colleges/BVCOE.jpeg' },
  { id: 'bpit', image: '/colleges/BPIT.jpeg' },
  { id: 'gtbit', image: '/colleges/GTBIT.jpeg' },
  { id: 'adgitm', image: '/colleges/ADGITM.jpeg' },
  { id: 'vips-tc', image: '/colleges/VIPS.jpeg' },
  { id: 'hmr', image: '/colleges/HMR.jpeg' },
  { id: 'usar', image: '/colleges/USAR.jpeg' },
  { id: 'usict', image: '/colleges/USICT.jpeg' },
];

export default function HomePage() {
  const {
    listings,
    colleges,
    categories,
    currentUser,
  } = useApp();

  const heroSlides: HeroSlide[] = useMemo(
    () =>
      HERO_SLIDE_CONFIG.map(({ id, image }) => {
        const c = colleges.find((x) => x.id === id);
        if (!c) return null;
        return {
          id: c.id,
          slug: c.slug,
          name: c.name,
          shortName: c.short_name,
          location: c.location,
          category: c.category,
          description: c.description || '',
          establishedYear: c.establishedYear,
          image,
        };
      }).filter(Boolean) as HeroSlide[],
    [colleges]
  );

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

  const storeCategories = STORE_CATEGORIES.slice(0, 4);
  const catRailRef = useRef<HTMLDivElement>(null);
  const scrollCats = (dir: 1 | -1) =>
    catRailRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  /* Marquee names — every college on the network, doubled for a seamless loop */
  const marqueeNames = useMemo(
    () => [...colleges.map((c) => ({ short: c.short_name, name: c.name })), ...colleges.map((c) => ({ short: c.short_name, name: c.name }))],
    [colleges]
  );

  return (
    <div>
      {/* ───────────────────────────── Hero ───────────────────────────── */}
      <HeroSlider slides={heroSlides} />

      {/* ─────────────── College name marquee (all campuses) ───────────── */}
      <Reveal>
        <section aria-label="Colleges on the Pass ON network" className="border-b border-ink-200 bg-white py-5">
          <div className="marquee-mask overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
              {marqueeNames.map((c, i) => (
                <span key={`${c.short}-${i}`} className="flex items-center gap-10">
                  <span className="flex items-baseline gap-2.5">
                    <span className="font-display text-sm font-extrabold tracking-wide text-ink-950">{c.short}</span>
                    <span className="hidden text-[11px] font-medium text-ink-400 md:inline">{c.name}</span>
                  </span>
                  <span className="h-1 w-1 rounded-full bg-brand-600" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─────────────── Campus categories — sliding icon rail ──────────── */}
      <section className="section pt-10 sm:pt-14">
        <div className="container-x">
          <Reveal>
            <SectionHeader
              eyebrow="Campus Marketplace"
              title="Browse Campus Categories"
              description="Everything changes hands here — from first-year textbooks to final-year calculators, lab gear and hostel essentials."
              actionHref="/categories"
              actionLabel="All Categories"
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="relative">
              {/* Rail */}
              <div
                ref={catRailRef}
                className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 pt-1 sm:mx-0 sm:px-0"
              >
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
                  const count = activeListings.filter((l) => l.categoryId === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/explore?category=${cat.id}`}
                      className="card-3d glass-card group flex shrink-0 snap-start items-center gap-3 rounded-full py-2.5 pl-3 pr-6 hover:border-brand-200"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full neu-inset text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-none">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="whitespace-nowrap text-xs font-extrabold text-ink-950 transition group-hover:text-brand-700">
                          {cat.name}
                        </span>
                        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-ink-400">
                          {count} item{count === 1 ? '' : 's'}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Rail arrows */}
              <button
                onClick={() => scrollCats(-1)}
                aria-label="Scroll categories left"
                className="absolute -left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-ink-700 shadow-lift backdrop-blur transition hover:bg-brand-600 hover:text-white sm:grid"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollCats(1)}
                aria-label="Scroll categories right"
                className="absolute -right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-ink-700 shadow-lift backdrop-blur transition hover:bg-brand-600 hover:text-white sm:grid"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────── Students' products — live listings ────────────── */}
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {studentListings.map((item, idx) => (
                <Reveal key={item.id} delay={Math.min(idx, 5) * 80}>
                  <ListingCard listing={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-ink-200 bg-white p-10 text-center shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                <p className="font-display text-base font-extrabold text-ink-950">
                  The first student item is about to land.
                </p>
                <Link
                  href="/sell"
                  className="inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-xs font-bold text-white transition hover:bg-brand-700"
                >
                  Post an Item
                </Link>
              </div>
            </Reveal>
          )}

          {/* Store promo band */}
          <Reveal delay={120}>
            <div className="card-3d mt-12 overflow-hidden rounded-3xl bg-ink-950 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-64 lg:min-h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/store/store-banner.jpg"
                    alt="Pass ON store — everyday student essentials"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink-950/20 to-ink-950 lg:bg-gradient-to-r lg:from-transparent lg:to-ink-950" />
                  <div className="absolute inset-0 bg-ink-950/40 lg:bg-transparent" />
                </div>
                <div className="p-8 sm:p-12">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-400">Our Store</p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Essentials you can buy — not just pass on.
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-300">
                    New laptops, audio gear, stationery bundles, official Pass ON merch and room upgrades — sourced
                    fresh, quality-checked and priced for student budgets.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-ink-300">
                    {[
                      { icon: Truck, text: 'Free campus delivery over ' + formatINR(999) },
                      { icon: Tag, text: 'Student pricing with instant MRP savings' },
                      { icon: CheckCircle2, text: 'Every order quality-checked before handover' },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0 text-brand-400" />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {storeCategories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/store?category=${c.id}`}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 transition hover:border-brand-500 hover:bg-brand-600 hover:text-white"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/store"
                    className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-500"
                  >
                    <StoreIcon className="h-4 w-4" /> Shop the Store
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── How it works ───────────────────────── */}
      <section className="border-y border-ink-200 bg-white section">
        <div className="container-x">
          <Reveal>
            <SectionHeader
              eyebrow="How Pass ON works"
              title="From one student's shelf to another — in three steps"
              align="center"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                step: '01',
                title: 'Verify with your enrollment ID',
                text: 'Register with your college email and enrollment number. Every seller is manually checked.',
              },
              {
                icon: Sparkles,
                step: '02',
                title: 'List, browse or give away',
                text: `Sell, borrow, exchange or donate — ${freeCount} free giveaway${freeCount === 1 ? '' : 's'} live right now. Filter by your own campus to find items next door.`,
              },
              {
                icon: MessageCircle,
                step: '03',
                title: 'Meet & hand it over',
                text: 'Chat directly with the seller over WhatsApp, meet at a safe campus spot, pay nothing in fees. Done.',
              },
            ].map((s, idx) => (
              <Reveal key={s.step} delay={idx * 110}>
                <div className="card-3d relative rounded-2xl border border-ink-200 bg-[#f7f7f8] p-6">
                  <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-ink-100 select-none">
                    {s.step}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                    <s.icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-extrabold text-ink-950">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {!currentUser && (
            <Reveal delay={200}>
              <div className="mt-8 text-center">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-950 px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink-800"
                >
                  Get verified in minutes <ArrowRight className="h-4 w-4 text-brand-400" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ───────────────────────────── Final CTA ─────────────────────────── */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-14 text-center text-white shadow-lift sm:px-14">
              {/* Ambient floating blobs */}
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 animate-float-slow rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 animate-float-slower rounded-full bg-ink-950/20 blur-3xl" />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 40%)',
                }}
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Something on your shelf someone on this campus needs?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                  List it in under two minutes and let it pass on. Textbooks, calculators, cycles, microwaves — if it
                  has owner's manual, it has a next owner.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/sell"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-brand-700 shadow-lift transition hover:-translate-y-0.5 hover:bg-ink-100"
                  >
                    Pass On an Item <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/explore"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-bold text-white transition hover:border-white/70 hover:bg-white/10"
                  >
                    Browse the Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Small stat strip */}
          <Reveal delay={140}>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: PackageSearch, label: 'Student items listed', value: activeListings.length },
                { icon: MapPin, label: 'Campuses on the network', value: colleges.length },
                { icon: Sparkles, label: 'Free giveaways live', value: freeCount },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-3d flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-950 text-brand-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="block font-display text-2xl font-extrabold leading-none text-ink-950">
                      {value}
                    </span>
                    <span className="mt-1 block text-[11px] font-extrabold uppercase tracking-widest text-ink-400">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
