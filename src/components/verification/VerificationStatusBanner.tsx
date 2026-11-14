'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Clock, XCircle } from 'lucide-react';

/** Global banner under the navbar explaining the user's verification state. */
export function VerificationStatusBanner() {
  const { currentUser, isUserVerified } = useApp();
  if (!currentUser || isUserVerified) return null;

  const pending = currentUser.verificationStatus !== 'rejected';

  return (
    <div className="mt-3 mb-0 rounded-2xl border px-4 py-3 sm:flex sm:items-center sm:justify-between gap-4 shadow-chip
      bg-amber-50/80 border-amber-200
      dark:[color-scheme:light]">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
          {pending ? <Clock className="h-4.5 w-4.5" /> : <XCircle className="h-4.5 w-4.5" />}
        </span>
        <div>
          <p className="text-sm font-bold text-ink-950">
            {pending ? 'Verification in review' : 'Verification rejected'}
          </p>
          <p className="text-xs text-ink-600 leading-relaxed max-w-2xl">
            {pending
              ? 'Your enrollment details are being verified by the campus team. Until approval you can browse and save items, unrestricted posting unlocks once verified.'
              : `Reason: ${currentUser.rejectionReason || 'Details could not be verified'}. Update your information to request a re-review.`}
          </p>
        </div>
      </div>
      <Link
        href="/profile"
        className="mt-3 inline-flex h-9 shrink-0 items-center rounded-full bg-ink-950 px-4 text-xs font-bold text-white transition hover:bg-ink-800 sm:mt-0"
      >
        {pending ? 'View Profile' : 'Edit & Resubmit'}
      </Link>
    </div>
  );
}
