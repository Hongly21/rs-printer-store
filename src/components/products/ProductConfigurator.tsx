'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product, SelectedProductConfig, UploadedFile } from '@/types';
import { calculateProductPrice } from '@/lib/pricing';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { PriceSummary } from './PriceSummary';
import { QuantitySelector } from './QuantitySelector';
import { FileUploader } from './FileUploader';
import { PresetDesignPicker } from './PresetDesignPicker';
import { ImageEditorModal } from './ImageEditorModal';
import { PRESET_DESIGNS, PresetDesign } from '@/data/preset-designs';
import { Badge } from '@/components/common/Badge';
import {
  ShoppingBag,
  Clock,
  Sparkles,
  Check,
  CheckCircle2,
  Layers,
  Maximize,
  Sliders,
  UploadCloud,
  Wand2,
  Eye,
  Zap,
  Palette,
} from 'lucide-react';

interface ProductConfiguratorProps {
  product: Product;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({ product }) => {
  const { addItem } = useCart();
  const { t, tObj } = useLanguage();

  const isStickerOrLabelProduct =
    product.category === 'stickers' ||
    product.category === 'labels' ||
    product.slug.includes('sticker');

  const defaultMaterial = product.options.materials?.[0];
  const defaultSize = product.options.sizes?.[0];
  const defaultFinishing = product.options.finishings?.[0];
  const defaultQuantity = product.options.quantities?.[0] || product.options.minQuantity || 50;

  const [config, setConfig] = useState<SelectedProductConfig>({
    materialId: defaultMaterial?.id,
    materialName: defaultMaterial?.name,
    materialNameKm: defaultMaterial?.nameKm,
    sizeId: defaultSize?.id,
    sizeName: defaultSize?.name,
    sizeNameKm: defaultSize?.nameKm,
    finishingId: defaultFinishing?.id,
    finishingName: defaultFinishing?.name,
    finishingNameKm: defaultFinishing?.nameKm,
    quantity: defaultQuantity,
    notes: '',
  });

  // Artwork & Design Mode: 'preset' (ready-made stickers) vs 'custom' (upload & studio)
  const [designMode, setDesignMode] = useState<'preset' | 'custom'>(
    isStickerOrLabelProduct ? 'preset' : 'custom'
  );

  const [selectedPreset, setSelectedPreset] = useState<PresetDesign | undefined>(() => {
    if (isStickerOrLabelProduct && PRESET_DESIGNS.length > 0) {
      return PRESET_DESIGNS[0];
    }
    return undefined;
  });

  const [isPresetCustomized, setIsPresetCustomized] = useState(false);
  const [isPresetEditorOpen, setIsPresetEditorOpen] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>(() => {
    if (isStickerOrLabelProduct && PRESET_DESIGNS.length > 0) {
      const p = PRESET_DESIGNS[0];
      return {
        fileId: `preset_${p.id}`,
        name: `${p.name} (Ready Design)`,
        size: 120000,
        type: 'image/svg+xml',
        previewUrl: p.svgDataUri,
      };
    }
    return undefined;
  });

  const [isAdding, setIsAdding] = useState(false);

  const priceResult = useMemo(() => {
    return calculateProductPrice(product, config);
  }, [product, config]);

  const handleMaterialChange = (materialId: string) => {
    const mat = product.options.materials?.find((m) => m.id === materialId);
    setConfig((prev) => ({
      ...prev,
      materialId,
      materialName: mat?.name,
      materialNameKm: mat?.nameKm,
    }));
  };

  const handleSizeChange = (sizeId: string) => {
    const s = product.options.sizes?.find((item) => item.id === sizeId);
    setConfig((prev) => ({
      ...prev,
      sizeId,
      sizeName: s?.name,
      sizeNameKm: s?.nameKm,
    }));
  };

  const handleFinishingChange = (finishingId: string) => {
    const f = product.options.finishings?.find((item) => item.id === finishingId);
    setConfig((prev) => ({
      ...prev,
      finishingId,
      finishingName: f?.name,
      finishingNameKm: f?.nameKm,
    }));
  };

  const handleQuantityChange = (quantity: number) => {
    setConfig((prev) => ({
      ...prev,
      quantity,
    }));
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    const finalConfig: SelectedProductConfig = {
      ...config,
      designMode,
      presetId: designMode === 'preset' ? selectedPreset?.id : undefined,
      presetName: designMode === 'preset' ? selectedPreset?.name : undefined,
      presetNameKm: designMode === 'preset' ? selectedPreset?.nameKm : undefined,
      isCustomized: designMode === 'preset' ? isPresetCustomized : Boolean(uploadedFile),
    };

    addItem(
      product.id,
      product.slug,
      product.name,
      product.image,
      finalConfig,
      priceResult.unitPrice,
      priceResult.totalPrice,
      uploadedFile,
      product.nameKm
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const features = tObj(product.features, product.featuresKm);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 lg:pb-0">
        {/* Left Column: Product Showcase & Details */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Main Product Image / Live Sticker Showcase */}
          <div id="tour-config-preview" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden flex items-center justify-center aspect-square group">
            {uploadedFile?.previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedFile.previewUrl}
                  alt={uploadedFile.name}
                  className="w-full h-full object-contain max-h-[290px] filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                />

                {/* Badge for selected artwork */}
                <div className="absolute top-2 right-2 bg-slate-900/80 dark:bg-slate-800/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm border border-white/10">
                  {designMode === 'preset' ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{isPresetCustomized ? tObj('Customized Studio Art', 'ស្ទីគ័របានកែសម្រួល') : tObj('1-Click Ready Sticker', 'ស្ទីគ័ររួចរាល់')}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3 h-3 text-emerald-400" />
                      <span>{tObj('Custom Artwork', 'រូបភាពផ្ទាល់ខ្លួន')}</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Image
                src={product.image}
                alt={tObj(product.name, product.nameKm)}
                fill
                priority
                className="object-contain p-4 sm:p-6 hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
            )}

            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="accent" className="font-bold text-xs py-1 px-3 shadow-sm">
                  {tObj(product.badge, product.badgeKm)}
                </Badge>
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md z-10">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>
                {t('products.readyIn')} {tObj(product.turnaroundTime, product.turnaroundTimeKm)}
              </span>
            </div>
          </div>

          {/* Product Highlights & Quality Guarantee */}
          <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              {t('products.keySpecs')}
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long description */}
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <p>
              {tObj(product.longDescription, product.longDescriptionKm) ||
                tObj(product.description, product.descriptionKm)}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Configuration Form */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{product.category.toUpperCase()}</Badge>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-500 font-medium">SKU: {product.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {tObj(product.name, product.nameKm)}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {tObj(product.description, product.descriptionKm)}
            </p>
          </div>

          <div className="space-y-6 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Quick-Scroll Filter Bar */}
            {product.options.materials && product.options.materials.length > 3 && (
              <div className="bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    {tObj('Popular Materials Filter', 'តម្រងសម្ភារៈពេញនិយម')}
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {tObj('Scroll & click to apply', 'អូសដើម្បីជ្រើសរើស')}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {product.options.materials.map((mat) => {
                    const isSelected = config.materialId === mat.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => handleMaterialChange(mat.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          isSelected
                            ? 'bg-brand-600 text-white shadow-brand-600/25 scale-[1.02]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>{tObj(mat.name, mat.nameKm).split('(')[0].trim()}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. Material Selector */}
            {product.options.materials && product.options.materials.length > 0 && (
              <div id="tour-config-material" className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    {t('configurator.selectMaterial')}
                  </label>
                  <span className="text-xs text-brand-600 font-bold">
                    {tObj(config.materialName, config.materialNameKm)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.options.materials.map((mat) => {
                    const isSelected = config.materialId === mat.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => handleMaterialChange(mat.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {tObj(mat.name, mat.nameKm)}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                          )}
                        </div>
                        {(mat.description || mat.descriptionKm) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {tObj(mat.description, mat.descriptionKm)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Size Selector */}
            {product.options.sizes && product.options.sizes.length > 0 && (
              <div id="tour-config-size" className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Maximize className="w-3.5 h-3.5 text-brand-600" />
                    {t('configurator.selectSize')}
                  </label>
                  <span className="text-xs text-brand-600 font-bold">
                    {tObj(config.sizeName, config.sizeNameKm)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.options.sizes.map((s) => {
                    const isSelected = config.sizeId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSizeChange(s.id)}
                        className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {s.dimensions || s.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                          )}
                        </div>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {tObj(s.name, s.nameKm)}
                        </span>
                        {s.dimensions && (
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            {s.dimensions}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Finishing Selector (Optional) */}
            {product.options.finishings && product.options.finishings.length > 0 && (
              <div id="tour-config-finishing" className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-600" />
                    {t('configurator.selectFinishing')}
                  </label>
                  <span className="text-xs text-brand-600 font-bold">
                    {tObj(config.finishingName, config.finishingNameKm)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.options.finishings.map((f) => {
                    const isSelected = config.finishingId === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleFinishingChange(f.id)}
                        className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {tObj(f.name, f.nameKm)}
                          </span>
                          {f.price > 0 && (
                            <span className="text-[10px] font-bold text-brand-600 bg-brand-100 dark:bg-brand-900/60 px-1.5 py-0.5 rounded">
                              +${f.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {(f.description || f.descriptionKm) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {tObj(f.description, f.descriptionKm)}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Quantity Selector */}
            <div id="tour-config-quantity" className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                {t('configurator.printQuantity')}
              </label>
              <QuantitySelector
                quantity={config.quantity}
                onChange={handleQuantityChange}
                presetQuantities={product.options.quantities}
                minQuantity={product.options.minQuantity}
                maxQuantity={product.options.maxQuantity}
                step={product.options.quantityStep}
              />
            </div>

            {/* 5. Artwork Selection: Separate Ready Stickers vs Custom Upload Studio */}
            <div id="tour-config-artwork" className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  {t('configurator.artworkType')}
                </label>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
                  {designMode === 'preset' ? (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-500 inline" />
                      <span>{tObj('1-Click Order (No artwork needed)', 'ចុចទិញភ្លាមៗ (មិនបាច់មាន file)')}</span>
                    </>
                  ) : (
                    <>
                      <Palette className="w-3.5 h-3.5 text-brand-500 inline" />
                      <span>{tObj('Custom Image Upload & Studio', 'បោះពុម្ពរូបផ្ទាល់ខ្លួន')}</span>
                    </>
                  )}
                </span>
              </div>

              {/* Segmented Mode Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
                <button
                  type="button"
                  onClick={() => {
                    setDesignMode('preset');
                    if (!selectedPreset && PRESET_DESIGNS.length > 0) {
                      const first = PRESET_DESIGNS[0];
                      setSelectedPreset(first);
                      setUploadedFile({
                        fileId: `preset_${first.id}`,
                        name: `${first.name} (Ready Design)`,
                        size: 120000,
                        type: 'image/svg+xml',
                        previewUrl: first.svgDataUri,
                      });
                    } else if (selectedPreset) {
                      setUploadedFile({
                        fileId: `preset_${selectedPreset.id}`,
                        name: `${selectedPreset.name} (Ready Design)`,
                        size: 120000,
                        type: 'image/svg+xml',
                        previewUrl: selectedPreset.svgDataUri,
                      });
                    }
                  }}
                  className={`py-3 px-3 rounded-xl text-xs sm:text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    designMode === 'preset'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{t('configurator.readyStickersTab')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDesignMode('custom');
                    // If the current uploadedFile was an unedited preset, clear it so user can upload custom file
                    if (uploadedFile?.fileId?.startsWith('preset_') && !isPresetCustomized) {
                      setUploadedFile(undefined);
                    }
                  }}
                  className={`py-3 px-3 rounded-xl text-xs sm:text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    designMode === 'custom'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">{t('configurator.customUploadTab')}</span>
                </button>
              </div>

              {/* Mode A: Ready-Made Sticker Gallery with 1-Click Order & Studio Edit */}
              {designMode === 'preset' && (
                <div className="space-y-3 animate-in fade-in">
                  <PresetDesignPicker
                    selectedPresetId={selectedPreset?.id}
                    activePreset={selectedPreset}
                    isCustomized={isPresetCustomized}
                    onSelectPreset={(preset) => {
                      setSelectedPreset(preset);
                      setIsPresetCustomized(false);
                      setUploadedFile({
                        fileId: `preset_${preset.id}`,
                        name: `${preset.name} (Ready Design)`,
                        size: 120000,
                        type: 'image/svg+xml',
                        previewUrl: preset.svgDataUri,
                      });
                    }}
                    onCustomizePreset={(preset) => {
                      setSelectedPreset(preset);
                      setIsPresetEditorOpen(true);
                    }}
                  />
                </div>
              )}

              {/* Mode B: Upload Custom Artwork & Image Studio */}
              {designMode === 'custom' && (
                <div className="space-y-3 animate-in fade-in">
                  <FileUploader
                    file={uploadedFile}
                    onFileSelect={setUploadedFile}
                  />
                </div>
              )}
            </div>

            {/* 6. Special Instructions Notes */}
            <div id="tour-config-notes" className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                {t('configurator.specialNotes')}
              </label>
              <input
                type="text"
                value={config.notes || ''}
                onChange={(e) => setConfig((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder={t('configurator.notesPlaceholder')}
                className="w-full px-4 py-3 text-xs sm:text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-sans"
              />
            </div>

            {/* 7. Live Price Summary Breakdown & Add to Cart Container */}
            <div id="tour-config-price" className="space-y-4">
              <PriceSummary
                calculation={priceResult}
                quantity={config.quantity}
              />

              {/* 8. Add to Cart CTA Button (Desktop) */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-3 disabled:opacity-75 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {isAdding
                    ? t('configurator.addingToCart')
                    : `${t('configurator.addToCart')} • $${priceResult.totalPrice.toFixed(2)}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile & Tablet Action Bar */}
      <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-2xl lg:hidden animate-in slide-in-from-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              {config.quantity} {t('configurator.pcs')}
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ${priceResult.totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-extrabold text-xs shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAdding ? t('configurator.addingToCart') : t('configurator.addToCart')}</span>
          </button>
        </div>
      </div>

      {/* Image Editor Modal for Customizing Preset Stickers ("customize it one more") */}
      {isPresetEditorOpen && selectedPreset && (
        <ImageEditorModal
          isOpen={isPresetEditorOpen}
          onClose={() => setIsPresetEditorOpen(false)}
          file={
            uploadedFile || {
              fileId: `preset_${selectedPreset.id}`,
              name: `${selectedPreset.name} (Ready Design)`,
              size: 120000,
              type: 'image/svg+xml',
              previewUrl: selectedPreset.svgDataUri,
            }
          }
          onSave={(updatedFile) => {
            setUploadedFile(updatedFile);
            setIsPresetCustomized(true);
            setIsPresetEditorOpen(false);
          }}
        />
      )}
    </>
  );
};
