'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CustomerInfo, DeliveryInfo, PaymentSelection, Order } from '@/types';
import { shopConfig } from '@/data/shop';
import { getPaymentMethodById } from '@/data/payment-methods';
import { generateOrderNumber } from '@/lib/utils';
import { useCart } from './CartContext';

interface CheckoutContextType {
  customer: CustomerInfo;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  updateCustomerField: (field: keyof CustomerInfo, value: string) => void;
  
  delivery: DeliveryInfo;
  setDelivery: React.Dispatch<React.SetStateAction<DeliveryInfo>>;
  updateDeliveryMethod: (method: 'pickup' | 'delivery') => void;
  updateDeliveryAddress: (address: string, city?: string, instructions?: string) => void;
  updateDeliveryCarrier: (carrier: import('@/types').DeliveryCarrier) => void;
  updateDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
  
  payment: PaymentSelection;
  setPayment: React.Dispatch<React.SetStateAction<PaymentSelection>>;
  updatePaymentMethod: (methodId: string) => void;
  
  validateCustomerStep: () => { isValid: boolean; errors: Partial<Record<keyof CustomerInfo, string>> };
  validateDeliveryStep: () => { isValid: boolean; errors: { address?: string; branch?: string } };
  
  currentOrder: Order | null;
  submitOrder: () => Order | null;
  resetCheckout: () => void;
  isHydrated: boolean;
}

const CHECKOUT_STORAGE_KEY = 'printcraft_checkout_draft_v1';
const LATEST_ORDER_STORAGE_KEY = 'printcraft_latest_order_v1';

const defaultCustomer: CustomerInfo = {
  fullName: '',
  phone: '',
  telegram: '',
  notes: '',
};

const defaultDelivery: DeliveryInfo = {
  method: 'pickup',
  carrier: 'vireak_buntham',
  vireakProvince: 'phnom_penh',
  vireakBranch: 'pp_night_market',
  vireakBranchName: 'សាខាកណ្តាល ផ្សាររាត្រី (ផ្លូវ ១០៦)',
  vireakBranchNote: '',
  recipientPhone: '',
  address: '',
  city: 'Phnom Penh',
  instructions: '',
  deliveryFee: 0,
};

const defaultPayment: PaymentSelection = {
  methodId: 'qr-payment',
  status: 'pending',
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, getTotals, clearCart } = useCart();
  const [customer, setCustomer] = useState<CustomerInfo>(defaultCustomer);
  const [delivery, setDelivery] = useState<DeliveryInfo>(defaultDelivery);
  const [payment, setPayment] = useState<PaymentSelection>(defaultPayment);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate draft from localStorage on mount
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft);
        if (parsed.customer) setCustomer(parsed.customer);
        if (parsed.delivery) setDelivery(parsed.delivery);
        if (parsed.payment) setPayment(parsed.payment);
      }

      const storedOrder = localStorage.getItem(LATEST_ORDER_STORAGE_KEY);
      if (storedOrder) {
        setCurrentOrder(JSON.parse(storedOrder));
      }
    } catch (e) {
      console.error('Failed to load checkout state', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync draft to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify({ customer, delivery, payment })
      );
    } catch (e) {
      console.error('Failed to save checkout draft', e);
    }
  }, [customer, delivery, payment, isHydrated]);

  const updateCustomerField = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const updateDeliveryMethod = (method: 'pickup' | 'delivery') => {
    const totals = getTotals(method);
    setDelivery((prev) => ({
      ...prev,
      method,
      deliveryFee: totals.deliveryFee,
    }));
  };

  const updateDeliveryAddress = (address: string, city?: string, instructions?: string) => {
    setDelivery((prev) => ({
      ...prev,
      address,
      city: city ?? prev.city,
      instructions: instructions ?? prev.instructions,
    }));
  };

  const updateDeliveryCarrier = (carrier: import('@/types').DeliveryCarrier) => {
    setDelivery((prev) => ({
      ...prev,
      carrier,
    }));
  };

  const updateDeliveryInfo = (info: Partial<DeliveryInfo>) => {
    setDelivery((prev) => ({
      ...prev,
      ...info,
    }));
  };

  const updatePaymentMethod = (methodId: string) => {
    setPayment((prev) => ({
      ...prev,
      methodId,
    }));
  };

  const validateCustomerStep = () => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (customer.fullName.trim().length < 2) {
      errors.fullName = 'Please enter at least 2 characters.';
    }

    if (!customer.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[\d\s+\-()]{8,15}$/.test(customer.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (8-15 digits).';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateDeliveryStep = () => {
    const errors: { address?: string; branch?: string } = {};
    if (delivery.method === 'delivery') {
      const carrier = delivery.carrier || 'vireak_buntham';
      if (carrier === 'vireak_buntham') {
        if (!delivery.vireakBranch && !delivery.vireakBranchName) {
          errors.branch = 'Please select a Vireak Buntham campus/branch.';
        }
      } else if (carrier === 'phnom_penh_door') {
        if (!delivery.address?.trim()) {
          errors.address = 'Delivery address is required for Phnom Penh door delivery.';
        }
      } else if (carrier === 'other_courier') {
        if (!delivery.otherCourierName?.trim()) {
          errors.address = 'Courier name and destination station are required.';
        }
      }
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const submitOrder = (): Order | null => {
    if (items.length === 0) return null;

    const totals = getTotals(delivery.method);
    const paymentConfig = getPaymentMethodById(payment.methodId);

    const order: Order = {
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: { ...customer },
      delivery: {
        ...delivery,
        deliveryFee: totals.deliveryFee,
      },
      payment: {
        methodId: payment.methodId,
        methodName: paymentConfig ? paymentConfig.name : 'Standard Payment',
        status: 'pending', // MVP status remains pending until admin verification
      },
      items: [...items],
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
    };

    setCurrentOrder(order);
    try {
      localStorage.setItem(LATEST_ORDER_STORAGE_KEY, JSON.stringify(order));
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to store order', e);
    }

    clearCart();
    return order;
  };

  const resetCheckout = () => {
    setCustomer(defaultCustomer);
    setDelivery(defaultDelivery);
    setPayment(defaultPayment);
  };

  return (
    <CheckoutContext.Provider
      value={{
        customer,
        setCustomer,
        updateCustomerField,
        delivery,
        setDelivery,
        updateDeliveryMethod,
        updateDeliveryAddress,
        updateDeliveryCarrier,
        updateDeliveryInfo,
        payment,
        setPayment,
        updatePaymentMethod,
        validateCustomerStep,
        validateDeliveryStep,
        currentOrder,
        submitOrder,
        resetCheckout,
        isHydrated,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
