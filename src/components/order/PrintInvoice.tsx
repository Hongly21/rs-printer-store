'use client';

import React, { useRef } from 'react';
import { Order } from '@/types';
import { shopConfig } from '@/data/shop';
import { formatPrice, formatDate } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { Printer, Download, CheckCircle2, QrCode, FileText, X } from 'lucide-react';

interface PrintInvoiceProps {
  order: Order;
  isOpen?: boolean;
  onClose?: () => void;
}

export const PrintInvoice: React.FC<PrintInvoiceProps> = ({ order, isOpen, onClose }) => {
  const { tObj } = useLanguage();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const carrierLabel =
    order.delivery.method === 'pickup'
      ? tObj('Store Pickup (RS Printer Hub, Sen Sok)', 'មកយកផ្ទាល់នៅហាង (RS Printer Hub, សែនសុខ)')
      : order.delivery.carrier === 'vireak_buntham'
      ? `${tObj('Vireak Buntham (VET Express)', 'វីរៈ ប៊ុនថាំ អេចប្រេស')} - ${order.delivery.vireakBranchName || tObj('Provincial Hub', 'សាខាខេត្ត')}`
      : tObj('Phnom Penh Door-to-Door Delivery', 'ដឹកជញ្ជូនដល់ទីកន្លែង រាជធានីភ្នំពេញ');

  const paymentMethodLabel =
    order.payment.methodName ||
    (order.payment.methodId === 'khqr'
      ? tObj('Bakong KHQR Universal Scan', 'ស្កេន Bakong KHQR')
      : order.payment.methodId === 'aba'
      ? tObj('ABA Bank Mobile Transfer', 'ផ្ទេរតាម ABA Mobile')
      : tObj('Cash on Delivery / Counter', 'ទូទាត់សាច់ប្រាក់នៅហាង'));

  return (
    <>
      {/* Print Trigger Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white hover:bg-brand-600 dark:hover:bg-brand-500 text-white dark:text-slate-900 dark:hover:text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 print:hidden"
      >
        <Printer className="w-4 h-4" />
        <span>{tObj('Print Invoice / Save as PDF', 'បោះពុម្ពវិក្កយបត្រ / រក្សាទុកជា PDF')}</span>
      </button>

      {/* Printable Invoice Container */}
      {/* On screen: hidden or modal; During print: cleanly visible as standard A4 document */}
      <div className="print:block hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 24px;
              background: white !important;
              color: black !important;
            }
            @page {
              size: A4 portrait;
              margin: 1.2cm;
            }
          }
        `}} />

        <div id="printable-invoice" ref={invoiceRef} className="bg-white text-slate-900 p-8 font-sans max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-300 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                  RS
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {shopConfig.name}
                </h1>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                {shopConfig.tagline}
              </p>
              <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                <p>{shopConfig.address}</p>
                <p>Phone: {shopConfig.displayPhone} | Telegram: {shopConfig.telegram}</p>
                <p>Email: {shopConfig.email}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-widest text-sky-700 block">
                OFFICIAL INVOICE
              </span>
              <span className="text-lg font-black font-mono text-slate-900 block mt-0.5">
                #{order.orderNumber}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Date: {formatDate(order.createdAt)}
              </span>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified Order
              </span>
            </div>
          </div>

          {/* Customer & Delivery Information Cards */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] text-slate-500 mb-1.5">
                Billed / Issued To:
              </h3>
              <p className="font-black text-sm text-slate-900">{order.customer.fullName}</p>
              <p className="text-slate-600 mt-0.5">Phone: {order.customer.phone}</p>
              {order.customer.telegram && <p className="text-slate-600">Telegram: {order.customer.telegram}</p>}
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] text-slate-500 mb-1.5">
                Fulfillment & Payment:
              </h3>
              <p className="font-bold text-slate-900">Delivery: {carrierLabel}</p>
              {order.delivery.address && (
                <p className="text-slate-600 mt-0.5">Address: {order.delivery.address}</p>
              )}
              <p className="text-slate-600 mt-1">Payment: {paymentMethodLabel}</p>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-2.5 px-2">No.</th>
                  <th className="py-2.5 px-2">Description & Print Specifications</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {order.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-2 font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <strong className="font-bold text-slate-900 block text-xs">
                        {item.productName}
                      </strong>
                      <div className="text-[11px] text-slate-500 mt-0.5 space-x-1.5">
                        {item.config.materialName && <span>Material: {item.config.materialName}</span>}
                        {item.config.sizeName && <span>• Size: {item.config.sizeName}</span>}
                        {item.config.finishingName && <span>• Finish: {item.config.finishingName}</span>}
                      </div>
                      {item.file && (
                        <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                          Artwork: {item.file.name}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-700">
                      {item.config.quantity}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-2 border-t border-slate-300">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Shipping:</span>
                <span className="font-mono font-bold text-slate-900">
                  {order.deliveryFee === 0 ? 'FREE ($0.00)' : formatPrice(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-base text-sky-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Authorized Stamp */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div className="max-w-xs space-y-1 text-[10px]">
              <p className="font-bold text-slate-700">Notice & Terms:</p>
              <p>1. Proof inspection approved prior to printing run.</p>
              <p>2. Keep this invoice receipt for pickup collection or delivery verification.</p>
              <p>3. Questions? Contact orders@rsprinter.com or Telegram @b_hongly.</p>
            </div>

            <div className="text-center w-48 border-t border-dashed border-slate-400 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Authorized Signature & Stamp
              </span>
              <span className="text-[11px] font-bold text-slate-800 block mt-1 font-serif">
                RS Printer Workshop
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
