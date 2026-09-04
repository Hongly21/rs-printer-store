'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, Clock, Palette, Printer, Truck, HelpCircle, Phone, Sparkles } from 'lucide-react';
import { shopConfig } from '@/data/shop';

interface OrderTimelineTrackerProps {
  carrier?: string;
  isPickup?: boolean;
}

export const OrderTimelineTracker: React.FC<OrderTimelineTrackerProps> = ({
  carrier,
  isPickup = false,
}) => {
  const { tObj } = useLanguage();

  const steps = [
    {
      id: 1,
      title: tObj('Order Placed', 'បានទទួលការកុម្ម៉ង់'),
      desc: tObj('Received & logged', 'បានកត់ត្រាក្នុងប្រព័ន្ធ'),
      icon: CheckCircle2,
      status: 'completed', // completed | current | upcoming
    },
    {
      id: 2,
      title: tObj('Artwork Review', 'ផ្ទៀងផ្ទាត់ប្លង់'),
      desc: tObj('Checking resolution & bleed', 'ត្រួតពិនិត្យទំហំ & គុណភាព'),
      icon: Palette,
      status: 'current',
    },
    {
      id: 3,
      title: tObj('Printing & Die-Cut', 'បោះពុម្ព & កាត់'),
      desc: tObj('High-res digital printing', 'ព្រីនឌីជីថលកម្រិតខ្ពស់'),
      icon: Printer,
      status: 'upcoming',
    },
    {
      id: 4,
      title: isPickup
        ? tObj('Ready for Pickup', 'ត្រៀមខ្លួនមកយក')
        : carrier === 'vireak_buntham'
        ? tObj('VET Branch Arrival', 'ទៅដល់សាខាវីរៈប៊ុនថាំ')
        : tObj('Delivered to You', 'ដឹកជញ្ជូនដល់ទីកន្លែង'),
      desc: isPickup
        ? tObj('Pick up at counter', 'មកយកនៅបញ្ជរហាង')
        : carrier === 'vireak_buntham'
        ? tObj('SMS notification sent', 'មានសារ SMS ជូនដំណឹង')
        : tObj('Delivered to your door', 'ប្រគល់ជូនដល់ដៃ'),
      icon: isPickup ? Clock : Truck,
      status: 'upcoming',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tObj('Live Production Timeline', 'ដំណើរការផលិតកម្ម')}</span>
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {tObj('What Happens Next?', 'តើអ្វីនឹងកើតឡើងបន្ទាប់?')}
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>{tObj('Est. Turnaround: 24-48 Hours', 'រយៈពេលផលិត៖ ២៤ ដល់ ៤៨ ម៉ោង')}</span>
        </div>
      </div>

      {/* 4 Steps Visual Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300'
                  : isCurrent
                  ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-300 dark:border-brand-700 text-brand-950 dark:text-brand-200 ring-2 ring-brand-500/20 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-brand-600 text-white shadow-sm animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                        : isCurrent
                        ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted
                      ? tObj('Done', 'រួចរាល់')
                      : isCurrent
                      ? tObj('Active', 'កំពុងពិនិត្យ')
                      : tObj('Step', 'ជំហាន')} {idx + 1}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Contact Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300">
            {tObj(
              'Need urgent rush printing or have artwork design questions?',
              'ត្រូវការព្រីនបន្ទាន់ ឬមានសំណួរអំពីប្លង់រូបភាព?'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${shopConfig.phone}`}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{shopConfig.displayPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
