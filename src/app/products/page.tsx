'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Search, Sparkles, UploadCloud, Layers, Check, Zap, Palette, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { t, tObj } = useLanguage();

  const [orderTypeMode, setOrderTypeMode] = useState<'all' | 'ready' | 'custom'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Order Type Mode (Ready-Made vs Custom Print)
    if (orderTypeMode === 'ready') {
      result = result.filter(
        (p) => p.category === 'stickers' || p.category === 'labels' || p.slug.includes('sticker')
      );
    } else if (orderTypeMode === 'custom') {
      // All products support custom, but when filtered to custom exclude pure ready packs if any
      result = result.filter((p) => p.category !== 'stickers' || !p.slug.includes('ready-only'));
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameKm && p.nameKm.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.descriptionKm && p.descriptionKm.toLowerCase().includes(q)) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.taglineKm && p.taglineKm.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    }

    return result;
  }, [orderTypeMode, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('products.catalogBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('products.allCatalogTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('products.allCatalogSubtitle')}
          </p>
        </div>

        {/* Primary Order Mode Separation: All vs Ready Stickers vs Custom Print */}
        <div className="bg-slate-50 dark:bg-slate-900/80 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-sm overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setOrderTypeMode('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                orderTypeMode === 'all'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25 scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{tObj('All Products', 'ផលិតផលទាំងអស់')}</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderTypeMode('ready')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                orderTypeMode === 'ready'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25 scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{tObj('Ready Stickers (1-Click Order)', 'ស្ទីគ័រមានស្រាប់ (ចុចទិញភ្លាមៗ)')}</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderTypeMode('custom')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                orderTypeMode === 'custom'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25 scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>{tObj('Custom Print & Studio', 'ព្រីនរូបផ្ទាល់ខ្លួន')}</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 px-2 font-medium flex items-center gap-2">
            <span>
              {orderTypeMode === 'ready'
                ? tObj('Showing stickers with 1-click ready designs', 'បង្ហាញស្ទីគ័រដែលមានម៉ូដស្រាប់ ចុចទិញភ្លាមៗ')
                : orderTypeMode === 'custom'
                ? tObj('Showing custom on-demand printing options', 'បង្ហាញជម្រើសបោះពុម្ពរូបភាពផ្ទាល់ខ្លួន')
                : `${filteredProducts.length} ${t('products.allProductsTab')}`}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 pt-1">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t('products.allProductsTab')} ({products.length})
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tObj(cat.name, cat.nameKm)} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('products.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="sort-by" className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {t('products.sortBy')}
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recommended' | 'price-low' | 'price-high')}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
              >
                <option value="recommended">{t('products.sortFeatured')}</option>
                <option value="price-low">{t('products.sortPriceLow')}</option>
                <option value="price-high">{t('products.sortPriceHigh')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="pt-2">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                {t('products.noProductsFound')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setOrderTypeMode('all');
                  setSearchQuery('');
                }}
                className="text-xs font-extrabold text-brand-600 hover:underline cursor-pointer"
              >
                {t('products.allProductsTab')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-400">
          Loading catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
