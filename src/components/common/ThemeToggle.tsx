'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'switch' | 'segmented' | 'icon';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  variant,
}) => {
  const { setTheme, toggleTheme, isDark } = useTheme();
  const { tObj } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-14 h-8 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 flex items-center p-1 opacity-70 ${className}`}
        aria-hidden="true"
      >
        <span className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
      </div>
    );
  }

  // If segmented control or showLabel is requested (e.g. inside menus / settings)
  if (variant === 'segmented' || showLabel) {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 select-none ${className}`}
        role="group"
        aria-label={tObj('Theme Selection', 'ការជ្រើសរើសពន្លឺ')}
      >
        {/* Light Mode Option */}
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={!isDark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            !isDark
              ? 'bg-white text-brand-600 shadow-sm font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>{tObj('Light', 'ពន្លឺ')}</span>
        </button>

        {/* Dark Mode Option */}
        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-pressed={isDark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isDark
              ? 'bg-slate-900 text-brand-400 shadow-sm border border-slate-700/80 font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>{tObj('Dark', 'ងងឹត')}</span>
        </button>
      </div>
    );
  }

  // Default: Tactile pill toggle switch with sliding knob
  const tooltipText = isDark
    ? tObj('Switch to Light Mode (ពន្លឺ)', 'ប្តូរទៅពន្លឺ (Light)')
    : tObj('Switch to Dark Mode (ងងឹត)', 'ប្តូរទៅងងឹត (Dark)');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      title={tooltipText}
      aria-label={tooltipText}
      className={`relative w-14 h-8 rounded-full transition-colors duration-200 border p-1 flex items-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-brand-500/40 active:scale-95 ${
        isDark
          ? 'bg-slate-800 border-slate-700 shadow-inner'
          : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300/80 shadow-inner'
      } ${className}`}
    >
      {/* Background icons */}
      <div className="absolute inset-0 px-2 flex items-center justify-between pointer-events-none">
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
      </div>

      {/* Sliding knob */}
      <div
        className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-200 z-10 ${
          isDark
            ? 'translate-x-6 bg-slate-900 text-indigo-300 border border-slate-700'
            : 'translate-x-0 bg-white text-amber-500 border border-slate-200/80'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-indigo-300 animate-in zoom-in-75 duration-200" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 animate-in zoom-in-75 duration-200" />
        )}
      </div>
    </button>
  );
};
