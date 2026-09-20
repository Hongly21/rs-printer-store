'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type TourType = 'homepage' | 'configurator';

interface OrderGuideContextType {
  // Modal Guide
  isGuideOpen: boolean;
  openGuide: (step?: number) => void;
  closeGuide: () => void;
  currentStep: number;
  setStep: (step: number) => void;
  hasSeenGuide: boolean;

  // Modern Live Spotlight Tour (Background Dim/Blur + Cutout)
  isLiveTourActive: boolean;
  liveTourStep: number;
  liveTourType: TourType;
  startLiveTour: (type?: TourType) => void;
  stopLiveTour: () => void;
  nextLiveTourStep: () => void;
  prevLiveTourStep: () => void;
  goToLiveTourStep: (step: number) => void;
}

const OrderGuideContext = createContext<OrderGuideContextType | undefined>(undefined);

const STORAGE_KEY = 'rs_printer_order_guide_seen_v1';

export const OrderGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSeenGuide, setHasSeenGuide] = useState(true);

  // Live Spotlight Tour State
  const [isLiveTourActive, setIsLiveTourActive] = useState(false);
  const [liveTourStep, setLiveTourStep] = useState(0);
  const [liveTourType, setLiveTourType] = useState<TourType>('homepage');

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      setHasSeenGuide(!!seen);
    } catch {
      setHasSeenGuide(false);
    }
  }, []);

  // Check URL params for auto-starting tour if redirected from elsewhere
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('tour') === 'configurator') {
        setLiveTourType('configurator');
        setLiveTourStep(0);
        setIsLiveTourActive(true);
        // Clean URL without refresh
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, [pathname]);

  const openGuide = (step?: number) => {
    if (step && step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
    setIsGuideOpen(true);
  };

  const closeGuide = () => {
    setIsGuideOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setHasSeenGuide(true);
    } catch {}
  };

  const setStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  // Start Live Spotlight Tour
  const startLiveTour = (type?: TourType) => {
    setIsGuideOpen(false); // Close modal if open

    const targetType = type || (pathname.includes('/products/') ? 'configurator' : 'homepage');

    if (targetType === 'configurator' && !pathname.includes('/products/')) {
      // If user wants customizer tour but is on homepage or another page, redirect to a popular product with ?tour=configurator
      router.push('/products/sticker-printing?tour=configurator');
      return;
    }

    setLiveTourType(targetType);
    setLiveTourStep(0);
    setIsLiveTourActive(true);
  };

  const stopLiveTour = () => {
    setIsLiveTourActive(false);
    setLiveTourStep(0);
  };

  const nextLiveTourStep = () => {
    setLiveTourStep((prev) => prev + 1);
  };

  const prevLiveTourStep = () => {
    setLiveTourStep((prev) => Math.max(0, prev - 1));
  };

  const goToLiveTourStep = (step: number) => {
    setLiveTourStep(step);
  };

  return (
    <OrderGuideContext.Provider
      value={{
        isGuideOpen,
        openGuide,
        closeGuide,
        currentStep,
        setStep,
        hasSeenGuide,
        isLiveTourActive,
        liveTourStep,
        liveTourType,
        startLiveTour,
        stopLiveTour,
        nextLiveTourStep,
        prevLiveTourStep,
        goToLiveTourStep,
      }}
    >
      {children}
    </OrderGuideContext.Provider>
  );
};

export const useOrderGuide = (): OrderGuideContextType => {
  const context = useContext(OrderGuideContext);
  if (!context) {
    throw new Error('useOrderGuide must be used within an OrderGuideProvider');
  }
  return context;
};
