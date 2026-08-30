import React from 'react';
import { DeliverySelector } from '@/components/checkout/DeliverySelector';

export const metadata = {
  title: 'Delivery Method - Checkout',
};

export default function CheckoutDeliveryPage() {
  return <DeliverySelector />;
}
