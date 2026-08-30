'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, MessageSquare, Globe } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { shopConfig } from '@/data/shop';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, isHydrated } = useCart();
  const { lang, toggleLang, t } = useLanguage();

  // Hide bottom nav on checkout review and order success to give clean focus
  if (pathname.includes('/checkout/review') || pathname.includes('/order/success')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-3 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/') && pathname === '/'
              ? 'text-brand-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') && pathname === '/' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">{t('nav.home')}</span>
        </Link>

        {/* 2. Products Catalog */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive('/products')
              ? 'text-brand-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <Grid className={`w-5 h-5 ${isActive('/products') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">{t('nav.products')}</span>
        </Link>

        {/* 3. Cart with Badge */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            isActive('/cart') || isActive('/checkout')
              ? 'text-brand-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${(isActive('/cart') || isActive('/checkout')) ? 'stroke-[2.5]' : ''}`} />
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[1.125rem] h-[1.125rem] bg-brand-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center px-1 shadow-sm animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('nav.cart')}</span>
        </Link>

        {/* 4. Telegram Direct Support */}
        <a
          href={`https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-sky-600 hover:text-sky-700 font-semibold transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Telegram</span>
        </a>

        {/* 5. Language Switcher Quick Button */}
        <button
          type="button"
          onClick={toggleLang}
          aria-label="Toggle language"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold transition-all active:scale-95"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black border border-slate-300">
            {lang === 'km' ? 'EN' : 'ខ្មែរ'}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">
            {lang === 'km' ? 'ភាសា' : 'Lang'}
          </span>
        </button>
      </div>
    </div>
  );
};
