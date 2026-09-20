'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOrderGuide, TourType } from '@/context/OrderGuideContext';
import { useLanguage } from '@/context/LanguageContext';
import { triggerConfetti } from '@/lib/confetti';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  MousePointer,
  HelpCircle,
  Zap,
  Layers,
  Maximize2,
  Sliders,
  UploadCloud,
  Package,
  FileCheck,
  CreditCard,
  Truck,
  Info,
  Eye,
  Settings2,
  Grid,
  Globe,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Send,
  Printer,
} from 'lucide-react';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius?: number;
}

interface TourStepDef {
  selector: string;
  icon: React.ComponentType<{ className?: string }>;
  titleEn: string;
  titleKm: string;
  descEn: string;
  descKm: string;
  pointsEn: string[];
  pointsKm: string[];
  actionTipEn?: string;
  actionTipKm?: string;
}

export const LiveSpotlightTour: React.FC = () => {
  const {
    isLiveTourActive,
    liveTourStep,
    liveTourType,
    stopLiveTour,
    nextLiveTourStep,
    prevLiveTourStep,
  } = useOrderGuide();
  const { lang, tObj } = useLanguage();

  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Tour steps definition - In-depth technical guide for all functions (NO EMOJIS)
  const tourSteps: TourStepDef[] = useMemo(() => {
    if (liveTourType === 'configurator') {
      return [
        {
          selector: '#tour-config-preview',
          icon: Eye,
          titleEn: '1. Live Artwork & Cutline Showcase',
          titleKm: '១. ការបង្ហាញប្លង់បោះពុម្ព & រូបរាងជាក់ស្តែង',
          descEn:
            'This interactive viewport displays a high-resolution preview of your artwork or selected template, showing aspect ratio and cutline orientation before production.',
          descKm:
            'ផ្ទាំងនេះបង្ហាញគំរូប្លង់បោះពុម្ពកម្រិតច្បាស់ខ្ពស់ ឬម៉ូដដែលអ្នកបានជ្រើសរើស ដោយបញ្ជាក់ពីសមាមាត្រ និងទម្រង់នៃការកាត់មុនពេលបោះពុម្ពពិតប្រាកដ។',
          pointsEn: [
            'Live rendering of uploaded artwork or 1-click template',
            'Pre-press cutline and bleed orientation verification',
            'Quality guarantee and turnaround time indicator',
          ],
          pointsKm: [
            'បង្ហាញរូបភាពដែលបានភ្ជាប់ ឬម៉ូដស្រាប់ភ្លាមៗ',
            'ផ្ទៀងផ្ទាត់ទម្រង់នៃការកាត់ និងគែមសុវត្ថិភាពមុនព្រីន',
            'ធានាគុណភាពបោះពុម្ព និងបញ្ជាក់រយៈពេលរួចរាល់',
          ],
          actionTipEn: 'Observe how the preview updates when you switch artwork or options.',
          actionTipKm: 'សង្កេតមើលរបៀបដែលរូបភាពប្រែប្រួលរាល់ពេលអ្នកប្តូរម៉ូដ ឬជម្រើស។',
        },
        {
          selector: '#tour-config-material',
          icon: Layers,
          titleEn: '2. Material & Substrate Engineering',
          titleKm: '២. ការជ្រើសរើសប្រភេទសម្ភារៈ & ក្រដាស',
          descEn:
            'Choose the substrate best engineered for your use case. Each material has distinct surface reflections, water resistance, and adhesive longevity.',
          descKm:
            'ជ្រើសរើសប្រភេទសម្ភារៈដែលត្រូវនឹងតម្រូវការប្រើប្រាស់របស់អ្នក។ សម្ភារៈនីមួយៗមានកម្រិតចំណាំងផ្លាត ភាពធន់នឹងទឹក និងកាវស្អិតខុសៗគ្នា។',
          pointsEn: [
            'Glossy Vinyl: 100% waterproof, tear-proof, vibrant color saturation',
            'Matte Vinyl: Anti-glare satin texture, executive elegance',
            'Kraft Paper: Vintage eco-friendly brown textured fiber',
          ],
          pointsKm: [
            'ស្ទីគ័ររលោង (Glossy): មិនជ្រាបទឹក ១០០% មិនរហែក ពណ៌ស្រស់ច្បាស់',
            'ស្ទីគ័រម៉ាត់ (Matte): ផ្ទៃរលោងទន់ភ្លឺស្រាល ថ្លៃថ្នូរ មិនចាំងពន្លឺ',
            'ក្រដាសត្នោត (Kraft): បែប Vintage បរិស្ថាន ស័ក្តិសមសម្រាប់កញ្ចប់ផលិតផល',
          ],
          actionTipEn: 'Click any material card to test dynamic material multiplier calculation.',
          actionTipKm: 'ចុចលើប្រភេទសម្ភារៈណាមួយដើម្បីសាកល្បងការគណនាមេគុណតម្លៃ។',
        },
        {
          selector: '#tour-config-size',
          icon: Maximize2,
          titleEn: '3. Dimensions, Sizing & Bleed Zones',
          titleKm: '៣. កំណត់ទំហំ ទទឹង & បណ្តោយ',
          descEn:
            'Select standard dimension presets or input custom width and height. The system calculates square area and print yield automatically.',
          descKm:
            'ជ្រើសរើសទំហំខ្នាតស្តង់ដារ ឬវាយបញ្ចូលទំហំទទឹង និងបណ្តោយជាក់ស្តែង។ ប្រព័ន្ធនឹងគណនាផ្ទៃក្រឡា និងបរិមាណបោះពុម្ពដោយស្វ័យប្រវត្តិ។',
          pointsEn: [
            'Standard sizes: 5x5 cm (cups/jars), 10x10 cm (boxes), A4 sheets',
            'Custom Dimensions: Enter exact width and height in centimeters',
            'Automatic area scaling applied directly to base price',
          ],
          pointsKm: [
            'ទំហំស្តង់ដារ៖ ៥x៥ ស.ម (កែវ/ដប), ១០x១០ ស.ម (ប្រអប់), សន្លឹក A4',
            'ទំហំផ្ទាល់ខ្លួន៖ កំណត់ទទឹង និងបណ្តោយជាក់ស្តែងតាមតម្រូវការ',
            'គណនាផ្ទៃក្រឡា និងបញ្ចូលទៅក្នុងតម្លៃដោយស្វ័យប្រវត្តិ',
          ],
          actionTipEn: 'Click a different size to watch the live unit price scale.',
          actionTipKm: 'ចុចប្តូរទំហំដើម្បីមើលការប្រែប្រួលតម្លៃក្នុងមួយបន្ទះ។',
        },
        {
          selector: '#tour-config-finishing',
          icon: Sliders,
          titleEn: '4. Protective Finishing & Textures',
          titleKm: '៤. ស្រទាប់ស្រោបការពារ UV & ទឹក',
          descEn:
            'Optional protective over-laminates shield the ink pigment from mechanical friction, liquid spills, and ultraviolet sunlight degradation.',
          descKm:
            'ស្រទាប់ស្រោបបន្ថែមជួយការពារទឹកថ្នាំពីការកកិត ជាតិទឹក និងកាំរស្មីព្រះអាទិត្យ UV មិនឱ្យស្លេកពណ៌។',
          pointsEn: [
            'Gloss Lamination: High-shine reflective gloss with scratch armor',
            'Matte Velvet: Soft-touch luxury finish that resists fingerprints',
            'Weatherproof UV barrier suitable for outdoor refrigeration & cups',
          ],
          pointsKm: [
            'ស្រោបរលោង (Glossy): ផ្ទៃភ្លឺចាំង ការពារការឆ្កូត និងភាពកខ្វក់',
            'ស្រោបម៉ាត់ (Matte): ផ្ទៃម៉ាត់ប្រណិត មិនជាប់ស្នាមក្រយៅដៃ',
            'ស្រទាប់ការពារ UV ស័ក្តិសមសម្រាប់ទំនិញក្លាសេ និងការប្រើក្រៅផ្ទះ',
          ],
          actionTipEn: 'Toggle finishing to see the per-unit addon reflected in the breakdown.',
          actionTipKm: 'ចុចជ្រើសរើសស្រទាប់ការពារដើម្បីឃើញតម្លៃបន្ថែមក្នុងមួយឯកតា។',
        },
        {
          selector: '#tour-config-quantity',
          icon: Package,
          titleEn: '5. Volume Quantity & Tiered Discounts',
          titleKm: '៥. ចំនួនបោះពុម្ព & តារាងបញ្ចុះតម្លៃ',
          descEn:
            'Commercial printing benefits from economies of scale. Selecting higher print quantities triggers automatic tiered volume discounts from 10% to 25%.',
          descKm:
            'ការបោះពុម្ពកាន់តែច្រើន ចំណាយកាន់តែទាប។ ការជ្រើសរើសចំនួនច្រើននឹងទទួលបានការបញ្ចុះតម្លៃស្វ័យប្រវត្តិចាប់ពី ១០% ដល់ ២៥%។',
          pointsEn: [
            'Quantity steppers: Adjust in increments or choose volume presets',
            '100 pcs: Standard base production unit price',
            '300+ pcs: 10% volume discount | 500+ pcs: 20% volume discount',
          ],
          pointsKm: [
            'ប៊ូតុងជ្រើសរើសចំនួន៖ អាចចុចជ្រើសរើសកញ្ចប់ ឬវាយបញ្ចូលចំនួនផ្ទាល់',
            '១០០ បន្ទះ៖ តម្លៃដើមស្តង់ដារសម្រាប់បោះពុម្ពគំរូ',
            '៣០០+ បន្ទះ៖ បញ្ចុះ ១០% | ៥០០+ បន្ទះ៖ បញ្ចុះ ២០% ភ្លាមៗ',
          ],
          actionTipEn: 'Select 300 or 500 pcs to see the bulk discount badge activate.',
          actionTipKm: 'ចុចរើស ៣០០ ឬ ៥០០ បន្ទះ ដើម្បីឃើញការបញ្ចុះតម្លៃដំណើរការ។',
        },
        {
          selector: '#tour-config-artwork',
          icon: UploadCloud,
          titleEn: '6. Artwork Upload & Studio Presets',
          titleKm: '៦. ភ្ជាប់ឯកសារឌីហ្សាញ ឬរើសម៉ូដស្រាប់',
          descEn:
            'RS Printer supports two paths: upload your own vector/raster print files, or select from curated 1-click industry templates that require zero design skills.',
          descKm:
            'RS Printer ផ្តល់ជម្រើសពីរ៖ ភ្ជាប់ឯកសារឌីហ្សាញផ្ទាល់ខ្លួន ឬជ្រើសរើសម៉ូដស្ទីគ័រអាជីវកម្មមានស្រាប់ ដោយមិនបាច់ចេះឌីហ្សាញ។',
          pointsEn: [
            'File Upload: PDF, AI, SVG, PNG, JPG (300 DPI high-res recommended)',
            'Free pre-press cutline and resolution check by technicians',
            '1-Click Templates: Ready designs for coffee, thank you, fragile stickers',
          ],
          pointsKm: [
            'ភ្ជាប់ឯកសារ៖ គាំទ្រ PDF, AI, SVG, PNG, JPG (កម្រិតច្បាស់ 300 DPI)',
            'ពិនិត្យប្លង់កាត់ និងកម្រិតច្បាស់ជូនដោយឥតគិតថ្លៃមុនបោះពុម្ព',
            'ម៉ូដមានស្រាប់៖ ស្ទីគ័របិទកែวกាហ្វេ អរគុណអតិថិជន និងប្រយ័ត្នបែក',
          ],
          actionTipEn: 'Toggle between the Ready Stickers and Custom Upload tabs.',
          actionTipKm: 'ចុចប្តូររវាងផ្ទាំង "ស្ទីគ័រមានស្រាប់" និង "ភ្ជាប់រូបផ្ទាល់ខ្លួន"។',
        },
        {
          selector: '#tour-config-notes',
          icon: Info,
          titleEn: '7. Special Instructions & Production Notes',
          titleKm: '៧. ចំណាំបន្ថែមសម្រាប់ជាងបោះពុម្ព',
          descEn:
            'Provide custom instructions to our print engineers, such as specific white ink underbase requirements, kiss-cut margins, or delivery timing preferences.',
          descKm:
            'បញ្ជាក់ការណែនាំបន្ថែមទៅកាន់ជាងបោះពុម្ព ដូចជាការដាក់ទឹកថ្នាំទ្រនាប់ស រឹមគម្លាតនៃការកាត់ ឬពេលវេលាដែលត្រូវការ។',
          pointsEn: [
            'Die-cut outline instructions (contour cut vs geometric shape)',
            'Sheet layout arrangement vs individual single-cut handouts',
            'Urgent delivery timeframe requests',
          ],
          pointsKm: [
            'បញ្ជាក់ទម្រង់កាត់ (កាត់តាមរាងឌីហ្សាញ ឬកាត់រាងមូល/ការ៉េ)',
            'ការរៀបជាសន្លឹកផ្ទាំង ឬកាត់ដាច់មួយៗសម្រាប់ចែកភ្ញៀវ',
            'សំណើសុំទទួលទំនិញប្រញាប់តាមកាលបរិច្ឆេទជាក់លាក់',
          ],
          actionTipEn: 'Leave any custom requests here before adding to cart.',
          actionTipKm: 'អាចកត់ត្រារាល់សំណើពិសេសរបស់អ្នកនៅទីនេះ។',
        },
        {
          selector: '#tour-config-price',
          icon: CreditCard,
          titleEn: '8. Real-Time Pricing Engine & Add to Cart',
          titleKm: '៨. ម៉ាស៊ីនគណនាតម្លៃភ្លាមៗ & ដាក់ចូលកន្ត្រក',
          descEn:
            'The pricing engine combines material factors, dimensions, finishing add-ons, and quantity tiers into a transparent total without staff delays.',
          descKm:
            'ម៉ាស៊ីនគណនាតម្លៃបញ្ចូលមេគុណសម្ភារៈ ទំហំ ការស្រោប និងចំនួនបញ្ចុះតម្លៃ ដើម្បីបង្ហាញតម្លៃសុក្រឹតភ្លាមៗដោយមិនបាច់រង់ចាំសម្រង់តម្លៃ។',
          pointsEn: [
            'Transparent breakdown: Unit base price, add-ons, and discounts',
            'Zero hidden fees: Exact production subtotal displayed live',
            'Click Add to Cart to store configuration and proceed to checkout',
          ],
          pointsKm: [
            'តម្លាភាពតម្លៃ៖ បង្ហាញតម្លៃដើមក្នុងមួយឯកតា ការស្រោប និងការបញ្ចុះ',
            'គ្មានការគិតថ្លៃលាក់បាំង៖ បង្ហាញតម្លៃពិតប្រាកដមុនពេលកុម្ម៉ង់',
            'ចុច Add to Cart ដើម្បីរក្សាទុកជម្រើស និងបន្តទៅកាន់ការទូទាត់',
          ],
          actionTipEn: 'Click Add to Cart when you are ready to review your order.',
          actionTipKm: 'ចុច Add to Cart នៅពេលអ្នកពេញចិត្តនឹងការកំណត់ដើម្បីបន្ត។',
        },
      ];
    }

    // Default: Homepage Platform Tour (NO EMOJIS)
    return [
      {
        selector: '#tour-hero-start',
        icon: Sparkles,
        titleEn: '1. Instant Order & Catalog Entry',
        titleKm: '១. ច្រកចូលកុម្ម៉ង់ & មើលផលិតផលទាំងអស់',
        descEn:
          'This primary call-to-action directs you straight to our comprehensive catalog of commercial printing products, packaging labels, and signage.',
        descKm:
          'ប៊ូតុងចម្បងនេះនឹងនាំអ្នកទៅកាន់កាតាឡុកផលិតផលបោះពុម្ពទាំងអស់ រួមមានស្ទីគ័រ ស្លាកសញ្ញា នាមប័ណ្ណ និងផ្ទាំងផ្សាយពាណិជ្ជកម្ម។',
        pointsEn: [
          'Immediate access to 8+ commercial printing categories',
          'Live filters by material, turnaround time, and price',
          'Same-day and 1-2 day fast production dispatch',
        ],
        pointsKm: [
          'ចូលមើលផលិតផលបោះពុម្ពពាណិជ្ជកម្មច្រើនជាង ៨ ប្រភេទ',
          'តម្រងស្វែងរកតាមសម្ភារៈ រយៈពេលបោះពុម្ព និងតម្លៃ',
          'សេវាកម្មរហ័ស៖ ផ្ញើជូនក្នុងថ្ងៃតែមួយ ឬក្នុងរយៈពេល ១-២ ថ្ងៃ',
        ],
        actionTipEn: 'Click here anytime to start selecting printing products.',
        actionTipKm: 'ចុចទីនេះបានគ្រប់ពេលដើម្បីចាប់ផ្តើមជ្រើសរើសផលិតផល។',
      },
      {
        selector: '#tour-how-it-works',
        icon: Settings2,
        titleEn: '2. Transparent 5-Step Fulfillment System',
        titleKm: '២. ដំណើរការងាយៗ ៥ ជំហានពេញលេញ',
        descEn:
          'Our standardized production pipeline guides orders from digital file submission through pre-press verification, industrial printing, and delivery.',
        descKm:
          'ប្រព័ន្ធបោះពុម្ពស្តង់ដាររបស់យើងធានាការត្រួតពិនិត្យប្លង់ ការបោះពុម្ពលើម៉ាស៊ីនឧស្សាហកម្ម និងការដឹកជញ្ជូនដល់ដៃអ្នកយ៉ាងរលូន។',
        pointsEn: [
          '1. Select product category and print specifications',
          '2. Configure materials, dimensions, and finishing textures',
          '3. Upload artwork (free resolution and cutline inspection)',
          '4. Select local delivery (Pickup, Door delivery, or VET Bus) and KHQR payment',
          '5. Automated production dispatch and live Telegram tracking',
        ],
        pointsKm: [
          '១. ជ្រើសរើសប្រភេទផលិតផលបោះពុម្ពដែលត្រូវការ',
          '២. កំណត់ប្រភេទក្រដាស ទំហំ និងស្រទាប់ស្រោបការពារ',
          '៣. ភ្ជាប់ឯកសារឌីហ្សាញ (ពិនិត្យប្លង់ និងកម្រិតច្បាស់ឥតគិតថ្លៃ)',
          '៤. ជ្រើសរើសការដឹកជញ្ជូន (មកយកផ្ទាល់, ដឹកដល់ផ្ទះ, ឡានក្រុង វីរៈ ប៊ុនថាំ) និងទូទាត់ KHQR',
          '៥. បញ្ជូនចូលម៉ាស៊ីនបោះពុម្ព និងតាមដានដំណាក់កាលតាម Telegram',
        ],
        actionTipEn: 'Click on any step card to open the interactive hands-on simulator.',
        actionTipKm: 'ចុចលើប័ណ្ណជំហាននីមួយៗដើម្បីបើកផ្ទាំងសាកល្បងជាក់ស្តែង។',
      },
      {
        selector: '#tour-nav-products',
        icon: Grid,
        titleEn: '3. Technical Products Navigation Menu',
        titleKm: '៣. ម៉ឺនុយកាតាឡុកផលិតផលបោះពុម្ព',
        descEn:
          'Access specific commercial printing categories directly from the persistent navigation bar on any page.',
        descKm:
          'ចូលមើលប្រភេទផលិតផលបោះពុម្ពជាក់លាក់បានគ្រប់ពេលវេលា ពីរបារម៉ឺនុយខាងលើនៃគ្រប់ទំព័រ។',
        pointsEn: [
          'Vinyl & Paper Stickers: Die-cut, kiss-cut, holographic, clear transparent',
          'Business Cards: Heavy 350gsm art card with velvet matte lamination',
          'Marketing Banners: Weatherproof tarpaulin with grommet eyelets',
          'Archival Photo Prints: Ultra HD photographic paper with fade resistance',
        ],
        pointsKm: [
          'ស្ទីគ័រ៖ កាត់ដាច់ កាត់សន្លឹក ស្ទីគ័រ 7 ពណ៌ (Holographic) និងស្ទីគ័រថ្លា',
          'នាមប័ណ្ណ៖ ក្រដាសក្រាស់ 350gsm ស្រោបម៉ាត់ប្រណិត មិនជ្រាបទឹក',
          'បដាផ្សាយពាណិជ្ជកម្ម៖ ផ្ទាំងតង់ក្រាស់ ធន់នឹងអាកាសធាតុ ដំឡើងកងស្រាប់',
          'រូបថត៖ ក្រដាសរូបថតជប៉ុន RC កម្រិត Ultra HD មិនស្លេកពណ៌ទោះបីរាប់ឆ្នាំ',
        ],
        actionTipEn: 'Use this menu to quickly jump across different product types.',
        actionTipKm: 'ប្រើម៉ឺនុយនេះដើម្បីរុករកផលិតផលផ្សេងៗបានយ៉ាងរហ័ស។',
      },
      {
        selector: '#tour-nav-theme-lang',
        icon: Globe,
        titleEn: '4. Khmer/English Localization & Dark Theme',
        titleKm: '៤. ប្តូរភាសាខ្មែរ/អង់គ្លេស & ផ្ទៃងងឹត/ពន្លឺ',
        descEn:
          'The entire platform provides seamless 1-click toggling between Khmer and English, along with dark and light themes for optimal viewing comfort.',
        descKm:
          'គេហទំព័រទាំងមូលគាំទ្រការប្តូរភាសារវាងភាសាខ្មែរ និងអង់គ្លេសភ្លាមៗ ព្រមទាំងមានមុខងារប្តូរពណ៌ផ្ទៃងងឹត និងពន្លឺដើម្បីងាយស្រួលមើលគ្រប់ពេល។',
        pointsEn: [
          'Instant bilingual translation across catalogs, options, and receipts',
          'Preserves your language and theme preferences in local storage',
          'Clean typography optimized for Khmer Unicode scripts',
        ],
        pointsKm: [
          'បកប្រែភ្លាមៗគ្រប់ទំព័រ រួមទាំងកាតាឡុក ជម្រើស និងវិក្កយបត្រ',
          'ចងចាំការកំណត់ភាសា និងពណ៌ផ្ទៃរបស់អ្នកដោយស្វ័យប្រវត្តិ',
          'ពុម្ពអក្សរច្បាស់ស្អាត និងងាយស្រួលអានសម្រាប់អក្សរខ្មែរ',
        ],
        actionTipEn: 'Try clicking the language or theme buttons to toggle appearance.',
        actionTipKm: 'សាកល្បងចុចប៊ូតុងភាសា ឬប៊ូតុងរូបព្រះអាទិត្យ/ព្រះច័ន្ទដើម្បីប្តូរទម្រង់។',
      },
      {
        selector: '#tour-nav-cart',
        icon: ShoppingBag,
        titleEn: '5. Shopping Cart & Localized Checkout',
        titleKm: '៥. កន្ត្រកទំនិញ & ការទូទាត់ក្នុងស្រុក',
        descEn:
          'Review configured specifications, attached artwork files, and proceed through our Cambodia-tailored checkout pipeline.',
        descKm:
          'ពិនិត្យមើលលក្ខណៈបច្ចេកទេសដែលបានកំណត់ ឯកសារភ្ជាប់ និងបន្តទៅកាន់ការទូទាត់ដែលបង្កើតឡើងសម្រាប់ទីផ្សារកម្ពុជា។',
        pointsEn: [
          'Persistent local storage: Saved items and artwork remain across sessions',
          'Delivery: Shop Pickup, Phnom Penh Door Delivery, or Vireak Buntham Bus',
          'Payment: Bakong KHQR (universal scan) and ABA Bank transfer',
          'Automated Telegram Bot order invoice and confirmation alerts',
        ],
        pointsKm: [
          'រក្សាទុកទំនិញ និងឯកសារដោយស្វ័យប្រវត្តិកុំឱ្យបាត់បង់',
          'ដឹកជញ្ជូន៖ មកយកនៅហាង, ដឹកដល់ផ្ទះភ្នំពេញ, ឬឡានក្រុង វីរៈ ប៊ុនថាំ',
          'ការទូទាត់៖ ស្កេន Bakong KHQR គ្រប់ធនាគារ និងផ្ទេរតាម ABA',
          'វិក្កយបត្រស្វ័យប្រវត្តិ និងការជូនដំណឹងតាម Telegram ភ្លាមៗ',
        ],
        actionTipEn: 'Click the cart icon anytime to manage your selected print orders.',
        actionTipKm: 'ចុចរូបកន្ត្រកដើម្បីពិនិត្យ និងកែសម្រួលទំនិញដែលបានកុម្ម៉ង់។',
      },
    ];
  }, [liveTourType]);

  const currentStepData = tourSteps[liveTourStep] || tourSteps[0];
  const isLastStep = liveTourStep >= tourSteps.length - 1;
  const StepIcon = currentStepData.icon;

  // Update spotlight coordinates
  const updateRect = useCallback(() => {
    if (!isLiveTourActive || !currentStepData) return;

    const el = document.querySelector(currentStepData.selector);
    if (el) {
      const b = el.getBoundingClientRect();
      const padding = 8;
      setRect({
        top: Math.max(0, b.top - padding),
        left: Math.max(0, b.left - padding),
        width: b.width + padding * 2,
        height: b.height + padding * 2,
        borderRadius: 16,
      });

      // Smooth scroll if element is far from viewport center
      const inView = b.top >= 60 && b.bottom <= window.innerHeight - 60;
      if (!inView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Fallback center box if element not present on current viewport
      setRect({
        top: window.innerHeight / 2 - 80,
        left: window.innerWidth / 2 - 160,
        width: 320,
        height: 160,
        borderRadius: 16,
      });
    }
  }, [isLiveTourActive, currentStepData]);

  // Window resize & scroll listener
  useEffect(() => {
    if (!isLiveTourActive) return;

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResizeOrScroll = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateRect();
    };

    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    // Initial update with small delay to allow smooth DOM scroll
    const timer = setTimeout(updateRect, 60);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
      clearTimeout(timer);
    };
  }, [isLiveTourActive, updateRect, liveTourStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLiveTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopLiveTour();
      if (e.key === 'ArrowRight' && !isLastStep) nextLiveTourStep();
      if (e.key === 'ArrowLeft' && liveTourStep > 0) prevLiveTourStep();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLiveTourActive, isLastStep, liveTourStep, nextLiveTourStep, prevLiveTourStep, stopLiveTour]);

  if (!isLiveTourActive || !rect) return null;

  // Calculate Popover Position (smart placement: below if fits, else above)
  const popoverWidth = Math.min(420, windowSize.width - 32);
  const popoverHeight = 310;
  const margin = 14;

  let popoverTop = rect.top + rect.height + margin;
  let popoverLeft = Math.max(
    16,
    Math.min(windowSize.width - popoverWidth - 16, rect.left + rect.width / 2 - popoverWidth / 2)
  );

  // If clipping at the bottom, flip to above the spotlight
  if (popoverTop + popoverHeight > windowSize.height - 20) {
    popoverTop = Math.max(16, rect.top - popoverHeight - margin);
  }

  const handleFinish = () => {
    triggerConfetti();
    stopLiveTour();
  };

  const progressPercent = Math.round(((liveTourStep + 1) / tourSteps.length) * 100);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto select-none transition-all duration-300">
      {/* 1. SVG Cutout Mask (Dark Blurred Background + Illuminated Cutout) */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <mask id="spotlight-cutout-mask">
            {/* White background: fully visible dark overlay */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout: reveals the underlying page element with full clarity */}
            <rect
              x={rect.left}
              y={rect.top}
              width={rect.width}
              height={rect.height}
              rx={rect.borderRadius || 16}
              ry={rect.borderRadius || 16}
              fill="black"
              className="transition-all duration-300 ease-out"
            />
          </mask>
        </defs>

        {/* Backdrop Gray/Dark with Backdrop Blur */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.78)"
          mask="url(#spotlight-cutout-mask)"
          className="backdrop-blur-[2.5px] transition-all duration-300"
        />
      </svg>

      {/* 2. Glowing Neon Spotlight Ring around the Target Element */}
      <div
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: `${rect.borderRadius || 16}px`,
          boxShadow: '0 0 0 3px #0284c7, 0 0 25px 5px rgba(2, 132, 199, 0.55)',
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden="true"
      >
        {/* Beacon Tag on Spotlight Corner (NO EMOJIS) */}
        <div className="absolute -top-3.5 -right-2 bg-brand-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
          <MousePointer className="w-2.5 h-2.5" />
          <span>{tObj('Active Element', 'ប៊ូតុងជាក់ស្តែង')}</span>
        </div>
      </div>

      {/* 3. Floating Modern Detailed Popover Card */}
      <div
        style={{
          position: 'fixed',
          top: popoverTop,
          left: popoverLeft,
          width: popoverWidth,
          zIndex: 10001,
          transition: 'top 0.3s ease, left 0.3s ease',
        }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-5 text-slate-900 dark:text-white space-y-3.5 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto scrollbar-none"
      >
        {/* Progress Bar & Header Row */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <StepIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                {tObj(
                  `Step ${liveTourStep + 1} of ${tourSteps.length}`,
                  `ជំហានទី ${liveTourStep + 1} នៃ ${tourSteps.length}`
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                {progressPercent}%
              </span>
              <button
                onClick={stopLiveTour}
                aria-label="Exit Live Tour"
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thin Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Title & Technical Description */}
        <div>
          <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{tObj(currentStepData.titleEn, currentStepData.titleKm)}</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            {tObj(currentStepData.descEn, currentStepData.descKm)}
          </p>
        </div>

        {/* Technical Sub-Points Checklist (Detailed Information) */}
        <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-2.5 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          {(lang === 'km' ? currentStepData.pointsKm : currentStepData.pointsEn).map(
            (pt, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{pt}</span>
              </div>
            )
          )}
        </div>

        {/* Interactive Action Tip Banner */}
        {(currentStepData.actionTipEn || currentStepData.actionTipKm) && (
          <div className="p-2 rounded-xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-900/50 text-[11px] text-brand-800 dark:text-brand-300 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{tObj(currentStepData.actionTipEn || '', currentStepData.actionTipKm || '')}</span>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={prevLiveTourStep}
            disabled={liveTourStep === 0}
            className={`text-xs font-bold flex items-center gap-1 transition-all ${
              liveTourStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{tObj('Back', 'ថយក្រោយ')}</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1">
            {tourSteps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  liveTourStep === idx
                    ? 'w-4 bg-brand-600 dark:bg-brand-400'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Next or Finish Button */}
          {isLastStep ? (
            <button
              onClick={handleFinish}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{tObj('Finish Tour', 'បញ្ចប់ការណែនាំ')}</span>
            </button>
          ) : (
            <button
              onClick={nextLiveTourStep}
              className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <span>{tObj('Next Step', 'ជំហានបន្ទាប់')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
