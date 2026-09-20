'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Sliders,
  UploadCloud,
  Truck,
  CreditCard,
  Send,
  CheckCircle2,
  Check,
  Copy,
  Layers,
  ShieldCheck,
  QrCode,
  MapPin,
  Zap,
  Flame,
  Briefcase,
  SunMedium,
  Camera,
  FileCheck,
  Info,
  Package,
  Printer,
  Store,
  Bike,
  Bus,
  Clock,
  Tag,
  Eye,
  Maximize2,
  FileText,
  MessageSquare,
  Compass,
  LayoutTemplate,
  Coffee,
  Heart,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useOrderGuide } from '@/context/OrderGuideContext';
import { useLanguage } from '@/context/LanguageContext';
import { triggerConfetti } from '@/lib/confetti';
import Link from 'next/link';

export const InteractiveOrderGuide: React.FC = () => {
  const { isGuideOpen, closeGuide, currentStep, setStep, startLiveTour } = useOrderGuide();
  const { lang, tObj } = useLanguage();

  // Step 1 Interactive State: Selected Product
  const [selectedProduct, setSelectedProduct] = useState<'stickers' | 'cards' | 'banners' | 'photos'>('stickers');

  // Step 2 Interactive State: Substrate & Price Calculation
  const [material, setMaterial] = useState<'glossy' | 'matte' | 'kraft'>('glossy');
  const [size, setSize] = useState<'5x5' | '10x10' | 'a4'>('5x5');
  const [hasLamination, setHasLamination] = useState(true);
  const [quantity, setQuantity] = useState<number>(300);

  // Step 3 Interactive State: Artwork Upload / Preset
  const [designMode, setDesignMode] = useState<'upload' | 'preset'>('upload');
  const [uploadedFile, setUploadedFile] = useState<string | null>('my-brand-logo.png');
  const [isVerifyingFile, setIsVerifyingFile] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('coffee');

  // Step 4 Interactive State: Local Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'express' | 'vireak'>('vireak');
  const [selectedVireakBranch, setSelectedVireakBranch] = useState('Battambang Central Hub');

  // Step 5 Interactive State: Payment & Telegram Dispatch
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Close on Escape & Arrow Navigation
  useEffect(() => {
    if (!isGuideOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGuide();
      if (e.key === 'ArrowRight' && currentStep < 5) setStep(currentStep + 1);
      if (e.key === 'ArrowLeft' && currentStep > 1) setStep(currentStep - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuideOpen, currentStep, closeGuide, setStep]);

  // Lock body scroll
  useEffect(() => {
    if (isGuideOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGuideOpen]);

  if (!isGuideOpen) return null;

  // Step 2 Dynamic Price Engine Simulation
  const getMaterialPrice = () => (material === 'glossy' ? 0.05 : material === 'matte' ? 0.06 : 0.07);
  const getSizeMultiplier = () => (size === '5x5' ? 1 : size === '10x10' ? 1.8 : 3.5);
  const getFinishingCost = () => (hasLamination ? 0.02 : 0);
  const getDiscount = () => (quantity >= 500 ? 0.2 : quantity >= 300 ? 0.1 : 0);

  const unitBasePrice = getMaterialPrice() * getSizeMultiplier() + getFinishingCost();
  const discountedUnitPrice = unitBasePrice * (1 - getDiscount());
  const calculatedTotal = (discountedUnitPrice * quantity).toFixed(2);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('096 542 9290');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSimulateUpload = () => {
    setIsVerifyingFile(true);
    setTimeout(() => {
      setUploadedFile('brand-packaging-artwork.pdf');
      setIsVerifyingFile(false);
    }, 600);
  };

  const handleFinish = () => {
    triggerConfetti();
    closeGuide();
  };

  const stepsList = [
    {
      num: 1,
      titleEn: '1. Product Catalog',
      titleKm: '១. រើសផលិតផល',
      icon: ShoppingBag,
    },
    {
      num: 2,
      titleEn: '2. Specs & Live Pricing',
      titleKm: '២. កំណត់ជម្រើស & តម្លៃ',
      icon: Sliders,
    },
    {
      num: 3,
      titleEn: '3. Artwork & Templates',
      titleKm: '៣. ភ្ជាប់រូប & ម៉ូដ',
      icon: UploadCloud,
    },
    {
      num: 4,
      titleEn: '4. Local Logistics',
      titleKm: '៤. ការដឹកជញ្ជូន',
      icon: Truck,
    },
    {
      num: 5,
      titleEn: '5. KHQR & Telegram',
      titleKm: '៥. ទូទាត់ & Telegram',
      icon: CreditCard,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {tObj('Interactive Order Guide & Technical Simulator', 'មគ្គុទ្ទេសក៍ណែនាំការកុម្ម៉ង់ & គំរូសាកល្បងបច្ចេកទេស')}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                  {tObj(`Stage ${currentStep} of 5`, `ដំណាក់កាលទី ${currentStep} នៃ ៥`)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {tObj(
                  'Hands-on technical walkthrough covering substrate selection, dimensions, resolution, delivery, and KHQR fulfillment.',
                  'ការណែនាំលម្អិតអំពីការជ្រើសរើសក្រដាស ខ្នាតទំហំ កម្រិតច្បាស់រូប ការដឹកជញ្ជូន និងការទូទាត់ KHQR។'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live On-Screen Tour Trigger Button (NO EMOJIS) */}
            <button
              type="button"
              onClick={() => startLiveTour()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-brand-600 dark:hover:bg-brand-600 text-white dark:text-slate-900 dark:hover:text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              title="Spotlight real live elements with blurred background"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{tObj('Live Tour on Page', 'មើលជាក់ស្តែងលើទំព័រ')}</span>
              <span className="sm:hidden">{tObj('Live Tour', 'លើទំព័រ')}</span>
            </button>

            <button
              onClick={closeGuide}
              aria-label="Close guide"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar & Tab Buttons */}
        <div className="px-4 py-2 sm:px-6 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {stepsList.map((st) => {
            const IconComponent = st.icon;
            const isCurrent = currentStep === st.num;
            const isCompleted = currentStep > st.num;

            return (
              <button
                key={st.num}
                onClick={() => setStep(st.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-sm'
                    : isCompleted
                    ? 'text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tObj(st.titleEn, st.titleKm)}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STEP 1: CHOOSE PRODUCT & TECHNICAL SPECIFICATIONS */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-600" />
                    {tObj('Stage 1: Choose Product Category & Specifications', 'ដំណាក់កាលទី ១៖ ជ្រើសរើសប្រភេទផលិតផល & លក្ខណៈបច្ចេកទេស')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tObj(
                      'Select any product card below to inspect industrial substrates, adhesive ratings, and production turnaround times.',
                      'ចុចលើផលិតផលគំរូនីមួយៗខាងក្រោម ដើម្បីពិនិត្យកម្រិតកម្រាស់ ភាពធន់ និងរយៈពេលបោះពុម្ពជាក់ស្តែង។'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full w-fit">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{tObj('Interactive Selection', 'ចុចជ្រើសរើសប័ណ្ណគំរូ')}</span>
                </div>
              </div>

              {/* 4 Interactive Category Cards with Technical Icons (NO EMOJIS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'stickers',
                    icon: Flame,
                    nameEn: 'Vinyl Stickers',
                    nameKm: 'ស្ទីគ័រមិនជ្រាបទឹក (Vinyl)',
                    price: 'From $0.05/pc',
                    badgeEn: 'Best Seller',
                    badgeKm: 'លក់ដាច់បំផុត',
                    speedEn: 'Same-Day Dispatch',
                    speedKm: 'ផ្ញើក្នុងថ្ងៃតែមួយ',
                    specs: ['100% Waterproof', 'Tear-resistant PVC', 'Die-cut contour'],
                    descEn: 'Industrial white vinyl with strong adhesive for cups, bottles, boxes & packaging.',
                    descKm: 'ស្ទីគ័រ PVC មិនជ្រាបទឹក ស្អិតខ្លាំង សម្រាប់បិទកែវ ដប និងប្រអប់ផលិតផល។',
                  },
                  {
                    id: 'cards',
                    icon: Briefcase,
                    nameEn: 'Business Cards',
                    nameKm: 'នាមប័ណ្ណអាជីវកម្ម',
                    price: 'From $5.00/box',
                    badgeEn: 'Executive Grade',
                    badgeKm: 'កម្រិតប្រណិត',
                    speedEn: '1-2 Days Dispatch',
                    speedKm: '១-២ ថ្ងៃរួចរាល់',
                    specs: ['350gsm Heavy Card', 'Velvet Matte Lamination', 'Double-sided CMYK'],
                    descEn: 'Ultra-stiff 350gsm art board with protective velvet matte finish and rounded corners.',
                    descKm: 'ក្រដាសក្រាស់ 350gsm ស្រោបកម្រាលម៉ាត់ប្រណិត មិនជ្រាបទឹក និងកាត់ជ្រុងមូលស្អាត។',
                  },
                  {
                    id: 'banners',
                    icon: SunMedium,
                    nameEn: 'Vinyl Banners',
                    nameKm: 'បដាផ្សាយពាណិជ្ជកម្ម',
                    price: 'From $12.00',
                    badgeEn: 'Outdoor Tarpaulin',
                    badgeKm: 'ក្រៅអគារធន់ខ្ពស់',
                    speedEn: '24 Hours',
                    speedKm: '២៤ ម៉ោង',
                    specs: ['510gsm Tarpaulin', 'Brass Grommet Eyelets', 'UV & Rain Resistant'],
                    descEn: 'Heavyweight PVC outdoor banner with welded edges and corner eyelets for installations.',
                    descKm: 'ផ្ទាំងតង់ក្រាស់ 510gsm ធន់នឹងភ្លៀងខ្យល់ ដំឡើងកងដែកស្រាប់សម្រាប់ព្យួរ។',
                  },
                  {
                    id: 'photos',
                    icon: Camera,
                    nameEn: 'Archival Photo Prints',
                    nameKm: 'ព្រីនរូបថតច្បាស់ (HD)',
                    price: 'From $0.25/ea',
                    badgeEn: 'Ultra HD Archival',
                    badgeKm: 'គុណភាពជប៉ុន',
                    speedEn: 'Instant Production',
                    speedKm: 'ព្រីនភ្លាមៗ',
                    specs: ['260gsm RC Luster', 'Fade-proof 100 Years', '12-Color Pigment'],
                    descEn: 'Professional Japanese RC photographic luster paper with microscopic pigment detail.',
                    descKm: 'ក្រដាសរូបថតជប៉ុន RC គុណភាពខ្ពស់ មិនស្លេកពណ៌ទោះបីរាប់ឆ្នាំ។',
                  },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = selectedProduct === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedProduct(item.id as any)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 shadow-md ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <ItemIcon className="w-3 h-3 text-brand-600" />
                            {tObj(item.badgeEn, item.badgeKm)}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                        </div>

                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {tObj(item.nameEn, item.nameKm)}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {tObj(item.descEn, item.descKm)}
                        </p>

                        {/* Specs Checklist */}
                        <div className="mt-2.5 space-y-1">
                          {item.specs.map((sp, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{sp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="font-black text-brand-600 dark:text-brand-400">{item.price}</span>
                        <span className="text-slate-400 text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tObj(item.speedEn, item.speedKm)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Technical Inspection Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>
                        {tObj('Active Selected Category:', 'ប្រភេទផលិតផលដែលបានជ្រើសរើស៖')}{' '}
                        <strong className="text-brand-600 uppercase">{selectedProduct}</strong>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {tObj(
                        'Each category has custom sizing, material thickness, and automated pricing algorithms.',
                        'ផលិតផលនីមួយៗមានកម្រាស់សម្ភារៈ ជម្រើសទំហំ និងរូបមន្តគណនាតម្លៃជាក់លាក់។'
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 transition-all"
                >
                  <span>{tObj('Next: Try Substrate & Pricing', 'បន្ត៖ សាកល្បងសម្ភារៈ & គណនាតម្លៃ')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SUBSTRATE, SIZING & REAL-TIME PRICING ENGINE */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-brand-600" />
                    {tObj('Stage 2: Configure Substrate, Sizing & Dynamic Pricing', 'ដំណាក់កាលទី ២៖ កំណត់ប្រភេទក្រដាស ទំហំ & គណនាតម្លៃ')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tObj(
                      'Test changing materials, dimensions, and quantities below to watch our live dynamic pricing engine update automatically.',
                      'សាកល្បងចុចប្តូរសម្ភារៈ ទំហំ និងចំនួនខាងក្រោម ដើម្បីឃើញម៉ាស៊ីនគណនាតម្លៃដំណើរការភ្លាមៗ។'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full w-fit">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{tObj('Live Calculation Active', 'ការគណនាបន្តផ្ទាល់')}</span>
                </div>
              </div>

              {/* Interactive Mini-Configurator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                {/* Left: Interactive Controls */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 1. Material Substrate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {tObj('1. Substrate Material (ប្រភេទស្ទីគ័រ / ក្រដាស):', '១. ជ្រើសរើសប្រភេទស្ទីគ័រ៖')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'glossy', nameEn: 'Glossy Vinyl', nameKm: 'រលោងភ្លឺ (Glossy)', sub: '$0.05/pc' },
                        { id: 'matte', nameEn: 'Matte Vinyl', nameKm: 'ម៉ាត់ប្រណិត (Matte)', sub: '$0.06/pc' },
                        { id: 'kraft', nameEn: 'Kraft Vintage', nameKm: 'ក្រដាសត្នោត (Kraft)', sub: '$0.07/pc' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMaterial(m.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            material === m.id
                              ? 'border-brand-600 bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 font-extrabold shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs'
                          }`}
                        >
                          <span className="block text-xs">{tObj(m.nameEn, m.nameKm)}</span>
                          <span className="text-[10px] text-slate-400">{m.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Dimensions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {tObj('2. Dimensions & Surface Area (ទំហំខ្នាត):', '២. ជ្រើសរើសទំហំខ្នាត៖')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '5x5', name: '5 x 5 cm', noteEn: 'Cup/Jar Label', noteKm: 'បិទកែវ/ដប' },
                        { id: '10x10', name: '10 x 10 cm', noteEn: 'Box Packaging', noteKm: 'បិទប្រអប់' },
                        { id: 'a4', name: 'A4 Sheet', noteEn: 'Full Sticker Sheet', noteKm: 'ផ្ទាំងសន្លឹក' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSize(s.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            size === s.id
                              ? 'border-brand-600 bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 font-extrabold shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs'
                          }`}
                        >
                          <span className="block text-xs font-mono">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{tObj(s.noteEn, s.noteKm)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Finishing Addon */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-brand-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white block">
                          {tObj('Protective UV Gloss Over-Laminate', 'ស្រោបស្រទាប់ការពារកាំរស្មី UV & ទឹក')}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {tObj('Scratch resistance + weatherproof outdoor seal (+$0.02/pc)', 'ការពារការឆ្កូត និងការពារទឹក ១០០% (+$0.02)')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setHasLamination(!hasLamination)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        hasLamination
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {hasLamination ? tObj('Enabled', 'បានបើក') : tObj('Disabled', 'មិនយក')}
                    </button>
                  </div>

                  {/* 4. Volume Quantity Tiers */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {tObj('4. Quantity & Bulk Tier Discounts (ចំនួន & បញ្ចុះតម្លៃ):', '៤. ចំនួន & បញ្ចុះតម្លៃ៖')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { qty: 100, label: '100 pcs', disc: 'Standard' },
                        { qty: 300, label: '300 pcs', disc: '10% Discount' },
                        { qty: 500, label: '500 pcs', disc: '20% Discount' },
                      ].map((q) => (
                        <button
                          key={q.qty}
                          onClick={() => setQuantity(q.qty)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            quantity === q.qty
                              ? 'border-brand-600 bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 font-extrabold shadow-sm ring-1 ring-brand-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs'
                          }`}
                        >
                          <span className="block text-xs font-black">{q.label}</span>
                          <span className={`text-[10px] font-bold ${q.qty > 100 ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {q.disc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Real-time Price Calculation Summary */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-brand-200 dark:border-brand-900/50 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-brand-600" />
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                          {tObj('Live Cost Breakdown', 'របាយការណ៍គណនាតម្លៃ')}
                        </span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>{tObj('Material base rate:', 'តម្លៃដើមសម្ភារៈ៖')}</span>
                        <span className="font-bold text-slate-800 dark:text-white font-mono">${getMaterialPrice().toFixed(2)}/pc</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>{tObj('Dimension multiplier:', 'មេគុណផ្ទៃក្រឡាទំហំ៖')}</span>
                        <span className="font-bold text-slate-800 dark:text-white font-mono">{getSizeMultiplier()}x</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>{tObj('UV protective finish:', 'ស្រទាប់ការពារ UV៖')}</span>
                        <span className="font-bold text-slate-800 dark:text-white font-mono">+${getFinishingCost().toFixed(2)}</span>
                      </div>
                      {getDiscount() > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>{tObj('Applied volume discount:', 'បញ្ចុះតម្លៃទិញច្រើន៖')}</span>
                          <span className="font-mono">-{(getDiscount() * 100)}%</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-700 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span>{tObj('Calculated unit price:', 'តម្លៃក្នុងមួយបន្ទះ៖')}</span>
                        <span className="font-black text-brand-600 font-mono">${discountedUnitPrice.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {tObj('Estimated Total', 'តម្លៃសរុបប៉ាន់ស្មាន')}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                        ${calculatedTotal}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                        ({quantity} {tObj('pcs', 'បន្ទះ')})
                      </span>
                    </div>

                    <button
                      onClick={() => setStep(3)}
                      className="mt-3 w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <span>{tObj('Next: Artwork & Pre-Press', 'បន្ត៖ ភ្ជាប់ឯកសារ & ប្លង់')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ARTWORK SUBMISSION, RESOLUTION & STUDIO TEMPLATES */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-brand-600" />
                    {tObj('Stage 3: Artwork Submission & Studio Templates', 'ដំណាក់កាលទី ៣៖ ភ្ជាប់ឯកសារឌីហ្សាញ & ម៉ូដស្ទូឌីយោ')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tObj(
                      'Have your own high-resolution brand file? Upload it with free cutline inspection. No design? Pick 1-click ready templates.',
                      'មានប្លង់ឡូហ្គោផ្ទាល់ខ្លួនមែនទេ? អាចភ្ជាប់បានជាមួយការពិនិត្យប្លង់ហ្វ្រី។ បើគ្មានប្លង់ទេ អាចជ្រើសរើសម៉ូដមានស្រាប់បានភ្លាមៗ។'
                    )}
                  </p>
                </div>
              </div>

              {/* Toggle Mode */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-sm">
                <button
                  onClick={() => setDesignMode('upload')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    designMode === 'upload'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{tObj('Upload Custom Artwork', 'ភ្ជាប់រូបផ្ទាល់ខ្លួន')}</span>
                </button>
                <button
                  onClick={() => setDesignMode('preset')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    designMode === 'preset'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  <span>{tObj('1-Click Presets', 'រើសម៉ូដមានស្រាប់')}</span>
                </button>
              </div>

              {/* Mode A: Simulated Upload Dropzone */}
              {designMode === 'upload' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl border-2 border-dashed border-brand-300 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-950/20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {tObj('Drag & Drop Print Artwork Here', 'អូសទម្លាក់ឯកសារបោះពុម្ពនៅទីនេះ')}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {tObj('Accepted Formats: PDF, AI, PNG, SVG, JPG (300 DPI Recommended, Max 50MB)', 'គាំទ្រឯកសារ PDF, AI, PNG, SVG, JPG (កម្រិត 300 DPI)')}
                      </p>
                    </div>

                    {/* Simulation Trigger Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleSimulateUpload}
                        disabled={isVerifyingFile}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-brand-500 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5 mx-auto"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isVerifyingFile ? 'animate-spin' : ''}`} />
                        <span>
                          {isVerifyingFile
                            ? tObj('Verifying Pre-Press Resolution...', 'កំពុងពិនិត្យកម្រិតច្បាស់...')
                            : tObj('Simulate Uploading "brand-packaging-artwork.pdf"', 'សាកល្បងភ្ជាប់ឯកសារ "brand-packaging-artwork.pdf"')}
                        </span>
                      </button>
                    </div>

                    {/* Verification Result Card */}
                    {uploadedFile && !isVerifyingFile && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 max-w-lg mx-auto text-left flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                            {uploadedFile} — {tObj('Pre-Press Inspection Passed', 'បានត្រួតពិនិត្យប្លង់រួចរាល់')}
                          </span>
                          <p className="text-emerald-700 dark:text-emerald-400 text-[11px] leading-relaxed">
                            {tObj(
                              'Resolution: 300 DPI | Color: CMYK Verified | Cutline Margin: 2mm Safe Zone Confirmed.',
                              'កម្រិតច្បាស់៖ 300 DPI | ពណ៌៖ CMYK ត្រឹមត្រូវ | គែមសុវត្ថិភាពកាត់៖ 2mm បានផ្ទៀងផ្ទាត់។'
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode B: Ready Templates */}
              {designMode === 'preset' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'coffee', icon: Coffee, labelEn: 'Specialty Coffee Roasters', labelKm: 'ហាងកាហ្វេ & ភេសជ្ជៈ', color: 'from-amber-700 to-amber-900' },
                      { id: 'thanks', icon: Heart, labelEn: 'Thank You Customer Seal', labelKm: 'ស្ទីគ័រថ្លែងអំណរគុណ', color: 'from-rose-500 to-pink-600' },
                      { id: 'fragile', icon: AlertTriangle, labelEn: 'Fragile Handle With Care', labelKm: 'ស្ទីគ័រប្រយ័ត្នបែកបាក់', color: 'from-orange-500 to-red-600' },
                    ].map((p) => {
                      const PresetIcon = p.icon;
                      const isSelected = selectedPreset === p.id;

                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPreset(p.id)}
                          className={`p-3.5 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 shadow-sm ring-2 ring-brand-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className={`h-16 rounded-xl bg-gradient-to-tr ${p.color} text-white flex flex-col items-center justify-center shadow-sm mb-2.5`}>
                            <PresetIcon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-bold tracking-wider uppercase">Template</span>
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                            {tObj(p.labelEn, p.labelKm)}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {tObj('Click to apply directly to print run', 'ចុចជ្រើសរើសសម្រាប់បោះពុម្ពភ្លាមៗ')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span>{tObj('Next: Local Logistics & Delivery', 'បន្ត៖ ការដឹកជញ្ជូនក្នុងស្រុក')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CAMBODIA LOCAL LOGISTICS */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand-600" />
                    {tObj('Stage 4: Local Cambodian Logistics & Delivery Channels', 'ដំណាក់កាលទី ៤៖ ការដឹកជញ្ជូន & ទទួលទំនិញនៅកម្ពុជា')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tObj(
                      'Select between store pickup at our Phnom Penh hub, doorstep moto courier, or nationwide bus cargo branches via Vireak Buntham (VET Express).',
                      'ជ្រើសរើសមកយកផ្ទាល់នៅហាង រាជធានីភ្នំពេញ ដឹកដល់ផ្ទះ ឬផ្ញើតាមឡានក្រុង វីរៈ ប៊ុនថាំ គ្រប់ខេត្ត។'
                    )}
                  </p>
                </div>
              </div>

              {/* 3 Delivery Method Cards with Icons (NO EMOJIS) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'pickup',
                    icon: Store,
                    nameEn: 'Store Pickup',
                    nameKm: 'មកយកនៅហាងផ្ទាល់',
                    fee: 'Free ($0.00)',
                    detailEn: 'RS Printer Hub, Street 2004, Sen Sok, Phnom Penh. Ground floor, Counter 1.',
                    detailKm: 'បញ្ជរ RS Printer Hub, ផ្លូវ ២០០៤, សែនសុខ, រាជធានីភ្នំពេញ (៨:០០ ព្រឹក - ៦:៣០ ល្ងាច)។',
                  },
                  {
                    id: 'express',
                    icon: Bike,
                    nameEn: 'Phnom Penh Door-to-Door',
                    nameKm: 'ដឹកដល់ទីកន្លែង (ភ្នំពេញ)',
                    fee: '$2.00 Flat Rate',
                    detailEn: 'Direct moto courier dispatch to your office or home address within Phnom Penh.',
                    detailKm: 'ដឹកជញ្ជូនផ្ទាល់ដល់គេហដ្ឋាន ឬការិយាល័យរបស់អ្នកក្នុងរាជធានីភ្នំពេញ។',
                  },
                  {
                    id: 'vireak',
                    icon: Bus,
                    nameEn: 'Vireak Buntham (VET)',
                    nameKm: 'វីរៈ ប៊ុនថាំ អេចប្រេស',
                    fee: '$2.00 - $2.50',
                    detailEn: 'Provincial cargo bus dispatch to any of 50+ VET branches across 25 provinces.',
                    detailKm: 'ទទួលនៅសាខាឡានក្រុង វីរៈ ប៊ុនថាំ ទូទាំង ២៥ ខេត្តក្រុង (ភ្ជាប់លេខកូដតាមដាន)។',
                  },
                ].map((d) => {
                  const DeliveryIcon = d.icon;
                  const isSelected = deliveryMethod === d.id;

                  return (
                    <button
                      key={d.id}
                      onClick={() => setDeliveryMethod(d.id as any)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-950/40 shadow-sm ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900 dark:text-white">
                            <DeliveryIcon className="w-4 h-4 text-brand-600" />
                            <span>{tObj(d.nameEn, d.nameKm)}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {tObj(d.detailEn, d.detailKm)}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-black text-brand-600 dark:text-brand-400 font-mono">
                        {d.fee}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Vireak Buntham Branch Selector Simulation */}
              {deliveryMethod === 'vireak' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>{tObj('VET Express Provincial Branch Selector:', 'ជ្រើសរើសសាខា វីរៈ ប៊ុនថាំ តាមខេត្ត៖')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Battambang Central Hub',
                      'Siem Reap Old Market',
                      'Sihanoukville Port Hub',
                      'Kampot Riverside',
                      'Poipet Border Station',
                    ].map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedVireakBranch(b)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          selectedVireakBranch === b
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200/80 dark:border-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400">
                    {tObj(
                      `Selected Destination: ${selectedVireakBranch}. Cargo parcel receipt bill number and bus dispatch alerts are forwarded directly to recipient phone via SMS & Telegram.`,
                      `គោលដៅទទួល៖ ${selectedVireakBranch}។ លេខបុងឡានក្រុង និងដំណឹងចេញដំណើរនឹងផ្ញើជូនលេខទូរស័ព្ទទទួលតាម SMS & Telegram។`
                    )}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(5)}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <span>{tObj('Next: KHQR Payment & Telegram', 'បន្ត៖ ទូទាត់ KHQR & Telegram')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: BAKONG KHQR & TELEGRAM DISPATCH */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-600" />
                    {tObj('Stage 5: Bakong KHQR Payment & Automated Telegram Ingestion', 'ដំណាក់កាលទី ៥៖ ទូទាត់តាម Bakong KHQR & ការបញ្ជូនចូល Telegram')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tObj(
                      'Universal scan-to-pay via Bakong KHQR for all Cambodian banking apps, with automated production tickets sent to the print workshop.',
                      'ស្កេនទូទាត់ Bakong KHQR ជាមួយគ្រប់កម្មវិធីធនាគារក្នុងស្រុក រួមជាមួយការបញ្ជូនវិក្កយបត្រស្វ័យប្រវត្តិចូលរោងពុម្ព។'
                    )}
                  </p>
                </div>
              </div>

              {/* Two-Column Simulation: Left: Payment / Right: Telegram Alert */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Simulated KHQR Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-brand-600" />
                      {tObj('Bakong KHQR Universal Scan', 'គំរូស្កេន Bakong KHQR')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                      National Standard
                    </span>
                  </div>

                  <div className="w-36 h-36 mx-auto bg-white rounded-2xl p-2 border border-slate-300 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center relative">
                    <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                      <QrCode className="w-16 h-16 text-slate-800" />
                      <span className="text-[9px] font-black text-rose-600 mt-1">BAKONG KHQR</span>
                    </div>
                  </div>

                  {/* ABA Mobile Transfer Simulator */}
                  <div className="p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="font-bold text-sky-900 dark:text-sky-200 block">ABA Bank (USD)</span>
                      <span className="text-[11px] text-sky-700 dark:text-sky-400 font-mono">096 542 9290 (RS PRINTER)</span>
                    </div>
                    <button
                      onClick={handleCopyAccount}
                      className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedAccount ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAccount ? tObj('Copied!', 'បានចម្លង!') : tObj('Copy', 'ចម្លង')}</span>
                    </button>
                  </div>
                </div>

                {/* Right: Simulated Telegram Message Alert */}
                <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-850 border border-sky-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center">
                          <Send className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          Telegram Bot Notification Pipeline
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">@RSPrinterBot</span>
                    </div>

                    {/* Telegram Bubble (NO EMOJIS) */}
                    <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-1.5 shadow-sm">
                      <div className="font-bold text-slate-900 dark:text-white">
                        ORDER DISPATCH #RS-9921
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Item: Vinyl Stickers (300 pcs)
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Specs: 5x5 cm | Glossy + UV Coat
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Fulfillment: VET Express ({selectedVireakBranch})
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Payment: Bakong KHQR (Verified)
                      </div>
                      <div className="pt-1 text-emerald-600 font-bold text-[11px]">
                        Status: Industrial Production Queued
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {tObj(
                      'Both the customer and shop manager receive real-time updates directly on Telegram with full vector cutline files.',
                      'ទាំងអតិថិជន និងរោងពុម្ព នឹងទទួលបានឯកសារប្លង់ និងវិក្កយបត្របញ្ជាក់ភ្លាមៗនៅលើ Telegram។'
                    )}
                  </p>
                </div>
              </div>

              {/* Completion CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="text-center sm:text-left">
                  <div className="font-black text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                    <span>{tObj('You are ready to place real custom orders!', 'អ្នកបានយល់ច្បាស់ពីគ្រប់មុខងារបច្ចេកទេសហើយ!')}</span>
                  </div>
                  <p className="text-xs text-brand-100 mt-0.5">
                    {tObj(
                      'Explore our live catalog to configure your prints with dynamic instant pricing.',
                      'ចាប់ផ្តើមជ្រើសរើសផលិតផលពិតជាក់ស្តែង ដើម្បីទទួលបានតម្លៃគណនាភ្លាមៗ។'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleFinish}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    {tObj('Done', 'រួចរាល់')}
                  </button>
                  <Link
                    href="/products"
                    onClick={handleFinish}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-white text-brand-700 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{tObj('Explore Products', 'មើលផលិតផល')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-5 py-3.5 sm:px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{tObj('Previous', 'ថយក្រោយ')}</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                aria-label={`Jump to stage ${s}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentStep === s
                    ? 'w-6 bg-brand-600 dark:bg-brand-400'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {currentStep < 5 ? (
            <button
              onClick={() => setStep(currentStep + 1)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span>{tObj('Next Stage', 'ជំហានបន្ទាប់')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{tObj('Finish Walkthrough', 'បញ្ចប់ការណែនាំ')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
