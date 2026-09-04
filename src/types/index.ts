export type Language = 'en' | 'km';

export interface MaterialOption {
  id: string;
  name: string;
  nameKm?: string;
  description?: string;
  descriptionKm?: string;
  priceMultiplier?: number;
  priceAddon?: number;
}

export interface SizeOption {
  id: string;
  name: string;
  nameKm?: string;
  dimensions?: string;
  price: number;
  isCustom?: boolean;
}

export interface FinishingOption {
  id: string;
  name: string;
  nameKm?: string;
  description?: string;
  descriptionKm?: string;
  price: number;
}

export interface ProductOptions {
  materials?: MaterialOption[];
  sizes?: SizeOption[];
  finishings?: FinishingOption[];
  quantities?: number[];
  minQuantity?: number;
  maxQuantity?: number;
  quantityStep?: number;
  allowCustomQuantity?: boolean;
  allowCustomDimensions?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameKm?: string;
  tagline: string;
  taglineKm?: string;
  description: string;
  descriptionKm?: string;
  longDescription?: string;
  longDescriptionKm?: string;
  category: string;
  image: string;
  badge?: string;
  badgeKm?: string;
  startingPrice: number;
  turnaroundTime: string;
  turnaroundTimeKm?: string;
  features: string[];
  featuresKm?: string[];
  options: ProductOptions;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameKm?: string;
  description: string;
  descriptionKm?: string;
  iconName: string;
  image: string;
}

export interface UploadedFile {
  fileId?: string;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  previewUrl?: string;
}

export interface SelectedProductConfig {
  materialId?: string;
  materialName?: string;
  materialNameKm?: string;
  sizeId?: string;
  sizeName?: string;
  sizeNameKm?: string;
  customWidth?: number;
  customHeight?: number;
  customUnit?: 'cm' | 'mm' | 'm' | 'in';
  finishingId?: string;
  finishingName?: string;
  finishingNameKm?: string;
  quantity: number;
  notes?: string;
  designMode?: 'preset' | 'custom';
  presetId?: string;
  presetName?: string;
  presetNameKm?: string;
  isCustomized?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productNameKm?: string;
  productImage: string;
  config: SelectedProductConfig;
  unitPrice: number;
  totalPrice: number;
  file?: UploadedFile;
  createdAt: number;
}

export type DeliveryMethod = 'pickup' | 'delivery';
export type DeliveryCarrier = 'vireak_buntham' | 'phnom_penh_door' | 'other_courier';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  telegram?: string;
  notes?: string;
}

export interface DeliveryInfo {
  method: DeliveryMethod;
  carrier?: DeliveryCarrier;
  vireakProvince?: string;
  vireakBranch?: string;
  vireakBranchName?: string;
  vireakBranchNote?: string;
  recipientPhone?: string;
  otherCourierName?: string;
  address?: string;
  city?: string;
  instructions?: string;
  deliveryFee: number;
}

export type PaymentStatus = 'pending' | 'paid';

export interface PaymentMethodConfig {
  id: string;
  name: string;
  nameKm?: string;
  subtitle: string;
  subtitleKm?: string;
  description: string;
  descriptionKm?: string;
  icon: string;
  badge?: string;
  badgeKm?: string;
  qrImage?: string;
  accountName?: string;
  accountNumber?: string;
  instructions: string[];
  instructionsKm?: string[];
}

export interface PaymentSelection {
  methodId: string;
  status: PaymentStatus;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  payment: {
    methodId: string;
    methodName: string;
    methodNameKm?: string;
    status: PaymentStatus;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface ShopConfig {
  name: string;
  nameKm: string;
  tagline: string;
  taglineKm: string;
  phone: string;
  displayPhone: string;
  telegram: string;
  telegramBotOrUser: string;
  email: string;
  address: string;
  addressKm: string;
  pickupLocationDetail: string;
  pickupLocationDetailKm: string;
  workingHours: string;
  workingHoursKm: string;
  currency: string;
  currencySymbol: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
}
