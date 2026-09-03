'use client';

import React from 'react';
import { PaymentStatus } from '@/types';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface OrderStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className,
}) => {
  const { tObj } = useLanguage();

  if (status === 'paid') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 ${className || ''}`}>
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{tObj('PAID & CONFIRMED', 'បានទូទាត់រួចរាល់')}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 tracking-wide ${className || ''}`}>
      <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
      <span>{tObj('PENDING VERIFICATION', 'កំពុងរង់ចាំការផ្ទៀងផ្ទាត់ (PENDING)')}</span>
    </div>
  );
};
