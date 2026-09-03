import { Product, SelectedProductConfig, CartItem, DeliveryMethod } from '@/types';
import { shopConfig } from '@/data/shop';

export interface PriceCalculationResult {
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  totalPrice: number;
  breakdown: {
    baseSizePrice: number;
    baseTotal: number;
    materialAddon: number;
    materialMultiplier: number;
    materialTotal: number;
    finishingAddon: number;
    baseUnitCost: number;
  };
}

export function calculateProductPrice(
  product: Product,
  config: SelectedProductConfig
): PriceCalculationResult {
  const { materialId, sizeId, customWidth, customHeight, finishingId, quantity } = config;

  // 1. Size base price
  let baseSizePrice = product.startingPrice;
  if (sizeId && product.options.sizes) {
    const selectedSize = product.options.sizes.find((s) => s.id === sizeId);
    if (selectedSize) {
      baseSizePrice = selectedSize.price;
    }
  } else if (customWidth && customHeight) {
    // Square meter or cm area calculation
    const areaSqCm = customWidth * customHeight;
    baseSizePrice = Math.max(0.1, (areaSqCm / 100) * 0.05);
  }

  // 2. Material add-on and multiplier
  let materialMultiplier = 1.0;
  let materialAddon = 0;
  if (materialId && product.options.materials) {
    const selectedMaterial = product.options.materials.find((m) => m.id === materialId);
    if (selectedMaterial) {
      materialMultiplier = selectedMaterial.priceMultiplier ?? 1.0;
      materialAddon = selectedMaterial.priceAddon ?? 0;
    }
  }

  // 3. Finishing add-on
  let finishingAddon = 0;
  if (finishingId && product.options.finishings) {
    const selectedFinishing = product.options.finishings.find((f) => f.id === finishingId);
    if (selectedFinishing) {
      finishingAddon = selectedFinishing.price;
    }
  }

  // 4. Calculate unit price & components
  const rawUnitPrice = Math.max(0.01, baseSizePrice * materialMultiplier);
  const baseTotal = Number((baseSizePrice * quantity).toFixed(2));
  const materialTotal = Number((((rawUnitPrice - baseSizePrice) * quantity) + materialAddon).toFixed(2));
  const rawSubtotal = Number((baseTotal + materialTotal + finishingAddon).toFixed(2));
  
  // 5. Volume discount calculation
  let discountPercentage = 0;
  if (quantity >= 1000) {
    discountPercentage = 15;
  } else if (quantity >= 500) {
    discountPercentage = 10;
  } else if (quantity >= 200) {
    discountPercentage = 5;
  }

  const discountAmount = Number(((rawSubtotal * discountPercentage) / 100).toFixed(2));
  const totalPrice = Math.max(0.1, Number((rawSubtotal - discountAmount).toFixed(2)));
  const finalUnitPrice = Number((totalPrice / quantity).toFixed(3));
  const baseUnitCost = (baseSizePrice * materialMultiplier) + (materialAddon / Math.max(1, quantity)) + (finishingAddon / Math.max(1, quantity));

  return {
    unitPrice: finalUnitPrice,
    subtotal: rawSubtotal,
    discountAmount,
    discountPercentage,
    totalPrice,
    breakdown: {
      baseSizePrice,
      baseTotal,
      materialAddon,
      materialMultiplier,
      materialTotal,
      finishingAddon,
      baseUnitCost,
    },
  };
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  isFreeDelivery: boolean;
  total: number;
}

export function calculateCartTotals(
  items: CartItem[],
  deliveryMethod: DeliveryMethod = 'pickup'
): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.config.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  let deliveryFee = 0;
  let isFreeDelivery = false;
  let amountNeededForFreeDelivery = Math.max(0, shopConfig.freeDeliveryThreshold - subtotal);

  if (deliveryMethod === 'delivery') {
    if (subtotal >= shopConfig.freeDeliveryThreshold) {
      deliveryFee = 0;
      isFreeDelivery = true;
      amountNeededForFreeDelivery = 0;
    } else {
      deliveryFee = shopConfig.standardDeliveryFee;
    }
  }

  const total = Number((subtotal + deliveryFee).toFixed(2));

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    freeDeliveryThreshold: shopConfig.freeDeliveryThreshold,
    amountNeededForFreeDelivery: Number(amountNeededForFreeDelivery.toFixed(2)),
    isFreeDelivery,
    total,
  };
}
