'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Report } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/Common';
import {
  MessageSquare,
  Flag,
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
  Search,
  EyeOff,
  Inbox,
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminRequestsPage() {
  const {
    reports,
    inquiries,
    resolveReport,
    dismissReport,
    updateListingStatus,
    logAdminAction,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'reports' | 'inquiries'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionModalReport, setActionModalReport] = useState<Report | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'inquiries') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.listingTitle.toLowerCase().includes(q);
      const matchReason = r.reason.toLowerCase().includes(q);
      const matchReporter = r.reporterName.toLowerCase().includes(q);
      if (!matchTitle && !matchReason && !matchReporter) return false;
    }
    return true;
  });

  const filteredInquiries = inquiries.filter((inq) => {
    if (activeTab === 'reports') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inq.listingTitle.toLowerCase().includes(q);
      const matchSender = inq.senderName.toLowerCase().includes(q);
      const matchMsg = inq.message.toLowerCase().includes(q);
      if (!matchTitle && !matchSender && !matchMsg) return false;
    }
    return true;
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModalReport) return;
    resolveReport(actionModalReport.id, adminNote || 'Action taken by moderation team.');
    logAdminAction(
      'Resolved Report',
      'listing',
      actionModalReport.listingId,
      `Moderator resolved report on "${actionModalReport.listingTitle}". Note: ${adminNote || 'Resolved'}`
    );
    setActionModalReport(null);
    setAdminNote('');
  };

  const handleDismiss = (r: Report) => {
    dismissReport(r.id);
    logAdminAction(
      'Dismissed Report',
      'listing',
      r.listingId,
      `Moderator dismissed report on "${r.listingTitle}" as compliant.`
    );
  };

  const handleHideListing = (listingId: string, title: string) => {
    updateListingStatus(listingId, 'unavailable');
    logAdminAction('Hidden Listing', 'listing', listingId, `Hidden due to report: "${title}".`);
    showToast(`Listing "${title}" hidden from marketplace exploration.`);
  };

  const tabs = [
    {
      key: 'all' as const,
      label: `All Activity (${reports.length + inquiries.length})`,
    },
    {
      key: 'reports' as const,
      icon: Flag,
      iconClass: 'text-red-600',
      label: `Listing Reports (${reports.length})`,
      count: pendingReportsCount,
      countClass: 'bg-red-100 text-red-700',
    },
    {
      key: 'inquiries' as const,
      icon: MessageSquare,
      iconClass: 'text-sky-600',
      label: `Campus Inquiries (${inquiries.length})`,
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
          <Badge tone="blue" size="sm">
            <MessageSquare className="h-3 w-3" /> Safety &amp; Requests Console
          </Badge>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
          Student Reports &amp; Campus Requests
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Review user-submitted item reports, investigate safety flags, and monitor peer campus inquiries.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition-all',
                activeTab === tab.key
                  ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-600/15'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'
              )}
            >
              {tab.icon && <tab.icon className={clsx('h-3.5 w-3.5', tab.iconClass)} />}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={clsx('rounded-full px-1.5 py-0.5 text-[10px] font-extrabold', tab.countClass)}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report, student, item..."
            className="input-base pl-9 text-xs sm:w-72"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Reports Section */}
        {activeTab !== 'inquiries' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
                <Flag className="h-4 w-4 text-red-600" />
                <span>Flagged Item Reports ({filteredReports.length})</span>
              </h2>
            </div>

            {filteredReports.length === 0 ? (
              <EmptyState
                icon={ShieldAlert}
                title="No Flagged Reports"
                description="All campus listings are currently compliant and safe. New reports will appear here for review."
              />
            ) : (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="space-y-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-card"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-ink-100 pb-3 sm:flex-row sm:items-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-ink-950">{report.listingTitle}</span>
                        <Badge
                          tone={
                            report.status === 'pending'
                              ? 'amber'
                              : report.status === 'action_taken'
                                ? 'green'
                                : 'gray'
                          }
                          size="sm"
                        >
                          <span className="uppercase">{report.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <span className="text-[11px] font-medium text-ink-500">
                        Reported by: <strong className="font-bold text-ink-800">{report.reporterName}</strong> on{' '}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                      <div>
                        <span className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                          Report Reason:
                        </span>
                        <p className="font-bold text-ink-950">{report.reason}</p>
                        {report.details && (
                          <p className="mt-1 text-[11px] font-normal leading-relaxed text-ink-600">{report.details}</p>
                        )}
                      </div>

                      {report.adminNotes && (
                        <div className="rounded-xl border border-ink-200 bg-ink-50 p-2.5">
                          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                            Moderator Note:
                          </span>
                          <p className="mt-0.5 text-xs font-normal text-ink-700">{report.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {report.status === 'pending' && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
                        <Button variant="dark" size="sm" onClick={() => setActionModalReport(report)}>
                          Resolve Report
                        </Button>

                        <Button variant="soft" size="sm" onClick={() => handleHideListing(report.listingId, report.listingTitle)}>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Hide Item</span>
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleDismiss(report)}>
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inquiries Section */}
        {activeTab !== 'reports' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
                <MessageSquare className="h-4 w-4 text-sky-600" />
                <span>Campus Peer Inquiries ({filteredInquiries.length})</span>
              </h2>
            </div>

            {filteredInquiries.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No Active Inquiries"
                description="Student messages sent via website inquiry will appear here for oversight."
              />
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="space-y-2 rounded-2xl border border-ink-200 bg-white p-5 shadow-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-ink-950">{inq.senderName}</span>
                        <span className="text-[11px] text-ink-400">
                          ({inq.senderCollege} • {inq.senderBranch})
                        </span>
                        <span className="text-ink-300">→</span>
                        <span className="text-ink-600">To: {inq.receiverName}</span>
                      </div>
                      <span className="text-[11px] text-ink-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="rounded-xl border border-ink-100 bg-ink-50 p-3 text-xs">
                      <p className="font-normal text-ink-700">&quot;{inq.message}&quot;</p>
                      <span className="mt-1 block text-[10px] text-ink-400">
                        Item: <strong className="font-bold">{inq.listingTitle}</strong> ({inq.listingType.toUpperCase()})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      <Modal
        open={actionModalReport !== null}
        onClose={() => setActionModalReport(null)}
        title="Resolve Listing Report"
        description={actionModalReport ? `Item: ${actionModalReport.listingTitle}` : undefined}
      >
        <form onSubmit={handleResolve} className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 px-3.5 py-3 text-xs leading-relaxed text-emerald-800">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p>
              Resolving marks this report as actioned and records the moderation note in the audit log.
            </p>
          </div>

          <Textarea
            label="Moderator Action Notes"
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="e.g. Verified with seller, pricing updated, or warning issued."
            required
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setActionModalReport(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save &amp; Resolve
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
