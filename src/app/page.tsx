'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Wrench,
  Laptop,
  Bed,
  Bike,
  Compass,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Banknote,
  Search,
  ShoppingBag,
  PlusCircle,
  Store,
  Gift,
  BadgeCheck,
  Recycle,
  ImagePlus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CollegeSlider } from '@/components/home/CollegeSlider';
import { Reveal } from '@/components/ui/Reveal';

const CATEGORY_ITEMS = [
  { id: 'academic', name: 'Academic Materials', icon: BookOpen, desc: 'Textbooks & PYQs', tone: 'mint' as const },
  { id: 'lab-equipment', name: 'Engineering & Lab', icon: Wrench, desc: 'Drafters & Aprons', tone: 'lavender' as const },
  { id: 'electronics', name: 'Electronics & Tech', icon: Laptop, desc: 'Calculators & Screens', tone: 'mint' as const },
  { id: 'hostel-essentials', name: 'Hostel Essentials', icon: Bed, desc: 'Kettles & Lamps', tone: 'lavender' as const },
  { id: 'mobility', name: 'Cycles & Mobility', icon: Bike, desc: 'Bikes & U-Locks', tone: 'mint' as const },
  { id: 'design-arts', name: 'Design Supplies', icon: Compass, desc: 'Drawing Boards & Sets', tone: 'lavender' as const },
];

const FILTER_TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'academic', label: 'Books & Notes' },
  { id: 'lab-equipment', label: 'Engineering & Lab' },
  { id: 'electronics', label: 'Electronics & Tech' },
  { id: 'hostel-essentials', label: 'Hostel Essentials' },
  { id: 'free', label: 'Free Giveaways', isGift: true },
];

