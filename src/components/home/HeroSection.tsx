'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, CheckCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { useLanguage } from '@/context/LanguageContext';




export const HeroSection: React.FC = () => {
  const { t, tObj } = useLanguage();
  // wriite fail code for testing sonaqure to scann qulity fail 
  const testFailCode = () => {
    const a = 1;
    const b = 2;
    if (a = b) { // This is an intentional mistake (assignment instead of comparison)
      console.log('This will always execute');
    }
  };

  testFailCode();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative background grid subtle effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2]">
              {t('hero.titleMain')} <br />
              <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                {t('hero.titleGradient')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200 max-w-xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t('hero.desc')}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                id="tour-hero-start"
                href="/products"
                className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{t('hero.startOrder')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-slate-600" />
                <span>{t('hero.viewProducts')}</span>
              </Link>
            </div>

            {/* Trust Bullet Points */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('hero.noMin')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{t('hero.freeProof')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{t('hero.instantPay')}</span>
              </div>
            </div>
          </div>

          {/* Right Visual Col: Interactive Hero Mockup Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
              {/* Top Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('hero.livePreview')}
                </span>
              </div>

              {/* Product Preview Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-20 h-20 relative rounded-xl bg-white dark:bg-slate-900 p-2 border border-slate-200/60 dark:border-slate-800 shrink-0">
                  <Image
                    src="/images/products/sticker.svg"
                    alt="Custom Stickers"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="accent" className="text-[10px] mb-1">
                    {t('hero.mostPopular')}
                  </Badge>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {tObj('Die-Cut Vinyl Stickers', 'ស្ទីគ័រកាត់តាមទម្រង់ Die-Cut')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    10 × 10 cm • Glossy • 100 pcs
                  </p>
                  <p className="text-xs font-black text-brand-600 dark:text-brand-400 mt-1">
                    $28.00 <span className="text-[10px] text-slate-400 font-normal">($0.28/pc)</span>
                  </p>
                </div>
              </div>

              {/* 3 Quick Step Pills */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.materialLabel')}</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    {tObj('Glossy Waterproof Vinyl', 'កៅស៊ូរលោងមិនជ្រាបទឹក')}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.uploadLabel')}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>my-logo.png (3.2 MB)</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t('hero.priceLabel')}</span>
                  <span className="font-black text-slate-900 dark:text-white">$28.00</span>
                </div>
              </div>

              {/* Action Button inside mockup */}
              <Link
                href="/products/sticker-printing"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all block text-center"
              >
                <span>{t('hero.customizeThis')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
