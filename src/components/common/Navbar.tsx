'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Phone, MessageSquare, ArrowRight, Printer } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { shopConfig } from '@/data/shop';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, isHydrated } = useCart();
  const { t, tObj } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.howItWorks'), href: '/#how-it-works' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('nav.topBarTurnaround')}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              {t('nav.topBarFreeDelivery')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${shopConfig.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>{shopConfig.displayPhone}</span>
            </a>
            <a
              href={`https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>{shopConfig.telegram}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                RS<span className="text-brand-600 ml-1.5">Printer</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider -mt-1">
                {tObj('STUDIO & PRINT SHOP', 'រោងពុម្ព & ស្ទូឌីយោ')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors relative py-1 ${
                  isActive(link.href)
                    ? 'text-brand-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions: Language switcher, Cart button, CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              aria-label="View shopping cart"
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-brand-50 border border-slate-200/80 transition-all flex items-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-800" />
              <span className="hidden sm:inline text-xs font-bold text-slate-700">
                {t('nav.cart')}
              </span>
              {isHydrated && cartCount > 0 && (
                <span className="bg-brand-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-full shadow-sm animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Start Order CTA (Desktop) */}
            <Link
              href="/products"
              className="hidden lg:flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-brand-500/20 active:scale-95"
            >
              <span>{t('nav.orderNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive(link.href)
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/products"
                className="w-full text-center py-3 bg-brand-600 text-white font-bold text-sm rounded-xl shadow-sm"
              >
                {t('nav.browseAll')}
              </Link>
              <div className="flex items-center justify-around pt-2 text-xs text-slate-500">
                <a
                  href={`tel:${shopConfig.phone}`}
                  className="flex items-center gap-1 hover:text-slate-900 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>{shopConfig.displayPhone}</span>
                </a>
                <a
                  href={`https://t.me/${shopConfig.telegramBotOrUser.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('nav.telegram')}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
