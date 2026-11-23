'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp, ADMIN_CREDENTIALS } from '@/context/AppContext';
import { UserProfile } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { LogIn, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { setCurrentUser, loginWithEmail, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    // Administrator credential sets
    const matchingAdmins = ADMIN_CREDENTIALS.filter((c) => c.email.toLowerCase() === trimmedEmail);
    if (matchingAdmins.length > 0) {
      const match = matchingAdmins.some(
        (c) => c.password === password.trim() || c.password.toLowerCase() === password.trim().toLowerCase()
      );
      if (!match) {
        setError('Incorrect password for this administrator account.');
        setLoading(false);
        return;
      }
      const loggedAdmin = loginWithEmail(trimmedEmail, password);
      if (loggedAdmin) {
        setLoading(false);
        router.push('/admin');
        return;
      }
    }

    // Local registered students roster
    const loggedUser = loginWithEmail(email, password);
    if (loggedUser) {
      setLoading(false);
      router.push(loggedUser.role === 'admin' ? '/admin' : '/dashboard');
      return;
    }

    // Supabase auth fallback
    try {
      const supabase = createClient();
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) {
        setError('Email or password is incorrect.');
      } else if (data.user) {
        const studentProfile: UserProfile = {
          id: data.user.id,
          email: (data.user.email || email).trim().toLowerCase(),
          fullName: data.user.user_metadata?.full_name || 'College Student',
          collegeId: data.user.user_metadata?.college_id || 'mait',
          collegeName: data.user.user_metadata?.college_name || 'Delhi College',
          collegeShortName: data.user.user_metadata?.college_short_name || 'DELHI',
          branch: data.user.user_metadata?.branch || 'CSE',
          role: 'student',
          verificationStatus: (data.user.user_metadata?.verification_status as any) || 'pending',
          createdAt: data.user.created_at || new Date().toISOString(),
        };

        // Guarantee this student profile is persisted to Supabase database so admin sees them in verification queue
        try {
          await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentProfile),
          });
        } catch (postErr) {
          console.error('Error syncing signed-in student to server:', postErr);
        }

        setCurrentUser(studentProfile);
        try {
          localStorage.setItem('passon_user_v3', JSON.stringify(studentProfile));
        } catch {}
        showToast('Welcome back to Pass ON!');
        router.push('/dashboard');
        return;
      }
    } catch {
      setError('Could not sign you in. Please try again.');
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
          <p className="mt-1 text-sm text-ink-500">Sign in to your Pass ON account.</p>
        </div>

        {/* Card */}
        <div className="card-3d glass-card rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-8">
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" block disabled={loading} size="lg">
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-500">
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
