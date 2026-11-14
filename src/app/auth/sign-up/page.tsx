'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { createClient } from '@/lib/supabase/client';
import { Input, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { UserPlus, ArrowLeft, ArrowRight, Check, GraduationCap } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

export default function SignUpPage() {
  const router = useRouter();
  const { colleges, registerStudent, showToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeId, setCollegeId] = useState(colleges[0]?.id || 'mait');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('2nd Year');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedColObj = colleges.find((c) => c.id === collegeId);

  const goStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setStep(2);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!enrollmentNumber.trim()) {
      setError('Enrollment number is required for campus verification.');
      return;
    }

    setLoading(true);

    try {
      const selectedCol = colleges.find((c) => c.id === collegeId);

      // Register into local state & Supabase
      const newStudent: UserProfile = {
        id: `student_${Date.now()}`,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        instagramHandle: instagramHandle.trim().replace(/^@/, ''),
        collegeId,
        collegeName: selectedCol?.name || 'Delhi College',
        collegeShortName: selectedCol?.short_name || 'DELHI',
        branch,
        enrollmentNumber: enrollmentNumber.trim(),
        academicYear,
        password,
        role: 'student',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      registerStudent(newStudent);

      // Also register into Supabase Auth if available
      try {
        const supabase = createClient();
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              college_id: collegeId,
              college_name: selectedCol?.name,
              college_short_name: selectedCol?.short_name,
              branch,
              enrollment_number: enrollmentNumber.trim(),
              phone_number: phoneNumber.trim(),
              instagram_handle: instagramHandle.trim().replace(/^@/, ''),
              academic_year: academicYear,
              role: 'student',
              verification_status: 'pending',
            },
          },
        });
      } catch {
        // Fallback to local demo storage handled gracefully
      }

      showToast('Account created! Awaiting campus verification.');
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-lift">
            <UserPlus className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {step === 1 ? 'Two quick steps — under a minute.' : 'Almost done — campus details.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <span
                className={clsx(
                  'grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold transition',
                  step >= s ? 'bg-brand-600 text-white shadow-chip' : 'neu-inset text-ink-400'
                )}
              >
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </span>
              {s === 1 && <span className={clsx('h-1 w-10 rounded-full', step === 2 ? 'bg-brand-600' : 'bg-ink-200')} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card-3d glass-card rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-8">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {step === 1 ? (
            /* ── Step 1 · Account basics ── */
            <form onSubmit={goStep2} className="space-y-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="e.g. Tanveer Singh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Select
                label="Your College"
                name="college"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.short_name} — {c.name}
                  </option>
                ))}
              </Select>

              <Button type="submit" variant="primary" block size="lg">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            /* ── Step 2 · Campus & contact ── */
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                label="Enrollment / Roll Number"
                name="enrollmentNumber"
                placeholder="e.g. 04114802721"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
                helper="Only admins see this — used to verify you're a real student."
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Branch"
                  name="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  {(selectedColObj?.branches || ['CSE', 'IT', 'ECE', 'MAE', 'General']).map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Year"
                  name="academicYear"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="WhatsApp (optional)"
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Input
                  label="Instagram (optional)"
                  name="instagram"
                  placeholder="@handle"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl border border-ink-200 bg-ink-50 p-3 text-[11px] leading-relaxed text-ink-500">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                After signing up, admins verify your enrollment number. You can browse right away — posting unlocks
                once verified.
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="shrink-0">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" variant="primary" block size="lg" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-ink-500">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-bold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
