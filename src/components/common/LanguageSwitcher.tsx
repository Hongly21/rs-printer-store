'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'toggle';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { lang, setLang } = useLanguage();

  if (variant === 'toggle') {
    return (
      <button
        type="button"
        onClick={() => setLang(lang === 'en' ? 'km' : 'en')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-sm ${className}`}
        title="Change Language / ប្តូរភាសា"
      >
        <Globe className="w-3.5 h-3.5 text-brand-600" />
        <span>{lang === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}</span>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-bold ${className}`}>
      <button
        type="button"
        onClick={() => setLang('km')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
          lang === 'km'
            ? 'bg-white text-brand-700 shadow-sm font-black'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span>🇰🇭</span>
        <span>ខ្មែរ</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
          lang === 'en'
            ? 'bg-white text-brand-700 shadow-sm font-black'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
