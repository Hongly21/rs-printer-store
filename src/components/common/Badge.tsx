import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className,
}) => {
  const variantStyles = {
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    accent: 'bg-amber-50 text-amber-800 border-amber-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
