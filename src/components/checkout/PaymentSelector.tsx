'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useLanguage } from '@/context/LanguageContext';
import { paymentMethods } from '@/data/payment-methods';
import { QrCode, Store, CreditCard, CheckCircle2, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { startNavigationLoading } from '@/components/common/NavigationProgressBar';

export const PaymentSelector: React.FC = () => {
  const router = useRouter();
  const { payment, updatePaymentMethod } = useCheckout();
  const { t, tObj } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedMethod = paymentMethods.find((p) => p.id === payment.methodId) || paymentMethods[0];

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode':
        return <QrCode className="w-5 h-5" />;
      case 'Store':
        return <Store className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    startNavigationLoading();
    router.push('/checkout/review');
  };

  const instructions = tObj(selectedMethod.instructions, selectedMethod.instructionsKm);

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {t('checkout.choosePayment')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('checkout.paymentSubtitle')}
          </p>
        </div>

        {/* Payment Method Option Cards */}
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const isSelected = payment.methodId === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => updatePaymentMethod(method.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {getMethodIcon(method.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {tObj(method.name, method.nameKm)}
                      </span>
                      {method.badge && (
                        <Badge variant="accent" className="text-[10px]">
                          {tObj(method.badge, method.badgeKm)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{tObj(method.subtitle, method.subtitleKm)}</p>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Payment Method Display Card */}
        {selectedMethod && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('checkout.paymentDetails', { name: tObj(selectedMethod.name, selectedMethod.nameKm) })}
            </h4>

            {/* QR Image or Card View if available */}
            {selectedMethod.qrImage && (
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-xl border border-slate-200/70">
                <div className="w-44 h-52 relative shrink-0 flex items-center justify-center">
                  <Image
                    src={selectedMethod.qrImage}
                    alt={selectedMethod.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 space-y-2 text-xs text-slate-600">
                  {selectedMethod.accountName && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {t('checkout.accountName')}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {selectedMethod.accountName}
                      </span>
                    </div>
                  )}

                  {selectedMethod.accountNumber && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {t('checkout.accountNumber')}
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {selectedMethod.accountNumber}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <span className="font-bold text-slate-800 text-[11px] block mb-1">
                      {t('checkout.quickSteps')}
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-500 text-[11px]">
                      {instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Transparent Payment Status Explanation */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {t('checkout.initialPendingStatus')}
                </span>
                <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                  {t('checkout.pendingNotice')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            startNavigationLoading();
            router.push('/checkout/delivery');
          }}
          className="px-6 py-3.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          {t('checkout.backToDelivery')}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{t('checkout.continueToReview')}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
};
