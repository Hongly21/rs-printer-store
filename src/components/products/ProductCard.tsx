'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Clock, Check } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, tObj } = useLanguage();

  const features = tObj(product.features, product.featuresKm);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 dark:bg-slate-800/80 overflow-hidden border-b border-slate-100 dark:border-slate-800 flex items-center justify-center p-4">
        <Image
          src={product.image}
          alt={tObj(product.name, product.nameKm)}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent" className="shadow-sm font-bold">
              {tObj(product.badge, product.badgeKm)}
            </Badge>
          </div>
        )}

        {/* Turnaround pill */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
          <Clock className="w-3 h-3 text-brand-600" />
          <span>{tObj(product.turnaroundTime, product.turnaroundTimeKm)}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
          {tObj(product.name, product.nameKm)}
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {tObj(product.tagline, product.taglineKm) || tObj(product.description, product.descriptionKm)}
        </p>

        {/* Key Features list */}
        <div className="mt-3 space-y-1">
          {features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('products.startingFrom')}
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {formatPrice(product.startingPrice)}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-brand-600 dark:hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm group-hover:bg-brand-600 active:scale-95"
          >
            <span>{t('products.customizeBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
