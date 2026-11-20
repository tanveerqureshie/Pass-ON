'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Tag,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Landmark,
  PackageCheck,
  Info,
  CreditCard,
  ClipboardCheck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState } from '@/components/ui/Common';
import { formatINR } from '@/lib/data/store';
import clsx from 'clsx';

export default function CheckoutPage() {
  const { lines, count, subtotal, discount, deliveryFee, total, placeOrder, lastOrder, items } = useCart();
  const { currentUser, colleges, selectedCollegeId, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [fulfilment, setFulfilment] = useState<'campus-pickup' | 'home-delivery'>('campus-pickup');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  /* Pre-fill from the signed-in profile + chosen campus */
  useEffect(() => {
    if (currentUser) {
      setName((n) => n || currentUser.fullName || '');
      setPhone((p) => p || currentUser.phoneNumber || '');
      setEmail((e) => e || currentUser.email || '');
      setCollege((c) => c || currentUser.collegeId || selectedCollegeId);
    } else {
      setCollege((c) => c || selectedCollegeId);
    }
  }, [currentUser, selectedCollegeId]);

  /* Show confirmation after an order has been placed (clear cart means items==0 but lastOrder set) */
  if (lastOrder && items.length === 0 && placing === false && !hasCartItems(lines)) {
    return (
      <div className="section container-x">
        <div className="mx-auto max-w-xl rounded-3xl border border-ink-200 bg-white p-8 text-center shadow-card sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
            <PackageCheck className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink-950">Order placed!</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Thanks {lastOrder.customer.name.split(' ')[0]} — your order{' '}
            <span className="font-bold text-ink-900">{lastOrder.id}</span> is confirmed for{' '}
            <span className="font-bold text-ink-900">{formatINR(lastOrder.total)}</span>
            {lastOrder.fulfilment === 'campus-pickup' ? ' with campus pickup' : ' with home delivery'}.
          </p>
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-left text-xs leading-relaxed text-amber-800">
            <strong className="font-bold">Demo note:</strong> this storefront currently records orders locally.
            Payments (Razorpay/Stripe) and the real order API connect at the integration point marked in{' '}
            <code className="rounded bg-amber-100 px-1 font-mono">CartContext.placeOrder()</code>.
          </div>
          <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href="/store"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-ink-300 bg-white text-sm font-bold text-ink-900 transition hover:bg-ink-50"
            >
              <ShoppingBag className="h-4 w-4" /> Keep Shopping
            </Link>
            <Link
              href="/"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-ink-950 text-sm font-bold text-white transition hover:bg-ink-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="section container-x">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Your cart is empty. Add a few products from the Pass ON store first."
          actionHref="/store"
          actionLabel="Shop the Store"
        />
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) e.phone = 'Enter a valid 10-digit phone number';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address';
    if (fulfilment === 'campus-pickup' && !college) e.college = 'Select your campus';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlace = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields');
      return;
    }
    setPlacing(true);
    // Simulate a short checkout delay so the demo UX feels real
    setTimeout(() => {
      placeOrder(
        { name: name.trim(), phone: phone.trim(), email: email.trim(), college, notes: notes.trim() },
        fulfilment
      );
      setPlacing(false);
      showToast('Order placed! Confirmation saved locally (demo).');
    }, 900);
  };

  return (
    <div className="section">
      <div className="container-x">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Checkout · Step 2 of 2</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-950">Checkout</h1>
          <p className="mt-1 text-sm text-ink-500">
            Confirm your details and place the order — pay on handover or after checkout integration.
          </p>
        </div>

        <form onSubmit={handlePlace} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="space-y-5">
            {/* Contact */}
            <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink-950">
                <ClipboardCheck className="h-4.5 w-4.5 text-brand-600" /> Contact details
              </h2>
              {!currentUser && (
                <p className="mt-2 rounded-xl bg-ink-50 px-3.5 py-2 text-xs text-ink-600">
                  Have an account?{' '}
                  <Link href="/auth/sign-in" className="font-bold text-brand-700 hover:underline">
                    Sign in
                  </Link>{' '}
                  for faster checkout.
                </p>
              )}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aisha Verma"
                  error={errors.name}
                />
                <Input
                  label="Phone (WhatsApp preferred) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  inputMode="tel"
                  error={errors.phone}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email (optional)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    error={errors.email}
                  />
                </div>
              </div>
            </section>

            {/* Fulfilment */}
            <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink-950">
                <Truck className="h-4.5 w-4.5 text-brand-600" /> How would you like to receive it?
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    id: 'campus-pickup' as const,
                    icon: Landmark,
                    title: 'Campus Pickup',
                    desc: 'Collect between lectures at the Pass ON campus desk. Free.',
                  },
                  {
                    id: 'home-delivery' as const,
                    icon: Truck,
                    title: 'Home Delivery',
                    desc: 'Dispatched across Delhi-NCR. Free over ₹999.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFulfilment(opt.id)}
                    className={clsx(
                      'rounded-2xl border p-4 text-left transition',
                      fulfilment === opt.id
                        ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15'
                        : 'border-ink-200 bg-white hover:border-ink-300'
                    )}
                  >
                    <opt.icon
                      className={clsx(
                        'h-5 w-5',
                        fulfilment === opt.id ? 'text-brand-600' : 'text-ink-500'
                      )}
                    />
                    <p className="mt-2 text-sm font-extrabold text-ink-950">{opt.title}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {fulfilment === 'campus-pickup' && (
                <div className="mt-4">
                  <Select label="Pickup Campus *" value={college} onChange={(e) => setCollege(e.target.value)} error={errors.college}>
                    <option value="">Select your college…</option>
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.short_name} — {c.location}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="mt-4">
                <Textarea
                  label="Delivery / pickup notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Hand over near the library gate after 4 pm"
                  className="min-h-20"
                />
              </div>
            </section>

            {/* Payment — integration point */}
            <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink-950">
                <CreditCard className="h-4.5 w-4.5 text-brand-600" /> Payment
              </h2>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-ink-50 px-4 py-3.5 text-xs leading-relaxed text-ink-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <p>
                  <strong className="font-bold text-ink-900">Pay on handover</strong> is selected for now — the
                  order is recorded and you settle cash/UPI at pickup or delivery. Card/UPI checkout activates
                  automatically once the payment gateway integration (Razorpay/Stripe) is connected; the hook is
                  prepared in <code className="rounded bg-ink-100 px-1 font-mono text-[11px]">placeOrder()</code>.
                </p>
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-extrabold text-ink-950">Your Order</h2>

              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {lines.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg border border-ink-200 bg-white object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-ink-900">{product.name}</p>
                      <p className="text-[11px] text-ink-500">Qty {qty}</p>
                    </div>
                    <p className="text-sm font-bold text-ink-950">{formatINR(product.price * qty)}</p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2.5 border-t border-ink-200 pt-4 text-sm">
                <div className="flex justify-between text-ink-600">
                  <dt>Subtotal ({count} items)</dt>
                  <dd className="font-semibold text-ink-900">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" /> Savings
                  </dt>
                  <dd className="font-semibold text-emerald-600">−{formatINR(discount)}</dd>
                </div>
                <div className="flex justify-between text-ink-600">
                  <dt>Delivery</dt>
                  <dd className="font-semibold text-ink-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatINR(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-ink-200 pt-3 text-lg font-extrabold text-ink-950">
                  <dt>Total</dt>
                  <dd>{formatINR(total)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={placing}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-chip transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60"
              >
                {placing ? 'Placing order…' : <>Place Order <ArrowRight className="h-4 w-4" /></>}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-ink-500">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                Keep your phone reachable — the store team confirms every order.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function hasCartItems(lines: Array<{ product: unknown; qty: number }>) {
  return lines.length > 0;
}
