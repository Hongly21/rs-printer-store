'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function startNavigationLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('app:navigate-start'));
  }
}

export function stopNavigationLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('app:navigate-stop'));
  }
}

function NavigationProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spinnerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = () => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    setLoading(true);
    setProgress(20);

    spinnerTimerRef.current = setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 45) return prev + 10;
        if (prev < 70) return prev + 5;
        if (prev < 88) return prev + 2;
        return prev;
      });
    }, 150);
  };

  const finishLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spinnerTimerRef.current) clearTimeout(spinnerTimerRef.current);

    setProgress(100);
    setShowSpinner(false);

    finishTimerRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 200);
  };

  useEffect(() => {
    finishLoading();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.getAttribute('target') === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      startLoading();
    };

    const handleCustomStart = () => startLoading();
    const handleCustomStop = () => finishLoading();

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('app:navigate-start', handleCustomStart);
    window.addEventListener('app:navigate-stop', handleCustomStop);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('app:navigate-start', handleCustomStart);
      window.removeEventListener('app:navigate-stop', handleCustomStop);
      if (timerRef.current) clearInterval(timerRef.current);
      if (spinnerTimerRef.current) clearTimeout(spinnerTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
        style={{ opacity: loading ? 1 : 0 }}
      >
        <div
          className="h-[3px] bg-gradient-to-r from-brand-600 via-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(2,132,199,0.8)] transition-all duration-200 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/70 animate-pulse" />
        </div>
      </div>
      {showSpinner && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[99999] pointer-events-none animate-in fade-in zoom-in duration-150">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-1.5 ring-1 ring-black/5 dark:ring-white/10">
            <div className="w-full h-full rounded-full border-2 border-brand-200 dark:border-brand-900 border-t-brand-600 animate-spin" />
          </div>
        </div>
      )}
    </>
  );
}

export const NavigationProgressBar: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarInner />
    </Suspense>
  );
};
