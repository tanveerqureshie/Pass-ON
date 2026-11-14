'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Common';
import { MessageCircle, ArrowLeft, ArrowUpRight, Clock } from 'lucide-react';

export default function RequestsPage() {
  const { inquiries, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  const incoming = inquiries.filter((i) => i.receiverId === currentUser?.id);
  const outgoing = inquiries.filter((i) => i.senderId === currentUser?.id);

  const displayList = activeTab === 'incoming' ? incoming : outgoing;

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
          <span className="rounded-full bg-brand-50 px-3 py-1">Campus Inquiries</span>
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-950">
          Inquiries &amp; Campus Requests
        </h1>
        <p className="mt-1 max-w-xl text-sm text-ink-500">
          Questions and meetup requests sent by verified juniors regarding your campus items.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex max-w-sm rounded-2xl bg-ink-100 p-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`w-1/2 rounded-xl py-2 text-center transition-all ${
            activeTab === 'incoming'
              ? 'bg-white text-ink-950 shadow-chip'
              : 'text-ink-500 hover:text-ink-900'
          }`}
        >
          Incoming ({incoming.length})
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`w-1/2 rounded-xl py-2 text-center transition-all ${
            activeTab === 'outgoing'
              ? 'bg-white text-ink-950 shadow-chip'
              : 'text-ink-500 hover:text-ink-900'
          }`}
        >
          Sent by Me ({outgoing.length})
        </button>
      </div>

      {/* Inquiries Feed */}
      {displayList.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title={`No ${activeTab === 'incoming' ? 'Incoming' : 'Sent'} Inquiries`}
          description={
            activeTab === 'incoming'
              ? 'You have not received any website inquiries yet. Buyers can also reach you via WhatsApp.'
              : 'You have not sent any campus inquiries yet.'
          }
        />
      ) : (
        <div className="space-y-4">
          {displayList.map((inq) => (
            <div
              key={inq.id}
              className="space-y-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-lift sm:p-6"
            >
              <div className="flex flex-col justify-between gap-2 border-b border-ink-100 pb-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
                    {activeTab === 'incoming'
                      ? inq.senderName.charAt(0).toUpperCase()
                      : inq.receiverName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <span className="block text-sm font-extrabold text-ink-950">
                      {activeTab === 'incoming' ? inq.senderName : `To: ${inq.receiverName}`}
                    </span>
                    <span className="text-[11px] text-ink-400">
                      ({inq.senderCollege} • {inq.senderBranch || 'Student'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-ink-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                  <Badge tone={inq.status === 'replied' ? 'green' : inq.status === 'closed' ? 'gray' : 'amber'} size="sm">
                    {inq.status}
                  </Badge>
                </div>
              </div>

              {/* Item Subject */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-xs">
                <div className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                    Regarding Item:
                  </span>
                  <span className="truncate font-bold text-ink-900">{inq.listingTitle}</span>
                </div>

                <Link
                  href={`/item/${inq.listingId}`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-ink-300 bg-white px-3 py-2 text-xs font-bold text-ink-900 shadow-chip transition hover:border-ink-400 hover:bg-ink-50"
                >
                  <span>View Listing</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Message */}
              <div className="rounded-xl border border-ink-100 bg-white p-3 text-xs leading-relaxed text-ink-700 sm:text-sm">
                &quot;{inq.message}&quot;
              </div>

              <div className="flex flex-col gap-1 pt-1 text-[11px] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
                <span>Direct WhatsApp handover is encouraged for quickest campus coordination.</span>
                <span className="font-semibold capitalize text-ink-600">Status: {inq.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
