'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice, formatFileSize } from '@/lib/utils';
import { Trash2, Edit3, Paperclip, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();
  const { t, tObj } = useLanguage();

  const handleDecrement = () => {
    updateQuantity(item.id, item.config.quantity - 10);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.config.quantity + 10);
  };

  const materialDisplay = tObj(item.config.materialName, item.config.materialNameKm);
  const sizeDisplay = tObj(item.config.sizeName, item.config.sizeNameKm);
  const finishingDisplay = tObj(item.config.finishingName, item.config.finishingNameKm);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Product Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 relative shrink-0 flex items-center justify-center">
          <Image
            src={item.productImage}
            alt={tObj(item.productName, item.productNameKm)}
            fill
            className="object-contain p-1"
          />
        </div>

        {/* Item Configuration Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/products/${item.productSlug}`}
                className="font-bold text-slate-900 text-base hover:text-brand-600 transition-colors inline-block"
              >
                {tObj(item.productName, item.productNameKm)}
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5 font-medium">
                {materialDisplay && (
                  <span>{tObj('Material:', 'សម្ភារៈ៖')} <strong className="text-slate-700">{materialDisplay}</strong></span>
                )}
                {sizeDisplay && (
                  <span>{tObj('Size:', 'ទំហំ៖')} <strong className="text-slate-700">{sizeDisplay}</strong></span>
                )}
                {finishingDisplay && (
                  <span>{tObj('Finishing:', 'ការកាត់/ស្រោប៖')} <strong className="text-slate-700">{finishingDisplay}</strong></span>
                )}
              </div>
            </div>

            {/* Total Price */}
            <div className="text-right shrink-0">
              <span className="text-lg font-black text-slate-900 block">
                {formatPrice(item.totalPrice)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {formatPrice(item.unitPrice)} / {t('configurator.perPiece')}
              </span>
            </div>
          </div>

          {/* Attached Design File Info */}
          {item.file && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <Paperclip className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{item.file.name}</span>
              <span className="text-[10px] text-emerald-600 font-normal">
                ({formatFileSize(item.file.size)})
              </span>
            </div>
          )}

          {/* Special notes */}
          {item.config.notes && (
            <p className="text-xs text-slate-500 italic bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              {tObj('Note:', 'ចំណាំ៖')} &quot;{item.config.notes}&quot;
            </p>
          )}

          {/* Bottom actions: Quantity stepper + Edit + Remove */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={item.config.quantity <= 1}
                  aria-label="Decrease item quantity"
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 font-bold text-slate-800 min-w-[3rem] text-center">
                  {item.config.quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  aria-label="Increase item quantity"
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-slate-500">{t('configurator.pcs')}</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/products/${item.productSlug}`}
                className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('cart.edit')}</span>
              </Link>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item from cart"
                className="text-xs font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('cart.remove')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
