export interface FaqItem {
  question: string;
  questionKm?: string;
  answer: string;
  answerKm?: string;
  category?: string;
}

export const printingFaqs: FaqItem[] = [
  {
    question: 'What file formats do you accept for printing?',
    questionKm: 'តើហាងទទួលយកប្រភេទឯកសារឌីហ្សាញ (File format) អ្វីខ្លះ?',
    answer: 'We accept high-resolution PNG, JPG, PDF, SVG, AI, and PSD files up to 20MB. For best results, we recommend CMYK color mode and at least 300 DPI resolution.',
    answerKm: 'យើងទទួលយកឯកសារកម្រិតច្បាស់ខ្ពស់ដូចជា PNG, JPG, PDF, SVG, AI និង PSD ទំហំរហូតដល់ 20MB។ ដើម្បីទទួលបានពណ៌ស្អាតបំផុត យើងសូមណែនាំទម្រង់ពណ៌ CMYK និងកម្រិតភាពច្បាស់យ៉ាងតិច 300 DPI។',
    category: 'Artwork',
  },
  {
    question: 'How fast can I get my printed order?',
    questionKm: 'តើការបោះពុម្ពត្រូវចំណាយពេលប៉ុន្មានថ្ងៃទើបរួចរាល់?',
    answer: 'Most standard sticker, card, and poster orders are ready in 1 to 2 business days. Photo prints and rush orders can be processed same-day. Large banners or custom finishes may take 2 to 3 days.',
    answerKm: 'ការកុម្ម៉ង់ស្ទីគ័រ នាមប័ណ្ណ និងប័ណ្ណប្រកាសធម្មតា ប្រើពេលត្រឹមតែ ១ ទៅ ២ ថ្ងៃនៃថ្ងៃធ្វើការ។ ការព្រីនរូបថត ឬការកុម្ម៉ង់ប្រញាប់អាចធ្វើរួចរាល់ក្នុងថ្ងៃដដែល។ ចំណែកបដាធំៗ ឬការស្រោបពិសេសអាចប្រើពេល ២ ទៅ ៣ ថ្ងៃ។',
    category: 'Turnaround',
  },
  {
    question: 'What if I need help preparing cutlines or bleed area?',
    questionKm: 'ចុះបើខ្ញុំមិនចេះដាក់គែមស ឬកាត់គែមរូបភាព (Cutline)?',
    answer: 'No problem! Upload your graphic and mention your notes in the configuration. Our prepress team automatically adds free safe cut borders and checks alignment before printing.',
    answerKm: 'មិនបាច់បារម្ភទេ! គ្រាន់តែភ្ជាប់រូបភាពរបស់អ្នកមក ក្រុមការងាររចនារបស់យើងនឹងជួយរៀបចំគែមស និងសម្រួលកម្រិតច្បាស់ឱ្យអ្នកដោយឥតគិតថ្លៃមុនពេលដាក់ព្រីន។',
    category: 'Artwork',
  },
  {
    question: 'How does payment work for online orders?',
    questionKm: 'តើការទូទាត់ប្រាក់សម្រាប់ការកុម្ម៉ង់អនឡាញដំណើរការដូចម្តេច?',
    answer: 'You can pay instantly using KHQR (Bakong, ABA, Wing, ACLEDA), direct bank transfer, or choose Pay on Pickup / Cash on Delivery. When you submit your order, your status is recorded as PENDING until verified by our staff.',
    answerKm: 'អ្នកអាចទូទាត់ភ្លាមៗតាមរយៈ KHQR (Bakong, ABA, Wing, ACLEDA), ផ្ទេរតាមធនាគារផ្ទាល់ ឬជ្រើសរើសទូទាត់ពេលមកយកទំនិញ/ពេលដឹកជញ្ជូនដល់។ ពេលបញ្ជូនការកុម្ម៉ង់ ស្ថានភាពនឹងបង្ហាញជា "PENDING" រហូតដល់បុគ្គលិកយើងផ្ទៀងផ្ទាត់។',
    category: 'Payment',
  },
  {
    question: 'Can I pick up my order in person?',
    questionKm: 'តើខ្ញុំអាចទៅយកទំនិញដោយផ្ទាល់នៅហាងបានទេ?',
    answer: 'Yes! We offer free shop pickup at our Phnom Penh hub (Mon-Sat 8:00 AM - 6:30 PM). We also deliver nationwide via express door-to-door courier for a flat $2.00 fee (Free on orders over $50).',
    answerKm: 'បាទ/ចាស! អ្នកអាចមកទទួលយកដោយឥតគិតថ្លៃនៅហាងរបស់យើងនៅភ្នំពេញ (ច័ន្ទ-សៅរ៍ ៨:០០ ព្រឹក - ៦:៣០ ល្ងាច)។ យើងក៏មានសេវាដឹកជញ្ជូនរហ័សទូទាំងប្រទេសដោយគិតថ្លៃសេវាត្រឹមតែ $2.00 (ដឹកហ្វ្រីលើការកុម្ម៉ង់ចាប់ពី $50 ឡើងទៅ)។',
    category: 'Delivery',
  },
  {
    question: 'Can I order a custom quantity not listed?',
    questionKm: 'តើខ្ញុំអាចកុម្ម៉ង់ចំនួនផ្សេងដែលមិនមានក្នុងជម្រើសបានទេ?',
    answer: 'Yes! Simply use the custom quantity input box on any product configurator to enter your exact count and calculate your instant estimated price.',
    answerKm: 'បាន! អ្នកគ្រាន់តែបញ្ចូលចំនួនជាក់លាក់ដែលអ្នកចង់បានទៅក្នុងប្រអប់បញ្ចូលចំនួន នោះប្រព័ន្ធនឹងគណនាតម្លៃប៉ាន់ស្មានជូនអ្នកភ្លាមៗ។',
    category: 'Ordering',
  },
];
