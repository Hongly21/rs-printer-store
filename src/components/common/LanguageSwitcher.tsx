'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'toggle';
  className?: string;
}

const KhmerFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <svg className={`shrink-0 rounded-xs overflow-hidden shadow-xs ${className}`} viewBox="0 0 640 480" aria-hidden="true">
    <path fill="#032ea1" d="M0 0h640v480H0z"/>
    <path fill="#e00025" d="M0 120h640v240H0z"/>
    <path fill="#fff" d="M358.3 226.3v-12.7c0-1.8-1.5-3.3-3.3-3.3h-10.7c-1.8 0-3.3 1.5-3.3 3.3v12.7h-42v-12.7c0-1.8-1.5-3.3-3.3-3.3H285c-1.8 0-3.3 1.5-3.3 3.3v12.7h-21.7c-1.8 0-3.3 1.5-3.3 3.3v42.7c0 1.8 1.5 3.3 3.3 3.3h120c1.8 0 3.3-1.5 3.3-3.3v-42.7c0-1.8-1.5-3.3-3.3-3.3h-21.7z"/>
  </svg>
);

const EnglishFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <svg className={`shrink-0 rounded-xs overflow-hidden shadow-xs ${className}`} viewBox="0 0 640 480" aria-hidden="true">
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#fff" d="m75 0 245 180L565 0h75v60L415 240l225 180v60h-75L320 300 75 480H0v-60l225-180L0 60V0h75z"/>
    <path fill="#c8102e" d="m425 285 215 165v30h-35L385 300h40zm-210-90L0 30V0h35l220 180h-40zM0 450l215-165h40L40 480H0v-30zm640-420L425 195h-40L600 0h40v30z"/>
    <path fill="#fff" d="M260 0h120v480H260zM0 180h640v120H0z"/>
    <path fill="#c8102e" d="M280 0h80v480h-80zM0 200h640v80H0z"/>
  </svg>
);

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
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-sm ${className}`}
        title="Change Language / ប្តូរភាសា"
      >
        <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        {lang === 'en' ? (
          <span className="inline-flex items-center gap-1.5">
            <KhmerFlagIcon />
            <span>ភាសាខ្មែរ</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <EnglishFlagIcon />
            <span>English</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-xs font-bold ${className}`}>
      <button
        type="button"
        onClick={() => setLang('km')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
          lang === 'km'
            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm font-black'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <KhmerFlagIcon />
        <span>ខ្មែរ</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
          lang === 'en'
            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm font-black'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <EnglishFlagIcon />
        <span>EN</span>
      </button>
    </div>
  );
};
