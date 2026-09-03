'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';

const TOAST_DURATION_MS = 5000;

export const AddToCartToast: React.FC = () => {
  const { showToast, closeToast, lastAddedItem, getTotals } = useCart();
  const { t, tObj } = useLanguage();

  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-dismiss countdown
  useEffect(() => {
    if (!showToast || !lastAddedItem) return;

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      closeToast();
    }, TOAST_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showToast, lastAddedItem, isPaused, closeToast]);

  if (!showToast || !lastAddedItem) return null;

  const totals = getTotals();
  const productName = tObj(lastAddedItem.productName, lastAddedItem.productNameKm) || lastAddedItem.productName;
  const sizeDisplay = tObj(lastAddedItem.config.sizeName, lastAddedItem.config.sizeNameKm) || lastAddedItem.config.sizeName;
  const materialDisplay = tObj(lastAddedItem.config.materialName, lastAddedItem.config.materialNameKm) || lastAddedItem.config.materialName;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-3 right-3 sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 z-50 max-w-md sm:w-96 mx-auto sm:mx-0 animate-in slide-in-from-top-4 sm:slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 sm:p-4 relative overflow-hidden ring-1 ring-black/5">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-400" />

        {/* Header: Status & Close */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="leading-none">{t('configurator.addedToCart')}</span>
          </div>
          <button
            onClick={closeToast}
            aria-label="Close notification"
            className="text-slate-400 hover:text-slate-700 active:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Row */}
        <div className="mt-2.5 sm:mt-3 flex items-center gap-3 bg-slate-50/90 p-2.5 rounded-xl border border-slate-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 relative rounded-lg overflow-hidden bg-white border border-slate-200/60 shrink-0 flex items-center justify-center shadow-xs">
            <Image
              src={lastAddedItem.productImage}
              alt={productName}
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
              {productName}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
              <span>Qty: {lastAddedItem.config.quantity} {t('configurator.pcs')}</span>
              {sizeDisplay ? <span> • {sizeDisplay}</span> : null}
              {materialDisplay ? <span> • {materialDisplay}</span> : null}
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-brand-600 mt-0.5">
              {formatPrice(lastAddedItem.totalPrice)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={closeToast}
            className="w-full min-h-[40px] px-2 sm:px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all text-center flex items-center justify-center cursor-pointer active:scale-[0.98]"
          >
            <span className="truncate">{t('configurator.continueShopping')}</span>
          </button>
          <Link
            href="/cart"
            onClick={closeToast}
            className="w-full min-h-[40px] px-2 sm:px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl transition-all shadow-sm shadow-brand-600/20 flex items-center justify-center gap-1 group active:scale-[0.98]"
          >
            <span className="truncate">{t('configurator.viewCart')} ({totals.itemCount})</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
