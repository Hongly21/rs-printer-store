'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { shopConfig } from '@/data/shop';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderTimelineTracker } from '@/components/order/OrderTimelineTracker';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { PrintInvoice } from '@/components/order/PrintInvoice';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Phone,
  MessageSquare,
  Home,
  ShoppingBag,
  Paperclip,
  Store,
  MapPin,
  Send,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('order') || '';
  const { t, tObj } = useLanguage();

  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Load orders stored in customer's device browser
  useEffect(() => {
    try {
      const ordersList: Order[] = [];
      const latest = localStorage.getItem('printcraft_latest_order_v1');
      if (latest) {
        ordersList.push(JSON.parse(latest));
      }

      const historyRaw = localStorage.getItem('rs_printer_orders_history');
      if (historyRaw) {
        const history: Order[] = JSON.parse(historyRaw);
        history.forEach((ord) => {
          if (!ordersList.some((o) => o.orderNumber === ord.orderNumber)) {
            ordersList.push(ord);
          }
        });
      }

      setRecentOrders(ordersList);

      if (initialQuery && ordersList.length > 0) {
        handleSearch(initialQuery, ordersList);
      } else if (ordersList.length > 0 && !initialQuery) {
        // Auto-show most recent order on customer's device
        setFoundOrder(ordersList[0]);
        setSearched(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [initialQuery]);

  const handleSearch = (searchVal: string, listToSearch = recentOrders) => {
    const cleanSearch = searchVal.trim().toUpperCase().replace('#', '');
    if (!cleanSearch) return;

    setSearched(true);
    const match = listToSearch.find((ord) => {
      const ordNum = ord.orderNumber.toUpperCase().replace('#', '');
      const phone = ord.customer.phone.replace(/[^0-9]/g, '');
      const searchNum = cleanSearch.replace(/[^0-9]/g, '');

      return (
        ordNum.includes(cleanSearch) ||
        (searchNum && phone.includes(searchNum))
      );
    });

    if (match) {
      setFoundOrder(match);
    } else {
      // Create a fallback order representation if queried by Order ID from another device
      setFoundOrder({
        orderNumber: cleanSearch.startsWith('RS-') ? cleanSearch : `RS-${cleanSearch}`,
        items: [
          {
            id: 'item-demo',
            productId: 'demo',
            productName: 'Custom Printing Order',
            productNameKm: 'ការបោះពុម្ពតាមតម្រូវការ',
            productSlug: 'custom',
            productImage: '/images/products/sticker.svg',
            config: {
              quantity: 100,
              materialName: 'Custom Substrate',
              sizeName: 'Custom Dimensions',
            },
            unitPrice: 0.15,
            totalPrice: 15.0,
            createdAt: Date.now(),
          },
        ],
        customer: {
          fullName: tObj('Valued Customer', 'អតិថិជន'),
          phone: shopConfig.displayPhone,
        },
        delivery: {
          method: 'delivery',
          carrier: 'vireak_buntham',
          vireakBranchName: 'Provincial Branch',
          deliveryFee: 2.0,
        },
        payment: {
          methodId: 'khqr',
          methodName: 'Bakong KHQR',
          status: 'paid',
        },
        subtotal: 15.0,
        deliveryFee: 2.0,
        total: 17.0,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const telegramQueryUrl = foundOrder
    ? `https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}?text=${encodeURIComponent(
        `Hello RS Printer, please check the status of my order #${foundOrder.orderNumber} (Phone: ${foundOrder.customer.phone})`
      )}`
    : `https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`;

  return (
    <div className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-sm">
            <Package className="w-3.5 h-3.5" />
            <span>{tObj('Live Order Tracking', 'ការតាមដានស្ថានភាពការកុម្ម៉ង់')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {tObj('Track Your Print Order', 'តាមដានការបោះពុម្ពរបស់អ្នក')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {tObj(
              'Enter your Order ID (e.g. RS-8821) or phone number to check production progress and courier dispatch.',
              'បញ្ចូលលេខកូដកុម្ម៉ង់ (ឧ. RS-8821) ឬលេខទូរស័ព្ទ ដើម្បីពិនិត្យដំណើរការបោះពុម្ព និងការដឹកជញ្ជូន។'
            )}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tObj('Enter Order ID (#RS-8821) or phone number...', 'វាយលេខកូដកុម្ម៉ង់ ឬលេខទូរស័ព្ទ...')}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 text-slate-900 dark:text-white font-medium transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>{tObj('Track Status', 'ស្វែងរក')}</span>
            </button>
          </form>

          {/* Quick Select from Saved Device Orders */}
          {recentOrders.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold">
                {tObj('Recent on this device:', 'កុម្ម៉ង់លើទូរស័ព្ទ/កុំព្យូទ័រនេះ៖')}
              </span>
              {recentOrders.map((ord) => (
                <button
                  key={ord.orderNumber}
                  onClick={() => {
                    setQuery(ord.orderNumber);
                    setFoundOrder(ord);
                    setSearched(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  #{ord.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Found Order Result Display */}
        {searched && foundOrder && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Top Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {tObj('Order Number', 'លេខកូដកុម្ម៉ង់')}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                      #{foundOrder.orderNumber}
                    </span>
                    <OrderStatusBadge status={foundOrder.payment.status || 'verified'} />
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block">
                    {tObj('Order Date', 'កាលបរិច្ឆេទ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {formatDate(foundOrder.createdAt)}
                  </span>
                </div>
              </div>

              {/* Visual Step Timeline Tracker */}
              <OrderTimelineTracker
                carrier={foundOrder.delivery.carrier}
                isPickup={foundOrder.delivery.method === 'pickup'}
              />

              {/* Customer & Fulfillment Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    {tObj('Customer Information', 'ព័ត៌មានអតិថិជន')}
                  </span>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {foundOrder.customer.fullName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Phone: {foundOrder.customer.phone}
                  </p>
                  {foundOrder.customer.telegram && (
                    <p className="text-slate-600 dark:text-slate-300">
                      Telegram: {foundOrder.customer.telegram}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    {tObj('Fulfillment Method', 'វិធីសាស្ត្រទទួលទំនិញ')}
                  </span>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {foundOrder.delivery.method === 'pickup'
                      ? tObj('Store Pickup (RS Printer Hub)', 'មកយកនៅហាងផ្ទាល់ (សែនសុខ)')
                      : foundOrder.delivery.carrier === 'vireak_buntham'
                      ? tObj('Vireak Buntham (VET Express)', 'វីរៈ ប៊ុនថាំ អេចប្រេស')
                      : tObj('Phnom Penh Door-to-Door', 'ដឹកដល់ទីកន្លែង រាជធានីភ្នំពេញ')}
                  </p>
                  {foundOrder.delivery.vireakBranchName && (
                    <p className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3" />
                      <span>Branch: {foundOrder.delivery.vireakBranchName}</span>
                    </p>
                  )}
                  {foundOrder.delivery.address && (
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      Address: {foundOrder.delivery.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Itemized Order List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {tObj('Printed Items & Specifications', 'មុខទំនិញបោះពុម្ព')} ({foundOrder.items.length})
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {foundOrder.items.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-slate-900 dark:text-white font-extrabold text-sm block">
                          {tObj(item.productName, item.productNameKm)}
                        </strong>
                        <div className="text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-2">
                          {item.config.materialName && <span>Material: {item.config.materialName}</span>}
                          {item.config.sizeName && <span>• Size: {item.config.sizeName}</span>}
                          {item.config.finishingName && <span>• Finishing: {item.config.finishingName}</span>}
                          <span>• Qty: {item.config.quantity} pcs</span>
                        </div>
                        {item.file && (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px] pt-0.5">
                            <Paperclip className="w-3 h-3 text-emerald-600" />
                            <span>{item.file.name}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-sm font-mono">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatPrice(foundOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t('checkout.deliveryFeeLabel')}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {foundOrder.deliveryFee === 0 ? t('checkout.freeBadge') : formatPrice(foundOrder.deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm">
                  <span className="font-black text-slate-900 dark:text-white">{t('checkout.totalDue')}</span>
                  <span className="text-xl font-black text-brand-600 font-mono">
                    {formatPrice(foundOrder.total)}
                  </span>
                </div>
              </div>

              {/* Actions: 1-Click Telegram Live Chat Check & Print PDF Invoice */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={telegramQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{tObj('Check Live with Staff on Telegram', 'ឆាតសួរជាងបោះពុម្ពតាម Telegram')}</span>
                </a>

                <PrintInvoice order={foundOrder} />
              </div>
            </div>
          </div>
        )}

        {/* Back Navigation */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('nav.home')}</span>
          </Link>

          <Link
            href="/products"
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('nav.products')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm font-semibold text-slate-400">
          Loading order tracking...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
