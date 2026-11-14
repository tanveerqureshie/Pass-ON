'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Common';
import { Heart, ArrowLeft } from 'lucide-react';

export default function SavedListingsPage() {
  const { listings, savedListingIds } = useApp();

  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  return (
    <div className="container-x py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-700">
          <span className="rounded-full bg-brand-50 px-3 py-1">Saved Bookmarks</span>
        </p>
        <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-950">
              Saved Listings ({savedListings.length})
            </h1>
            <p className="mt-1 max-w-xl text-sm text-ink-500">
              Items you have bookmarked for this semester. Contact seniors on WhatsApp before they get passed on.
            </p>
          </div>

          <Button href="/explore" variant="outline" size="md" className="shrink-0">
            Explore More Items
          </Button>
        </div>
      </div>

      {/* Grid of Saved Items */}
      {savedListings.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Saved Items"
          description="You haven't bookmarked any items yet. Click the heart icon on any listing to save it here for later."
          actionHref="/explore"
          actionLabel="Browse Marketplace"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
}
