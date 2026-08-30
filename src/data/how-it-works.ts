export interface Step {
  step: string;
  title: string;
  titleKm?: string;
  description: string;
  descriptionKm?: string;
  iconName: string;
}

export const howItWorksSteps: Step[] = [
  {
    step: '01',
    title: 'Choose Your Product',
    titleKm: 'ជ្រើសរើសផលិតផល',
    description: 'Select what you want to print from stickers, banners, business cards, photo prints, and more.',
    descriptionKm: 'ជ្រើសរើសប្រភេទផលិតផលដែលអ្នកចង់បោះពុម្ព ដូចជាស្ទីគ័រ បដា នាមប័ណ្ណ រូបថត និងស្លាកសញ្ញា។',
    iconName: 'ShoppingBag',
  },
  {
    step: '02',
    title: 'Customize Options',
    titleKm: 'កំណត់ជម្រើស',
    description: 'Choose your desired size, material, finishing texture, and print quantity with live price updates.',
    descriptionKm: 'ជ្រើសរើសទំហំ ប្រភេទស្ទីគ័រ ស្រោបការពារ និងចំនួនបោះពុម្ព ជាមួយនឹងតម្លៃប៉ាន់ស្មានភ្លាមៗ។',
    iconName: 'Sliders',
  },
  {
    step: '03',
    title: 'Upload Your Design',
    titleKm: 'ភ្ជាប់ឯកសារឌីហ្សាញ',
    description: 'Drag & drop your artwork (PNG, JPG, PDF, SVG). Our team will check resolution and cutlines.',
    descriptionKm: 'អូសទម្លាក់ឯកសារឌីហ្សាញរបស់អ្នក (PNG, JPG, PDF, SVG)។ យើងពិនិត្យកម្រិតច្បាស់ និងប្លង់ហ្វ្រី។',
    iconName: 'UploadCloud',
  },
  {
    step: '04',
    title: 'Pay & Review',
    titleKm: 'ទូទាត់ & ផ្ទៀងផ្ទាត់',
    description: 'Select convenient pickup or delivery, scan QR or choose payment, and review your order summary.',
    descriptionKm: 'ជ្រើសរើសមកយកផ្ទាល់ ឬដឹកជញ្ជូន ស្កេន KHQR និងផ្ទៀងផ្ទាត់ព័ត៌មានលម្អិតមុនបញ្ជូន។',
    iconName: 'CreditCard',
  },
  {
    step: '05',
    title: 'We Print & Deliver',
    titleKm: 'យើងបោះពុម្ព & ដឹកជូន',
    description: 'We inspect, print on industrial machines, pack with care, and notify you when ready for pickup/delivery.',
    descriptionKm: 'យើងបោះពុម្ពលើម៉ាស៊ីនឧស្សាហកម្មទំនើប វេចខ្ចប់យ៉ាងស្អាត និងផ្ញើជូនអ្នកយ៉ាងរហ័ស។',
    iconName: 'Printer',
  },
];
