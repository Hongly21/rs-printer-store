'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { ArrowRight, Grid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const CategoriesGrid: React.FC = () => {
  const { t, tObj } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5" />
            <span>{t('products.catalogBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('products.exploreCategories')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('products.exploreSubtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500/60 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 mb-4 overflow-hidden border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {tObj(cat.name, cat.nameKm)}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {tObj(cat.description, cat.descriptionKm)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
