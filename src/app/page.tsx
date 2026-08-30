import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularProducts } from '@/components/home/PopularProducts';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <PopularProducts />
      <CategoriesGrid />
      <HowItWorksSection />
      <WhyChooseUs />
      <FaqSection />
      <CtaBanner />
    </div>
  );
}
