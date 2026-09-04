'use client';

import React, { useState, useMemo } from 'react';
import {
  PresetDesign,
  PRESET_DESIGNS,
  PRESET_CATEGORIES,
} from '@/data/preset-designs';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  Search,
  Check,
  CheckCircle2,
  Coffee,
  Smile,
  Package,
  Terminal,
  Palette,
  Utensils,
  Wand2,
  ArrowRight,
  Star,
  Zap,
  X,
} from 'lucide-react';

interface PresetDesignPickerProps {
  selectedPresetId?: string;
  onSelectPreset: (preset: PresetDesign) => void;
  onCustomizePreset?: (preset: PresetDesign) => void;
  activePreset?: PresetDesign;
  isCustomized?: boolean;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Coffee,
  Smile,
  Package,
  Terminal,
  Palette,
  Utensils,
};

export const PresetDesignPicker: React.FC<PresetDesignPickerProps> = ({
  selectedPresetId,
  onSelectPreset,
  onCustomizePreset,
  activePreset,
  isCustomized = false,
}) => {
  const { tObj } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDesigns = useMemo(() => {
    let list = [...PRESET_DESIGNS];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameKm.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.descriptionKm.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.tagKm.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 1. Header with description & 1-click order benefit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {tObj('Ready-Made Stickers & Designs', 'បណ្តុំស្ទីគ័រដែលមានស្រាប់ (ចុចទិញភ្លាមៗ)')}
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {tObj(
              'Pick an existing design to order instantly, or customize it further in the Studio.',
              'ជ្រើសរើសម៉ូដដែលអ្នកពេញចិត្ត ចុចកម្ម៉ង់ភ្លាមៗ ឬចុចកែសម្រួលបន្ថែមតាមចិត្ត។'
            )}
          </p>
        </div>

        {activePreset && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{tObj('Ready to Order', 'រួចរាល់សម្រាប់ការកម្ម៉ង់')}</span>
          </span>
        )}
      </div>

      {/* 2. Active Selected Banner Preview & Edit Trigger */}
      {activePreset && (
        <div className="bg-gradient-to-r from-brand-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-brand-950/40 dark:to-slate-900 border border-brand-200 dark:border-brand-800/80 rounded-2xl p-3.5 sm:p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-slate-700 p-1 shrink-0 flex items-center justify-center relative shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePreset.svgDataUri}
                  alt={activePreset.name}
                  className="w-full h-full object-contain"
                />
                {isCustomized && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title="Customized">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {tObj(activePreset.name, activePreset.nameKm)}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-brand-600 dark:text-brand-300 shrink-0" />
                    <span>{tObj('1-Click Ready', 'ម៉ូដរួចរាល់')}</span>
                  </span>
                  {isCustomized && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{tObj('Customized', 'បានកែសម្រួល')}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {tObj(activePreset.description, activePreset.descriptionKm)}
                </p>
              </div>
            </div>

            {/* Action buttons on active design */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {onCustomizePreset && (
                <button
                  type="button"
                  onClick={() => onCustomizePreset(activePreset)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:text-amber-800 border border-amber-300 dark:border-amber-800/80 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title={tObj(
                    'Add hats, sunglasses, VIP badges, crop shape, or change border',
                    'ដាក់មួក វ៉ែនតា តែម VIP កាត់តម្រឹមរាង ឬប្តូរពណ៌គែម'
                  )}
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{tObj('Customize This Sticker', 'កែសម្រួលរូបនេះបន្ថែម')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Controls: Search & Category Scroll */}
      <div className="space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tObj(
              'Search ready stickers (e.g. coffee, cat, fragile, code, pizza)...',
              'ស្វែងរកស្ទីគ័រ (ឧ. កាហ្វេ, ឆ្មា, ប្រយ័ត្នបែក, កូដ, ភីហ្សា)...'
            )}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComp = CATEGORY_ICONS[cat.icon] || Sparkles;
            const count =
              cat.id === 'all'
                ? PRESET_DESIGNS.length
                : PRESET_DESIGNS.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tObj(cat.name, cat.nameKm)}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Grid of Ready Sticker Designs */}
      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredDesigns.map((preset) => {
            const isSelected = (selectedPresetId === preset.id) || (activePreset?.id === preset.id);

            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`group relative rounded-2xl border p-2.5 sm:p-3 transition-all cursor-pointer flex flex-col justify-between text-left active:scale-[0.98] ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/25 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm'
                }`}
              >
                {/* Artwork Graphic Preview with die-cut look */}
                <div className="relative w-full aspect-square rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-2 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.03]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.svgDataUri}
                    alt={preset.name}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                    loading="lazy"
                  />

                  {/* Top Badge */}
                  {preset.tag && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700">
                      {tObj(preset.tag, preset.tagKm)}
                    </span>
                  )}

                  {/* Checkmark indicator */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md animate-in zoom-in">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {tObj(preset.name, preset.nameKm)}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {tObj(preset.description, preset.descriptionKm)}
                  </p>
                </div>

                {/* Select / Click & Order Indicator */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold">
                  <span className={isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}>
                    {isSelected
                      ? tObj('Selected', 'បានជ្រើស')
                      : tObj('Click to Select', 'ចុចជ្រើសរើស')}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {tObj('No designs match your search.', 'រកមិនឃើញម៉ូដស្ទីគ័រដែលត្រូវគ្នានោះទេ។')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 text-xs text-brand-600 dark:text-brand-400 font-extrabold hover:underline"
          >
            {tObj('Show all designs', 'បង្ហាញម៉ូដទាំងអស់ឡើងវិញ')}
          </button>
        </div>
      )}
    </div>
  );
};
