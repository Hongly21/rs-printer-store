'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, User, Truck, CreditCard, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const CheckoutSteps: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const steps = [
    { id: 1, name: t('checkout.stepCustomer'), href: '/checkout/customer', icon: User },
    { id: 2, name: t('checkout.stepDelivery'), href: '/checkout/delivery', icon: Truck },
    { id: 3, name: t('checkout.stepPayment'), href: '/checkout/payment', icon: CreditCard },
    { id: 4, name: t('checkout.stepReview'), href: '/checkout/review', icon: ClipboardCheck },
  ];

  const getCurrentStepIndex = () => {
    if (pathname.includes('/customer')) return 0;
    if (pathname.includes('/delivery')) return 1;
    if (pathname.includes('/payment')) return 2;
    if (pathname.includes('/review')) return 3;
    if (pathname.includes('/order/success')) return 4;
    return 0;
  };

  const currentIdx = getCurrentStepIndex();

  return (
    <div className="w-full py-4 mb-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Desktop / Tablet steps line */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 z-0" />
          <div
            className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-brand-600 z-0 transition-all duration-300"
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <Link
                  href={isCompleted ? step.href : '#'}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                    isCompleted
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950 cursor-pointer shadow-md'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-200 dark:ring-brand-900 shadow-md scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-800 pointer-events-none'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </Link>
                <span
                  className={`text-xs mt-2 font-bold tracking-tight ${
                    isCurrent
                      ? 'text-brand-600'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Compact Progress Bar */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-brand-600">
              {t('checkout.stepOf', { step: currentIdx + 1, total: steps.length, name: steps[currentIdx]?.name || 'Complete' })}
            </span>
            <span className="text-slate-400">
              {Math.round(((currentIdx + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
