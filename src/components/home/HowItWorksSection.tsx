'use client';

import React from 'react';
import { howItWorksSteps } from '@/data/how-it-works';
import { ShoppingBag, Sliders, UploadCloud, CreditCard, Printer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { t, tObj } = useLanguage();

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
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            {t('howItWorks.badge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* 5 Steps horizontal/grid flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {howItWorksSteps.map((step) => (
            <div
              key={step.step}
              className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 relative flex flex-col justify-between space-y-4 hover:shadow-lg hover:border-brand-300 transition-all group"
            >
              {/* Step Number badge */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-200 group-hover:text-brand-200 transition-colors font-mono">
                  {step.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(step.iconName)}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1">
                  {tObj(step.title, step.titleKm)}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {tObj(step.description, step.descriptionKm)}
                </p>
              </div>

              <div className="h-1 w-12 bg-slate-200 rounded-full group-hover:w-full group-hover:bg-brand-600 transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Start Order CTA banner under steps */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all group active:scale-95"
          >
            <span>{t('howItWorks.startNow')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
