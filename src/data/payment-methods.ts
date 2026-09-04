import { PaymentMethodConfig } from '@/types';

export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: 'qr-payment',
    name: 'QR Pay (KHQR / Instant Banking)',
    nameKm: 'ទូទាត់រហ័សតាម KHQR (គ្រប់ធនាគារ)',
    subtitle: 'Scan & Pay with any mobile banking app',
    subtitleKm: 'ស្កេនទូទាត់ជាមួយ ABA, Bakong, Wing, ACLEDA...',
    description: 'Instant scan with Bakong, ABA, Wing, ACLEDA, or any KHQR-compatible banking app.',
    descriptionKm: 'ស្កេនទូទាត់ភ្លាមៗជាមួយគ្រប់ App ធនាគារដែលគាំទ្រ KHQR។',
    icon: 'QrCode',
    badge: 'Fast & Instant',
    badgeKm: 'រហ័ស & ភ្លាមៗ',
    qrImage: '/images/logo/qr-for-payment.jpg',
    accountName: 'RS PRINTER',
    accountNumber: '001 889 922 (USD)',
    instructions: [
      'Open your mobile banking app (ABA, Bakong, Wing, ACLEDA, etc.)',
      'Scan the QR code displayed on screen',
      'Verify the account name: RS PRINTER and exact order amount',
      'Complete the payment and keep your transaction note',
      'Click "Place Order" to submit your request for confirmation',
    ],
    instructionsKm: [
      'បើកកម្មវិធីធនាគារក្នុងទូរស័ព្ទរបស់អ្នក (ABA, Bakong, Wing, ACLEDA...)',
      'ស្កេនរូបភាព QR កូដដែលបង្ហាញលើអេក្រង់',
      'ផ្ទៀងផ្ទាត់ឈ្មោះគណនី៖ RS PRINTER និងចំនួនទឹកប្រាក់',
      'បញ្ចប់ការទូទាត់ និងរក្សាទុកវិក្កយបត្រ',
      'ចុចប៊ូតុង "បញ្ជូនការបញ្ជាទិញ" ដើម្បីបញ្ចប់ការកុម្ម៉ង់',
    ],
  },
  {
    id: 'shop-pickup-pay',
    name: 'Pay on Shop Pickup / Cash on Delivery',
    nameKm: 'ទូទាត់ពេលមកយកផ្ទាល់ ឬសេវា COD',
    subtitle: 'Pay with cash or card when receiving your prints',
    subtitleKm: 'ទូទាត់ជាសាច់ប្រាក់ ឬផ្ទេរប្រាក់ពេលទទួលទំនិញ',
    description: 'Pay directly at our counter upon picking up your order, or pay the driver when delivered.',
    descriptionKm: 'ទូទាត់ដោយផ្ទាល់នៅបញ្ជរហាងពេលមកយក ឬទូទាត់ជូនអ្នកដឹកជញ្ជូន។',
    icon: 'Store',
    badge: 'Pay Later',
    badgeKm: 'ទូទាត់ពេលក្រោយ',
    qrImage: '/images/payment/shop-counter.svg',
    instructions: [
      'Your order will be queued for review and printing',
      'Pay in cash or bank transfer when you pick up at our shop counter or upon delivery arrival',
      'Please have exact change or banking app ready',
    ],
    instructionsKm: [
      'ការកុម្ម៉ង់របស់អ្នកនឹងត្រូវបានត្រួតពិនិត្យ និងរៀបចំការបោះពុម្ព',
      'ទូទាត់ជាសាច់ប្រាក់ ឬផ្ទេរតាមធនាគារពេលមកទទួលទំនិញនៅហាង ឬពេលដឹកជញ្ជូនដល់',
      'សូមរៀបចំសាច់ប្រាក់ ឬ App ធនាគារឱ្យបានរួចរាល់',
    ],
  },
];

export function getPaymentMethodById(id: string): PaymentMethodConfig | undefined {
  return paymentMethods.find((p) => p.id === id);
}
