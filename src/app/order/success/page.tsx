'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useLanguage } from '@/context/LanguageContext';
import { Order } from '@/types';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderTelegramShare } from '@/components/order/OrderTelegramShare';
import { OrderTimelineTracker } from '@/components/order/OrderTimelineTracker';
import { formatPrice, formatDate } from '@/lib/utils';
import { shopConfig } from '@/data/shop';
import { triggerConfetti } from '@/lib/confetti';
import { CheckCircle2, ShoppingBag, Paperclip, Home, MapPin, Phone, Building2, Info } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('orderNumber');
  const { currentOrder } = useCheckout();
  const { t, tObj } = useLanguage();
  const [order, setOrder] = useState<Order | null>(currentOrder);

  useEffect(() => {
    try {
      triggerConfetti();
    } catch (e) {
      // ignore
    }

    if (!order) {
      try {
        const stored = localStorage.getItem('printcraft_latest_order_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          setOrder(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [order]);

  const displayOrderNumber = order?.orderNumber || orderNumberParam || 'ORD-NEW-ORDER';

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Success Confirmation Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {t('success.orderReceived')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('success.thankYou')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('success.subtitle')}
            </p>
          </div>

          {/* Order ID & Payment Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('success.orderNumber')}
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-slate-900 dark:text-white block mt-0.5">
                #{displayOrderNumber}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-center items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('success.paymentStatus')}
              </span>
              <OrderStatusBadge status={order?.payment.status || 'pending'} />
            </div>
          </div>
        </div>

        {/* Visual Production Timeline Tracker */}
        <OrderTimelineTracker
          carrier={order?.delivery.carrier}
          isPickup={order?.delivery.method === 'pickup'}
        />

        {/* Special Vireak Buntham SMS Alert Notice */}
        {order?.delivery.carrier === 'vireak_buntham' && (
          <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-3xl border border-amber-200 dark:border-amber-900/60 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center font-black text-xs">
                VET
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {tObj('Vireak Buntham Delivery Pickup Note', 'សេចក្តីជូនដំណឹងអំពីការទៅយកទំនិញនៅ វីរៈ ប៊ុនថាំ')}
              </h4>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pl-1">
              <p className="flex items-center gap-1.5 flex-wrap">
                <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{tObj('Selected Campus/Branch:', 'សាខាដែលបានជ្រើស៖')}</span>{' '}
                <strong className="text-slate-900 dark:text-white">{order.delivery.vireakBranchName || order.delivery.address}</strong>
                {order.delivery.vireakBranchNote ? ` (${order.delivery.vireakBranchNote})` : ''}
              </p>
              <p className="flex items-center gap-1.5 flex-wrap">
                <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{tObj('Recipient Phone for SMS:', 'លេខទូរស័ព្ទសម្រាប់ទទួលសារ SMS៖')}</span>{' '}
                <code className="font-bold text-slate-900 dark:text-white bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">{order.delivery.recipientPhone || order.customer.phone}</code>
              </p>
              <p className="text-slate-500 dark:text-slate-400 pt-1 text-[11px] leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {tObj(
                    'Vireak Buntham will send an SMS to this phone number once your printed parcel arrives at the branch. Please present your phone number at the branch counter to collect.',
                    'ក្រុមហ៊ុន វីរៈ ប៊ុនថាំ នឹងផ្ញើសារ SMS ជូនដំណឹងទៅកាន់លេខទូរស័ព្ទនេះនៅពេលកញ្ចប់ទំនិញទៅដល់សាខា។ សូមបង្ហាញលេខទូរស័ព្ទនៅបញ្ជរដើម្បីទទួលកញ្ចប់ទំនិញ។'
                  )}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Telegram Direct Send Notification Card */}
        {order && <OrderTelegramShare order={order} />}

        {/* Order Details Receipt Breakdown */}
        {order && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {t('success.orderSummaryReceipt')}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('success.placedOn')} {formatDate(order.createdAt)}
              </span>
            </div>

            {/* Customer & Delivery Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {t('success.customerDetails')}
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{order.customer.fullName}</p>
                <p className="text-slate-600 dark:text-slate-300">Phone: {order.customer.phone}</p>
                {order.customer.telegram && (
                  <p className="text-sky-600 font-medium">Telegram: {order.customer.telegram}</p>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {t('success.fulfillmentMethod')}
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {order.delivery.method === 'pickup'
                    ? t('checkout.shopPickup')
                    : order.delivery.carrier === 'vireak_buntham'
                    ? tObj('Vireak Buntham Express (Branch Pickup)', 'វីរៈ ប៊ុនថាំ (ទៅយកនៅសាខា)')
                    : t('checkout.expressDelivery')}
                </p>
                <div className="text-slate-600 dark:text-slate-300 text-xs">
                  {order.delivery.method === 'pickup' ? (
                    <p>{tObj(shopConfig.address, shopConfig.addressKm)}</p>
                  ) : order.delivery.carrier === 'vireak_buntham' ? (
                    <div className="space-y-0.5 mt-0.5">
                      <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{order.delivery.vireakBranchName || order.delivery.address}</span>
                      </p>
                      {order.delivery.vireakBranchNote && (
                        <p className="text-slate-500 text-[11px] pl-5">Note: {order.delivery.vireakBranchNote}</p>
                      )}
                      {order.delivery.recipientPhone && (
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pl-0.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Contact/SMS: {order.delivery.recipientPhone}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>{order.delivery.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {t('success.printedItems')} ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                {order.items.map((item, idx) => {
                  const materialDisplay = tObj(item.config.materialName, item.config.materialNameKm);
                  const sizeDisplay = tObj(item.config.sizeName, item.config.sizeNameKm);
                  const finishingDisplay = tObj(item.config.finishingName, item.config.finishingNameKm);

                  return (
                    <div key={item.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">{idx + 1}.</span>
                          <strong className="text-slate-900 dark:text-white font-extrabold text-sm">
                            {tObj(item.productName, item.productNameKm)}
                          </strong>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 pl-4 flex flex-wrap gap-x-2">
                          {materialDisplay && <span>Material: {materialDisplay}</span>}
                          {sizeDisplay && <span>• Size: {sizeDisplay}</span>}
                          {finishingDisplay && <span>• Finishing: {finishingDisplay}</span>}
                          <span>• Qty: {item.config.quantity} {t('configurator.pcs')}</span>
                        </div>
                        {item.file && (
                          <div className="pl-4 flex items-center gap-1.5 text-emerald-700 font-semibold pt-0.5">
                            <Paperclip className="w-3 h-3 text-emerald-600" />
                            <span>{item.file.name}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
                <span>{t('cart.subtotal')}</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
                <span>{t('checkout.deliveryFeeLabel')}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {order.deliveryFee === 0 ? t('checkout.freeBadge') : formatPrice(order.deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900 dark:text-white">{t('checkout.totalDue')}</span>
                <span className="text-xl font-black text-brand-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Back Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{t('success.backToHome')}</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('success.browseMore')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm font-semibold text-slate-400">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
