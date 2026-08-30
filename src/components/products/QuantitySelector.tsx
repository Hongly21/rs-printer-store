'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  presetQuantities?: number[];
  minQuantity?: number;
  maxQuantity?: number;
  step?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  presetQuantities = [50, 100, 250, 500, 1000],
  minQuantity = 1,
  maxQuantity = 10000,
  step = 1,
}) => {
  const { t } = useLanguage();

  const handleDecrement = () => {
    const newQty = Math.max(minQuantity, quantity - step);
    onChange(newQty);
  };

  const handleIncrement = () => {
    const newQty = Math.min(maxQuantity, quantity + step);
    onChange(newQty);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      onChange(minQuantity);
    } else {
      onChange(Math.max(minQuantity, Math.min(maxQuantity, val)));
    }
  };

  return (
    <div className="space-y-3">
      {/* Preset pills */}
      {presetQuantities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presetQuantities.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                quantity === preset
                  ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {preset.toLocaleString()} {t('configurator.pcs')}
            </button>
          ))}
        </div>
      )}

      {/* Stepper + Input */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= minQuantity}
            aria-label="Decrease quantity"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            min={minQuantity}
            max={maxQuantity}
            value={quantity}
            onChange={handleInputChange}
            aria-label="Print quantity"
            className="w-20 text-center font-black text-slate-900 text-base focus:outline-none bg-transparent"
          />

          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {t('configurator.minOrder')} {minQuantity} {t('configurator.pcs')}
        </span>
      </div>
    </div>
  );
};
