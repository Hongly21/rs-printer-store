'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { formatTelegramOrderMessage, generateTelegramShareLink } from '@/lib/telegram';
import { MessageSquare, Copy, Check, ExternalLink, Printer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface OrderTelegramShareProps {
  order: Order;
}

export const OrderTelegramShare: React.FC<OrderTelegramShareProps> = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const { t, tObj } = useLanguage();
  const formattedMessage = formatTelegramOrderMessage(order);
  const telegramUrl = generateTelegramShareLink(order);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            {tObj('Fastest Confirmation', 'ការបញ្ជាក់រហ័សទាន់ចិត្ត')}
          </span>
          <h3 className="text-xl font-black text-white tracking-tight">
            {t('success.sendTelegramTitle')}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            {t('success.sendTelegramDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Print receipt"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('success.printReceipt')}</span>
          </button>
        </div>
      </div>

      {/* Message preview codeblock */}
      <div className="relative">
        <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto max-h-56 border border-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
          {formattedMessage}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{t('success.copySuccess')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t('success.copyFormatted')}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Telegram CTA */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all group"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{t('success.openTelegram')}</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? t('success.copySuccess') : t('success.copyFormatted')}</span>
        </button>
      </div>
    </div>
  );
};
