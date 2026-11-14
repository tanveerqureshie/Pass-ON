'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORE_PRODUCTS, getStoreProduct, type StoreProduct } from '@/lib/data/store';
import { useApp } from '@/context/AppContext';

export interface CartLine {
  productId: string;
  qty: number;
}

export interface PlacedOrder {
  id: string;
  createdAt: string;
  lines: Array<{ productId: string; name: string; qty: number; price: number }>;
  total: number;
  customer: { name: string; phone: string; email?: string; college?: string; notes?: string };
  fulfilment: 'campus-pickup' | 'home-delivery';
}

interface CartContextType {
  items: CartLine[];
  lines: Array<{ product: StoreProduct; qty: number }>; // resolved
  count: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  savingsPct: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  lastOrder: PlacedOrder | null;
  placeOrder: (
    customer: PlacedOrder['customer'],
    fulfilment: PlacedOrder['fulfilment']
  ) => PlacedOrder; // integration point for real backend
}

const STORAGE_KEY = 'passon_store_cart_v1';
const ORDER_KEY = 'passon_store_order_v1';
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 79;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
      const o = localStorage.getItem(ORDER_KEY);
      if (o) setLastOrder(JSON.parse(o));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = (productId: string, qty = 1) => {
    const product = getStoreProduct(productId);
    if (!product) return;
    let next = [...items];
    const existing = next.find((i) => i.productId === productId);
    const max = Math.min(product.stock, 10);
    if (existing) {
      next = next.map((i) =>
        i.productId === productId ? { ...i, qty: Math.min(max, i.qty + qty) } : i
      );
    } else {
      next.push({ productId, qty: Math.min(max, qty) });
    }
    setItems(next);
    showToast(`${product.name} added to cart`);
  };

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    showToast('Removed from cart');
  };

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      remove(productId);
      return;
    }
    const max = Math.min(getStoreProduct(productId)?.stock ?? 10, 10);
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(max, qty) } : i))
    );
  };

  const clear = () => setItems([]);

  const placeOrder = (
    customer: PlacedOrder['customer'],
    fulfilment: PlacedOrder['fulfilment']
  ): PlacedOrder => {
    /* --------------------------------------------------------------------
     * INTEGRATION POINT — Orders & Payments
     * Replace this local demo order with a POST to your backend, then the
     * response should be persisted. Suggested flow:
     *   1. Create order: POST /api/orders { items, customer, fulfilment }
     *   2. Open payment (Razorpay/Stripe checkout) with the returned order
     *   3. Confirm & store paymentId with the order on success webhook
     * ------------------------------------------------------------------ */
    const order: PlacedOrder = {
      id: `PO-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      lines: items.map((i) => {
        const p = getStoreProduct(i.productId)!;
        return { productId: p.id, name: p.name, qty: i.qty, price: p.price };
      }),
      total: Math.max(0, summary.subtotal) + deliveryFee,
      customer,
      fulfilment,
    };
    setLastOrder(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    setItems([]);
    return order;
  };

  const lines = useMemo(
    () =>
      items
        .map((i) => ({ product: getStoreProduct(i.productId), qty: i.qty }))
        .filter((l): l is { product: StoreProduct; qty: number } => Boolean(l.product)),
    [items]
  );

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const discount = lines.reduce((s, l) => s + (l.product.mrp - l.product.price) * l.qty, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const savingsPct = subtotal + discount > 0 ? Math.round((discount * 100) / (subtotal + discount)) : 0;

  const summary = { subtotal, discount, deliveryFee, total };

  return (
    <CartContext.Provider
      value={{
        items,
        lines,
        count,
        subtotal,
        discount,
        deliveryFee,
        total,
        savingsPct,
        drawerOpen,
        setDrawerOpen,
        add,
        remove,
        setQty,
        clear,
        lastOrder,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
