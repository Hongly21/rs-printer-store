'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, HelpCircle, Zap, Layers, X, ArrowRight } from 'lucide-react';
import { useOrderGuide } from '@/context/OrderGuideContext';
import { useLanguage } from '@/context/LanguageContext';

export const FloatingGuideButton: React.FC = () => {
  const pathname = usePathname();
  const { openGuide, startLiveTour, hasSeenGuide } = useOrderGuide();
  const { tObj } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Hide on checkout review & success pages to avoid distractions
  if (pathname.includes('/checkout/review') || pathname.includes('/order/success')) {
    return null;
  }

  const isConfiguratorPage = pathname.includes('/products/');

  return (
    <div
      ref={menuRef}
      className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Expandable Menu Popover */}
      {menuOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-3 text-slate-900 dark:text-white space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="font-extrabold text-xs">
                {tObj('Choose Guide Type', 'ជ្រើសរើសទម្រង់មគ្គុទ្ទេសក៍')}
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Option 1: Modern Live Spotlight Tour (Dimmed background + Element cutout) */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              startLiveTour(isConfiguratorPage ? 'configurator' : 'homepage');
            }}
            className="w-full p-3 rounded-2xl bg-brand-50/70 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800/80 text-left transition-all group flex items-start gap-3 active:scale-98"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="font-black text-xs text-brand-900 dark:text-brand-300">
                  {tObj('Live On-Screen Tour', 'មគ្គុទ្ទេសក៍ជាក់ស្តែងលើទំព័រ')}
                </h5>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                  Modern
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                {tObj(
                  'Dims the background and highlights real buttons one-by-one with interactive tips.',
                  'ធ្វើឱ្យផ្ទៃខាងក្រោយព្រាល និងរំលេចប៊ូតុងជាក់ស្តែងមួយៗលើអេក្រង់។'
                )}
              </p>
            </div>
          </button>

          {/* Option 2: Step-by-Step Visual Simulator Modal */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openGuide(1);
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left transition-all group flex items-start gap-3 active:scale-98"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h5 className="font-black text-xs text-slate-900 dark:text-white">
                {tObj('Hands-on Simulator', 'មគ្គុទ្ទេសក៍គំរូសាកល្បង')}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {tObj(
                  'Step-by-step modal with live price calculation, design picker, and KHQR preview.',
                  'ផ្ទាំងគំរូសាកល្បងចុចគណនាតម្លៃ ភ្ជាប់រូប និងមើលគំរូស្កេន KHQR។'
                )}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Pill Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-black/40 hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white border border-slate-700/50 dark:border-slate-200 transition-all active:scale-95"
        aria-label="Open Interactive Guide Menu"
      >
        {/* Pulsing beacon if user hasn't seen the guide */}
        {!hasSeenGuide && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
          </span>
        )}

        <div className="w-6 h-6 rounded-full bg-brand-500/20 dark:bg-slate-200 flex items-center justify-center text-brand-400 dark:text-brand-600 group-hover:text-white group-hover:bg-white/20 transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <div className="text-left">
          <span className="block text-[11px] sm:text-xs font-black tracking-tight leading-tight">
            {tObj('How to Order?', 'របៀបកុម្ម៉ង់?')}
          </span>
          <span className="block text-[9px] opacity-75 font-semibold leading-tight">
            {tObj('Interactive Guide', 'មគ្គុទ្ទេសក៍ជាក់ស្តែង')}
          </span>
        </div>
      </button>
    </div>
  );
};
