'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export const AddToCartToast: React.FC = () => {
  const { showToast, closeToast, lastAddedItem, getTotals } = useCart();

  if (!showToast || !lastAddedItem) return null;

  const totals = getTotals();

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-4 relative overflow-hidden backdrop-blur-md">
        {/* Top bar accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-emerald-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Added to your cart!</span>
          </div>
          <button
            onClick={closeToast}
            aria-label="Close notification"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-white border border-slate-200/60 shrink-0 flex items-center justify-center">
            <Image
              src={lastAddedItem.productImage}
              alt={lastAddedItem.productName}
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate">
              {lastAddedItem.productName}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              Qty: {lastAddedItem.config.quantity}
              {lastAddedItem.config.sizeName ? ` • ${lastAddedItem.config.sizeName}` : ''}
            </p>
            <p className="text-xs font-bold text-brand-600 mt-0.5">
              {formatPrice(lastAddedItem.totalPrice)}
            </p>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            onClick={closeToast}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
          >
            Continue Shopping
          </button>
          <Link
            href="/cart"
            onClick={closeToast}
            className="w-full px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 group"
          >
            <span>View Cart ({totals.itemCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
