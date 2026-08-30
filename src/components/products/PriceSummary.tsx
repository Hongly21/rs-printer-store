'use client';

import React from 'react';
import { PriceCalculationResult } from '@/lib/pricing';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, Tag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PriceSummaryProps {
  calculation: PriceCalculationResult;
  quantity: number;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  calculation,
  quantity,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t('configurator.estimatedTotal')}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {formatPrice(calculation.totalPrice)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({formatPrice(calculation.unitPrice)} / {t('configurator.perPiece')})
            </span>
          </div>
        </div>

        {calculation.discountPercentage > 0 && (
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Tag className="w-3 h-3" />
              {calculation.discountPercentage}% {t('configurator.bulkDiscount')}
            </span>
            <span className="block text-[11px] text-emerald-700 mt-0.5 font-semibold">
              {t('configurator.saved')} {formatPrice(calculation.discountAmount)}
            </span>
          </div>
        )}
      </div>

      {/* Pricing Breakdown Dropdown / List */}
      <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>{t('configurator.baseRate')} × {quantity}</span>
          <span className="font-semibold text-slate-800">
            {formatPrice(calculation.breakdown.baseSizePrice * quantity)}
          </span>
        </div>

        {calculation.breakdown.materialAddon > 0 && (
          <div className="flex justify-between">
            <span>{t('configurator.materialUpgrade')}</span>
            <span className="font-semibold text-slate-800">
              +{formatPrice(calculation.breakdown.materialAddon)}
            </span>
          </div>
        )}

        {calculation.breakdown.finishingAddon > 0 && (
          <div className="flex justify-between">
            <span>{t('configurator.finishingExtra')}</span>
            <span className="font-semibold text-slate-800">
              +{formatPrice(calculation.breakdown.finishingAddon)}
            </span>
          </div>
        )}

        {calculation.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>{t('configurator.volumeSavings')}</span>
            <span>-{formatPrice(calculation.discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
        <span>{t('configurator.proofGuarantee')}</span>
      </div>
    </div>
  );
};
