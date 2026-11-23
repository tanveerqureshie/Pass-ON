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
  Instagram,
  ChevronRight,
  Sparkles,
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
    registeredStudents,
    selectedCollegeId,
    isListingSaved,
    toggleSaveListing,
    reportListing,
    showToast,
    currentUser,
  } = useApp();

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
  const seller =
    registeredStudents.find((student) => student.id === listing.ownerId) ??
    (currentUser?.id === listing.ownerId ? currentUser : undefined);
  const sellerName = seller?.fullName || listing.ownerName;
  const sellerCollegeName = seller?.collegeName || listing.collegeName;
  const sellerBranch = seller?.branch || listing.ownerBranch || listing.department;
  const isSellerVerified = seller?.role === 'admin' || seller?.verificationStatus === 'approved';
  const instagramHandleDisplay = listing.instagramHandle?.startsWith('http')
    ? undefined
    : listing.instagramHandle?.replace(/^@+/, '');

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
    <div className="bg-[#F5FAFF] dark:bg-slate-950">
      <div className="container-x flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center py-4">
        {/* Breadcrumb + actions */}
        <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-500" aria-label="Breadcrumb">
            <Link href="/explore" className="inline-flex items-center gap-1.5 transition hover:text-brand-600">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Marketplace
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
            <span className="max-w-52 truncate text-ink-900">{listing.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReportModalOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 text-[11px] font-bold text-ink-500 shadow-chip transition hover:border-red-200 hover:text-red-600"
            >
              <Flag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 text-[11px] font-bold text-ink-700 shadow-chip transition hover:border-ink-300 hover:bg-ink-50"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={clsx(
                'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold shadow-chip transition',
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
        <div className="mx-auto mt-3 grid w-full max-w-[1080px] grid-cols-1 items-start gap-4 lg:grid-cols-[1.38fr_1fr] lg:gap-5">
          {/* Left: product image gallery */}
          <div className="min-w-0 lg:h-full">
            <div className="relative flex h-[300px] flex-col rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900 sm:h-[360px] lg:h-[clamp(360px,58vh,480px)]">
              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[18px] bg-white dark:bg-slate-900">
                {listing.images && listing.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.images[activeImageIndex] || listing.images[0]}
                    alt={listing.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                    <Sparkles className="h-8 w-8" />
                    <span className="text-sm font-semibold">No Photos Provided</span>
                  </div>
                )}

                {!isAvailable && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[18px] bg-slate-950/65 backdrop-blur-sm">
                    <span className="rounded-full bg-white px-5 py-2 text-sm font-extrabold uppercase tracking-widest text-slate-950 shadow-lg">
                      {listing.status === 'sold'
                        ? 'Sold Out'
                        : listing.status === 'donated'
                          ? 'Donated'
                          : 'Unavailable'}
                    </span>
                  </div>
                )}
              </div>

              {listing.images && listing.images.length > 1 && (
                <div className="mt-2 flex shrink-0 gap-1.5 overflow-x-auto">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={clsx(
                        'h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition sm:h-12 sm:w-12',
                        activeImageIndex === idx
                          ? 'border-brand-600'
                          : 'border-transparent hover:border-slate-300'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: details + actions */}
          <div className="min-w-0 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <div className="space-y-2">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Link
                  href={`/college/${listing.collegeId}`}
                  className={clsx(
                    'inline-flex max-w-full min-w-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition hover:border-brand-300',
                    isMyCollege
                      ? 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="min-w-0 truncate" title={listing.collegeName}>{listing.collegeName}</span>
                </Link>

                <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white">
                  {listing.condition === 'new' ? 'NEW' : listing.condition === 'like_new' ? 'LIKE NEW' : 'USED'}
                </span>
              </div>

              {/* Title */}
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  {listing.categoryName} {listing.subcategory ? `• ${listing.subcategory}` : ''}
                </p>
                <h1 className="mt-1 font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                  {listing.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={clsx(
                    'inline-flex items-center rounded-xl bg-green-50 px-3.5 py-1.5 font-display font-extrabold tracking-tight text-[#16A34A] dark:bg-green-950/50 dark:text-green-400',
                    listing.listingType === 'sell' ? 'text-xl' : 'text-sm'
                  )}
                >
                  {listing.listingType === 'sell'
                    ? `₹${listing.price.toLocaleString('en-IN')}`
                    : listing.listingType === 'free'
                      ? 'FREE'
                      : typeLabel}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Student Listing
                </span>
              </div>

              {/* Description */}
              <div>
                <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Description
                </span>
                <p className="whitespace-pre-line text-[12px] leading-[1.4] text-slate-600 dark:text-slate-300">
                  {listing.description}
                </p>
              </div>

              {listing.listingType === 'borrow' && (listing.borrowDuration || listing.borrowConditions) && (
                <div className="space-y-1 rounded-xl bg-slate-50 px-3 py-2 text-[11px] dark:bg-slate-800/70">
                  {listing.borrowDuration && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-slate-100">Borrow duration:</span>{' '}
                      {listing.borrowDuration}
                    </p>
                  )}
                  {listing.borrowConditions && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-slate-100">Borrow conditions:</span>{' '}
                      {listing.borrowConditions}
                    </p>
                  )}
                </div>
              )}
              {listing.listingType === 'exchange' && listing.exchangePreferences && (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Looking to exchange for:</span>{' '}
                  {listing.exchangePreferences}
                </p>
              )}

              {/* Pickup details */}
              <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-3 text-[11px] dark:bg-slate-800/70 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1754C4] dark:text-blue-400" />
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-slate-100">Pickup Spot</span>
                    <span className="text-slate-500 dark:text-slate-400">{listing.preferredPickupLocation}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l border-slate-200 pl-2 dark:border-slate-700">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#1754C4] dark:text-blue-400" />
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-slate-100">Timing</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {listing.pickupInstructions || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller card */}
              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/70">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 font-display text-xs font-extrabold text-white">
                    {sellerName.charAt(0)}
                  </span>
                  <div>
                    <span className="block truncate text-[11px] font-extrabold text-slate-950 dark:text-white">{sellerName}</span>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      {seller && (
                        <span
                          className={clsx(
                            'inline-flex items-center gap-0.5 text-[10px] font-bold',
                            isSellerVerified
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {isSellerVerified && <ShieldCheck className="h-3 w-3" />}
                          {isSellerVerified
                            ? 'Verified'
                            : seller.verificationStatus === 'rejected'
                              ? 'Not verified'
                              : 'Verification pending'}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {[sellerCollegeName, sellerBranch].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact actions */}
              <div className="grid gap-2">
                {listing.whatsappNumber && listing.contactPreference !== 'instagram' && (
                  <button
                    onClick={handleWhatsApp}
                    disabled={!isAvailable}
                    className={clsx(
                      'flex h-9 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-all',
                      isAvailable
                        ? 'bg-[#1754C4] text-white shadow-sm shadow-blue-800/20 hover:bg-[#1246A8] active:scale-[0.98]'
                        : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
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
                      'flex h-9 w-full items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all',
                      isAvailable
                        ? 'border-[#1754C4] bg-white text-[#1754C4] hover:bg-blue-50 active:scale-[0.98] dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800'
                        : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
                    )}
                  >
                    <Instagram className="h-4 w-4" />
                    Message on Instagram{instagramHandleDisplay ? ` (@${instagramHandleDisplay})` : ''}
                  </button>
                )}
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
