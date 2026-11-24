'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { LogIn, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.field) {
          setFieldErrors({ [data.field]: data.message || 'Invalid credentials' });
        }
        setError(data.message || 'Email or password is incorrect.');
        setLoading(false);
        return;
      }

      if (data.user) {
        setCurrentUser(data.user);
        try {
          localStorage.setItem('passon_user_v3', JSON.stringify(data.user));
        } catch {}
        showToast(`Welcome back, ${data.user.fullName}!`);
        router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-7 text-center">
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">Sign in to your Pass ON account.</p>
        </div>

        {/* Card */}
        <div className="card-3d glass-card rounded-3xl border border-white/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8">
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                }}
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                required
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <Button type="submit" variant="primary" block disabled={loading} size="lg">
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-500 dark:text-slate-400">
            New here?{' '}
            <Link href="/auth/sign-up" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
