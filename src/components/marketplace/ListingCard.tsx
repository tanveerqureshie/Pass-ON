'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { Heart, MapPin, MessageCircle, Sparkles, ArrowRight, Instagram } from 'lucide-react';
import clsx from 'clsx';

interface ListingCardProps {
  listing: Listing;
}

/** Type/price chip shown top-left of cover */
function TypeChip({ listing }: { listing: Listing }) {
  const base = 'rounded-full px-2.5 py-1 text-[11px] font-extrabold shadow-sm uppercase tracking-wide';
  if (listing.listingType === 'free')
    return <span className={clsx(base, 'bg-emerald-500 text-white')}>🎁 FREE</span>;
  if (listing.listingType === 'borrow')
    return <span className={clsx(base, 'bg-sky-500 text-white')}>↔ Borrow</span>;
  if (listing.listingType === 'exchange')
    return <span className={clsx(base, 'bg-violet-500 text-white')}>⇄ Exchange</span>;
  return <span className={clsx(base, 'bg-blue-600 text-white')}>₹{listing.price.toLocaleString('en-IN')}</span>;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { isListingSaved, toggleSaveListing, selectedCollegeId, showToast } = useApp();

  const isSaved = isListingSaved(listing.id);
  const isAvailable = listing.status === 'active';
  const isMyCollege = listing.collegeId === selectedCollegeId;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (listing.contactPreference === 'instagram' || (!listing.whatsappNumber && listing.instagramHandle)) {
      if (listing.instagramHandle) {
        const raw = listing.instagramHandle.trim();
        const url = raw.startsWith('http')
          ? raw
          : `https://instagram.com/${raw.replace(/^@+/, '')}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    if (listing.whatsappNumber) {
      const url = getWhatsAppUrl({
        phoneNumber: listing.whatsappNumber,
        itemTitle: listing.title,
        collegeShortName: listing.collegeShortName,
        listingType: listing.listingType,
        listingId: listing.id,
      });
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const clean = listing.whatsappNumber.replace(/\D/g, '');
        const num = clean.length === 10 ? '91' + clean : clean;
        window.open(`https://wa.me/${num}`, '_blank', 'noopener,noreferrer');
      }
    } else if (listing.instagramHandle) {
      const url = `https://instagram.com/${listing.instagramHandle.trim().replace(/^@+/, '')}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      showToast('Seller has not provided contact details');
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  return (
    <article className="card-3d group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_6px_18px_-4px_rgba(15,23,42,0.1),0_2px_6px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.18),0_6px_14px_rgba(15,23,42,0.08)] hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
      {/* Cover */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={`/item/${listing.id}`} aria-label={listing.title}>
          {listing.images && listing.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.images[0]}
              alt={listing.title}
              loading="lazy"
              className="aspect-[4/3] w-full bg-[#f7f7f8] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center p-4 text-center">
              <Sparkles className="mb-2 h-8 w-8 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">{listing.categoryName || 'Campus Item'}</span>
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 z-10">
          <TypeChip listing={listing} />
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
          <span className="rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur">
            {listing.condition.replace('_', ' ')}
          </span>
          <button
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            className={clsx(
              'place-items-center rounded-full p-1.5 shadow-sm transition',
              isSaved ? 'bg-blue-600 text-white' : 'bg-white/95 text-slate-600 hover:bg-white hover:text-blue-600'
            )}
          >
            <Heart className={clsx('h-3.5 w-3.5', isSaved && 'fill-current')} />
          </button>
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950/70 backdrop-blur-[2px]">
            <span className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-950 shadow-lift">
              {listing.status === 'sold' ? 'Sold' : listing.status === 'donated' ? 'Donated' : 'Unavailable'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide',
              isMyCollege ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            )}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.collegeShortName}
          </span>
          {listing.viewsCount !== undefined && listing.viewsCount > 0 && (
            <span className="text-[10px] font-semibold text-slate-400">{listing.viewsCount} views</span>
          )}
        </div>

        <Link href={`/item/${listing.id}`} className="mt-2 block">
          <h3 className="font-display text-[15px] font-extrabold leading-snug text-ink-950 dark:text-slate-100 transition-colors line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
            {listing.title}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{listing.description}</p>

        <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300">Pickup:</span>
          <span className="truncate">{listing.preferredPickupLocation}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:px-5 sm:pb-5">
        <Link
          href={`/item/${listing.id}`}
          className="inline-flex h-9.5 items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {listing.contactPreference === 'instagram' || (!listing.whatsappNumber && listing.instagramHandle) ? (
          <button
            onClick={handleContactClick}
            disabled={!isAvailable}
            title="Directly message seller on Instagram"
            className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            <Instagram className="h-3.5 w-3.5" />
            Instagram
          </button>
        ) : (
          <button
            onClick={handleContactClick}
            disabled={!isAvailable}
            title="Directly chat with student seller on WhatsApp"
            className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition shadow-sm shadow-blue-500/20 disabled:opacity-40"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </button>
        )}
      </div>
    </article>
  );
};
