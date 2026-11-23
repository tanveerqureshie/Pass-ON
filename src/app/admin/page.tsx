'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Building2,
  Package,
  CheckCircle,
  Clock,
  ArrowRight,
  UserCheck,
  MessageSquare,
  ScrollText,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { currentUser, listings, colleges, reports, inquiries, auditLogs, registeredStudents } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // Real stats
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const freeCount = listings.filter((l) => l.listingType === 'free').length;
  const pendingVerificationCount = registeredStudents.filter((s) => s.verificationStatus === 'pending').length;
  const verifiedStudentsCount = registeredStudents.filter((s) => s.verificationStatus === 'approved').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const totalRequestsCount = reports.length + inquiries.length;

  return (
    <div className="container-x py-8 sm:py-10">

      {/* Admin Header — dark chrome */}
      <div className="relative overflow-hidden rounded-3xl bg-ink-950 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-600/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-200">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                Campus Control Center
              </span>
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Administration &amp; Safety Portal
            </h1>
            <p className="text-xs font-medium leading-relaxed text-ink-300 sm:text-sm">
              Verify student enrollment records, review campus support requests, manage Delhi college directories, and oversee marketplace safety.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/admin/users">
              <Button variant="primary" size="sm">
                <UserCheck className="h-4 w-4" />
                <span>Verification Queue ({pendingVerificationCount})</span>
              </Button>
            </Link>
            <Link href="/admin/requests">
              <Button
                variant="ghost"
                size="sm"
                className="border border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Requests ({pendingReportsCount})</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Pending Approvals
          </span>
          <span className={`mt-1 block font-display text-3xl font-extrabold ${pendingVerificationCount > 0 ? 'text-amber-600' : 'text-ink-950'}`}>
            {pendingVerificationCount}
          </span>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Verified Students
          </span>
          <span className="mt-1 block font-display text-3xl font-extrabold text-emerald-600">{verifiedStudentsCount}</span>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Active Listings
          </span>
          <span className="mt-1 block font-display text-3xl font-extrabold text-ink-950">{activeCount}</span>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Free Items (₹0)
          </span>
          <span className="mt-1 block font-display text-3xl font-extrabold text-emerald-600">{freeCount}</span>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Colleges Active
          </span>
          <span className="mt-1 block font-display text-3xl font-extrabold text-ink-950">{colleges.length}</span>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
            Reports &amp; Inquiries
          </span>
          <span className={`mt-1 block font-display text-3xl font-extrabold ${pendingReportsCount > 0 ? 'text-red-600' : 'text-ink-950'}`}>
            {totalRequestsCount}
          </span>
        </div>
      </div>

      {/* Main Grid: Workspaces & Logs */}
      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left: Module Hubs (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-7">
            <div className="border-b border-ink-100 pb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600">Modules</p>
              <h2 className="mt-1 font-display text-lg font-extrabold text-ink-950">Administrative Workspaces</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/admin/users"
                className="group flex flex-col justify-between rounded-2xl border border-ink-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-lift"
              >
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-extrabold text-ink-950 transition-colors group-hover:text-brand-700">
                    Student Verification Queue
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-ink-500">
                    Review submitted personal emails &amp; enrollment roll numbers against college rosters.
                  </p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-600">
                  Review Queue ({pendingVerificationCount})
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href="/admin/requests"
                className="group flex flex-col justify-between rounded-2xl border border-ink-200 bg-white p-5 transition-all hover:border-sky-300 hover:shadow-lift"
              >
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-extrabold text-ink-950 transition-colors group-hover:text-sky-700">
                    Reports &amp; Student Requests
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-ink-500">
                    Inspect flagged items, student disputes, and campus inquiries.
                  </p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600">
                  Manage Requests ({totalRequestsCount})
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href="/admin/listings"
                className="group flex flex-col justify-between rounded-2xl border border-ink-200 bg-white p-5 transition-all hover:border-amber-300 hover:shadow-lift"
              >
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-extrabold text-ink-950 transition-colors group-hover:text-amber-700">
                    Listing Moderation
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-ink-500">
                    Hide, delete, restore, or monitor campus items.
                  </p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600">
                  Review Listings ({listings.length})
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href="/admin/colleges"
                className="group flex flex-col justify-between rounded-2xl border border-ink-200 bg-white p-5 transition-all hover:border-ink-400 hover:shadow-lift"
              >
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-extrabold text-ink-950 transition-colors group-hover:text-ink-700">
                    Colleges &amp; Branches
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-ink-500">
                    Manage 9 Delhi institutions and category directories.
                  </p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-bold text-ink-600">
                  Manage Directory
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Pending Verification Fast Table */}
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-7">
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Pending Student Verifications ({pendingVerificationCount})</span>
              </h2>
              <Link href="/admin/users" className="text-xs font-bold text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline">
                View Full Queue →
              </Link>
            </div>

            {pendingVerificationCount === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs font-medium text-ink-400">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                No pending student verifications at this moment.
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {registeredStudents
                  .filter((s) => s.verificationStatus === 'pending')
                  .slice(0, 3)
                  .map((s) => (
                    <div key={s.id} className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-ink-50 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-ink-950">{s.fullName}</span>
                          <Badge tone="amber" size="sm">
                            {s.enrollmentNumber}
                          </Badge>
                        </div>
                        <span className="text-xs text-ink-500">
                          {s.email} • {s.collegeName} ({s.branch})
                        </span>
                      </div>
                      <Link href="/admin/users" className="shrink-0">
                        <Button variant="dark" size="sm">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Security Audit Log (5 cols) */}
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card lg:col-span-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-ink-100 pb-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-950">
              <ScrollText className="h-4 w-4 text-ink-500" />
              <span>Administrative Audit Log</span>
            </h2>
            <Badge tone="red" size="sm">LIVE</Badge>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            Real-time audit log of student verifications, directory updates, and moderation actions.
          </p>

          <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="space-y-1 rounded-2xl border border-ink-200 bg-ink-50 p-3.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold text-ink-950">{log.action}</span>
                  <span className="shrink-0 text-[11px] text-ink-400">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-ink-600">{log.details}</p>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                  Target: {log.targetType}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
