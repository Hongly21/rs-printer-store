import React from 'react';
import { PaymentSelector } from '@/components/checkout/PaymentSelector';

export const metadata = {
  title: 'Payment Method - Checkout',
};

export default function CheckoutPaymentPage() {
  return <PaymentSelector />;
}
