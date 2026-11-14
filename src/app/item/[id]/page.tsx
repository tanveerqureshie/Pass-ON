'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import {
  MessageCircle,
  Heart,
  Share2,
  Flag,
  MapPin,
  Clock,
  Building2,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  Send,
  Instagram,
  Lock,
  ChevronRight,
  Sparkles,
  Tag,
} from 'lucide-react';
import clsx from 'clsx';

const REPORT_REASONS = [
  'Misleading or inaccurate description',
  'Prohibited or inappropriate item',
  'Invalid WhatsApp number / spam',
  'Already sold / unresponsive',
];

export default function ItemDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const {
    listings,
    selectedCollegeId,
    isListingSaved,
    toggleSaveListing,
    sendInquiry,
    reportListing,
    showToast,
    currentUser,
    isUserVerified,
  } = useApp();

  const [inquiryMessage, setInquiryMessage] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const listing = listings.find((item) => item.id === id);

  if (!listing) {
    return (
      <div className="section container-x">
        <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-ink-300 bg-white p-12 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink-100 text-ink-400">
            <Sparkles className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-950">Listing Not Found</h1>
          <p className="mt-2 text-sm text-ink-500">
            This item may have been removed, sold, or is temporarily archived.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-950 px-6 text-sm font-bold text-white transition hover:bg-ink-800"
          >
            Explore Other Items
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = isListingSaved(listing.id);
  const isAvailable = listing.status === 'active';
  const isMyCollege = listing.collegeId === selectedCollegeId;

  const handleWhatsApp = () => {
    if (!listing.whatsappNumber) {
      showToast('Seller contact number is missing');
      return;
    }
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
  };

  const handleInstagram = () => {
    if (!listing?.instagramHandle) {
      showToast('Instagram handle not available');
      return;
    }
    const raw = listing.instagramHandle.trim();
    if (raw.startsWith('http')) {
      window.open(raw, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://instagram.com/${raw.replace(/^@+/, '')}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    if (!currentUser) {
      showToast('Please sign in to send campus inquiries.');
      return;
    }

    if (!isUserVerified) {
      showToast('Verification Required: Account must be approved to send inquiries.');
      return;
    }

    const success = sendInquiry(listing.id, inquiryMessage);
    if (success) {
      setInquiryMessage('');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportListing(listing.id, reportReason, reportDetails);
    setReportModalOpen(false);
    setReportDetails('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: listing.title,
          text: `Check out ${listing.title} on Pass ON:`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!');
    }
  };

  const relatedListings = listings
    .filter(
      (l) => l.id !== listing.id && (l.collegeId === listing.collegeId || l.categoryId === listing.categoryId)
    )
    .slice(0, 3);

  const typeLabel =
    listing.listingType === 'free'
      ? 'Free Senior Giveaway'
      : listing.listingType === 'borrow'
        ? 'Temporary Borrow'
        : listing.listingType === 'exchange'
          ? 'Barter Exchange'
          : 'Fixed Student Price';

  return (
    <div className="py-8">
      <div className="container-x space-y-8">
        {/* Breadcrumb + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-ink-500" aria-label="Breadcrumb">
            <Link href="/explore" className="inline-flex items-center gap-1.5 transition hover:text-brand-600">
              <ArrowLeft className="h-3.5 w-3.5" />
              Marketplace
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
            <span className="max-w-52 truncate text-ink-900">{listing.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 text-xs font-bold text-ink-700 shadow-chip transition hover:border-ink-300 hover:bg-ink-50"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={clsx(
                'inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-xs font-bold shadow-chip transition',
                isSaved
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700'
              )}
            >
              <Heart className={clsx('h-3.5 w-3.5', isSaved && 'fill-current')} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left: image gallery + safety */}
          <div className="space-y-4 lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-200 bg-ink-100 shadow-card">
              {listing.images && listing.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.images[activeImageIndex] || listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full bg-[#f7f7f8] object-contain"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-400">
                  <Sparkles className="h-8 w-8" />
                  <span className="text-sm font-semibold">No Photos Provided</span>
                </div>
              )}

              {/* Type / price chip */}
              <div className="absolute left-4 top-4 z-10">
                {listing.listingType === 'free' ? (
                  <span className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-extrabold text-white shadow-lift">
                    🎁 100% FREE GIVEAWAY
                  </span>
                ) : listing.listingType === 'borrow' ? (
                  <span className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-extrabold text-white shadow-lift">
                    🔄 BORROW / LEND
                  </span>
                ) : listing.listingType === 'exchange' ? (
                  <span className="rounded-full bg-violet-500 px-4 py-1.5 text-sm font-extrabold text-white shadow-lift">
                    🔁 EXCHANGE OFFER
                  </span>
                ) : (
                  <span className="rounded-full bg-white px-4 py-1.5 font-display text-xl font-extrabold text-ink-950 shadow-lift">
                    ₹{listing.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {!isAvailable && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-950/75 backdrop-blur-sm">
                  <span className="rounded-full bg-white px-5 py-2 text-sm font-extrabold uppercase tracking-widest text-ink-950 shadow-lift">
                    {listing.status === 'sold'
                      ? 'Sold Out'
                      : listing.status === 'donated'
                        ? 'Donated'
                        : 'Unavailable'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={clsx(
                      'h-20 w-20 overflow-hidden rounded-xl border-2 transition',
                      activeImageIndex === idx
                        ? 'border-brand-600 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full bg-[#f7f7f8] object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Safety notice */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Campus Verification &amp; Safe Handover</span>
              </div>
              <p className="mt-1.5 leading-relaxed text-emerald-800/80">
                Always schedule handovers during daytime in busy public campus areas (e.g., college cafeteria,
                library foyer, or main academic block). Inspect the condition of calculators, textbooks, or
                electronics before final handover.
              </p>
            </div>
          </div>

          {/* Right: details + actions */}
          <div className="lg:col-span-5">
            <div className="space-y-5 rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-7">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/college/${listing.collegeId}`}
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition hover:border-brand-300',
                    isMyCollege
                      ? 'border-brand-200 bg-brand-50 text-brand-700'
                      : 'border-ink-200 bg-ink-50 text-ink-700'
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{listing.collegeShortName}</span>
                  {isMyCollege && <span className="text-[10px] font-extrabold">· MY CAMPUS</span>}
                </Link>

                {listing.department && (
                  <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-700">
                    {listing.department}
                  </span>
                )}

                <span className="rounded-full bg-ink-950 px-2.5 py-1 text-[11px] font-bold capitalize text-white">
                  {listing.condition.replace('_', ' ')}
                </span>
              </div>

              {/* Title */}
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                  {listing.categoryName} {listing.subcategory ? `• ${listing.subcategory}` : ''}
                </p>
                <h1 className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-3xl">
                  {listing.title}
                </h1>
              </div>

              {/* Pricing panel */}
              <div className="space-y-2.5 rounded-2xl border border-ink-200 bg-[#f7f7f8] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-500">Type</span>
                  <span className="font-extrabold uppercase tracking-wide text-ink-900">{typeLabel}</span>
                </div>

                {listing.listingType === 'sell' && (
                  <div className="flex items-baseline justify-between border-t border-ink-200 pt-2.5">
                    <span className="text-xs font-semibold text-ink-500">Price</span>
                    <span className="flex items-start gap-1.5">
                      <span className="font-display text-3xl font-extrabold tracking-tight text-ink-950">
                        ₹{listing.price.toLocaleString('en-IN')}
                      </span>
                    </span>
                  </div>
                )}

                {listing.listingType === 'borrow' && (
                  <div className="space-y-1 border-t border-ink-200 pt-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-500">Borrow Duration</span>
                      <span className="font-bold text-ink-900">{listing.borrowDuration || '1-2 weeks'}</span>
                    </div>
                    {listing.borrowConditions && (
                      <p className="italic text-ink-500">Condition: {listing.borrowConditions}</p>
                    )}
                  </div>
                )}

                {listing.listingType === 'exchange' && (
                  <div className="border-t border-ink-200 pt-2.5 text-xs">
                    <span className="mb-1 block font-semibold text-ink-500">Desired Exchange Items</span>
                    <p className="rounded-xl border border-ink-200 bg-white p-2.5 text-ink-800">
                      {listing.exchangePreferences || 'Open to relevant semester textbooks or lab kits'}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-ink-400">
                  Description
                </span>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">{listing.description}</p>
              </div>

              {/* Pickup details */}
              <div className="space-y-2 rounded-2xl border border-ink-200 bg-[#f7f7f8] p-4 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <div>
                    <span className="block font-bold text-ink-900">Preferred Pickup Spot</span>
                    <span className="text-ink-500">{listing.preferredPickupLocation}</span>
                  </div>
                </div>
                {listing.pickupInstructions && (
                  <div className="flex items-start gap-2 border-t border-ink-200 pt-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                    <div>
                      <span className="block font-bold text-ink-900">Timing / Instructions</span>
                      <span className="text-ink-500">{listing.pickupInstructions}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Seller card */}
              <div className="flex items-center justify-between rounded-2xl border border-ink-200 bg-[#f7f7f8] p-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 font-display text-sm font-extrabold text-white">
                    {listing.ownerName.charAt(0)}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-ink-950">{listing.ownerName}</span>
                      <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        Verified
                      </span>
                    </div>
                    <span className="block text-[11px] text-ink-500">
                      {listing.collegeShortName} • {listing.department || 'Student'}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-ink-400">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Contact actions */}
              <div className="space-y-3">
                {listing.instagramHandle && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-ink-200 bg-ink-50 p-3 text-xs text-ink-600">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span>
                      <strong className="font-bold text-ink-900">Privacy option:</strong> seller accepts direct
                      Instagram DMs (@{listing.instagramHandle.replace(/^@/, '')}) for secure campus meetups
                      without sharing a phone number.
                    </span>
                  </div>
                )}

                <div className="grid gap-2.5">
                  {listing.whatsappNumber && listing.contactPreference !== 'instagram' && (
                    <button
                      onClick={handleWhatsApp}
                      disabled={!isAvailable}
                      className={clsx(
                        'flex h-13 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all',
                        isAvailable
                          ? 'bg-ink-950 text-white shadow-chip hover:bg-ink-800 active:scale-[0.98]'
                          : 'cursor-not-allowed bg-ink-100 text-ink-400'
                      )}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp ({listing.whatsappNumber})
                    </button>
                  )}

                  {listing.instagramHandle && (
                    <button
                      onClick={handleInstagram}
                      disabled={!isAvailable}
                      className={clsx(
                        'flex h-13 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all',
                        isAvailable
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-chip hover:opacity-90 active:scale-[0.98]'
                          : 'cursor-not-allowed bg-ink-100 text-ink-400'
                      )}
                    >
                      <Instagram className="h-4 w-4" />
                      Message on Instagram (@{listing.instagramHandle.replace(/^@/, '')})
                    </button>
                  )}
                </div>

                <p className="text-center text-[11px] leading-snug text-ink-400">
                  Official peer handover. Personal phone numbers and private profiles are protected.
                </p>
              </div>

              {/* Inquiry */}
              <div className="space-y-2 border-t border-ink-100 pt-4">
                <span className="block text-xs font-extrabold text-ink-950">Send a quick inquiry</span>
                <form onSubmit={handleSendInquiry} className="space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Ask about availability or handover time…"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="input-base min-h-20 resize-none text-xs"
                  />
                  <Button type="submit" variant="primary" block disabled={!inquiryMessage.trim()} size="sm">
                    <Send className="h-3.5 w-3.5" />
                    Send Campus Inquiry
                  </Button>
                </form>
              </div>

              {/* Report */}
              <div className="pt-1 text-right">
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-400 transition-colors hover:text-red-500"
                >
                  <Flag className="h-3 w-3" />
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related items */}
        {relatedListings.length > 0 && (
          <div className="space-y-6 border-t border-ink-200 pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Keep browsing</p>
                <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-ink-950">
                  More from {listing.collegeShortName} &amp; {listing.categoryName}
                </h2>
              </div>
              <Link
                href="/explore"
                className="group inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-800"
              >
                View All <ArrowLeft className="h-4 w-4 rotate-180 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report modal */}
      <Modal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Listing"
        description="Help maintain community trust on Pass ON. Reports are reviewed by campus administrators."
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label htmlFor="report-reason" className="label-base">
              Reason for reporting
            </label>
            <select
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input-base text-xs"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="report-details" className="label-base">
              Additional details
            </label>
            <textarea
              id="report-details"
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Provide context for our moderators…"
              className="input-base min-h-24 resize-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setReportModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              <AlertTriangle className="h-4 w-4" /> Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
