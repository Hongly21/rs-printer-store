'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { shopConfig } from '@/data/shop';
import { formatPrice } from '@/lib/utils';
import {
  CAMBODIA_PROVINCES,
  findProvinceById,
  findBranchById,
} from '@/data/vireak-branches';
import { DeliveryCarrier } from '@/types';
import {
  Store,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Navigation,
  Building2,
  Phone,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { startNavigationLoading } from '@/components/common/NavigationProgressBar';

export const DeliverySelector: React.FC = () => {
  const router = useRouter();
  const {
    delivery,
    customer,
    updateDeliveryMethod,
    updateDeliveryAddress,
    updateDeliveryCarrier,
    updateDeliveryInfo,
    validateDeliveryStep,
  } = useCheckout();
  const { getTotals } = useCart();
  const { t, tObj } = useLanguage();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state initialized from checkout context
  const activeCarrier: DeliveryCarrier = delivery.carrier || 'vireak_buntham';
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    delivery.vireakProvince || 'phnom_penh'
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    delivery.vireakBranch || 'pp_night_market'
  );
  const [branchNote, setBranchNote] = useState<string>(
    delivery.vireakBranchNote || ''
  );
  const [recipientPhone, setRecipientPhone] = useState<string>(
    delivery.recipientPhone || customer.phone || ''
  );
  const [ppAddress, setPpAddress] = useState<string>(
    activeCarrier === 'phnom_penh_door' ? delivery.address || '' : ''
  );
  const [otherCourierName, setOtherCourierName] = useState<string>(
    delivery.otherCourierName || ''
  );
  const [otherStationAddress, setOtherStationAddress] = useState<string>(
    activeCarrier === 'other_courier' ? delivery.address || '' : ''
  );

  const totals = getTotals(delivery.method);

  // Current province object and branches
  const currentProvince = findProvinceById(selectedProvinceId) || CAMBODIA_PROVINCES[0];
  const availableBranches = currentProvince.branches;

  // Sync recipientPhone if customer phone changes and recipientPhone is empty
  useEffect(() => {
    if (!delivery.recipientPhone && customer.phone) {
      setRecipientPhone(customer.phone);
    }
  }, [customer.phone, delivery.recipientPhone]);

  // Handle Carrier Switch
  const handleCarrierSwitch = (newCarrier: DeliveryCarrier) => {
    updateDeliveryCarrier(newCarrier);
    setValidationError(null);

    if (newCarrier === 'vireak_buntham') {
      const branch = findBranchById(selectedProvinceId, selectedBranchId) || availableBranches[0];
      const provName = tObj(currentProvince.nameEn, currentProvince.nameKm);
      const branchName = branch ? tObj(branch.nameEn, branch.nameKm) : '';
      const formattedAddress = `${tObj('Vireak Buntham Express', 'វីរៈ ប៊ុនថាំ')} (${provName} - ${branchName}${branchNote ? ` / ${branchNote}` : ''})`;

      updateDeliveryInfo({
        carrier: 'vireak_buntham',
        vireakProvince: selectedProvinceId,
        vireakBranch: branch?.id || selectedBranchId,
        vireakBranchName: branchName,
        vireakBranchNote: branchNote,
        recipientPhone: recipientPhone || customer.phone,
        address: formattedAddress,
        city: provName,
      });
    } else if (newCarrier === 'phnom_penh_door') {
      updateDeliveryInfo({
        carrier: 'phnom_penh_door',
        address: ppAddress,
        city: 'Phnom Penh',
        recipientPhone: recipientPhone || customer.phone,
      });
    } else if (newCarrier === 'other_courier') {
      updateDeliveryInfo({
        carrier: 'other_courier',
        otherCourierName,
        address: otherStationAddress,
        recipientPhone: recipientPhone || customer.phone,
      });
    }
  };

  // When province changes in Vireak Buntham
  const handleProvinceChange = (provId: string) => {
    setSelectedProvinceId(provId);
    const newProv = findProvinceById(provId);
    const firstBranch = newProv?.branches[0];
    const newBranchId = firstBranch?.id || '';
    setSelectedBranchId(newBranchId);

    const provName = newProv ? tObj(newProv.nameEn, newProv.nameKm) : '';
    const branchName = firstBranch ? tObj(firstBranch.nameEn, firstBranch.nameKm) : '';
    const formattedAddress = `${tObj('Vireak Buntham Express', 'វីរៈ ប៊ុនថាំ')} (${provName} - ${branchName}${branchNote ? ` / ${branchNote}` : ''})`;

    updateDeliveryInfo({
      carrier: 'vireak_buntham',
      vireakProvince: provId,
      vireakBranch: newBranchId,
      vireakBranchName: branchName,
      vireakBranchNote: branchNote,
      recipientPhone: recipientPhone || customer.phone,
      address: formattedAddress,
      city: provName,
    });
  };

  // When branch changes in Vireak Buntham
  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    const branch = findBranchById(selectedProvinceId, branchId);
    const provName = tObj(currentProvince.nameEn, currentProvince.nameKm);
    const branchName = branch ? tObj(branch.nameEn, branch.nameKm) : '';
    const formattedAddress = `${tObj('Vireak Buntham Express', 'វីរៈ ប៊ុនថាំ')} (${provName} - ${branchName}${branchNote ? ` / ${branchNote}` : ''})`;

    updateDeliveryInfo({
      carrier: 'vireak_buntham',
      vireakProvince: selectedProvinceId,
      vireakBranch: branchId,
      vireakBranchName: branchName,
      vireakBranchNote: branchNote,
      recipientPhone: recipientPhone || customer.phone,
      address: formattedAddress,
      city: provName,
    });
  };

  // When branch note changes
  const handleBranchNoteChange = (note: string) => {
    setBranchNote(note);
    const branch = findBranchById(selectedProvinceId, selectedBranchId);
    const provName = tObj(currentProvince.nameEn, currentProvince.nameKm);
    const branchName = branch ? tObj(branch.nameEn, branch.nameKm) : '';
    const formattedAddress = `${tObj('Vireak Buntham Express', 'វីរៈ ប៊ុនថាំ')} (${provName} - ${branchName}${note ? ` / ${note}` : ''})`;

    updateDeliveryInfo({
      carrier: 'vireak_buntham',
      vireakBranchNote: note,
      address: formattedAddress,
    });
  };

  // When recipient phone changes
  const handleRecipientPhoneChange = (phone: string) => {
    setRecipientPhone(phone);
    updateDeliveryInfo({
      recipientPhone: phone,
    });
  };

  // When PP address changes
  const handlePpAddressChange = (addr: string) => {
    setPpAddress(addr);
    updateDeliveryAddress(addr, 'Phnom Penh');
  };

  // When Other Courier info changes
  const handleOtherCourierChange = (name: string, station: string) => {
    setOtherCourierName(name);
    setOtherStationAddress(station);
    updateDeliveryInfo({
      carrier: 'other_courier',
      otherCourierName: name,
      address: station,
    });
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (delivery.method === 'delivery') {
      if (activeCarrier === 'vireak_buntham') {
        if (!selectedBranchId) {
          setValidationError(t('checkout.branchRequired'));
          return;
        }
      } else if (activeCarrier === 'phnom_penh_door') {
        if (!ppAddress.trim()) {
          setValidationError(t('checkout.addressRequired'));
          return;
        }
      } else if (activeCarrier === 'other_courier') {
        if (!otherCourierName.trim() || !otherStationAddress.trim()) {
          setValidationError(tObj('Please enter courier name and destination station.', 'សូមបញ្ចូលឈ្មោះក្រុមហ៊ុនដឹកជញ្ជូន និងទីតាំងទទួល។'));
          return;
        }
      }
    }

    const validation = validateDeliveryStep();
    if (!validation.isValid) {
      setValidationError(validation.errors.branch || validation.errors.address || t('checkout.addressRequired'));
      return;
    }

    setIsSubmitting(true);
    startNavigationLoading();
    router.push('/checkout/payment');
  };

  // Selected Branch Object for Display
  const currentSelectedBranch = findBranchById(selectedProvinceId, selectedBranchId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('checkout.deliveryTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('checkout.deliverySubtitle')}
          </p>
        </div>

        {/* 2 Big Choice Cards: Pickup vs Express Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pickup Option */}
          <button
            type="button"
            onClick={() => updateDeliveryMethod('pickup')}
            className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
              delivery.method === 'pickup'
                ? 'border-brand-600 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-950/60 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              {delivery.method === 'pickup' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              )}
            </div>
            <div className="mt-3">
              <span className="font-extrabold text-slate-900 dark:text-white text-base block">
                {t('checkout.shopPickup')}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('checkout.shopPickupDesc')}
              </p>
              <span className="inline-block mt-2 font-black text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {t('checkout.freeBadge')}
              </span>
            </div>
          </button>

          {/* Delivery Option */}
          <button
            type="button"
            onClick={() => updateDeliveryMethod('delivery')}
            className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
              delivery.method === 'delivery'
                ? 'border-brand-600 dark:border-brand-500 bg-brand-50/60 dark:bg-brand-950/60 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              {delivery.method === 'delivery' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              )}
            </div>
            <div className="mt-3">
              <span className="font-extrabold text-slate-900 dark:text-white text-base block">
                {t('checkout.expressDelivery')}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('checkout.expressDeliveryDesc')}
              </p>
              <span className="inline-block mt-2 font-bold text-slate-700 dark:text-slate-300 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {totals.isFreeDelivery ? t('checkout.freeOverThreshold') : formatPrice(shopConfig.standardDeliveryFee)}
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Detail Card Based on Selection */}
        {delivery.method === 'pickup' ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('checkout.pickupHubTitle')}
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-white">{tObj(shopConfig.name, shopConfig.nameKm)}</p>
              <p>{tObj(shopConfig.address, shopConfig.addressKm)}</p>
              <p className="text-slate-500 dark:text-slate-400">{tObj(shopConfig.pickupLocationDetail, shopConfig.pickupLocationDetailKm)}</p>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{tObj(shopConfig.workingHours, shopConfig.workingHoursKm)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            {/* CARRIER SELECTION SECTION */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{tObj('Choose Delivery Service / Carrier', 'ជ្រើសរើសសេវាដឹកជញ្ជូន')}</span>
              </label>

              {/* 3 Carrier Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Vireak Buntham Express (VET) - Highlighted in Cambodia */}
                <button
                  type="button"
                  onClick={() => handleCarrierSwitch('vireak_buntham')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    activeCarrier === 'vireak_buntham'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      VET
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{tObj('Popular', 'ពេញនិយម')}</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm block">
                      {t('checkout.carrierVireak')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-snug">
                      {t('checkout.carrierVireakDesc')}
                    </span>
                  </div>
                </button>

                {/* 2. Phnom Penh Door-to-Door Delivery */}
                <button
                  type="button"
                  onClick={() => handleCarrierSwitch('phnom_penh_door')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    activeCarrier === 'phnom_penh_door'
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Navigation className="w-4 h-4" />
                    </div>
                    {activeCarrier === 'phnom_penh_door' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm block">
                      {t('checkout.carrierPpDoor')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-snug">
                      {t('checkout.carrierPpDoorDesc')}
                    </span>
                  </div>
                </button>

                {/* 3. Other Express Courier */}
                <button
                  type="button"
                  onClick={() => handleCarrierSwitch('other_courier')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    activeCarrier === 'other_courier'
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    {activeCarrier === 'other_courier' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm block">
                      {t('checkout.carrierOther')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-snug">
                      {t('checkout.carrierOtherDesc')}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* CARRIER SPECIFIC FORM FIELDS */}

            {/* 1. VIREAK BUNTHAM (VET EXPRESS) BRANCH & CAMPUS SELECTION */}
            {activeCarrier === 'vireak_buntham' && (
              <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-3xl p-5 sm:p-6 border border-amber-200/80 dark:border-amber-900/60 space-y-5 animate-in fade-in">
                {/* VET Info Banner */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      VET
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {tObj('Vireak Buntham Express (VET)', 'ក្រុមហ៊ុន វីរៈ ប៊ុនថាំ អេចប្រេស')}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {tObj('Branch & Campus Pickup across Cambodia', 'ផ្ញើទៅកាន់សាខា វីរៈ ប៊ុនថាំ ទូទាំងប្រទេសកម្ពុជា')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-lg">
                    {tObj('25 Provinces & Towns', '២៥ រាជធានី-ខេត្ត')}
                  </span>
                </div>

                {/* Popular Province Quick Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    {t('checkout.popularProvinces')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'phnom_penh', label: tObj('Phnom Penh', 'ភ្នំពេញ') },
                      { id: 'siem_reap', label: tObj('Siem Reap', 'សៀមរាប') },
                      { id: 'battambang', label: tObj('Battambang', 'បាត់ដំបង') },
                      { id: 'sihanoukville', label: tObj('Sihanoukville', 'ព្រះសីហនុ') },
                      { id: 'kampot', label: tObj('Kampot', 'កំពត') },
                      { id: 'banteay_meanchey', label: tObj('Poipet', 'ប៉ោយប៉ែត') },
                      { id: 'kampong_cham', label: tObj('Kampong Cham', 'កំពង់ចាម') },
                    ].map((prov) => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => handleProvinceChange(prov.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          selectedProvinceId === prov.id
                            ? 'bg-amber-500 text-white shadow-sm scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        <MapPin className={`w-3.5 h-3.5 ${selectedProvinceId === prov.id ? 'text-white' : 'text-amber-500'}`} />
                        <span>{prov.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 1: Province Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('checkout.selectProvince')} <strong className="text-red-500">*</strong></span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProvinceId}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer"
                    >
                      {CAMBODIA_PROVINCES.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {tObj(prov.nameEn, prov.nameKm)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 2: Campus / Branch Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('checkout.selectCampus')} <strong className="text-red-500">*</strong></span>
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    className="w-full pl-3.5 pr-8 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer"
                  >
                    {availableBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {tObj(branch.nameEn, branch.nameKm)} {branch.hintKm ? `(${tObj(branch.hintEn, branch.hintKm)})` : ''}
                      </option>
                    ))}
                  </select>
                  {currentSelectedBranch?.hintKm && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{tObj('Location Hint:', 'ទីតាំងសំគាល់៖')} {tObj(currentSelectedBranch.hintEn, currentSelectedBranch.hintKm)}</span>
                    </p>
                  )}
                </div>

                {/* Step 3: Specific Campus Notes / Landmark (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>{t('checkout.campusDetailLabel')}</span>
                  </label>
                  <input
                    type="text"
                    value={branchNote}
                    onChange={(e) => handleBranchNoteChange(e.target.value)}
                    placeholder={t('checkout.campusDetailPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                </div>

                {/* Step 4: Recipient Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('checkout.recipientPhoneLabel')} <strong className="text-red-500">*</strong></span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => handleRecipientPhoneChange(e.target.value)}
                      placeholder="012 345 678"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{t('checkout.recipientPhoneHint')}</span>
                  </p>
                </div>

                {/* Live Selected Campus Confirmation Card */}
                {currentSelectedBranch && (
                  <div className="p-3.5 rounded-2xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-xs space-y-1 text-slate-800 dark:text-slate-200">
                    <span className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {tObj('Confirmed Pickup Destination:', 'ទីតាំងទៅយកទំនិញដែលបានជ្រើសរើស៖')}
                    </span>
                    <p className="font-black text-slate-900 dark:text-white text-sm">
                      {tObj(currentSelectedBranch.nameEn, currentSelectedBranch.nameKm)}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {tObj(currentProvince.nameEn, currentProvince.nameKm)}{branchNote ? ` — ${branchNote}` : ''}
                    </p>
                    {recipientPhone && (
                      <p className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 pt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{tObj('Contact Phone:', 'លេខទាក់ទង៖')} {recipientPhone}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. PHNOM PENH DOOR-TO-DOOR ADDRESS FORM */}
            {activeCarrier === 'phnom_penh_door' && (
              <div className="bg-sky-50/40 dark:bg-sky-950/20 rounded-3xl p-5 sm:p-6 border border-sky-200/80 dark:border-sky-900/60 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-sky-200/60 dark:border-sky-900/40">
                  <Navigation className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {tObj('Phnom Penh Door-to-Door Delivery', 'សេវាដឹកជញ្ជូនដល់ទីកន្លែង រាជធានីភ្នំពេញ')}
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('checkout.deliveryAddress')} <strong className="text-red-500">*</strong></span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      rows={3}
                      value={ppAddress}
                      onChange={(e) => handlePpAddressChange(e.target.value)}
                      placeholder={t('checkout.addressPlaceholder')}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>{t('checkout.recipientPhoneLabel')}</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => handleRecipientPhoneChange(e.target.value)}
                      placeholder="012 345 678"
                      className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. OTHER COURIER FORM */}
            {activeCarrier === 'other_courier' && (
              <div className="bg-purple-50/40 dark:bg-purple-950/20 rounded-3xl p-5 sm:p-6 border border-purple-200/80 dark:border-purple-900/60 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-purple-200/60 dark:border-purple-900/40">
                  <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {tObj('Other Express Courier', 'ក្រុមហ៊ុនដឹកជញ្ជូនផ្សេងទៀត')}
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>{t('checkout.otherCourierNameLabel')} <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="text"
                    value={otherCourierName}
                    onChange={(e) => handleOtherCourierChange(e.target.value, otherStationAddress)}
                    placeholder={t('checkout.otherCourierNamePlaceholder')}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>{t('checkout.otherCourierStationLabel')} <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="text"
                    value={otherStationAddress}
                    onChange={(e) => handleOtherCourierChange(otherCourierName, e.target.value)}
                    placeholder={t('checkout.otherCourierStationPlaceholder')}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>{t('checkout.recipientPhoneLabel')}</span>
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => handleRecipientPhoneChange(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Delivery Fee Notice */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t('checkout.deliveryFeeLabel')}</span>
              <span className="font-black text-slate-900 dark:text-white">
                {totals.isFreeDelivery ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{t('checkout.freeBadge')} ($0.00)</span>
                ) : (
                  formatPrice(shopConfig.standardDeliveryFee)
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            startNavigationLoading();
            router.push('/checkout/customer');
          }}
          className="px-6 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          {t('checkout.backToCustomer')}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{t('checkout.continueToPayment')}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
};
