'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { shopConfig } from '@/data/shop';
import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
}) => {
  const { getTotals } = useCart();
  const { t } = useLanguage();
  const totals = getTotals('pickup');

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((totals.subtotal / shopConfig.freeDeliveryThreshold) * 100)
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-6">
      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
        {t('cart.orderSummary')}
      </h3>

      {/* Free Delivery Goal Tracker */}
      <div className="bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-brand-900 dark:text-brand-200 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-600" />
            {totals.subtotal >= shopConfig.freeDeliveryThreshold
              ? t('cart.unlockedFreeDelivery')
              : t('cart.addMoreForFree', { amount: formatPrice(shopConfig.freeDeliveryThreshold - totals.subtotal) })}
          </span>
          <span className="font-extrabold text-brand-700 dark:text-brand-400">{freeDeliveryProgress}%</span>
        </div>
        <div className="w-full bg-brand-200/60 dark:bg-brand-900/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Subtotals breakdown */}
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex justify-between">
          <span>{t('cart.subtotal')} ({totals.itemCount} {t('cart.itemsCount')})</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatPrice(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>{t('cart.estimatedDelivery')}</span>
          <span className="text-slate-500 text-xs font-semibold">
            {t('cart.freeShopPickup')}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
          <span className="font-extrabold text-slate-900 dark:text-white text-base">{t('configurator.estimatedTotal')}</span>
          <span className="font-black text-2xl text-slate-900 dark:text-white">
            {formatPrice(totals.subtotal)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="space-y-3 pt-2">
          <Link
            href="/checkout/customer"
            className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            <span>{t('cart.proceedCheckout')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/products"
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors text-center block"
          >
            {t('configurator.continueShopping')}
          </Link>
        </div>
      )}

      {/* Trust Badges */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('cart.qualityGuarantee')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{t('cart.preflightCheck')}</span>
        </div>
      </div>
    </div>
  );
};
