'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Tag,
  Truck,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { EmptyState } from '@/components/ui/Common';
import { formatINR, STORE_CATEGORIES } from '@/lib/data/store';

export default function CartPage() {
  const { lines, count, subtotal, discount, deliveryFee, total, setQty, remove, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="section container-x">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to the cart yet. Browse the Pass ON store for student favourites and official merch."
          actionHref="/store"
          actionLabel="Shop the Store"
        />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-x">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Checkout · Step 1 of 2</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-950">Shopping Cart</h1>
            <p className="mt-1 text-sm text-ink-500">
              {count} item{count === 1 ? '' : 's'} · prices inclusive of all taxes
            </p>
          </div>
          <Link
            href="/store"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-300 bg-white px-5 text-sm font-bold text-ink-900 transition hover:border-ink-400 hover:bg-ink-50"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Line items */}
          <div>
            <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
              {lines.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 p-4 sm:p-5">
                  <Link href={`/store/${product.id}`} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 rounded-xl border border-ink-200 bg-white object-contain sm:h-28 sm:w-28"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                          {STORE_CATEGORIES.find((c) => c.id === product.categoryId)?.name}
                        </p>
                        <Link
                          href={`/store/${product.id}`}
                          className="mt-0.5 block font-display text-[15px] font-extrabold leading-snug text-ink-950 hover:text-brand-700"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-500">Brand: {product.brand}</p>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="shrink-0 rounded-full p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-600 transition hover:text-brand-600"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-ink-900">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-600 transition hover:text-brand-600"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-extrabold text-ink-950">
                          {formatINR(product.price * qty)}
                        </p>
                        <p className="text-xs text-ink-400 line-through">{formatINR(product.mrp * qty)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clear}
              className="mt-3 text-xs font-bold text-ink-500 transition hover:text-red-600"
            >
              Clear cart
            </button>
          </div>

          {/* Order summary */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-extrabold text-ink-950">Order Summary</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-ink-600">
                  <dt>Subtotal ({count} items)</dt>
                  <dd className="font-semibold text-ink-900">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" /> Product savings
                  </dt>
                  <dd className="font-semibold text-emerald-600">−{formatINR(discount)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" /> Delivery
                  </dt>
                  <dd className="font-semibold text-ink-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatINR(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-ink-200 pt-3 text-lg font-extrabold text-ink-950">
                  <dt>Total</dt>
                  <dd>{formatINR(total)}</dd>
                </div>
              </dl>

              {deliveryFee > 0 && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-amber-800">
                  Add {formatINR(999 - subtotal)} more to unlock <strong>FREE delivery</strong> to your campus.
                </p>
              )}

              <Link
                href="/checkout"
                className="mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-chip transition hover:bg-brand-700 active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-ink-500">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                Safe campus handover or tracked delivery
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
