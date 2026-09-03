'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { shopConfig } from '@/data/shop';
import { formatPrice } from '@/lib/utils';
import { Store, Truck, MapPin, Clock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { startNavigationLoading } from '@/components/common/NavigationProgressBar';

export const DeliverySelector: React.FC = () => {
  const router = useRouter();
  const { delivery, updateDeliveryMethod, updateDeliveryAddress, validateDeliveryStep } = useCheckout();
  const { getTotals } = useCart();
  const { t, tObj } = useLanguage();
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = getTotals(delivery.method);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    const validation = validateDeliveryStep();
    if (!validation.isValid) {
      setAddressError(t('checkout.addressRequired'));
      return;
    }

    setIsSubmitting(true);
    startNavigationLoading();
    router.push('/checkout/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {t('checkout.deliveryTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('checkout.deliverySubtitle')}
          </p>
        </div>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pickup Option */}
          <button
            type="button"
            onClick={() => updateDeliveryMethod('pickup')}
            className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
              delivery.method === 'pickup'
                ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              {delivery.method === 'pickup' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              )}
            </div>
            <div className="mt-3">
              <span className="font-extrabold text-slate-900 text-base block">
                {t('checkout.shopPickup')}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {t('checkout.shopPickupDesc')}
              </p>
              <span className="inline-block mt-2 font-black text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {t('checkout.freeBadge')}
              </span>
            </div>
          </button>

          {/* Delivery Option */}
          <button
            type="button"
            onClick={() => updateDeliveryMethod('delivery')}
            className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
              delivery.method === 'delivery'
                ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              {delivery.method === 'delivery' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              )}
            </div>
            <div className="mt-3">
              <span className="font-extrabold text-slate-900 text-base block">
                {t('checkout.expressDelivery')}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {t('checkout.expressDeliveryDesc')}
              </p>
              <span className="inline-block mt-2 font-bold text-slate-700 text-xs bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                {totals.isFreeDelivery ? t('checkout.freeOverThreshold') : formatPrice(shopConfig.standardDeliveryFee)}
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Detail Card Based on Selection */}
        {delivery.method === 'pickup' ? (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              {t('checkout.pickupHubTitle')}
            </h4>
            <div className="text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">{tObj(shopConfig.name, shopConfig.nameKm)}</p>
              <p>{tObj(shopConfig.address, shopConfig.addressKm)}</p>
              <p className="text-slate-500">{tObj(shopConfig.pickupLocationDetail, shopConfig.pickupLocationDetailKm)}</p>
              <div className="flex items-center gap-1.5 text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{tObj(shopConfig.workingHours, shopConfig.workingHoursKm)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
            {/* Delivery Address Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>{t('checkout.deliveryAddress')} <strong className="text-red-500">*</strong></span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows={3}
                  value={delivery.address || ''}
                  onChange={(e) => updateDeliveryAddress(e.target.value)}
                  placeholder={t('checkout.addressPlaceholder')}
                  required
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none resize-none ${
                    addressError
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                />
              </div>
              {addressError && (
                <p className="text-xs font-semibold text-red-500 animate-in fade-in">
                  {addressError}
                </p>
              )}
            </div>

            {/* Delivery Fee Notice */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">{t('checkout.deliveryFeeLabel')}</span>
              <span className="font-black text-slate-900">
                {totals.isFreeDelivery ? (
                  <span className="text-emerald-600 font-extrabold">{t('checkout.freeBadge')} ($0.00)</span>
                ) : (
                  formatPrice(shopConfig.standardDeliveryFee)
                )}
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
            router.push('/checkout/customer');
          }}
          className="px-6 py-3.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          {t('checkout.backToCustomer')}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{t('checkout.continueToPayment')}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
};
