import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MessageCircle, Heart, Landmark, Mail, Github, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />
      <div className="container-x grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-block" aria-label="Pass ON home">
            <Image
              src="/logo-dark-mode.png"
              alt="Pass ON"
              width={150}
              height={42}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Pass It On. Save More. The verified campus marketplace connecting seniors and juniors across Delhi
            engineering institutions — plus our own store for student essentials.
          </p>
          <div className="mt-5 flex items-center gap-2">
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
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-800 text-slate-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Marketplace */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Marketplace</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/explore" className="text-slate-400 transition hover:text-white">Browse All Items</Link></li>
            <li><Link href="/categories" className="text-slate-400 transition hover:text-white">Categories</Link></li>
            <li><Link href="/explore?type=free" className="text-slate-400 transition hover:text-white">Free Giveaways</Link></li>
            <li><Link href="/explore?type=borrow" className="text-slate-400 transition hover:text-white">Borrow & Lend</Link></li>
            <li><Link href="/sell" className="text-slate-400 transition hover:text-white">Sell an Item</Link></li>
            <li><Link href="/dashboard" className="text-slate-400 transition hover:text-white">Student Dashboard</Link></li>
          </ul>
        </div>

        {/* Store + colleges */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Our Store & Colleges</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/store" className="text-slate-400 transition hover:text-white">Shop the Store</Link></li>
            <li><Link href="/store?category=books" className="text-slate-400 transition hover:text-white">Books & Study Material</Link></li>
            <li><Link href="/store?category=electronics" className="text-slate-400 transition hover:text-white">Electronics & Accessories</Link></li>
            <li><Link href="/cart" className="text-slate-400 transition hover:text-white">Cart & Checkout</Link></li>
            <li><Link href="/college/mait" className="text-slate-400 transition hover:text-white">MAIT — Rohini</Link></li>
            <li><Link href="/college/msit" className="text-slate-400 transition hover:text-white">MSIT — Janakpuri</Link></li>
            <li><Link href="/colleges" className="text-slate-400 transition hover:text-white">All 11 Delhi Colleges →</Link></li>
          </ul>
        </div>

        {/* Trust */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Trust & Safety</h4>
          <ul className="mt-4 space-y-3.5 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span>Every seller is manually verified against college enrollment records.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>Direct WhatsApp handovers — contacts stay private, zero commission.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span>Meet-ups in safe, well-lit campus spots. Free giveaways supported.</span>
            </li>
          </ul>
          <Link
            href="/team"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-xs font-bold text-white transition hover:border-blue-500 hover:bg-blue-600"
          >
            Meet the Team
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Pass ON — Made for Delhi-NCR college students.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/explore" className="transition hover:text-white">Marketplace</Link>
            <Link href="/store" className="transition hover:text-white">Store</Link>
            <Link href="/colleges" className="transition hover:text-white">Campuses</Link>
            <Link href="/team" className="transition hover:text-white">Team</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
