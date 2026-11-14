'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  ChevronLeft,
  Landmark,
  ArrowRight,
} from 'lucide-react';
import { STORE_PRODUCTS, STORE_CATEGORIES, getStoreProduct, discountPercent, formatINR } from '@/lib/data/store';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/store/ProductCard';
import { EmptyState } from '@/components/ui/Common';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const product = id ? getStoreProduct(id) : undefined;
  const { add, setDrawerOpen } = useCart();
  const [qty, setQtyLocal] = useState(1);

  const related = useMemo(() => {
    if (!product) return [];
    return STORE_PRODUCTS.filter((p) => p.id !== product.id)
      .sort((a, b) => (a.categoryId === product.categoryId ? 0 : 1) - (b.categoryId === product.categoryId ? 0 : 1))
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="section container-x">
        <EmptyState
          icon={Landmark}
          title="Product not found"
          description="The product you're looking for doesn't exist or may have been sold out and removed."
          actionHref="/store"
          actionLabel="Back to Store"
        />
      </div>
    );
  }

  const off = discountPercent(product);
  const category = STORE_CATEGORIES.find((c) => c.id === product.categoryId);
  const maxQty = Math.min(product.stock, 10);

  return (
    <div className="section pt-8">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav className="mb-7 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-brand-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
          <Link href="/store" className="transition hover:text-brand-600">Our Store</Link>
          <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
          <Link href={`/store?category=${product.categoryId}`} className="transition hover:text-brand-600">
            {category?.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Product image */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
              {off >= 30 && (
                <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-lift">
                  −{off}% Off
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-ink-600">
              {[
                { icon: Truck, label: 'Fast campus delivery' },
                { icon: ShieldCheck, label: 'Quality checked' },
                { icon: RotateCcw, label: 'Easy 7-day swap' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-ink-200 bg-white px-3 py-3.5">
                  <Icon className="mx-auto mb-1.5 h-5 w-5 text-brand-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Purchase panel */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-600">{category?.name}</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-bold text-ink-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {product.rating}
              </span>
              <span className="text-ink-500">{product.ratingCount.toLocaleString('en-IN')} ratings</span>
              <span className="text-ink-300">·</span>
              <span className="font-semibold text-ink-600">Brand: {product.brand}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-600">{product.description}</p>

            {/* Price block */}
            <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink-950">
                  {formatINR(product.price)}
                </span>
                <span className="text-lg font-medium text-ink-400 line-through">{formatINR(product.mrp)}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                  Save {formatINR(product.mrp - product.price)} ({off}%)
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-500">
                <Tag className="h-3.5 w-3.5 text-emerald-600" />
                Inclusive of all taxes · Free delivery over ₹999
              </p>

              {/* Stock note */}
              <p
                className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${
                  product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {product.stock <= 5 ? `Hurry — only ${product.stock} left in stock` : 'In stock and ready to ship'}
              </p>

              {/* Quantity + actions */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-ink-300 bg-white">
                  <button
                    onClick={() => setQtyLocal((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:text-brand-600 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center font-display text-base font-extrabold text-ink-950">{qty}</span>
                  <button
                    onClick={() => setQtyLocal((q) => Math.min(maxQty, q + 1))}
                    aria-label="Increase quantity"
                    disabled={qty >= maxQty}
                    className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:text-brand-600 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  variant="dark"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    add(product.id, qty);
                    setDrawerOpen(true);
                  }}
                >
                  <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                </Button>
              </div>
              <Link
                href="/cart"
                className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-ink-300 text-sm font-bold text-ink-800 transition hover:border-ink-400 hover:bg-ink-50"
              >
                Go to Cart <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Highlights */}
            <div className="mt-6">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink-950">
                Product highlights
              </h2>
              <ul className="mt-3 space-y-2.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Keep browsing</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950">
                You may also like
              </h2>
            </div>
            <Link href="/store" className="group inline-flex items-center gap-2 text-sm font-bold text-brand-700">
              <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" /> Back to Store
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
