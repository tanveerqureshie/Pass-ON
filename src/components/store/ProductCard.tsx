'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { StoreProduct, discountPercent, formatINR, STORE_CATEGORIES } from '@/lib/data/store';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

const BADGE_STYLE: Record<string, string> = {
  featured: 'bg-brand-600 text-white',
  new: 'bg-emerald-500 text-white',
  bestseller: 'bg-ink-950 text-white',
  sale: 'bg-amber-400 text-ink-950',
};

export function ProductCard({ product }: { product: StoreProduct }) {
  const { add } = useCart();
  const off = discountPercent(product);
  const categoryName = STORE_CATEGORIES.find((c) => c.id === product.categoryId)?.name;

  return (
    <article className="card-3d glass-card group flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl hover:border-brand-200">
      {/* Image */}
      <div className="relative">
        <Link href={`/store/${product.id}`} aria-label={product.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full rounded-t-2xl object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off >= 30 && (
            <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-chip">
              −{off}% Off
            </span>
          )}
          {product.badges.includes('new') && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-chip">
              New
            </span>
          )}
          {product.badges.includes('bestseller') && (
            <span className="rounded-full bg-ink-950 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-chip">
              Bestseller
            </span>
          )}
        </div>
        {product.stock <= 5 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300 backdrop-blur">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-400">{categoryName}</p>
        <Link href={`/store/${product.id}`} className="mt-1">
          <h3 className="font-display text-[15px] font-extrabold leading-snug text-ink-950 transition-colors line-clamp-2 hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">{product.short}</p>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-ink-600">
          <span className="flex items-center gap-0.5 rounded-full bg-ink-100 px-1.5 py-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
          <span className="text-ink-400">({product.ratingCount.toLocaleString('en-IN')})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold text-ink-950">{formatINR(product.price)}</span>
          <span className="text-xs font-medium text-ink-400 line-through">{formatINR(product.mrp)}</span>
        </div>

        <div className="mt-3.5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/store/${product.id}`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-ink-300 bg-white text-xs font-bold text-ink-800 transition hover:border-ink-400 hover:bg-ink-50"
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </Link>
          <button
            onClick={() => add(product.id)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 text-xs font-bold text-white shadow-chip transition hover:bg-brand-700 active:scale-[0.97]"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
