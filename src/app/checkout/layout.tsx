import React from 'react';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutSteps />
        {children}
      </div>
    </div>
  );
}
