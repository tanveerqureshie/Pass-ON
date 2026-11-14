'use client';

import React from 'react';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/data/store';

/** Slide-over shopping cart, opened from the navbar bag icon. */
export const CartDrawer: React.FC = () => {
  const { drawerOpen, setDrawerOpen, lines, count, subtotal, deliveryFee, total, setQty, remove, discount } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-white shadow-lift transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <ShoppingBag className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="font-display text-base font-extrabold text-ink-950">Your Cart</h2>
              <p className="text-xs text-ink-500">{count} item{count === 1 ? '' : 's'}</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lines */}
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-100 text-ink-300">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <p className="font-display text-lg font-extrabold text-ink-950">Your cart is empty</p>
            <p className="text-sm text-ink-500">
              Browse official Pass ON gear and student-favourite products in our store.
            </p>
            <Link
              href="/store"
              onClick={() => setDrawerOpen(false)}
              className="mt-2 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Shop the Store
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-ink-100 overflow-y-auto px-5">
              {lines.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 py-4">
                  <Link href={`/store/${product.id}`} onClick={() => setDrawerOpen(false)} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-xl border border-ink-200 bg-white object-contain"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/store/${product.id}`}
                        onClick={() => setDrawerOpen(false)}
                        className="line-clamp-2 text-sm font-bold leading-snug text-ink-900 hover:text-brand-700"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="shrink-0 rounded-lg p-1 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">{product.brand}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-600 transition hover:text-brand-600"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-ink-900">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-600 transition hover:text-brand-600"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-extrabold text-ink-950">{formatINR(product.price * qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-ink-200 bg-ink-50/60 px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-600">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-ink-900">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" /> Savings
                  </dt>
                  <dd className="font-semibold text-emerald-600">−{formatINR(discount)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Delivery
                  </dt>
                  <dd className="font-semibold text-ink-900">{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-extrabold text-ink-950">
                  <dt>Total</dt>
                  <dd>{formatINR(total)}</dd>
                </div>
              </dl>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-ink-300 bg-white text-sm font-bold text-ink-900 transition hover:bg-ink-50"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-chip transition hover:bg-brand-700"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
