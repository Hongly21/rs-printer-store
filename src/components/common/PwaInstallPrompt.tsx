'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { tObj } = useLanguage();

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    // Check if dismissed before in this session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds before displaying prompt to not disrupt first load
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For iOS Safari or browsers without beforeinstallprompt
      alert(
        tObj(
          'To install on iPhone/iPad: Tap the Share button in Safari and select "Add to Home Screen".',
          'សម្រាប់ iPhone/iPad៖ ចុចប៊ូតុង Share ក្នុង Safari រួចជ្រើសរើស "Add to Home Screen / បន្ថែមលើអេក្រង់ដើម"។'
        )
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md">
            P
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm text-white truncate">
              {tObj('Install PrintCraft App', 'ដំឡើងកម្មវិធី PrintCraft')}
            </h4>
            <p className="text-[11px] text-slate-300 leading-tight line-clamp-1">
              {tObj(
                'Fast mobile experience & offline access',
                'បញ្ជាទិញកាន់តែរហ័សលើទូរស័ព្ទ & ថេប្លេត'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{tObj('Install', 'ដំឡើង')}</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss app install banner"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
