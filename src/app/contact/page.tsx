'use client';

import React, { useState } from 'react';
import { shopConfig } from '@/data/shop';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, MessageSquare, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { t, tObj } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            {t('contact.badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('contact.title')}
          </h1>
          <p className="text-sm text-slate-500">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* 2 Column Layout: Contact Cards on Left, Inquiry Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('contact.hotline')}
                </span>
                <a
                  href={`tel:${shopConfig.phone}`}
                  className="font-extrabold text-slate-900 text-base hover:text-brand-600 transition-colors"
                >
                  {shopConfig.displayPhone}
                </a>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('contact.hotlineDesc')}
                </p>
              </div>
            </div>

            {/* Telegram Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('contact.telegramChat')}
                </span>
                <a
                  href={`https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-sky-600 text-base hover:underline"
                >
                  {shopConfig.telegram}
                </a>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('contact.telegramDesc')}
                </p>
              </div>
            </div>

            {/* Studio Address & Hours */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('contact.pickupHub')}
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {tObj(shopConfig.name, shopConfig.nameKm)}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {tObj(shopConfig.address, shopConfig.addressKm)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {tObj(shopConfig.pickupLocationDetail, shopConfig.pickupLocationDetailKm)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('contact.operatingHours')}
                  </span>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">
                    {tObj(shopConfig.workingHours, shopConfig.workingHoursKm)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Quote / Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t('contact.quoteTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              {t('contact.quoteSubtitle')}
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">
                  {t('contact.msgReceived')}
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  {t('contact.msgThanks', { name: formData.name, contact: formData.contact })}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 shadow-sm"
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {t('contact.yourName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Alex Morgan / ប៊ុន ហុងលី"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {t('contact.contactInfo')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                    placeholder="e.g. 012 345 678 or @telegram_user"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {t('contact.messageLabel')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder={t('contact.messagePlaceholder')}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-white resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('contact.submitInquiry')}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('contact.responsePromise')}</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
