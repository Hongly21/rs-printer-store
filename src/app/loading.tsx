import React from 'react';
import { Printer } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer pulsing ring */}
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 animate-ping absolute inset-0 m-auto" />
        
        {/* Spinning border ring */}
        <div className="w-16 h-16 rounded-2xl border-2 border-slate-200 dark:border-slate-800 border-t-brand-600 dark:border-t-brand-500 animate-spin absolute inset-0 m-auto" />
        
        {/* Centered Brand Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md relative z-10">
          <Printer className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
        <span>RS</span>
        <span className="text-brand-600">Printer</span>
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
        Loading... / កំពុងដំណើរការ...
      </p>
    </div>
  );
}
