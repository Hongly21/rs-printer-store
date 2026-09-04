'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { paymentMethods } from '@/data/payment-methods';
import { formatPrice } from '@/lib/utils';
import {
  QrCode,
  Store,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Clock,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Smartphone,
  Banknote,
  Receipt,
  ScanLine,
  Download,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { startNavigationLoading } from '@/components/common/NavigationProgressBar';

export const PaymentSelector: React.FC = () => {
  const router = useRouter();
  const { payment, updatePaymentMethod, delivery } = useCheckout();
  const { getTotals } = useCart();
  const { t, tObj } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const totals = getTotals(delivery.method);
  const selectedMethod =
    paymentMethods.find((p) => p.id === payment.methodId) || paymentMethods[0];

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-brand-600" />;
      case 'Store':
        return <Store className="w-5 h-5 text-emerald-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-sky-600" />;
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    startNavigationLoading();
    router.push('/checkout/review');
  };

  const instructions = tObj(selectedMethod.instructions, selectedMethod.instructionsKm);

  // Instruction step icons
  const stepIcons = [
    <Smartphone key="1" className="w-4 h-4 text-brand-600 shrink-0" />,
    <ScanLine key="2" className="w-4 h-4 text-brand-600 shrink-0" />,
    <Receipt key="3" className="w-4 h-4 text-brand-600 shrink-0" />,
    <CheckCircle2 key="4" className="w-4 h-4 text-emerald-600 shrink-0" />,
    <ArrowRight key="5" className="w-4 h-4 text-brand-600 shrink-0" />,
  ];

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-brand-600" />
              <span>{t('checkout.choosePayment')}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('checkout.paymentSubtitle')}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{tObj('Verified Merchant', 'ពាណិជ្ជករផ្លូវការ')}</span>
          </div>
        </div>

        {/* Payment Method Cards */}
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const isSelected = payment.methodId === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => updatePaymentMethod(method.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  isSelected
                    ? 'border-brand-600 dark:border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-brand-200 dark:border-brand-800 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {getMethodIcon(method.icon)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                        {tObj(method.name, method.nameKm)}
                      </span>
                      {method.badge && (
                        <Badge variant="accent" className="text-[10px] py-0.5 px-2 font-bold">
                          {tObj(method.badge, method.badgeKm)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed truncate">
                      {tObj(method.subtitle, method.subtitleKm)}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Payment Detailed View */}
        {selectedMethod && (
          <div className="bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-brand-600" />
                <span>
                  {t('checkout.paymentDetails', {
                    name: tObj(selectedMethod.name, selectedMethod.nameKm),
                  })}
                </span>
              </h4>

              {/* Order total amount pill */}
              <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('checkout.totalDue')}:</span>
                <span className="text-brand-600 font-black text-sm">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            {/* QR View or Bank Card View */}
            {selectedMethod.qrImage && (
              <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                {/* QR Code Container with Frame */}
                <div className="relative shrink-0 flex flex-col items-center bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-inner">
                  <div className="w-44 h-44 relative bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Image
                      src={selectedMethod.qrImage}
                      alt={selectedMethod.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2 flex items-center gap-1">
                    <ScanLine className="w-3 h-3 text-brand-600" />
                    <span>{tObj('Scan with any Banking App', 'ស្កេនជាមួយគ្រប់ App ធនាគារ')}</span>
                  </span>

                  <a
                    href={selectedMethod.qrImage}
                    download="rs-printer-payment-qr.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                    title={tObj('Download QR code to scan from banking app gallery', 'ទាញយករូប QR ដើម្បីស្កេនពី App ធនាគារ')}
                  >
                    <Download className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                    <span>{tObj('Save QR to Photos', 'រក្សាទុករូប QR')}</span>
                  </a>
                </div>

                {/* Account Details & Steps */}
                <div className="flex-1 space-y-3.5 text-xs text-slate-600 dark:text-slate-300 w-full">
                  {/* Account Name */}
                  {selectedMethod.accountName && (
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {t('checkout.accountName')}
                        </span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {selectedMethod.accountName}
                        </span>
                      </div>
                      <Badge variant="primary" className="text-[10px] font-bold">
                        {tObj('Official Account', 'គណនីផ្លូវការ')}
                      </Badge>
                    </div>
                  )}

                  {/* Account Number with 1-Click Copy */}
                  {selectedMethod.accountNumber && (
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {t('checkout.accountNumber')}
                        </span>
                        <span className="font-mono font-black text-slate-900 dark:text-white text-base tracking-wide">
                          {selectedMethod.accountNumber}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(selectedMethod.accountNumber!, 'accountNumber')
                        }
                        className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                        title="Copy account number"
                      >
                        {copiedField === 'accountNumber' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">{tObj('Copied!', 'បានចម្លង!')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>{tObj('Copy', 'ចម្លង')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Instruction Steps */}
                  <div className="pt-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider block mb-2">
                      {t('checkout.quickSteps')}
                    </span>
                    <div className="space-y-2">
                      {instructions.map((inst, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed"
                        >
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                            {idx + 1}
                          </div>
                          <span>{inst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trust and Safety Notice */}
            <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">
                  {t('checkout.initialPendingStatus')}
                </span>
                <p className="text-amber-900/80 dark:text-amber-300/80 text-[11px] mt-0.5 leading-relaxed">
                  {t('checkout.pendingNotice')}
                </p>
              </div>
            </div>

            {/* Security Guarantee Footer */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tObj('256-bit Encrypted Checkout', 'សុវត្ថិភាពខ្ពស់ 256-bit')}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>{tObj('Instant Telegram Alert to Shop', 'ដំណឹងផ្ទាល់ទៅហាងភ្លាមៗ')}</span>
              </span>
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
          className="px-6 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
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
