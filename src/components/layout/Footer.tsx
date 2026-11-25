import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-outline-soft dark:border-slate-800 mt-10 transition-colors">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 pb-14 border-b border-outline-soft dark:border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit" aria-label="PassOn home">
              <div className="w-9 h-9 rounded-2xl bg-mint flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-xl text-text-main dark:text-white">
                Pass<span className="text-mint">On</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-text-muted dark:text-slate-400 max-w-sm leading-relaxed">
              The student-first peer marketplace for verified college campuses. Buy, sell, and exchange textbooks,
              electronics, and dorm essentials with zero platform tax.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint-light dark:bg-mint/15 w-fit text-mint-dark dark:text-mint text-xs font-bold border border-mint/20">
              <ShieldCheck className="h-4 w-4 text-mint shrink-0" />
              <span>100% Verified Campus Peers</span>
            </div>
          </div>

          {/* Marketplace */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-main dark:text-white">
              Marketplace
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-medium text-text-muted dark:text-slate-400">
              <li><Link href="/explore?category=academic" className="hover:text-mint transition-colors">Textbooks &amp; Notes</Link></li>
              <li><Link href="/explore?category=electronics" className="hover:text-mint transition-colors">Electronics &amp; Gadgets</Link></li>
              <li><Link href="/explore?category=hostel-essentials" className="hover:text-mint transition-colors">Dorm Essentials</Link></li>
              <li><Link href="/explore?category=mobility" className="hover:text-mint transition-colors">Cycles &amp; Mobility</Link></li>
              <li><Link href="/explore?category=lab-equipment" className="hover:text-mint transition-colors">Lab Gear &amp; Uniforms</Link></li>
            </ul>
          </div>

          {/* Campuses */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-main dark:text-white">
              Campuses
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-medium text-text-muted dark:text-slate-400">
              <li><Link href="/college/mait" className="hover:text-mint transition-colors">MAIT Delhi</Link></li>
              <li><Link href="/college/msit" className="hover:text-mint transition-colors">MSIT Janakpuri</Link></li>
              <li><Link href="/college/usict" className="hover:text-mint transition-colors">USICT Dwarka</Link></li>
              <li><Link href="/college/usar" className="hover:text-mint transition-colors">USAR East Campus</Link></li>
              <li><Link href="/colleges" className="hover:text-mint transition-colors">Browse All 11 Hubs</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-main dark:text-white">
              Trust &amp; Safety
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-medium text-text-muted dark:text-slate-400">
              <li><Link href="/auth/sign-up" className="hover:text-mint transition-colors">Student Verification</Link></li>
              <li><Link href="/store" className="hover:text-mint transition-colors">Official Campus Store</Link></li>
              <li><Link href="/explore" className="hover:text-mint transition-colors">Zero-Tax Policy</Link></li>
              <li><Link href="/team" className="hover:text-mint transition-colors">Meet the Team</Link></li>
              <li><Link href="/admin" className="hover:text-mint transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-text-muted dark:text-slate-400">
          <span>© {new Date().getFullYear()} PassOn Technologies. Built for Students.</span>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-text-main dark:hover:text-white transition-colors">Marketplace</Link>
            <Link href="/store" className="hover:text-text-main dark:hover:text-white transition-colors">Store</Link>
            <Link href="/team" className="hover:text-text-main dark:hover:text-white transition-colors">Team</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
