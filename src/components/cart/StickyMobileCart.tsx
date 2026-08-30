'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const StickyMobileCart: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, getTotals, isHydrated } = useCart();
  const { t } = useLanguage();

  if (!isHydrated || cartCount === 0 || pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/order')) {
    return null;
  }

  const totals = getTotals();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-500">
              {cartCount} {t('cart.itemsCount')}
            </span>
            <span className="text-base font-black text-slate-900 leading-none">
              {formatPrice(totals.subtotal)}
            </span>
          </div>
        </div>

        <Link
          href="/cart"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/25 flex items-center gap-1.5 transition-all"
        >
          <span>{t('configurator.viewCart')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
