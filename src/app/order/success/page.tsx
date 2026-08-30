'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useLanguage } from '@/context/LanguageContext';
import { Order } from '@/types';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { OrderTelegramShare } from '@/components/order/OrderTelegramShare';
import { formatPrice, formatDate } from '@/lib/utils';
import { shopConfig } from '@/data/shop';
import { triggerConfetti } from '@/lib/confetti';
import { CheckCircle2, ShoppingBag, Paperclip, Home } from 'lucide-react';

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
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Success Confirmation Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {t('success.orderReceived')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('success.thankYou')}
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {t('success.subtitle')}
            </p>
          </div>

          {/* Order ID & Payment Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('success.orderNumber')}
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-slate-900 block mt-0.5">
                #{displayOrderNumber}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-center items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('success.paymentStatus')}
              </span>
              <OrderStatusBadge status={order?.payment.status || 'pending'} />
            </div>
          </div>
        </div>

        {/* Telegram Direct Send Notification Card */}
        {order && <OrderTelegramShare order={order} />}

        {/* Order Details Receipt Breakdown */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {t('success.orderSummaryReceipt')}
              </h2>
              <span className="text-xs text-slate-500">
                {t('success.placedOn')} {formatDate(order.createdAt)}
              </span>
            </div>

            {/* Customer & Delivery Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {t('success.customerDetails')}
                </span>
                <p className="font-extrabold text-slate-900 text-sm">{order.customer.fullName}</p>
                <p className="text-slate-600">Phone: {order.customer.phone}</p>
                {order.customer.telegram && (
                  <p className="text-sky-600 font-medium">Telegram: {order.customer.telegram}</p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {t('success.fulfillmentMethod')}
                </span>
                <p className="font-extrabold text-slate-900 text-sm">
                  {order.delivery.method === 'pickup' ? t('checkout.shopPickup') : t('checkout.expressDelivery')}
                </p>
                <p className="text-slate-600">
                  {order.delivery.method === 'pickup'
                    ? tObj(shopConfig.address, shopConfig.addressKm)
                    : order.delivery.address}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('success.printedItems')} ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {order.items.map((item, idx) => {
                  const materialDisplay = tObj(item.config.materialName, item.config.materialNameKm);
                  const sizeDisplay = tObj(item.config.sizeName, item.config.sizeNameKm);
                  const finishingDisplay = tObj(item.config.finishingName, item.config.finishingNameKm);

                  return (
                    <div key={item.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">{idx + 1}.</span>
                          <strong className="text-slate-900 font-extrabold text-sm">
                            {tObj(item.productName, item.productNameKm)}
                          </strong>
                        </div>
                        <div className="text-slate-500 pl-4 flex flex-wrap gap-x-2">
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
                      <span className="font-black text-slate-900 text-sm">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>{t('cart.subtotal')}</span>
                <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>{t('checkout.deliveryFeeLabel')}</span>
                <span className="font-bold text-slate-900">
                  {order.deliveryFee === 0 ? t('checkout.freeBadge') : formatPrice(order.deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900">{t('checkout.totalDue')}</span>
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
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
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
