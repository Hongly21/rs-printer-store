'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const EmptyCart: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-sm">
        <ShoppingBag className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('cart.emptyTitle')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          {t('cart.emptyDesc')}
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-600/25 transition-all"
        >
          <span>{t('cart.browseBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
