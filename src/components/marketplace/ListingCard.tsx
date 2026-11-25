'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { Heart, MapPin, MessageCircle, Sparkles, GraduationCap, Instagram } from 'lucide-react';
import clsx from 'clsx';

interface ListingCardProps {
  listing: Listing;
}

function PricePill({ listing }: { listing: Listing }) {
  const base =
    'px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md font-display font-bold text-xs sm:text-base shadow-sm border border-outline-soft dark:border-slate-700';
  if (listing.listingType === 'free') return <span className={clsx(base, 'text-mint')}>FREE</span>;
  if (listing.listingType === 'borrow') return <span className={clsx(base, 'text-lavender-dark dark:text-lavender')}>Borrow</span>;
  if (listing.listingType === 'exchange') return <span className={clsx(base, 'text-lavender-dark dark:text-lavender')}>Exchange</span>;
  return <span className={clsx(base, 'text-mint')}>₹{listing.price.toLocaleString('en-IN')}</span>;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { isListingSaved, toggleSaveListing, showToast } = useApp();

  const isSaved = isListingSaved(listing.id);
  const isAvailable = listing.status === 'active';

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

  const conditionText = listing.condition.replace(/_/g, ' ');
  const isMintCondition = conditionText.toLowerCase().includes('new') || conditionText.toLowerCase().includes('mint');

  return (
    <article className="group flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-outline-soft dark:border-slate-800 hover:border-mint/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-mint/5 transition-all duration-300 hover:-translate-y-1.5">
      {/* Cover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted dark:bg-slate-800">
        <Link href={`/item/${listing.id}`} aria-label={listing.title} className="block w-full h-full">
          {listing.images && listing.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.images[0]}
              alt={listing.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex w-full h-full flex-col items-center justify-center p-4 text-center">
              <Sparkles className="mb-2 h-8 w-8 text-text-muted/40" />
              <span className="text-xs font-bold text-text-muted">{listing.categoryName || 'Campus Item'}</span>
            </div>
          )}
        </Link>

        {/* Price Pill Top-Left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10">
          <PricePill listing={listing} />
        </div>

        {/* Condition & Save Top-Right */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 flex items-center gap-1.5">
          <span
            className={clsx(
              'hidden xs:inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold capitalize',
              isMintCondition
                ? 'bg-mint-light text-mint-dark'
                : 'bg-lavender text-lavender-dark'
            )}
          >
            {conditionText}
          </span>
          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            className={clsx(
              'grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full shadow-sm transition',
              isSaved
                ? 'bg-mint text-white'
                : 'bg-white/95 dark:bg-slate-900/95 text-text-muted hover:text-mint'
            )}
          >
            <Heart className={clsx('h-3.5 w-3.5', isSaved && 'fill-current')} />
          </button>
        </div>

        {/* College Pill Bottom-Left */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3.5 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-text-main dark:text-white text-[10px] sm:text-[11px] font-semibold border border-outline-soft/60 dark:border-slate-700">
          <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-mint shrink-0" />
          <span className="truncate max-w-[100px] sm:max-w-none">{listing.collegeShortName}</span>
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
      <div className="p-3.5 sm:p-6 flex flex-col flex-1 justify-between gap-2.5 sm:gap-4">
        <div>
          <Link href={`/item/${listing.id}`}>
            <h3 className="font-display font-bold text-xs sm:text-base text-text-main dark:text-white group-hover:text-mint transition-colors line-clamp-1 sm:line-clamp-2">
              {listing.title}
            </h3>
          </Link>
          <p className="hidden sm:line-clamp-2 text-xs text-text-muted dark:text-slate-400 mt-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-text-muted dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mint shrink-0" />
          <span className="truncate">Pickup: {listing.preferredPickupLocation}</span>
        </div>

        <div className="pt-1 sm:pt-2 flex items-center gap-1.5 sm:gap-2">
          {listing.contactPreference === 'instagram' || (!listing.whatsappNumber && listing.instagramHandle) ? (
            <button
              type="button"
              onClick={handleContactClick}
              disabled={!isAvailable}
              title="Message seller on Instagram"
              className="flex-1 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition-all disabled:opacity-40"
            >
              <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Instagram</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContactClick}
              disabled={!isAvailable}
              title="Chat with student seller on WhatsApp"
              className="flex-1 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-mint hover:bg-mint-dark text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm shadow-mint/20 transition-all disabled:opacity-40"
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>WhatsApp</span>
            </button>
          )}
          <Link
            href={`/item/${listing.id}`}
            className="px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-surface-muted dark:bg-slate-800 hover:bg-lavender-light dark:hover:bg-slate-700 text-text-muted dark:text-slate-300 hover:text-lavender-dark text-[11px] sm:text-xs font-semibold transition-all text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
};
