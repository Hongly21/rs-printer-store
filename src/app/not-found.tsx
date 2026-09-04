import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 px-4 min-h-[70vh] flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto text-3xl font-black">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
