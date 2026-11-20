'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Input, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { User, ShieldCheck, Clock, XCircle, Check, ArrowLeft, BadgeCheck } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, colleges, updateProfile, setSelectedCollegeId, showToast } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [collegeId, setCollegeId] = useState(currentUser?.collegeId || 'mait');
  const [branch, setBranch] = useState(currentUser?.branch || 'CSE');
  const [academicYear, setAcademicYear] = useState(currentUser?.academicYear || '3rd Year');
  const [enrollmentNumber, setEnrollmentNumber] = useState(currentUser?.enrollmentNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [instagramHandle, setInstagramHandle] = useState(currentUser?.instagramHandle || '');

  const selectedColObj = colleges.find((c) => c.id === collegeId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Name cannot be empty');
      return;
    }

    updateProfile({
      fullName,
      collegeId,
      collegeName: selectedColObj?.name || 'Delhi College',
      branch,
      academicYear,
      enrollmentNumber,
      phoneNumber,
      instagramHandle,
    });

    setSelectedCollegeId(collegeId);
  };

  const status = currentUser?.verificationStatus || 'pending';

  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-4xl space-y-7">
        {/* Header */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-700">
            <User className="h-3 w-3" /> Student Profile &amp; Preferences
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            Profile &amp; Campus Verification
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your verified college credentials and choose how other students can contact you.
          </p>
        </div>

        {/* Profile form */}
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-9"
        >
          {/* Identity block */}
          <div className="flex flex-col justify-between gap-4 border-b border-ink-100 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 font-display text-2xl font-extrabold text-white shadow-card">
                {fullName ? fullName.charAt(0) : 'U'}
              </span>
              <div>
                <span className="block font-display text-lg font-extrabold text-ink-950">{fullName}</span>
                <span className="text-xs font-medium text-ink-500">{currentUser?.email}</span>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold capitalize text-ink-700">
                    {currentUser?.role}
                  </span>
                  {currentUser?.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-ink-950 px-2.5 py-0.5 text-xs font-bold text-white">
                      <ShieldCheck className="h-3.5 w-3.5" /> Campus Admin
                    </span>
                  ) : status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Student
                    </span>
                  ) : status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700">
                      <XCircle className="h-3.5 w-3.5" /> Verification Declined
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                      <Clock className="h-3.5 w-3.5" /> Pending Verification
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verification status card */}
          <div
            className={`space-y-1.5 rounded-2xl border p-4 ${
              status === 'rejected'
                ? 'border-red-200 bg-red-50'
                : status === 'approved'
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold text-ink-950">Campus Verification Status</span>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-ink-900">
                {status}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-ink-600">
              {status === 'approved'
                ? 'Your student status has been confirmed by campus administrators. You have full access to list items, participate in borrowing, and chat on WhatsApp or Instagram.'
                : status === 'rejected'
                  ? `Your application was declined: ${currentUser?.rejectionReason || 'Details could not be matched against university records.'}`
                  : 'Your application is awaiting manual verification by campus administrators. Browsing is unlocked.'}
            </p>
            {currentUser?.idCardUrl && (
              <div className="pt-2 flex items-center gap-3 border-t border-black/5 mt-2">
                <div className="h-12 w-20 overflow-hidden rounded-lg border border-teal-500/60 bg-slate-900 shrink-0">
                  <img src={currentUser.idCardUrl} alt="Uploaded College ID Card" className="h-full w-full object-cover" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink-900">Submitted College ID Card</span>
                  <span className="block text-[11px] text-ink-500">Verified by campus administration</span>
                </div>
              </div>
            )}
          </div>

          <Input
            label="Full Student Name"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Primary College Campus"
              name="college"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
            >
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.short_name} — {col.location}
                </option>
              ))}
            </Select>

            <Select
              label="Department / Branch"
              name="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {(selectedColObj?.branches || ['CSE']).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Academic Year"
              name="academicYear"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </Select>

            <Input
              label="Enrollment / Roll Number"
              name="enrollment"
              placeholder="e.g. 04114802721"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              helper="Confidential verification"
              required
            />

            <Input
              label="WhatsApp Number (Optional)"
              type="tel"
              name="phone"
              placeholder="10-digit number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helper="Share only if comfortable"
            />
          </div>

          <Input
            label="Instagram Username (Optional)"
            name="instagram"
            placeholder="@yourusername"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            helper="Used as a private alternative to WhatsApp."
          />

          <div className="flex items-center justify-between border-t border-ink-100 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600 transition hover:text-ink-950"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>

            <Button type="submit" variant="primary">
              <BadgeCheck className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
