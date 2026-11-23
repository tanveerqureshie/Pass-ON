'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ListingStatus } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/Common';
import {
  Package,
  PlusCircle,
  Eye,
  Trash2,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

const STATUS_BADGE: Record<ListingStatus, { tone: 'green' | 'red' | 'dark' | 'blue' | 'gray', label: string }> = {
  active: { tone: 'green', label: 'Active' },
  sold: { tone: 'red', label: 'Sold' },
  donated: { tone: 'dark', label: 'Donated' },
  borrowed: { tone: 'blue', label: 'Lent' },
  unavailable: { tone: 'gray', label: 'Unavailable' },
  archived: { tone: 'gray', label: 'Archived' },
};

export default function ManageListingsPage() {
  const { listings, currentUser, updateListingStatus, deleteListing } = useApp();

  const myListings = listings.filter((l) => l.ownerId === currentUser?.id);

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
          <span className="rounded-full bg-brand-50 px-3 py-1">Listing Management</span>
        </p>
        <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-950">
              Manage My Listings ({myListings.length})
            </h1>
            <p className="mt-1 max-w-xl text-sm text-ink-500">
              Update availability status, mark items as sold or donated to juniors, or delete completed listings.
            </p>
          </div>

          <Button href="/sell" variant="primary" size="md" className="shrink-0">
            <PlusCircle className="w-4 h-4" />
            <span>Pass On New Item</span>
          </Button>
        </div>
      </div>

      {/* Listings List */}
      {myListings.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Active Listings"
          description="You haven't created any listings yet. Post your used textbooks, drafters, or calculators to get started!"
          actionHref="/sell"
          actionLabel="Create Listing"
        />
      ) : (
        <div className="space-y-4">
          {myListings.map((item) => {
            const isFree = item.listingType === 'free';
            const badge = STATUS_BADGE[item.status] ?? { tone: 'gray' as const, label: item.status };
            return (
              <div
                key={item.id}
                className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-lift sm:p-6 md:flex-row md:items-center"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-ink-200 bg-ink-50">
                    {item.images && item.images.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-full w-full bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                        No Photo
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={isFree ? 'red' : 'dark'} size="sm">
                        {isFree ? '100% FREE' : `₹${item.price}`}
                      </Badge>

                      <Badge tone={badge.tone} size="sm">
                        Status: {badge.label}
                      </Badge>
                    </div>

                    <Link href={`/item/${item.id}`} className="block">
                      <h3 className="font-display text-base font-extrabold leading-snug text-ink-950 transition-colors hover:text-brand-700">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                      <span>{item.collegeShortName}</span>
                      <span>•</span>
                      <span>{item.department}</span>
                      <span>•</span>
                      <span>Pickup: {item.preferredPickupLocation}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-ink-400">
                        <Eye className="w-3.5 h-3.5" /> {item.viewsCount || 0} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Change Actions */}
                <div className="flex w-full shrink-0 flex-wrap items-center gap-2 border-t border-ink-100 pt-3 md:w-auto md:border-t-0 md:pt-0">
                  <div className="w-full sm:w-56">
                    <Select
                      value={item.status}
                      aria-label="Update listing status"
                      onChange={(e) =>
                        updateListingStatus(item.id, e.target.value as ListingStatus)
                      }
                    >
                      <option value="active">Active (Available)</option>
                      <option value="sold">Mark as Sold (₹)</option>
                      <option value="donated">Mark as Donated (Gifted)</option>
                      <option value="borrowed">Mark as Lent</option>
                      <option value="unavailable">Mark as Unavailable</option>
                    </Select>
                  </div>

                  <Link
                    href={`/item/${item.id}`}
                    title="View public listing"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-300 bg-white text-ink-700 shadow-chip transition hover:border-ink-400 hover:bg-ink-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this listing?')) {
                        await deleteListing(item.id);
                      }
                    }}
                    title="Delete listing"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 shadow-chip transition hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
