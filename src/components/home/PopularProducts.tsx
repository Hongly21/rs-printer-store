'use client';

import React from 'react';
import Link from 'next/link';
import { products, getPopularProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { ArrowRight, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const PopularProducts: React.FC = () => {
  const { t } = useLanguage();
  const popular = getPopularProducts().slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{t('products.favoritesBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('products.popularTitle')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('products.popularSubtitle')}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>{t('products.viewAllCount', { count: products.length })}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
