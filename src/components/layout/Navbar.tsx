'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import {
  PlusCircle,
  Shield,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  Heart,
  Clock,
  ShoppingBag,
  Store,
  Compass,
  LayoutGrid,
  Landmark,
  Users,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, selectedCollege, colleges, setSelectedCollegeId, logout, savedListingIds, theme, toggleTheme } = useApp();
  const { count, setDrawerOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const activeCollegeName = selectedCollege ? selectedCollege.short_name : 'MAIT';
  const displayName = currentUser ? currentUser.fullName.split(' ')[0] : 'Guest';
  const displayInitial = currentUser?.fullName ? currentUser.fullName.charAt(0) : 'P';

  const links = [
    { href: '/explore', label: 'Marketplace', icon: Compass },
    { href: '/categories', label: 'Categories', icon: LayoutGrid },
    { href: '/colleges', label: 'Colleges', icon: Landmark },
    { href: '/store', label: 'Our Store', icon: Store },
    { href: '/team', label: 'Our Team', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80 border-b border-ink-200/70 dark:border-slate-800 shadow-header transition-colors">
      {/* Brand strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-500" />

      <div className="container-x h-16 flex items-center justify-between gap-3">
        {/* Brand + college switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Pass ON home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white shadow-chip transition group-hover:bg-teal-700">
              <Landmark className="h-4.5 w-4.5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-ink-950">
              Pass <span className="text-teal-600">ON</span>
            </span>
          </Link>

          {/* College switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setCollegeDropdownOpen((v) => !v);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 py-1.5 pl-3 pr-2.5 text-xs font-bold text-ink-800 transition hover:border-ink-300 hover:bg-white"
            >
              <Building2 className="h-3.5 w-3.5 text-brand-600" />
              <span className="max-w-[80px] truncate">{activeCollegeName}</span>
              <ChevronDown className={clsx('h-3.5 w-3.5 text-ink-500 transition', collegeDropdownOpen && 'rotate-180')} />
            </button>

            {collegeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCollegeDropdownOpen(false)} />
                <div className="absolute left-0 top-full z-50 mt-2 w-72 animate-pop-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift">
                  <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-ink-400">
                    My Campus
                  </p>
                  <div className="max-h-72 overflow-y-auto px-2 pb-2">
                    {colleges.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => {
                          setSelectedCollegeId(col.id);
                          setCollegeDropdownOpen(false);
                        }}
                        className={clsx(
                          'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition',
                          col.id === selectedCollege?.id
                            ? 'bg-teal-50 font-bold text-teal-800'
                            : 'font-medium text-ink-700 hover:bg-cream-100'
                        )}
                      >
                        <span className="font-bold">{col.short_name}</span>
                        <span className="text-[11px] text-ink-400">{col.location.split(',')[0]}</span>
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/colleges"
                    onClick={() => setCollegeDropdownOpen(false)}
                    className="block border-t border-ink-100 py-2.5 text-center text-xs font-bold text-teal-700 transition hover:bg-teal-50"
                  >
                    All Colleges Directory →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition',
                isActive(href) ? 'bg-teal-50 text-teal-800 font-bold' : 'text-ink-600 hover:bg-cream-100 hover:text-ink-950'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Saved */}
          <Link
            href="/dashboard/saved"
            aria-label="Saved items"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-cream-300 bg-white text-ink-600 transition hover:border-teal-500 hover:text-teal-600"
          >
            <Heart className="h-[18px] w-[18px]" />
            {savedListingIds.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {savedListingIds.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={`Cart, ${count} items`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-cream-300 bg-white text-ink-600 transition hover:border-teal-500 hover:text-teal-600"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Theme Toggle Mode */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="grid h-10 w-10 place-items-center rounded-full border border-cream-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink-600 dark:text-slate-200 transition hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-teal-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Sell CTA */}
          <Link
            href="/sell"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-teal-600 px-4 text-[13px] font-bold text-white shadow-chip transition hover:bg-teal-700 active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            Sell an Item
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen((v) => !v);
                setCollegeDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-full border border-cream-300 bg-white py-1 pl-1 pr-2.5 transition hover:border-teal-400"
            >
              <span
                className={clsx(
                  'grid h-7 w-7 place-items-center rounded-full text-[11px] font-extrabold text-white',
                  currentUser?.role === 'admin' ? 'bg-teal-800' : 'bg-teal-600'
                )}
              >
                {displayInitial}
              </span>
              <span className="max-w-[72px] truncate text-xs font-bold text-ink-900">{displayName}</span>
              <ChevronDown className={clsx('h-3.5 w-3.5 text-ink-400 transition', userMenuOpen && 'rotate-180')} />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-pop-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift">
                  <div className="border-b border-ink-100 bg-ink-50/60 px-4 py-3">
                    <p className="truncate text-sm font-bold text-ink-950">
                      {currentUser ? currentUser.fullName : 'Pass ON Guest'}
                    </p>
                    <p className="truncate text-[11px] text-ink-500">{currentUser ? currentUser.email : 'Sign in to get started'}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      {currentUser?.role === 'admin' || !currentUser ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-ink-800 bg-ink-950 px-2 py-0.5 text-[10px] font-bold text-white">
                          <Shield className="h-3 w-3" /> Campus Admin
                        </span>
                      ) : currentUser.verificationStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <ShieldCheck className="h-3 w-3" /> Verified Student
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          <Clock className="h-3 w-3" /> Pending Approval
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 text-sm">
                    <MenuLink href="/dashboard" icon={LayoutGrid} label="Dashboard" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/dashboard/listings" icon={PlusCircle} label="My Listings" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/dashboard/saved" icon={Heart} label="Saved Items" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/cart" icon={ShoppingBag} label="Cart & Orders" onClick={() => setUserMenuOpen(false)} />
                    {currentUser?.role === 'admin' && (
                      <MenuLink href="/admin" icon={Settings} label="Admin Portal" onClick={() => setUserMenuOpen(false)} />
                    )}
                    <MenuLink href="/profile" icon={User} label="Profile & Verification" onClick={() => setUserMenuOpen(false)} />
                  </div>

                  <div className="border-t border-ink-100 p-2">
                    {currentUser ? (
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/auth/sign-in"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                      >
                        <User className="h-4 w-4" /> Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden sm:hidden">
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink-700 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-teal-700" />}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-ink-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink-700 dark:text-slate-200"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-ink-200 bg-white lg:hidden animate-fade-in">
          <div className="container-x grid grid-cols-2 gap-2 py-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'rounded-xl border px-3 py-3 text-center text-[13px] font-bold transition',
                  isActive(href) ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-ink-200 bg-ink-50 text-ink-800'
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-3 text-sm font-bold text-white"
            >
              <PlusCircle className="h-4 w-4" /> Sell an Item
            </Link>
          </div>

          <div className="container-x flex items-center justify-between border-t border-ink-100 py-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
                    {displayInitial}
                  </span>
                  <span className="text-xs font-bold text-ink-900">{currentUser.fullName}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-800"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl border border-ink-300 bg-white py-2.5 text-center text-xs font-bold text-ink-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-xs font-bold text-white"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

function MenuLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-ink-700 transition hover:bg-ink-50 hover:text-ink-950"
    >
      <Icon className="h-4 w-4 text-ink-400" />
      {label}
    </Link>
  );
}
