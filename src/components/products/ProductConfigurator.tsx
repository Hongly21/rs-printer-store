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
} from 'lucide-react';

interface ProductConfiguratorProps {
  product: Product;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({ product }) => {
  const { addItem } = useCart();
  const { t, tObj } = useLanguage();

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

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>(undefined);
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
    addItem(
      product.id,
      product.slug,
      product.name,
      product.image,
      config,
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
          {/* Main Product Image */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden flex items-center justify-center aspect-square">
            <Image
              src={product.image}
              alt={tObj(product.name, product.nameKm)}
              fill
              priority
              className="object-contain p-4 sm:p-6 hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />

            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge variant="accent" className="font-bold text-xs py-1 px-3 shadow-sm">
                  {tObj(product.badge, product.badgeKm)}
                </Badge>
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>{t('products.readyIn')} {tObj(product.turnaroundTime, product.turnaroundTimeKm)}</span>
            </div>
          </div>

          {/* Product Highlights & Quality Guarantee */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              {t('products.keySpecs')}
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long description */}
          <div className="text-xs text-slate-500 leading-relaxed bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70">
            <p>{tObj(product.longDescription, product.longDescriptionKm) || tObj(product.description, product.descriptionKm)}</p>
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {tObj(product.name, product.nameKm)}
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {tObj(product.description, product.descriptionKm)}
            </p>
          </div>

          <div className="space-y-6 pt-2 border-t border-slate-100">
            {/* 1. Material Selector */}
            {product.options.materials && product.options.materials.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                        className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {tObj(mat.name, mat.nameKm)}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                          )}
                        </div>
                        {(mat.description || mat.descriptionKm) && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                        className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900 truncate">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                        className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {tObj(f.name, f.nameKm)}
                          </span>
                          {f.price > 0 && (
                            <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded">
                              +${f.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {(f.description || f.descriptionKm) && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
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

            {/* 5. Upload Design Area */}
            <FileUploader
              file={uploadedFile}
              onFileSelect={setUploadedFile}
            />

            {/* 6. Special Instructions Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t('configurator.specialNotes')}
              </label>
              <input
                type="text"
                value={config.notes || ''}
                onChange={(e) => setConfig((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder={t('configurator.notesPlaceholder')}
                className="w-full px-4 py-3 text-xs sm:text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-white font-sans"
              />
            </div>

            {/* 7. Live Price Summary Breakdown */}
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

      {/* Floating Sticky Mobile & Tablet Action Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl lg:hidden animate-in slide-in-from-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              {config.quantity} {t('configurator.pcs')}
            </span>
            <span className="text-lg font-black text-slate-900">
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
    </>
  );
};
