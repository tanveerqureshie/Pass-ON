'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Package,
  CheckCircle,
  MessageCircle,
  Heart,
  PlusCircle,
  Building2,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { currentUser, listings, savedListingIds, inquiries, selectedCollege, isUserVerified } = useApp();

  const userListings = listings.filter((l) => l.ownerId === currentUser?.id);
  const activeCount = userListings.filter((l) => l.status === 'active').length;
  const soldDonatedCount = userListings.filter((l) => l.status === 'sold' || l.status === 'donated').length;
  const incomingInquiries = inquiries.filter((i) => i.receiverId === currentUser?.id);

  return (
    <div className="container-x py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {currentUser?.role === 'admin' ? (
              <Badge tone="amber" size="sm">CAMPUS ADMIN</Badge>
            ) : isUserVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED STUDENT
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700 ring-1 ring-inset ring-amber-200">
                <Clock className="w-3.5 h-3.5" /> PENDING VERIFICATION
              </span>
            )}
            <span className="text-xs font-medium text-ink-500">
              {currentUser?.collegeName} ({currentUser?.branch})
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            Welcome back, {currentUser?.fullName || 'Campus Peer'}!
          </h1>
          <p className="mt-1 max-w-xl text-xs text-ink-500 sm:text-sm">
            Manage your listings, respond to campus inquiries, review saved bookmarks, and track your handovers.
          </p>
        </div>

        <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
          <Button href="/sell" variant="primary" size="md" className="flex-1 md:flex-none">
            <PlusCircle className="w-4 h-4" />
            <span>Pass On New Item</span>
          </Button>
          <Button href={`/college/${selectedCollege?.slug}`} variant="outline" size="md" className="flex-1 md:flex-none">
            <Building2 className="w-4 h-4 text-ink-500" />
            <span>My Campus</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link
          href="/dashboard/listings"
          className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-lift hover:border-ink-300"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Package className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-600" />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Active Listings
          </span>
          <span className="font-display text-3xl font-extrabold text-ink-950">{activeCount}</span>
        </Link>

        <Link
          href="/dashboard/listings"
          className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-lift hover:border-ink-300"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-600" />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Sold or Donated
          </span>
          <span className="font-display text-3xl font-extrabold text-ink-950">{soldDonatedCount}</span>
        </Link>

        <Link
          href="/dashboard/requests"
          className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-lift hover:border-ink-300"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <MessageCircle className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-600" />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Campus Inquiries
          </span>
          <span className="font-display text-3xl font-extrabold text-ink-950">{incomingInquiries.length}</span>
        </Link>

        <Link
          href="/dashboard/saved"
          className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-lift hover:border-ink-300"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Heart className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-600" />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Saved Items
          </span>
          <span className="font-display text-3xl font-extrabold text-ink-950">{savedListingIds.length}</span>
        </Link>
      </div>

      {/* Main Grid: My Listings & Inquiries */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-ink-100 pb-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
              <Package className="h-4.5 w-4.5 text-brand-600" /> My Posted Items
            </h2>
            <Link
              href="/dashboard/listings"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              Manage All ({userListings.length}) →
            </Link>
          </div>

          {userListings.length === 0 ? (
            <div className="space-y-3 py-10 text-center">
              <Package className="mx-auto h-10 w-10 text-ink-300" />
              <p className="text-xs font-medium text-ink-500">
                You haven&apos;t posted any campus listings yet.
              </p>
              <Button href="/sell" variant="dark" size="sm">
                Post Your First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {userListings.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 transition-colors hover:bg-ink-50"
                >
                  <div className="min-w-0 space-y-1">
                    <span className="block truncate text-sm font-bold text-ink-950">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-md bg-brand-600 px-2 py-0.5 font-bold text-white">
                        {item.listingType === 'free' ? 'FREE' : `₹${item.price}`}
                      </span>
                      <span className="font-medium capitalize text-ink-500">{item.status}</span>
                    </div>
                  </div>

                  <Button href={`/item/${item.id}`} variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-ink-100 pb-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
              <MessageCircle className="h-4.5 w-4.5 text-brand-600" /> Recent Inquiries
            </h2>
            <Link
              href="/dashboard/requests"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              View Inquiries Inbox →
            </Link>
          </div>

          {incomingInquiries.length === 0 ? (
            <div className="space-y-2 py-10 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-ink-300" />
              <p className="text-xs font-medium text-ink-500">No incoming inquiries right now.</p>
              <p className="text-[11px] text-ink-400">
                Verified buyers can reach you directly on WhatsApp or Instagram.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {incomingInquiries.slice(0, 3).map((inq) => (
                <div key={inq.id} className="space-y-2 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-600 text-xs font-extrabold text-white">
                      {inq.senderName.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2 text-xs">
                      <span className="truncate font-bold text-ink-950">
                        {inq.senderName} ({inq.senderCollege})
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="rounded-lg border border-ink-100 bg-white px-2.5 py-2 text-xs italic leading-relaxed text-ink-700">
                    &quot;{inq.message}&quot;
                  </p>
                  <div className="text-[11px] text-ink-500">
                    Regarding: <span className="font-semibold text-ink-900">{inq.listingTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
