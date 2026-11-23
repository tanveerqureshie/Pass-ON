'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  ExternalLink,
  Users,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Instagram,
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  badge: string;
  bio: string;
  image: string;
  /** Optional clickable contact channels — each renders as a real link */
  website?: string;
  websiteDisplay?: string;
  instagram?: string;
  whatsapp?: string;
}

const MEMBERS: TeamMember[] = [
  {
    name: 'Tanveer Qureshie',
    role: 'Founder & Product Architect',
    badge: 'Founder',
    bio: 'Visionary founder of Pass ON. Architected the platform vision, the student verification pipeline, and the privacy-first peer exchange model that helps Delhi engineering students cut academic waste and save money.',
    image: '/team/member-1.jpg',
    website: 'https://www.tanveerqureshie.tech',
    websiteDisplay: 'www.tanveerqureshie.tech',
  },
  {
    name: 'Aastha Pasrija',
    role: 'Associate Founder & Operations Lead',
    badge: 'Associate Founder',
    bio: 'Driving inter-campus partnerships, managing campus ambassador operations, and strengthening student engagement across Delhi’s educational institutions. Focused on building meaningful collaborations, streamlining operations, and expanding the platform’s reach within the student community.',
    image: '/team/member-2.jpg',
  },
];

export default function TeamPage() {
  return (
    <div className="py-10">
      <div className="container-x space-y-10">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 text-center text-white shadow-lift sm:py-16">
          {/* Ambient floating blobs */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 animate-float-slow rounded-full bg-brand-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 animate-float-slower rounded-full bg-brand-600/15 blur-3xl" />

          <div className="relative mx-auto max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur">
              <Users className="h-3.5 w-3.5 text-brand-400" />
              Pass ON Core Team
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Meet Our Team
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Two Delhi students on a mission to make every academic essential affordable — and keep it moving
              from one shelf to the next.
            </p>
          </div>
        </section>

        {/* ── Member cards ── */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {MEMBERS.map((member) => (
            <article
              key={member.name}
              className="card-3d glass-card relative flex flex-col items-center rounded-3xl border border-ink-200/60 bg-white/70 p-8 text-center backdrop-blur-xl"
            >
              {/* Circular portrait with brand ring */}
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-brand-600 via-brand-500 to-ink-950 opacity-80"
                  style={{ transform: 'rotate(45deg)' }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="relative h-36 w-36 rounded-full border-4 border-white object-cover shadow-lift"
                />
                <span className="absolute -right-2 bottom-1 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lift">
                  {member.badge}
                </span>
              </div>

              <h2 className="mt-5 font-display text-xl font-extrabold tracking-tight text-ink-950">
                {member.name}
              </h2>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-brand-600">{member.role}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">{member.bio}</p>

              {/* Clickable contact channels */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex h-10 items-center gap-2 rounded-full bg-ink-950 px-5 text-xs font-bold text-white transition hover:bg-brand-600"
                  >
                    <Globe className="h-4 w-4" />
                    {member.websiteDisplay}
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={`https://instagram.com/${member.instagram.replace(/^@+/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 text-xs font-bold text-white transition hover:opacity-90"
                  >
                    <Instagram className="h-4 w-4" />
                    @{member.instagram.replace(/^@+/, '')}
                  </a>
                )}
                {member.whatsapp && (
                  <a
                    href={`https://wa.me/91${member.whatsapp.replace(/\D/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-5 text-xs font-bold text-white transition hover:bg-emerald-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                {!member.website && !member.instagram && !member.whatsapp && (
                  <span className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-5 text-xs font-bold text-ink-500">
                    <Sparkles className="h-4 w-4 text-brand-600" />
                    Reach out via Pass ON
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* ── Back ── */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 transition hover:text-brand-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
