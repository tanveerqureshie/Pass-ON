'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Common';
import {
  Package,
  Flag,
  EyeOff,
  Trash2,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  Search,
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminListingsPage() {
  const { listings, updateListing, updateListingStatus, deleteListing, logAdminAction, showToast } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'reported' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = listings.filter((l) => {
    if (filterMode === 'reported' && !l.isReported) return false;
    if (filterMode === 'inactive' && (l.status !== 'unavailable' && l.status !== 'archived')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchCollege = l.collegeShortName?.toLowerCase().includes(q);
      const matchOwner = l.ownerName?.toLowerCase().includes(q);
      if (!matchTitle && !matchCollege && !matchOwner) return false;
    }
    return true;
  });

  const handleHideListing = (id: string, title: string) => {
    updateListingStatus(id, 'unavailable');
    logAdminAction('Hidden Listing', 'listing', id, `Moderator hid: "${title}" due to compliance check.`);
    showToast(`Listing "${title}" hidden from public exploration.`);
  };

  const handleRestoreListing = (id: string, title: string) => {
    updateListing(id, { status: 'active', isReported: false });
    logAdminAction('Restored Listing', 'listing', id, `Moderator restored: "${title}".`);
    showToast(`Listing "${title}" restored to active status.`);
  };

  const handleDeleteListing = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await deleteListing(id);
      logAdminAction('Deleted Listing', 'listing', id, `Permanently deleted: "${title}".`);
      showToast(`Listing "${title}" removed.`);
    }
  };

  const reportedCount = listings.filter((l) => l.isReported).length;

  const tabs = [
    {
      key: 'all' as const,
      label: `All Listings (${listings.length})`,
    },
    {
      key: 'reported' as const,
      icon: Flag,
      label: `Reported (${reportedCount})`,
    },
    {
      key: 'inactive' as const,
      label: 'Inactive / Hidden',
    },
  ];

  return (
    <div className="container-x py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin Overview
          </Link>
          <span className="text-ink-300">•</span>
          <Badge tone="amber" size="sm">
            <Package className="h-3 w-3" /> Moderation Control
          </Badge>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
          Listing Moderation &amp; Safety
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Inspect campus listings, review student complaints, hide fraudulent posts, or restore approved items.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterMode(tab.key)}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition-all',
                filterMode === tab.key
                  ? tab.key === 'reported'
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-600/15'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'
              )}
            >
              {tab.icon && <tab.icon className={clsx('h-3.5 w-3.5', filterMode === tab.key ? 'text-white' : 'text-red-600')} />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, campus, student..."
            className="input-base pl-9 text-xs sm:w-72"
          />
        </div>
      </div>

      {/* Listings Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No listings found"
          description="Try choosing another filter tab or adjusting your search query to see more campus items."
        />
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={clsx(
                'flex flex-col items-start justify-between gap-4 rounded-2xl border p-5 shadow-card transition-all md:flex-row md:items-center',
                item.isReported
                  ? 'border-red-200 bg-red-50/40'
                  : 'border-ink-200 bg-white hover:border-ink-300'
              )}
            >
              {/* Left Info */}
              <div className="max-w-3xl space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green" size="sm">
                    {item.listingType === 'free' ? 'FREE' : `₹${item.price}`}
                  </Badge>

                  <Badge tone={item.status === 'active' ? 'gray' : 'amber'} size="sm">
                    {item.status.toUpperCase()}
                  </Badge>

                  <Badge tone="outline" size="sm">
                    {item.collegeShortName} • {item.department || 'General'}
                  </Badge>

                  {item.isReported && (
                    <Badge tone="red" size="sm">
                      <AlertTriangle className="h-3 w-3" />
                      Reported by student
                    </Badge>
                  )}
                </div>

                <h3 className="font-display text-base font-extrabold text-ink-950">{item.title}</h3>

                <p className="line-clamp-2 text-xs leading-relaxed text-ink-600">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-ink-500">
                  <span>Seller: <strong className="font-bold text-ink-700">{item.ownerName}</strong></span>
                  <span>Pickup: {item.preferredPickupLocation}</span>
                  <span>Type: <span className="capitalize">{item.listingType}</span></span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex w-full shrink-0 flex-wrap items-center gap-2 border-t border-ink-100 pt-3 md:w-auto md:border-t-0 md:pt-0">
                <Link href={`/item/${item.id}`} target="_blank">
                  <Button variant="outline" size="sm" className="px-3" title="View Item Page" aria-label="View Item Page">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>

                {item.status === 'active' ? (
                  <Button variant="soft" size="sm" onClick={() => handleHideListing(item.id, item.title)}>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Hide Item</span>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handleRestoreListing(item.id, item.title)} className="border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restore Active</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteListing(item.id, item.title)}
                  className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  title="Permanently Delete"
                  aria-label="Permanently Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
