'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/Common';
import {
  Users,
  Shield,
  ArrowLeft,
  Clock,
  XCircle,
  Search,
  Check,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminUsersPage() {
  const {
    registeredStudents,
    approveStudent,
    rejectStudent,
    logAdminAction,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionModalUser, setRejectionModalUser] = useState<UserProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [inspectingIdUser, setInspectingIdUser] = useState<UserProfile | null>(null);

  // Count pending
  const pendingCount = registeredStudents.filter((s) => s.verificationStatus === 'pending').length;

  const filtered = registeredStudents.filter((u) => {
    if (activeTab === 'pending' && u.verificationStatus !== 'pending') return false;
    if (activeTab === 'approved' && u.verificationStatus !== 'approved') return false;
    if (activeTab === 'rejected' && u.verificationStatus !== 'rejected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = u.fullName.toLowerCase().includes(q);
      const matchesEnrollment = u.enrollmentNumber?.toLowerCase().includes(q);
      const matchesCollege = u.collegeName?.toLowerCase().includes(q);
      if (!matchesName && !matchesEnrollment && !matchesCollege) return false;
    }
    return true;
  });

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalUser) return;
    const targetId = rejectionModalUser.id;
    const reason = rejectionReason.trim() || 'Enrollment number could not be verified against college database.';
    setRejectionModalUser(null);
    setRejectionReason('');
    await rejectStudent(targetId, reason);
  };

  const tabs = [
    {
      key: 'pending' as const,
      icon: Clock,
      iconClass: 'text-amber-500',
      label: 'Pending Review',
      activeClass: 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15',
      count: pendingCount,
      countClass: 'bg-amber-100 text-amber-800',
    },
    {
      key: 'approved' as const,
      icon: CheckCircle,
      iconClass: 'text-emerald-600',
      label: 'Verified Students',
      activeClass: 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15',
    },
    {
      key: 'rejected' as const,
      icon: XCircle,
      iconClass: 'text-red-600',
      label: 'Rejected',
      activeClass: 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15',
    },
    {
      key: 'all' as const,
      label: `All Accounts (${registeredStudents.length})`,
      activeClass: 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15',
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
          <Badge tone="green" size="sm">
            <Shield className="h-3 w-3" /> Manual Verification Console
          </Badge>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
          Student Verification &amp; User Approvals
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Review submitted student enrollment numbers, verify against college departmental records, and approve or reject access.
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        {/* Verification Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition-all',
                activeTab === tab.key
                  ? tab.activeClass
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
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search student or enrollment #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9 text-xs sm:w-64"
          />
        </div>
      </div>

      {/* Verification Queue List */}
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        {filtered.length === 0 ? (
          <div className="p-8 sm:p-10">
            <EmptyState
              icon={Users}
              title="No students found in this verification queue"
              description={
                activeTab === 'pending'
                  ? 'All student registrations have been reviewed and verified!'
                  : 'Try clearing your search query to see more accounts.'
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {filtered.map((u) => {
              const isPending = u.verificationStatus === 'pending';
              const isApproved = u.verificationStatus === 'approved';
              const isRejected = u.verificationStatus === 'rejected';

              return (
                <div
                  key={u.id}
                  className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-ink-50/60 md:flex-row md:items-center sm:p-6"
                >
                  {/* Left: Student Profile & Enrollment Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={clsx(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border font-display text-base font-extrabold',
                        isApproved
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : isRejected
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-ink-200 bg-ink-100 text-ink-700'
                      )}
                    >
                      {u.fullName.charAt(0)}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-extrabold text-ink-950">{u.fullName}</span>

                        {/* Verification Status Pill */}
                        {isApproved && (
                          <Badge tone="green" size="sm">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </Badge>
                        )}

                        {isPending && (
                          <Badge tone="amber" size="sm">
                            <Clock className="h-3 w-3" /> Pending Review
                          </Badge>
                        )}

                        {isRejected && (
                          <Badge tone="red" size="sm">
                            <XCircle className="h-3 w-3" /> Rejected
                          </Badge>
                        )}

                        <Badge tone="outline" size="sm">
                          {u.role}
                        </Badge>
                      </div>

                      {/* Detailed info pills */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-500">
                        <span>{u.email}</span>
                        <span>•</span>
                        <span className="font-bold text-ink-800">{u.collegeName}</span>
                        <span>•</span>
                        <span>{u.branch || 'CSE'} ({u.academicYear || '1st Year'})</span>
                        <span>•</span>
                        <span>Phone: {u.phoneNumber}</span>
                      </div>

                      {/* College ID Card Photo Preview Thumbnail */}
                      <div className="flex flex-wrap items-center gap-3 pt-1.5">
                        {u.idCardUrl ? (
                          <button
                            type="button"
                            onClick={() => setInspectingIdUser(u)}
                            className="group relative flex items-center gap-2.5 rounded-xl border-2 border-teal-500/80 bg-teal-50/70 dark:bg-teal-950/40 p-1.5 transition hover:scale-[1.02] hover:shadow-md cursor-pointer text-left"
                          >
                            <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-slate-900 border border-teal-600/40">
                              <img
                                src={u.idCardUrl}
                                alt={`ID Card of ${u.fullName}`}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div className="pr-2">
                              <span className="block text-[11px] font-extrabold text-teal-800 dark:text-teal-300">
                                Inspect College ID Card
                              </span>
                              <span className="block text-[10px] text-ink-500 dark:text-slate-400">
                                Click to verify full photo
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                              ID Card:
                            </span>
                            <Badge tone="gray" size="sm">
                              No photo attached
                            </Badge>
                          </div>
                        )}

                        {u.enrollmentNumber && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink-400">
                              Enrollment #:
                            </span>
                            <Badge tone={isApproved ? 'green' : isPending ? 'amber' : 'gray'} size="sm">
                              <span className="font-mono">{u.enrollmentNumber}</span>
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Rejection note if any */}
                      {u.rejectionReason && (
                        <p className="max-w-xl rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium leading-relaxed text-red-700">
                          Decline Note: {u.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Verification Approval Actions */}
                  <div className="flex w-full shrink-0 items-center gap-2 border-t border-ink-100 pt-3 md:w-auto md:border-t-0 md:pt-0">
                    {/* Approve Action */}
                    {!isApproved && (
                      <Button variant="dark" size="sm" onClick={() => approveStudent(u.id)}>
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve Student</span>
                      </Button>
                    )}

                    {/* Reject Action */}
                    {!isRejected && (
                      <Button variant="danger" size="sm" onClick={() => setRejectionModalUser(u)}>
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </Button>
                    )}

                    {isApproved && (
                      <span className="px-2 text-xs font-semibold text-ink-400">Active Verified Student</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <Modal
        open={rejectionModalUser !== null}
        onClose={() => setRejectionModalUser(null)}
        title="Reject Verification Application"
        description={
          rejectionModalUser
            ? `Rejecting verification for ${rejectionModalUser.fullName} (${rejectionModalUser.enrollmentNumber}). Please specify the reason to help the student correct their details.`
            : undefined
        }
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              The student will be notified and their campus access will remain restricted until re-verification.
            </p>
          </div>

          <Textarea
            label="Reason for Rejection"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Enrollment number does not match MAIT CSE 2023 records. Please check your roll number."
            required
          />

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setRejectionModalUser(null)} className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" variant="danger" className="w-1/2">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* ID Card Full Size Inspection Modal */}
      <Modal
        open={inspectingIdUser !== null}
        onClose={() => setInspectingIdUser(null)}
        title="Student College ID Card Inspection"
        description={
          inspectingIdUser
            ? `Reviewing submitted college ID card for ${inspectingIdUser.fullName} (${inspectingIdUser.collegeName}).`
            : undefined
        }
        size="lg"
      >
        {inspectingIdUser && (
          <div className="space-y-5">
            {/* High-res Image Preview */}
            <div className="relative aspect-[16/10] max-h-[440px] w-full overflow-hidden rounded-2xl border-2 border-teal-500/40 bg-slate-950 flex items-center justify-center p-2 shadow-inner">
              {inspectingIdUser.idCardUrl ? (
                <img
                  src={inspectingIdUser.idCardUrl}
                  alt={`Student ID of ${inspectingIdUser.fullName}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <p className="text-sm text-slate-400">No ID card photo attached</p>
              )}
            </div>

            {/* Student Details Grid */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-cream-100/70 dark:bg-slate-800/60 p-4 text-xs border border-cream-200 dark:border-slate-700">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Student Name</span>
                <span className="font-bold text-ink-950 dark:text-white text-sm">{inspectingIdUser.fullName}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Campus Institution</span>
                <span className="font-bold text-teal-800 dark:text-teal-300 text-sm">{inspectingIdUser.collegeName}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Branch & Academic Year</span>
                <span className="font-semibold text-ink-800 dark:text-slate-200">{inspectingIdUser.branch || 'CSE'} • {inspectingIdUser.academicYear || '1st Year'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Student Email & Phone</span>
                <span className="font-semibold text-ink-800 dark:text-slate-200">{inspectingIdUser.email} • {inspectingIdUser.phoneNumber || 'N/A'}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setInspectingIdUser(null)}>
                Close
              </Button>
              <div className="flex items-center gap-2">
                {inspectingIdUser.verificationStatus !== 'rejected' && (
                  <Button
                    variant="danger"
                    onClick={() => {
                      const u = inspectingIdUser;
                      setInspectingIdUser(null);
                      setRejectionModalUser(u);
                    }}
                  >
                    <XCircle className="h-4 w-4" /> Reject ID
                  </Button>
                )}
                {inspectingIdUser.verificationStatus !== 'approved' && (
                  <Button
                    variant="dark"
                    onClick={() => {
                      approveStudent(inspectingIdUser.id);
                      setInspectingIdUser(null);
                      showToast(`Approved ${inspectingIdUser.fullName} against College ID!`);
                    }}
                  >
                    <Check className="h-4 w-4" /> Approve Student ID
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
