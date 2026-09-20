'use client';

import React from 'react';
import Link from 'next/link';
import { shopConfig } from '@/data/shop';
import { categories } from '@/data/categories';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Truck, Sparkles, Printer } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, tObj } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {tObj('Industrial Print Quality', 'គុណភាពបោះពុម្ពកម្រិតឧស្សាហកម្ម')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {tObj(
                  'True CMYK high-DPI UV, eco-solvent, and archival giclée printing.',
                  'បច្ចេកវិទ្យាព្រីន CMYK UV និង Pigment កម្រិតច្បាស់ខ្ពស់ មិនងាយស្លេកពណ៌។'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {tObj('Fast Turnaround & Delivery', 'សេវាកម្មរហ័សទាន់ចិត្ត & ដឹកជញ្ជូន')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {tObj(
                  `Same-day & 1-2 day dispatch with free delivery on orders over $${shopConfig.freeDeliveryThreshold}.`,
                  `ផ្ញើចេញក្នុងថ្ងៃ ឬ ១-២ ថ្ងៃ ជាមួយនឹងការដឹកហ្វ្រីសម្រាប់ការកុម្ម៉ង់ចាប់ពី $${shopConfig.freeDeliveryThreshold}។`
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {tObj('Free Prepress File Check', 'ពិនិត្យឯកសារ & ប្លង់ឥតគិតថ្លៃ')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {tObj(
                  'We review bleed, cutlines, and resolution before putting any job on press.',
                  'ក្រុមការងារជំនាញជួយពិនិត្យគែមស កម្រិតច្បាស់ និងសម្រួលប្លង់មុនព្រីន។'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Printer className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                RS <span className="text-brand-400">Printer</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{tObj(shopConfig.address, shopConfig.addressKm)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{tObj(shopConfig.workingHours, shopConfig.workingHoursKm)}</span>
              </div>
            </div>
          </div>

          {/* Product Categories Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {tObj(cat.name, cat.nameKm)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-brand-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-400 transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-brand-400 transition-colors">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-brand-400 transition-colors">
                  {tObj('Track Your Order', 'តាមដានការកុម្ម៉ង់')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-400 transition-colors">
                  {t('nav.cart')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.getTouch', { default: 'Get in Touch' })}
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <a
                href={`tel:${shopConfig.phone}`}
                className="flex items-center gap-2 text-white hover:text-brand-400 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4 text-brand-400" />
                <span>{shopConfig.displayPhone}</span>
              </a>
              <a
                href={`https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-semibold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Telegram: {shopConfig.telegram}</span>
              </a>
              <a
                href={`mailto:${shopConfig.email}`}
                className="flex items-center gap-2 hover:text-brand-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{shopConfig.email}</span>
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 font-medium">
                {t('footer.paymentMethods')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-red-400 border border-slate-700">
                  KHQR
                </span>
                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-sky-400 border border-slate-700">
                  ABA Bank
                </span>
                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-emerald-400 border border-slate-700">
                  COD / Pickup
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {tObj(shopConfig.name, shopConfig.nameKm)}. {t('footer.allRights')}</p>
          <p className="text-slate-500">
            {t('footer.architecture')}
          </p>
        </div>
      </div>
    </footer>
  );
};
