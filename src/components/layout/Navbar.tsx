'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import {
  PlusCircle,
  Shield,
  ShieldCheck,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Heart,
  Clock,
  ShoppingBag,
  Search,
  GraduationCap,
  LayoutGrid,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, selectedCollege, colleges, setSelectedCollegeId, logout, savedListingIds, theme, toggleTheme } = useApp();
  const { count, setDrawerOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const activeCollegeName = selectedCollege ? `${selectedCollege.short_name} - Delhi` : 'MAIT - Delhi';
  const displayName = currentUser ? currentUser.fullName.split(' ')[0] : 'Guest';
  const displayInitial = currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'P';

  const links = [
    { href: '/explore', label: 'Marketplace' },
    { href: '/categories', label: 'Categories' },
    { href: '/colleges', label: 'Campuses' },
    { href: '/store', label: 'Campus Store' },
    { href: '/team', label: 'Community' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-outline-soft/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-colors">
      <div className="h-20 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand & Hub Pill */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 text-text-main dark:text-white group" aria-label="PassOn home">
            <div className="w-10 h-10 rounded-2xl bg-mint flex items-center justify-center text-white shadow-md shadow-mint/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-[22px] w-[22px]" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-text-main dark:text-white">
              Pass<span className="text-mint">On</span>
            </span>
          </Link>

          {/* Campus Switcher */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                setCollegeDropdownOpen((v) => !v);
                setUserMenuOpen(false);
                setGuestMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lavender-light dark:bg-slate-900 border border-lavender/60 dark:border-slate-700 hover:bg-lavender/40 dark:hover:bg-slate-800 text-lavender-dark dark:text-lavender transition-all"
            >
              <MapPin className="h-4 w-4 text-mint shrink-0" />
              <span className="text-xs font-semibold tracking-wide max-w-[110px] truncate">{activeCollegeName}</span>
              <ChevronDown className={clsx('h-3.5 w-3.5 text-text-muted transition-transform', collegeDropdownOpen && 'rotate-180')} />
            </button>

            {collegeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCollegeDropdownOpen(false)} />
                <div className="absolute left-0 top-full z-50 mt-2 w-72 animate-pop-in overflow-hidden rounded-2xl border border-outline-soft dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lift">
                  <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Select Your Campus
                  </p>
                  <div className="max-h-72 overflow-y-auto px-2 pb-2">
                    {colleges.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          setSelectedCollegeId(col.id);
                          setCollegeDropdownOpen(false);
                        }}
                        className={clsx(
                          'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition',
                          col.id === selectedCollege?.id
                            ? 'bg-mint-light dark:bg-mint/20 font-bold text-mint-dark dark:text-mint'
                            : 'font-medium text-text-main dark:text-slate-300 hover:bg-surface-muted dark:hover:bg-slate-800'
                        )}
                      >
                        <span className="font-bold">{col.short_name}</span>
                        <span className="text-[11px] text-text-muted">{col.location.split(',')[0]}</span>
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/colleges"
                    onClick={() => setCollegeDropdownOpen(false)}
                    className="block border-t border-outline-soft dark:border-slate-800 py-2.5 text-center text-xs font-bold text-mint hover:bg-mint-light/50 dark:hover:bg-slate-800 transition"
                  >
                    All 11 Campuses Directory →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-text-muted dark:text-slate-400">
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'relative py-1 transition-colors hover:text-text-main dark:hover:text-white',
                  active &&
                    'text-text-main dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-mint after:rounded-full'
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Search button */}
          <button
            type="button"
            onClick={() => router.push('/explore')}
            aria-label="Search marketplace"
            className="w-10 h-10 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-surface-muted dark:hover:bg-slate-800 text-text-muted hover:text-text-main dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Saved Wishlist */}
          <Link
            href="/dashboard/saved"
            aria-label="Saved items"
            className="relative w-10 h-10 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-surface-muted dark:hover:bg-slate-800 text-text-muted hover:text-text-main dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            <Heart className="h-[18px] w-[18px]" />
            {savedListingIds.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-mint text-white text-[10px] font-bold flex items-center justify-center">
                {savedListingIds.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Cart, ${count} items`}
            className="relative w-10 h-10 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-surface-muted dark:hover:bg-slate-800 text-text-muted hover:text-text-main dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-mint text-white text-[10px] font-bold flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-10 h-10 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-surface-muted dark:hover:bg-slate-800 text-text-muted hover:text-text-main dark:hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] text-amber-400" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-lavender-dark" />
            )}
          </button>

          {/* Pass an Item CTA */}
          <Link
            href="/sell"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-mint hover:bg-mint-dark text-white font-semibold text-xs tracking-wide shadow-lg shadow-mint/25 hover:shadow-mint/40 hover:-translate-y-0.5 transition-all"
          >
            <PlusCircle className="h-[17px] w-[17px]" />
            <span>Pass an Item</span>
          </Link>

          {/* User menu or Guest Account */}
          {currentUser ? (
            <div className="relative pl-1">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen((v) => !v);
                  setCollegeDropdownOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 py-1 pl-1 pr-2.5 hover:border-mint/60 transition shadow-sm"
              >
                <span className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center border border-lavender-dark/20 text-lavender-dark font-bold text-xs">
                  {displayInitial}
                </span>
                <span className="hidden xl:inline-block max-w-[80px] truncate text-xs font-semibold text-text-main dark:text-white">
                  {displayName}
                </span>
                <ChevronDown className={clsx('h-3.5 w-3.5 text-text-muted transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-pop-in overflow-hidden rounded-2xl border border-outline-soft dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lift">
                    <div className="border-b border-outline-soft dark:border-slate-800 bg-surface-muted/60 dark:bg-slate-800/50 px-4 py-3">
                      <p className="truncate text-sm font-bold text-text-main dark:text-white">
                        {currentUser.fullName}
                      </p>
                      <p className="truncate text-[11px] text-text-muted">{currentUser.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        {currentUser.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-lavender px-2 py-0.5 text-[10px] font-bold text-lavender-dark">
                            <Shield className="h-3 w-3" /> Campus Admin
                          </span>
                        ) : currentUser.verificationStatus === 'approved' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-mint-light px-2 py-0.5 text-[10px] font-bold text-mint-dark">
                            <ShieldCheck className="h-3 w-3 text-mint" /> Verified Student
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
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
                      {currentUser.role === 'admin' && (
                        <MenuLink href="/admin" icon={Settings} label="Admin Portal" onClick={() => setUserMenuOpen(false)} />
                      )}
                      <MenuLink href="/profile" icon={User} label="Profile & Verification" onClick={() => setUserMenuOpen(false)} />
                    </div>

                    <div className="border-t border-outline-soft dark:border-slate-800 p-2">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative pl-1">
              <button
                type="button"
                onClick={() => {
                  setGuestMenuOpen((v) => !v);
                  setUserMenuOpen(false);
                  setCollegeDropdownOpen(false);
                }}
                aria-label="Account menu"
                className="w-10 h-10 rounded-full bg-lavender hover:bg-lavender/80 flex items-center justify-center border border-lavender-dark/20 text-lavender-dark font-bold transition shadow-sm"
              >
                <User className="h-[18px] w-[18px]" />
              </button>

              {guestMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setGuestMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 animate-pop-in overflow-hidden rounded-2xl border border-outline-soft dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lift p-2 space-y-1">
                    <Link
                      href="/auth/sign-in"
                      onClick={() => setGuestMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-text-main dark:text-slate-200 hover:bg-surface-muted dark:hover:bg-slate-800 transition"
                    >
                      <LogIn className="h-4 w-4 text-text-muted" />
                      Login
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      onClick={() => setGuestMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl bg-mint hover:bg-mint-dark text-white px-3.5 py-2.5 text-xs font-bold shadow-sm transition"
                    >
                      <UserPlus className="h-4 w-4" />
                      Create account
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="grid h-10 w-10 place-items-center rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 text-text-muted"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-lavender-dark" />}
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 text-text-muted"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4.5 min-w-[18px] place-items-center rounded-full bg-mint px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-full border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 text-text-main dark:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-outline-soft dark:border-slate-800 bg-white dark:bg-slate-950 lg:hidden animate-fade-in">
          <div className="max-w-[1320px] mx-auto px-4 py-4 grid grid-cols-2 gap-2.5">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'rounded-2xl border px-3 py-3 text-center text-xs font-bold transition',
                  isActive(href)
                    ? 'border-mint/40 bg-mint-light text-mint-dark dark:bg-mint/20 dark:text-mint'
                    : 'border-outline-soft dark:border-slate-800 bg-surface-muted/60 dark:bg-slate-900 text-text-main dark:text-slate-200'
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-mint hover:bg-mint-dark px-3 py-3 text-sm font-bold text-white shadow-md shadow-mint/20"
            >
              <PlusCircle className="h-4 w-4" /> Pass an Item
            </Link>
          </div>

          <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between gap-2 border-t border-outline-soft dark:border-slate-800 py-3.5">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender text-xs font-extrabold text-lavender-dark">
                    {displayInitial}
                  </span>
                  <span className="text-xs font-bold text-text-main dark:text-white truncate">{currentUser.fullName}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-outline-soft dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-text-main dark:text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-600"
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
                  className="flex-1 rounded-2xl border border-outline-soft dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 text-center text-xs font-bold text-text-main dark:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-2xl bg-mint hover:bg-mint-dark text-white py-2.5 text-center text-xs font-bold shadow-sm transition"
                >
                  Create account
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
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-text-main dark:text-slate-200 transition hover:bg-surface-muted dark:hover:bg-slate-800"
    >
      <Icon className="h-4 w-4 text-text-muted" />
      {label}
    </Link>
  );
}