export default function HomePage() {
  const router = useRouter();
  const { listings, colleges } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const activeListings = useMemo(() => listings.filter((l) => l.status === 'active'), [listings]);

  const studentListings = useMemo(() => {
    let filtered = [...activeListings];
    if (activeFilter === 'free') {
      filtered = filtered.filter((l) => l.listingType === 'free');
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter((l) => l.categoryId === activeFilter);
    }
    return filtered
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 8);
  }, [activeListings, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="w-full bg-surface-bg dark:bg-[#020617] text-text-main dark:text-slate-100 transition-colors duration-300">
      {/* ───────────────────────────── HERO SECTION ───────────────────────────── */}
      <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 flex flex-col items-center text-center overflow-hidden">
        {/* Soft ambient backdrop glows */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-lavender/50 dark:bg-lavender-dark/15 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-48 left-12 w-[300px] h-[300px] bg-mint/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-48 right-12 w-[320px] h-[320px] bg-lavender/40 dark:bg-lavender-dark/15 rounded-full blur-[110px] pointer-events-none -z-10" />

        {/* Campus Live Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-lavender dark:border-slate-700 shadow-sm mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint"></span>
          </span>
          <span className="text-xs font-semibold text-text-muted dark:text-slate-300">
            11 Verified Delhi NCR Campuses Active
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-text-main dark:text-white tracking-tight max-w-4xl leading-[1.12]">
          Pass It On. <span className="text-mint">Save More.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-text-muted dark:text-slate-400 max-w-2xl mt-5 mb-8 sm:mb-10 leading-relaxed font-normal px-2">
          Seniors’ textbooks, lab instruments, gadgets &amp; hostel essentials find their next owner — zero platform tax,
          zero middlemen, 100% verified campus handovers.
        </p>

        {/* Spacious Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-700 rounded-3xl sm:rounded-full p-2 sm:p-2.5 sm:pl-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:border-mint/50 transition-all mb-7 sm:mb-8"
        >
          <div className="hidden sm:flex items-center gap-2 w-auto">
            <Link
              href="/colleges"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lavender-light dark:bg-slate-800 text-lavender-dark dark:text-lavender text-xs font-bold hover:bg-lavender/50 transition-colors"
            >
              <Compass className="h-4 w-4 text-mint" />
              <span>All Hubs</span>
            </Link>
            <div className="w-px h-6 bg-outline-soft dark:bg-slate-700 mx-1" />
          </div>
          <div className="relative flex-1 w-full flex items-center px-2 sm:px-0">
            <Search className="h-5 w-5 text-text-muted mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search textbooks, notes, lab gear, tech, drafters..."
              className="w-full bg-transparent py-2 sm:py-0 text-text-main dark:text-white placeholder:text-text-muted/70 text-sm font-medium focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-2xl sm:rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-md shadow-mint/25 transition-all hover:scale-[1.02]"
          >
            <span>Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-full bg-mint text-white font-semibold text-xs flex items-center gap-2 shadow-sm hover:bg-mint-dark transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Explore Campus Items</span>
          </Link>
          <Link
            href="/sell"
            className="px-5 py-2.5 rounded-full bg-lavender text-lavender-dark font-semibold text-xs flex items-center gap-2 hover:bg-lavender/80 transition-all border border-lavender-dark/10"
          >
            <PlusCircle className="h-4 w-4 text-mint" />
            <span>Pass On Item</span>
          </Link>
          <Link
            href="/store"
            className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-700 text-text-main dark:text-white hover:bg-surface-muted dark:hover:bg-slate-800 font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Store className="h-4 w-4 text-text-muted" />
            <span>Campus Store</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-8 text-text-muted dark:text-slate-400 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-mint" />
            <span>Verified Student IDs</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-soft hidden sm:block" />
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-mint" />
            <span>Zero Commission Guarantee</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-soft hidden sm:block" />
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-mint" />
            <span>Direct WhatsApp Handover</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── SECTION 1: EXPLORE CATEGORIES ───────────────────────────── */}
      <section id="categories" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-outline-soft/80 dark:border-slate-800">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-lavender-light dark:bg-slate-800 border border-lavender dark:border-slate-700 text-lavender-dark dark:text-lavender text-[11px] font-bold uppercase tracking-wider mb-2">
                Organized By Semester Needs
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main dark:text-white">
                Explore Categories
              </h2>
              <p className="text-text-muted dark:text-slate-400 text-sm sm:text-base mt-2">
                From first-year drafting gear to final-year project monitors and hostel handovers.
              </p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-bold text-mint hover:text-mint-dark flex items-center gap-1 group self-start md:self-auto"
            >
              <span>All Categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              const isMint = cat.tone === 'mint';
              return (
                <Link
                  key={cat.id}
                  href={`/explore?category=${cat.id}`}
                  className="group flex flex-col items-center text-center p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-800 hover:border-mint/60 hover:shadow-xl hover:shadow-mint/5 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3.5 sm:mb-4 group-hover:scale-110 transition-transform ${
                      isMint
                        ? 'bg-mint-light dark:bg-mint/15 text-mint'
                        : 'bg-lavender-light dark:bg-slate-800 text-lavender-dark dark:text-lavender'
                    }`}
                  >
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <span className="font-display text-xs sm:text-sm font-bold text-text-main dark:text-white group-hover:text-mint transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] sm:text-xs text-text-muted dark:text-slate-400 mt-1 font-medium">
                    {cat.desc}
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ───────────────────────────── SECTION 2: LIVE CAMPUS LISTINGS ───────────────────────────── */}
      <section id="listings" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-outline-soft/80 dark:border-slate-800">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-light dark:bg-mint/15 text-mint-dark dark:text-mint text-xs font-bold mb-2">
                <BadgeCheck className="h-4 w-4 text-mint" />
                <span>Straight from Verified Students</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main dark:text-white">
                Live Campus Listings
              </h2>
              <p className="text-text-muted dark:text-slate-400 text-sm sm:text-base mt-2">
                Textbooks, calculators, lab aprons &amp; electronics listed by students across Delhi right now.
              </p>
            </div>
            <Link
              href="/explore"
              className="text-sm font-bold text-mint hover:text-mint-dark flex items-center gap-1 group self-start md:self-auto"
            >
              <span>Explore All Items</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        {/* Filter Chips Bar */}
        <Reveal delay={40}>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
            {FILTER_TABS.map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={
                    active
                      ? 'px-5 py-2.5 rounded-full bg-mint text-white text-xs font-bold shadow-md shadow-mint/20 whitespace-nowrap transition-all flex items-center gap-1.5'
                      : tab.isGift
                      ? 'px-5 py-2.5 rounded-full bg-lavender-light dark:bg-slate-800 border border-lavender dark:border-slate-700 text-lavender-dark dark:text-lavender hover:bg-lavender text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5'
                      : 'px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-700 hover:border-mint text-text-muted dark:text-slate-300 hover:text-text-main dark:hover:text-white text-xs font-semibold whitespace-nowrap transition-all'
                  }
                >
                  {tab.isGift && <Gift className="h-4 w-4 text-mint" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Product Cards Grid: 2-col on mobile, 4-col on desktop */}
        {studentListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
            {studentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-800 p-12 text-center">
            <p className="text-sm sm:text-base font-semibold text-text-muted dark:text-slate-400">
              No items found for this category right now. Be the first to list one!
            </p>
            <Link
              href="/sell"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint hover:bg-mint-dark text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md shadow-mint/25 transition active:scale-95"
            >
              Pass On an Item
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ───────────────────────────── SECTION 3: EXPLORE YOUR CAMPUS (REAL COLLEGE PHOTOS) ───────────────────────────── */}
      <Reveal>
        <CollegeSlider colleges={colleges} />
      </Reveal>

      {/* ───────────────────────────── IMPACT METRICS & TRUST STATS STRIP ───────────────────────────── */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-800 shadow-sm">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-display text-2xl sm:text-4xl font-bold text-mint">₹18.4L+</span>
              <span className="text-xs sm:text-sm font-bold text-text-main dark:text-white mt-1.5">Student Savings</span>
              <span className="text-[11px] sm:text-xs text-text-muted dark:text-slate-400 mt-0.5">Compared to retail stores</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-display text-2xl sm:text-4xl font-bold text-lavender-dark dark:text-lavender">3,420+</span>
              <span className="text-xs sm:text-sm font-bold text-text-main dark:text-white mt-1.5">Verified Peers</span>
              <span className="text-[11px] sm:text-xs text-text-muted dark:text-slate-400 mt-0.5">Active student accounts</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-display text-2xl sm:text-4xl font-bold text-mint">&lt; 15 Mins</span>
              <span className="text-xs sm:text-sm font-bold text-text-main dark:text-white mt-1.5">Handover Time</span>
              <span className="text-[11px] sm:text-xs text-text-muted dark:text-slate-400 mt-0.5">Between campus blocks</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-display text-2xl sm:text-4xl font-bold text-text-main dark:text-white">0%</span>
              <span className="text-xs sm:text-sm font-bold text-text-main dark:text-white mt-1.5">Platform Tax</span>
              <span className="text-[11px] sm:text-xs text-text-muted dark:text-slate-400 mt-0.5">Direct student-to-student</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────────────────────── HIGH-CONVERSION SELLER CTA BANNER ───────────────────────────── */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-mint-light via-white to-lavender-light dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-outline-soft dark:border-slate-700 p-8 sm:p-16 shadow-lg flex flex-col items-center text-center">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-mint/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-lavender/60 dark:bg-lavender-dark/20 blur-3xl pointer-events-none" />

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 text-mint-dark dark:text-mint font-bold text-xs mb-5 shadow-sm border border-mint/20">
              <Recycle className="h-4 w-4 text-mint" />
              <span>Zero Waste Campus Initiative</span>
            </span>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-text-main dark:text-white max-w-2xl leading-tight">
              Something on your shelf someone on this campus needs?
            </h2>

            <p className="text-text-muted dark:text-slate-400 text-sm sm:text-base max-w-xl mt-4 mb-8 leading-relaxed">
              List it in under two minutes and let it pass on. Textbooks, calculators, cycles, lab gear — if it helped you
              clear your sem, pass it on to a junior.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/sell"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-mint text-white font-display font-bold text-sm shadow-xl shadow-mint/30 hover:bg-mint-dark hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <ImagePlus className="h-5 w-5" />
                <span>Pass On an Item</span>
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 hover:bg-surface-muted dark:hover:bg-slate-700 text-text-main dark:text-white font-semibold text-xs border border-outline-soft dark:border-slate-700 flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
