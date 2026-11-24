import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MessageCircle, Heart, Github, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />
      <div className="container-x grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-block" aria-label="Pass ON home">
            <Image
              src="/logo-dark-mode.png"
              alt="Pass ON"
              width={140}
              height={38}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>
          <p className="mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-slate-400">
            Pass It On. Save More. The verified student marketplace connecting college seniors and juniors across campus.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {[
              { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/' },
              { icon: Github, label: 'GitHub', href: 'https://github.com/' },
              { icon: Mail, label: 'Email', href: 'mailto:hello@passon.in' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-800 text-slate-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Essential Link 1: Marketplace */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Marketplace</h4>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <li><Link href="/explore" className="text-slate-400 transition hover:text-white">Browse All Items</Link></li>
            <li><Link href="/categories" className="text-slate-400 transition hover:text-white">Categories</Link></li>
            <li><Link href="/explore?type=free" className="text-slate-400 transition hover:text-white">Free Giveaways</Link></li>
            <li><Link href="/sell" className="text-slate-400 transition hover:text-white">Sell / Pass On</Link></li>
          </ul>
        </div>

        {/* Essential Link 2: Store */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Store</h4>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <li><Link href="/store" className="text-slate-400 transition hover:text-white">Campus Store</Link></li>
            <li><Link href="/cart" className="text-slate-400 transition hover:text-white">Cart & Checkout</Link></li>
            <li><Link href="/colleges" className="text-slate-400 transition hover:text-white">Campus Directory</Link></li>
          </ul>
        </div>

        {/* Essential Link 3: Trust & Safety + Team */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Trust & Safety</h4>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Campus ID verification for student listings.</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span>Direct WhatsApp/IG handovers, zero commission.</span>
            </li>
          </ul>
          <div className="mt-5">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition hover:border-blue-500 hover:bg-blue-600"
            >
              Meet the Team →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Pass ON. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/explore" className="transition hover:text-white">Marketplace</Link>
            <Link href="/store" className="transition hover:text-white">Store</Link>
            <Link href="/colleges" className="transition hover:text-white">Campus</Link>
            <Link href="/team" className="transition hover:text-white">Team</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
