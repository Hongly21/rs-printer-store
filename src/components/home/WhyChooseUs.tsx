'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Truck, ThumbsUp, Layers, Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { t, tObj } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: 'Vibrant CMYK Fidelity',
      titleKm: 'បច្ចេកវិទ្យាពណ៌ CMYK ដិតច្បាស់',
      description: 'Industrial-grade Japanese wide-format & digital printers for sharp lines and true-to-life colors.',
      descriptionKm: 'ប្រើម៉ាស៊ីនព្រីនឧស្សាហកម្មរបស់ប្រទេសជប៉ុន ផ្ដល់កម្រិតពណ៌ត្រឹមត្រូវ និងច្បាស់ល្អឥតខ្ចោះ។',
    },
    {
      icon: ShieldCheck,
      title: 'Free File & Proof Check',
      titleKm: 'ពិនិត្យឯកសារ & ប្លង់ឥតគិតថ្លៃ',
      description: 'Our prepress specialists check resolution, margins, bleeds, and cutlines at no extra charge.',
      descriptionKm: 'ក្រុមការងារបច្ចេកទេសជួយពិនិត្យកម្រិតច្បាស់ គែមស និងប្លង់ឱ្យស្អាតមុនពេលដាក់ព្រីន។',
    },
    {
      icon: Truck,
      title: 'Fast Dispatch & Delivery',
      titleKm: 'សេវាកម្មរហ័ស & ដឹកជញ្ជូន',
      description: 'Standard 1-2 business day turnaround, same-day rush processing, and nationwide courier delivery.',
      descriptionKm: 'រយៈពេលផលិតត្រឹមតែ ១-២ ថ្ងៃ មានសេវាប្រញាប់ក្នុងថ្ងៃ និងដឹកជញ្ជូនទូទាំងប្រទេស។',
    },
    {
      icon: Layers,
      title: 'Premium Materials & Vinyl',
      titleKm: 'សម្ភារៈ & ស្ទីគ័រគុណភាពខ្ពស់',
      description: 'Heavyweight weatherproof vinyl, UV laminates, and luxury 350gsm+ cardstocks that last.',
      descriptionKm: 'កៅស៊ូស្វិតមិនជ្រាបទឹក ស្រទាប់ការពារ UV និងក្រដាសរឹង 350gsm+ ប្រើប្រាស់បានយូរអង្វែង។',
    },
    {
      icon: ThumbsUp,
      title: 'No Minimums on Core Items',
      titleKm: 'មិនកំណត់ចំនួនអប្បបរមា',
      description: 'Order from single poster prints to 10,000+ commercial bulk runs with transparent volume tiers.',
      descriptionKm: 'អាចកុម្ម៉ង់បានចាប់ពីចំនួនតិចតួច រហូតដល់រាប់ម៉ឺនសន្លឹក ជាមួយតម្លៃបញ្ចុះតាមចំនួន។',
    },
    {
      icon: Headphones,
      title: 'Direct Telegram Support',
      titleKm: 'ប្រឹក្សាផ្ទាល់តាម Telegram',
      description: 'Direct communication with real human print technicians for instant proofing and design advice.',
      descriptionKm: 'ជជែកពិភាក្សាផ្ទាល់ជាមួយអ្នកបច្ចេកទេសដើម្បីផ្ទៀងផ្ទាត់ប្លង់ និងសាកសួរព័ត៌មានលម្អិត។',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            {t('whyUs.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('whyUs.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {tObj(feat.title, feat.titleKm)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tObj(feat.description, feat.descriptionKm)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
