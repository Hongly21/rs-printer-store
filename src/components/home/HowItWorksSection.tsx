'use client';

import React from 'react';
import { howItWorksSteps } from '@/data/how-it-works';
import { ShoppingBag, Sliders, UploadCloud, CreditCard, Printer, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useOrderGuide } from '@/context/OrderGuideContext';

export const HowItWorksSection: React.FC = () => {
  const { t, tObj } = useLanguage();
  const { openGuide } = useOrderGuide();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-brand-600" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-brand-600" />;
      case 'UploadCloud':
        return <UploadCloud className="w-6 h-6 text-brand-600" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-brand-600" />;
      case 'Printer':
        return <Printer className="w-6 h-6 text-brand-600" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            {t('howItWorks.badge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* 5 Steps horizontal/grid flow - Clickable to open hands-on interactive guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {howItWorksSteps.map((step, idx) => (
            <button
              key={step.step}
              type="button"
              onClick={() => openGuide(idx + 1)}
              className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 relative flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-brand-400 dark:hover:border-brand-500 transition-all group text-left active:scale-[0.98] cursor-pointer"
            >
              {/* Step Number badge */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors font-mono">
                  {step.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(step.iconName)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {tObj(step.title, step.titleKm)}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tObj(step.description, step.descriptionKm)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {tObj('Try this step', 'សាកល្បងជំហាននេះ')}
                </span>
                <div className="h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded-full group-hover:w-16 group-hover:bg-brand-600 transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Action CTAs under steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => openGuide(1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-extrabold text-sm rounded-2xl shadow-sm transition-all group active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{tObj('Launch Interactive Visual Guide', 'បើកមគ្គុទ្ទេសក៍ណែនាំជាក់ស្តែង')}</span>
          </button>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-brand-600 dark:hover:bg-brand-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all group active:scale-95"
          >
            <span>{t('howItWorks.startNow')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
