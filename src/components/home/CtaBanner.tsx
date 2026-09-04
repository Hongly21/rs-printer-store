'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { shopConfig } from '@/data/shop';
import { useLanguage } from '@/context/LanguageContext';

export const CtaBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle glow shapes */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center lg:text-left max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('cta.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {t('cta.title')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('cta.desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>{t('cta.explore')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={`https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>{t('cta.chatTelegram')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
