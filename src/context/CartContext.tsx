'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, SelectedProductConfig, UploadedFile, DeliveryMethod } from '@/types';
import { calculateCartTotals, CartTotals } from '@/lib/pricing';

interface CartContextType {
  items: CartItem[];
  addItem: (
    productId: string,
    productSlug: string,
    productName: string,
    productImage: string,
    config: SelectedProductConfig,
    unitPrice: number,
    totalPrice: number,
    file?: UploadedFile
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
  getTotals: (deliveryMethod?: DeliveryMethod) => CartTotals;
  cartCount: number;
  lastAddedItem: CartItem | null;
  showToast: boolean;
  closeToast: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'printcraft_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage safely on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isHydrated]);

  const addItem = (
    productId: string,
    productSlug: string,
    productName: string,
    productImage: string,
    config: SelectedProductConfig,
    unitPrice: number,
    totalPrice: number,
    file?: UploadedFile
  ) => {
    const newItem: CartItem = {
      id: `${productId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId,
      productSlug,
      productName,
      productImage,
      config,
      unitPrice,
      totalPrice,
      file,
      createdAt: Date.now(),
    };

    setItems((prev) => [newItem, ...prev]);
    setLastAddedItem(newItem);
    setShowToast(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const unitPrice = item.unitPrice;
          const totalPrice = Number((unitPrice * newQuantity).toFixed(2));
          return {
            ...item,
            config: {
              ...item.config,
              quantity: newQuantity,
            },
            totalPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const getItem = (id: string) => {
    return items.find((i) => i.id === id);
  };

  const getTotals = (deliveryMethod: DeliveryMethod = 'pickup'): CartTotals => {
    return calculateCartTotals(items, deliveryMethod);
  };

  const cartCount = items.reduce((sum, item) => sum + (item.config?.quantity || 1), 0);

  const closeToast = () => setShowToast(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItem,
        getTotals,
        cartCount,
        lastAddedItem,
        showToast,
        closeToast,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
