'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { createClient } from '@/lib/supabase/client';
import { Input, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { UserPlus, ArrowLeft, ArrowRight, Check, GraduationCap, UploadCloud, Camera, Image as ImageIcon, X, Trash2 } from 'lucide-react';
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
  const [academicYear, setAcademicYear] = useState('2nd Year');
  const [idCardImage, setIdCardImage] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('ID card photo must be less than 5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setIdCardImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

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

    if (!idCardImage) {
      setError('Please upload your College ID Card photo for campus verification.');
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
        idCardUrl: idCardImage,
        academicYear,
        password,
        role: 'student',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      await registerStudent(newStudent);

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
              id_card_url: idCardImage,
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
          <Link href="/" className="inline-block mb-3">
            <Image
              src="/logo.png"
              alt="Pass ON"
              width={160}
              height={48}
              priority
              className="h-11 sm:h-12 w-auto object-contain mx-auto dark:hidden"
            />
            <Image
              src="/logo-dark-mode.png"
              alt="Pass ON"
              width={160}
              height={48}
              priority
              className="h-11 sm:h-12 w-auto object-contain mx-auto hidden dark:block"
            />
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950 dark:text-white sm:text-3xl">
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
                placeholder="e.g. Mr Tanveer"
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
              {/* College ID Card Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink-900 dark:text-slate-200">
                  College Student ID Card Photo <span className="text-teal-600 dark:text-teal-400">*</span>
                </label>

                {idCardImage ? (
                  <div className="relative overflow-hidden rounded-2xl border-2 border-teal-500/80 bg-teal-50/40 dark:bg-teal-950/40 p-2.5">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-900">
                      <Image
                        src={idCardImage}
                        alt="Uploaded College ID Card"
                        fill
                        sizes="(max-width: 768px) 100vw, 640px"
                        unoptimized
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <label className="cursor-pointer rounded-lg bg-black/75 hover:bg-black px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur shadow-sm transition">
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleIdCardChange}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setIdCardImage('')}
                          className="grid h-7 w-7 place-items-center rounded-lg bg-red-600/85 hover:bg-red-600 text-white shadow-sm transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-[11px] font-semibold text-teal-800 dark:text-teal-300">
                      ✓ ID Card photo attached for admin verification
                    </p>
                  </div>
                ) : (
                  <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 dark:border-teal-700 hover:border-teal-500 bg-white/70 dark:bg-slate-900/60 p-5 text-center transition hover:bg-teal-50/40 dark:hover:bg-teal-950/30">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 mb-2.5 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-ink-900 dark:text-slate-100">
                      Click to upload your Student ID Card Photo
                    </span>
                    <span className="mt-1 text-[11px] text-ink-400 dark:text-slate-400">
                      PNG, JPG, or WEBP up to 5MB (physical card photo or digital ID)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleIdCardChange}
                    />
                  </label>
                )}
                <p className="text-[11px] text-ink-400 dark:text-slate-400">
                  Only college admins inspect this photo — it is never shown publicly.
                </p>
              </div>

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

              <div className="flex items-start gap-2.5 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/30 p-3 text-[11px] leading-relaxed text-ink-600 dark:text-slate-300">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                After signing up, campus admins verify your uploaded Student ID card photo. You can browse right away — posting unlocks
                once approved.
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
