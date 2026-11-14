'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp, DEFAULT_ADMIN_PROFILE, ADMIN_CREDENTIALS } from '@/context/AppContext';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { LogIn, Shield, ArrowRight } from 'lucide-react';

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
    const admin = ADMIN_CREDENTIALS.find((c) => c.email === trimmedEmail);
    if (admin) {
      if (password !== admin.password) {
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
        setCurrentUser({
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || 'College Student',
          collegeId: data.user.user_metadata?.college_id || 'mait',
          branch: data.user.user_metadata?.branch || 'CSE',
          role: data.user.user_metadata?.role || 'student',
          verificationStatus: data.user.user_metadata?.verification_status || 'approved',
          createdAt: data.user.created_at,
        });
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

  /* Quick admin login — credentials are intentionally NOT displayed here. */
  const handleQuickAdminLogin = () => {
    setCurrentUser(DEFAULT_ADMIN_PROFILE);
    localStorage.setItem('passon_user_v3', JSON.stringify(DEFAULT_ADMIN_PROFILE));
    showToast('Logged in as Administrator (Tanveer Qureshi)');
    router.push('/admin');
  };

  return (
    <div className="container-x flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-lift">
            <LogIn className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
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

        {/* Quick admin */}
        <div className="mt-5">
          <Button type="button" variant="dark" block onClick={handleQuickAdminLogin}>
            <Shield className="h-4 w-4" />
            One-Click Admin Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
