'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp, ADMIN_CREDENTIALS } from '@/context/AppContext';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loginWithEmail } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as administrator, render the admin portal
  if (currentUser && currentUser.role === 'admin') {
    return <>{children}</>;
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmed = email.trim().toLowerCase();
    const matchingCreds = ADMIN_CREDENTIALS.filter((c) => c.email.toLowerCase() === trimmed);

    if (matchingCreds.length === 0) {
      setError('Invalid administrator email.');
      setLoading(false);
      return;
    }

    const matches = matchingCreds.some(
      (c) => c.password === password.trim() || c.password.toLowerCase() === password.trim().toLowerCase()
    );

    if (!matches) {
      setError('Invalid administrator password.');
      setLoading(false);
      return;
    }

    const logged = loginWithEmail(trimmed, password);
    if (!logged || logged.role !== 'admin') {
      setError('Authentication failed. Please verify credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
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
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Admin Authentication
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Enter administrator credentials to unlock the management console.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/50 p-3 text-center text-xs font-semibold text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin321@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin321"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" block disabled={loading} size="lg">
              {loading ? 'Authenticating…' : 'Access Admin Panel'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
