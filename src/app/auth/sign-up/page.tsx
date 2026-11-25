'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { uploadToCloudinary } from '@/lib/cloudinary/upload';
import { Input, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { UserPlus, ArrowLeft, ArrowRight, Check, UploadCloud, Camera, Image as ImageIcon, X, Trash2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

export default function SignUpPage() {
  const router = useRouter();
  const { colleges, registerStudent, showToast, setCurrentUser } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeId, setCollegeId] = useState(colleges[0]?.id || 'mait');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [academicYear, setAcademicYear] = useState('2nd Year');
  const [idCardImage, setIdCardImage] = useState<string>('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordScore = calculatePasswordStrength(password);
  const getStrengthLabel = () => {
    if (!password) return { label: '', color: 'bg-slate-200 dark:bg-slate-700' };
    if (passwordScore <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (passwordScore <= 4) return { label: 'Medium', color: 'bg-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, idCard: 'Please upload an image file (PNG, JPG, WEBP).' }));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, idCard: 'ID card photo must be less than 8MB.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, idCard: '' }));
    setIdCardFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setIdCardImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    // 1. Name: Required, min 3 chars, letters/spaces only
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters long.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      newErrors.fullName = 'Name can only contain letters and spaces.';
    }

    // 2. Email: Valid format
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 3. Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      newErrors.password =
        'Password must contain an uppercase letter, lowercase letter, number, and symbol.';
    }

    // 4. Confirm Password: Must match
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!idCardFile && !idCardImage) {
      setErrors({ idCard: 'Please upload your College ID Card photo for campus verification.' });
      return;
    }

    setLoading(true);

    try {
      const selectedCol = colleges.find((c) => c.id === collegeId);

      // Permanently upload student ID card photo to Cloudinary
      let permanentPhotoUrl = idCardImage;
      if (idCardFile) {
        try {
          const uploadedUrl = await uploadToCloudinary(idCardFile, 'pass-on/verification');
          if (uploadedUrl) {
            permanentPhotoUrl = uploadedUrl;
          }
        } catch (uploadErr) {
          console.warn('Cloudinary upload warning:', uploadErr);
        }
      }

      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phoneNumber: phoneNumber.trim(),
        instagramHandle: instagramHandle.trim().replace(/^@/, ''),
        collegeId,
        collegeName: selectedCol?.name || 'Delhi College',
        collegeShortName: selectedCol?.short_name || 'DELHI',
        branch,
        idCardUrl: permanentPhotoUrl,
        academicYear,
      };

      // Call server registration API
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.field) {
          setErrors({ [data.field]: data.message || data.error });
          if (['fullName', 'email', 'password'].includes(data.field)) {
            setStep(1);
          }
        } else {
          setErrors({ general: data.message || data.error || 'Registration failed' });
        }
        setLoading(false);
        return;
      }

      // Update client state without firing a duplicate POST /api/students call
      if (data.student) {
        setCurrentUser(data.student);
        try {
          localStorage.setItem('passon_user_v3', JSON.stringify(data.student));
        } catch {}
      }

      showToast('Account created! Awaiting campus verification.');
      router.push('/dashboard');
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrengthLabel();

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
          <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
            {step === 1 ? 'Step 1 of 2: Account credentials' : 'Step 2 of 2: Campus & ID verification'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <span
                className={clsx(
                  'grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold transition',
                  step >= s ? 'bg-brand-600 text-white shadow-chip' : 'neu-inset text-ink-400 dark:text-slate-600'
                )}
              >
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </span>
              {s === 1 && (
                <span className={clsx('h-1 w-10 rounded-full', step === 2 ? 'bg-brand-600' : 'bg-ink-200 dark:bg-slate-800')} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card-3d glass-card rounded-3xl border border-white/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8">
          {errors.general && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
              {errors.general}
            </div>
          )}

          {step === 1 ? (
            /* ── Step 1 · Account basics ── */
            <form onSubmit={goStep2} className="space-y-4">
              <div>
                <Input
                  label="Full Name (Min 3 characters)"
                  name="fullName"
                  placeholder="e.g. Tanveer Qureshi"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  required
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  label="Password (Min 8 chars: 1 upper, 1 lower, 1 number, 1 symbol)"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  required
                />
                {/* Password strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                      <span className={clsx(
                        passwordScore <= 2 ? 'text-red-500' : passwordScore <= 4 ? 'text-amber-500' : 'text-emerald-500'
                      )}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={clsx('h-full transition-all duration-300', strength.color)}
                        style={{ width: `${(passwordScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  required
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

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
            /* ── Step 2 · Campus & ID verification ── */
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
                      <button
                        type="button"
                        onClick={() => {
                          setIdCardImage('');
                          setIdCardFile(null);
                        }}
                        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-red-600"
                        title="Remove photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between px-1 text-[11px] font-semibold text-teal-800 dark:text-teal-300">
                      <span className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Photo attached for Cloudinary upload
                      </span>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="id-card-input"
                    className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-400/80 bg-teal-50/30 dark:bg-teal-950/20 px-4 py-8 text-center transition hover:border-teal-500 hover:bg-teal-50/60 dark:hover:bg-teal-950/40"
                  >
                    <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 shadow-sm transition group-hover:scale-110">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-ink-900 dark:text-slate-100">Click or tap to upload College ID Card</p>
                    <p className="mt-1 text-[11px] text-ink-500 dark:text-slate-400">Clear photo or scan (PNG, JPG, WEBP up to 8MB)</p>
                    <input
                      id="id-card-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleIdCardChange}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.idCard && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.idCard}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Branch"
                  name="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="MAE / ME">Mechanical</option>
                  <option value="EEE / EE">Electrical</option>
                  <option value="Civil">Civil</option>
                  <option value="Applied Sciences">Applied Sciences</option>
                </Select>

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
                  <option value="Postgraduate">Postgraduate</option>
                </Select>
              </div>

              <Input
                label="WhatsApp Phone Number"
                name="phoneNumber"
                placeholder="10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <Input
                label="Instagram Username (Optional)"
                name="instagramHandle"
                placeholder="e.g. username"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
              />

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" variant="primary" block disabled={loading} size="lg">
                  {loading ? 'Creating Account…' : 'Submit for Verification'}
                </Button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-ink-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-bold text-brand-600 hover:text-brand-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
