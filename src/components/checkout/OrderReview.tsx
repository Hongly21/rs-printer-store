'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getPaymentMethodById } from '@/data/payment-methods';
import { shopConfig } from '@/data/shop';
import { formatPrice, formatFileSize } from '@/lib/utils';
import {
  User,
  Truck,
  Store,
  CreditCard,
  Clock,
  Edit3,
  Paperclip,
  CheckCircle2,
  Loader2,
  Zap,
  Sparkles,
} from 'lucide-react';
import { startNavigationLoading, stopNavigationLoading } from '@/components/common/NavigationProgressBar';

import { getArtworkFile, clearArtworkFiles } from '@/lib/file-store';

export const OrderReview: React.FC = () => {
  const router = useRouter();
  const { customer, delivery, payment, submitOrder } = useCheckout();
  const { items, getTotals } = useCart();
  const { t, tObj } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = getTotals(delivery.method);
  const paymentConfig = getPaymentMethodById(payment.methodId);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    startNavigationLoading();

    try {
      // 1. Submit order in context (saves locally and generates orderNumber)
      const createdOrder = submitOrder();

      if (!createdOrder) {
        setIsSubmitting(false);
        stopNavigationLoading();
        return;
      }

      // 2. Prepare FormData to send to /api/orders (including any uploaded artwork files)
      const formData = new FormData();
      formData.append('order', JSON.stringify(createdOrder));

      for (const item of createdOrder.items) {
        if (item.file) {
          try {
            let rawFile = item.file.fileId ? await getArtworkFile(item.file.fileId) : null;
            if (!rawFile && item.file.previewUrl?.startsWith('data:')) {
              const res = await fetch(item.file.previewUrl);
              const blob = await res.blob();
              const ext = blob.type.includes('svg') ? '.svg' : blob.type.includes('png') ? '.png' : '.jpg';
              const cleanName = (item.file.name || 'artwork').replace(/[^a-zA-Z0-9_\u1780-\u17FF-]/g, '_');
              rawFile = new File([blob], `${cleanName}${ext}`, { type: blob.type || 'image/png' });
            }
            if (rawFile) {
              formData.append(`file_${item.id}`, rawFile, rawFile.name || item.file.name);
            }
          } catch (fileErr) {
            console.warn('Could not attach artwork file:', fileErr);
          }
        }
      }

      // 3. Dispatch to backend API (sends message and documents to Telegram group)
      try {
        await fetch('/api/orders', {
          method: 'POST',
          body: formData,
        });
      } catch (notifyErr) {
        console.warn('Telegram background dispatch warning:', notifyErr);
      }

      // 4. Clean up stored artwork files in IndexedDB
      try {
        await clearArtworkFiles();
      } catch {}

      // 5. Navigate to order confirmation
      router.push(`/order/success?orderNumber=${createdOrder.orderNumber}`);
    } catch (err) {
      console.error('Failed to submit order:', err);
      setIsSubmitting(false);
      stopNavigationLoading();
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 text-center space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">{t('cart.emptyTitle')}</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl"
        >
          {t('products.allProductsTab')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('checkout.reviewTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('checkout.reviewSubtitle')}
          </p>
        </div>

        {/* Section 1: Customer Details */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              {t('checkout.customerTitle')}
            </h3>
            <Link
              href="/checkout/customer"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('checkout.editSection')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t('checkout.fullName')}:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{customer.fullName || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t('checkout.phone')}:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{customer.phone || 'N/A'}</strong>
            </div>
            {customer.telegram && (
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t('checkout.telegramUser')}:</span>
                <span className="text-sky-600 font-bold">{customer.telegram}</span>
              </div>
            )}
            {customer.notes && (
              <div className="sm:col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t('checkout.orderRemarks')}:</span>
                <p className="italic text-slate-600 dark:text-slate-400">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Delivery Details */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              {delivery.method === 'pickup' ? (
                <Store className="w-4 h-4 text-brand-600" />
              ) : (
                <Truck className="w-4 h-4 text-brand-600" />
              )}
              {t('checkout.stepDelivery')}
            </h3>
            <Link
              href="/checkout/delivery"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('checkout.editSection')}</span>
            </Link>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 pt-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                {delivery.method === 'pickup' ? t('checkout.shopPickup') : t('checkout.expressDelivery')}
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {totals.deliveryFee === 0 ? t('checkout.freeBadge') : formatPrice(totals.deliveryFee)}
              </span>
            </div>

            {delivery.method === 'pickup' ? (
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {tObj(shopConfig.address, shopConfig.addressKm)} ({tObj(shopConfig.pickupLocationDetail, shopConfig.pickupLocationDetailKm)})
              </p>
            ) : delivery.carrier === 'vireak_buntham' ? (
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center text-[8px] font-black">VET</span>
                  <span>{tObj('Vireak Buntham Express (Branch Pickup)', 'វីរៈ ប៊ុនថាំ (ទៅយកនៅសាខា)')}</span>
                </p>
                <p>
                  {tObj('Branch / Campus:', 'សាខាទៅយក៖')} <strong>{delivery.vireakBranchName || delivery.address}</strong>
                </p>
                {delivery.vireakBranchNote && (
                  <p className="text-slate-500">
                    {tObj('Campus Note:', 'ចំណាំទីតាំង៖')} {delivery.vireakBranchNote}
                  </p>
                )}
                {delivery.recipientPhone && (
                  <p>
                    {tObj('VET SMS/Contact Phone:', 'លេខទូរស័ព្ទទទួលទំនិញ៖')} <strong>{delivery.recipientPhone}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <p>
                  {t('checkout.deliveryAddress')}: <strong>{delivery.address}</strong>
                </p>
                {delivery.recipientPhone && (
                  <p>
                    {tObj('Contact Phone:', 'លេខទូរស័ព្ទទទួល៖')} <strong>{delivery.recipientPhone}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Ordered Items List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {t('success.printedItems')} ({items.length})
            </h3>
            <Link
              href="/cart"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('checkout.editItems')}</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {items.map((item, idx) => {
              const materialDisplay = tObj(item.config.materialName, item.config.materialNameKm);
              const sizeDisplay = tObj(item.config.sizeName, item.config.sizeNameKm);
              const finishingDisplay = tObj(item.config.finishingName, item.config.finishingNameKm);

              return (
                <div key={item.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Artwork Preview Thumbnail */}
                    {item.file?.previewUrl && (
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.file.previewUrl}
                          alt={item.file.name}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                    )}

                    <div className="space-y-1 text-xs min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-400">{idx + 1}.</span>
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{tObj(item.productName, item.productNameKm)}</h4>
                        {item.config.designMode === 'preset' && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 text-brand-600 dark:text-brand-300 shrink-0" />
                            <span>{tObj('Ready Design', 'ស្ទីគ័រមានស្រាប់')}</span>
                          </span>
                        )}
                        {item.config.isCustomized && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>{tObj('Customized', 'បានកែសម្រួល')}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-2 pl-4">
                        {materialDisplay && <span>• {materialDisplay}</span>}
                        {sizeDisplay && <span>• {sizeDisplay}</span>}
                        {finishingDisplay && <span>• {finishingDisplay}</span>}
                        <span>• Qty: {item.config.quantity} {t('configurator.pcs')}</span>
                      </div>

                      {item.file && (
                        <div className="pl-4 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold pt-0.5">
                          <Paperclip className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{item.file.name} ({formatFileSize(item.file.size)})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Payment & Status */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              {t('checkout.stepPayment')}
            </h3>
            <Link
              href="/checkout/payment"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('checkout.editSection')}</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t('checkout.selectedMethod')}</span>
              <strong className="text-slate-900 dark:text-white font-extrabold text-sm">
                {paymentConfig ? tObj(paymentConfig.name, paymentConfig.nameKm) : 'Payment'}
              </strong>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold text-xs border border-amber-200/80 dark:border-amber-800/80">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('checkout.statusPending')}</span>
            </div>
          </div>
        </div>

        {/* Totals Calculation */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{t('cart.subtotal')}</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatPrice(totals.subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{t('checkout.deliveryFeeLabel')}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {totals.deliveryFee === 0 ? t('checkout.freeBadge') : formatPrice(totals.deliveryFee)}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
            <span className="text-base font-black text-slate-900 dark:text-white">{t('checkout.totalDue')}</span>
            <span className="text-2xl font-black text-brand-600">
              {formatPrice(totals.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            startNavigationLoading();
            router.push('/checkout/payment');
          }}
          className="px-6 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          {t('checkout.backToPayment')}
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          <span>{isSubmitting ? t('checkout.placingOrder') : t('checkout.placeOrder')}</span>
        </button>
      </div>
    </div>
  );
};
