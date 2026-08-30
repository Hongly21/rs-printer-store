'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-24 text-center text-sm font-semibold text-slate-400">
        Loading cart items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 bg-white min-h-[60vh] flex items-center justify-center">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-brand-600" />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Shopping Cart
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review your customized printing items and attached artwork before checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* 2 Column Layout: Items List on Left, Order Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
