'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useLanguage } from '@/context/LanguageContext';
import { User, Phone, MessageSquare, ArrowRight, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { startNavigationLoading } from '@/components/common/NavigationProgressBar';

export const CustomerForm: React.FC = () => {
  const router = useRouter();
  const { customer, updateCustomerField, validateCustomerStep } = useCheckout();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateCustomerStep();
    setErrors(validation.errors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true });
    const validation = validateCustomerStep();

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    startNavigationLoading();
    router.push('/checkout/delivery');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('checkout.customerTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('checkout.customerSubtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>{t('checkout.fullName')} <strong className="text-red-500">*</strong></span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={customer.fullName}
                onChange={(e) => updateCustomerField('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Boun Hongly"
                required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border transition-all focus:outline-none ${
                  touched.fullName && errors.fullName
                    ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
            </div>
            {touched.fullName && errors.fullName && (
              <p className="text-xs font-semibold text-red-500 mt-1 animate-in fade-in">
                {t('checkout.fullNameRequired')}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>{t('checkout.phone')} <strong className="text-red-500">*</strong></span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => updateCustomerField('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="e.g. 012 345 678"
                required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border transition-all focus:outline-none ${
                  touched.phone && errors.phone
                    ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-xs font-semibold text-red-500 mt-1 animate-in fade-in">
                {t('checkout.phoneRequired')}
              </p>
            )}
          </div>

          {/* Telegram Username */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {t('checkout.telegramUser')}
              </label>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t('checkout.telegramOptional')}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MessageSquare className="w-4 h-4 text-sky-500" />
              </div>
              <input
                type="text"
                value={customer.telegram || ''}
                onChange={(e) => updateCustomerField('telegram', e.target.value)}
                placeholder="e.g. @boun_hongly"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {t('checkout.telegramDesc')}
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {t('checkout.orderRemarks')}
              </label>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t('checkout.remarksOptional')}
              </span>
            </div>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                value={customer.notes || ''}
                onChange={(e) => updateCustomerField('notes', e.target.value)}
                rows={3}
                placeholder={t('checkout.remarksPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('checkout.privacyNotice')}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            startNavigationLoading();
            router.push('/cart');
          }}
          className="px-6 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          {t('checkout.backToCart')}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{t('checkout.continueToDelivery')}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
};
