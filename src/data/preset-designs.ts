export interface PresetDesign {
  id: string;
  name: string;
  nameKm: string;
  category: 'cafe' | 'cute' | 'packaging' | 'tech' | 'aesthetic' | 'bakery';
  tag: string;
  tagKm: string;
  badgeColor?: string;
  description: string;
  descriptionKm: string;
  svgDataUri: string;
  recommendedMaterialId?: string;
  recommendedSizeId?: string;
}

export interface PresetCategory {
  id: 'all' | 'cafe' | 'cute' | 'packaging' | 'tech' | 'aesthetic' | 'bakery';
  name: string;
  nameKm: string;
  icon: string;
}

export const PRESET_CATEGORIES: PresetCategory[] = [
  { id: 'all', name: 'All Designs', nameKm: 'ទាំងអស់', icon: 'Sparkles' },
  { id: 'cafe', name: 'Coffee & Cafe', nameKm: 'ហាងកាហ្វេ & ភេសជ្ជៈ', icon: 'Coffee' },
  { id: 'cute', name: 'Cute Mascots', nameKm: 'តុក្កតា & សត្វគួរឱ្យស្រលាញ់', icon: 'Smile' },
  { id: 'packaging', name: 'Packaging & Fragile', nameKm: 'កញ្ចប់បញ្ញើ & ការពារបែក', icon: 'Package' },
  { id: 'tech', name: 'Tech & Dev', nameKm: 'តិចណូឡូជី & កូដ', icon: 'Terminal' },
  { id: 'aesthetic', name: 'Aesthetic & Art', nameKm: 'សិល្បៈទាន់សម័យ', icon: 'Palette' },
  { id: 'bakery', name: 'Bakery & Food', nameKm: 'នំប៉័ង & ម្ហូប', icon: 'Utensils' },
];

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// 1. Cafe & Drinks
const svgArtisanCoffee = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-1" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="c-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="c-crema" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <!-- Die-cut white border contour -->
  <path d="M60 110 C60 90 90 85 110 85 L180 85 C235 85 245 120 245 145 C245 175 220 185 190 185 L185 185 C175 225 145 240 105 240 C65 240 45 210 50 170 C48 140 52 120 60 110 Z" fill="#ffffff" filter="url(#sticker-shadow-1)"/>
  
  <!-- Outer Cup Silhouette -->
  <path d="M70 120 L175 120 C170 195 150 225 105 225 C65 225 65 185 70 120 Z" fill="url(#c-grad1)"/>
  <!-- Handle -->
  <path d="M168 132 C195 132 225 135 225 152 C225 170 195 174 168 174" fill="none" stroke="url(#c-grad1)" stroke-width="16" stroke-linecap="round"/>
  <path d="M168 132 C195 132 225 135 225 152 C225 170 195 174 168 174" fill="none" stroke="#fef3c7" stroke-width="6" stroke-linecap="round"/>
  
  <!-- Crema / Latte Art Top -->
  <ellipse cx="122" cy="120" rx="46" ry="14" fill="url(#c-crema)"/>
  <!-- Latte Art Heart -->
  <path d="M122 126 C115 118 107 117 107 113 C107 110 111 108 114 110 C118 113 122 118 122 118 C122 118 126 113 130 110 C133 108 137 110 137 113 C137 117 129 118 122 126 Z" fill="#ffffff"/>

  <!-- Steam curves -->
  <path d="M100 95 Q105 75 95 60" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M125 90 Q135 68 125 50" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M150 95 Q142 75 152 60" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none"/>
  
  <!-- Badge text inside cup -->
  <rect x="75" y="160" width="80" height="24" rx="12" fill="#fef3c7"/>
  <text x="115" y="176" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#78350f" text-anchor="middle">COFFEE</text>
</svg>`;

const svgBobaCat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-2" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="boba-cup-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
  </defs>
  <!-- White Contour Die-cut Border -->
  <rect x="52" y="32" width="196" height="236" rx="55" fill="#ffffff" filter="url(#sticker-shadow-2)"/>
  
  <!-- Cup Body -->
  <path d="M85 95 L215 95 L195 240 C195 252 180 255 150 255 C120 255 105 252 105 240 Z" fill="url(#boba-cup-grad)"/>
  <!-- Cup Rim -->
  <rect x="78" y="86" width="144" height="15" rx="7.5" fill="#c2410c"/>
  <!-- Giant Boba Straw -->
  <line x1="168" y1="42" x2="148" y2="120" stroke="#7c2d12" stroke-width="16" stroke-linecap="round"/>
  <line x1="168" y1="42" x2="148" y2="120" stroke="#f97316" stroke-width="10" stroke-linecap="round"/>

  <!-- Smiling Cat Ears poking out of the milk foam -->
  <polygon points="98,90 114,60 130,90" fill="#fed7aa" stroke="#c2410c" stroke-width="4"/>
  <polygon points="170,90 186,60 202,90" fill="#fed7aa" stroke="#c2410c" stroke-width="4"/>
  <polygon points="103,88 114,68 125,88" fill="#fda4af"/>
  <polygon points="175,88 186,68 197,88" fill="#fda4af"/>

  <!-- Cute Cat Face on Cup -->
  <circle cx="125" cy="142" r="5" fill="#431407"/>
  <circle cx="175" cy="142" r="5" fill="#431407"/>
  <!-- Rosy cheeks -->
  <ellipse cx="112" cy="150" rx="7" ry="4" fill="#fb7185" opacity="0.8"/>
  <ellipse cx="188" cy="150" rx="7" ry="4" fill="#fb7185" opacity="0.8"/>
  <!-- W-smile -->
  <path d="M140 148 Q145 155 150 150 Q155 155 160 148" fill="none" stroke="#431407" stroke-width="3" stroke-linecap="round"/>

  <!-- Tapioca Pearls at bottom -->
  <circle cx="120" cy="225" r="11" fill="#451a03"/>
  <circle cx="148" cy="235" r="12" fill="#291102"/>
  <circle cx="176" cy="223" r="11" fill="#451a03"/>
  <circle cx="132" cy="204" r="10" fill="#291102"/>
  <circle cx="162" cy="206" r="10" fill="#451a03"/>
  <!-- Pearl Shine -->
  <circle cx="117" cy="221" r="3" fill="#ffffff" opacity="0.6"/>
  <circle cx="145" cy="231" r="3" fill="#ffffff" opacity="0.6"/>
  <circle cx="173" cy="219" r="3" fill="#ffffff" opacity="0.6"/>
</svg>`;

const svgMatchaCup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-3" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="matcha-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  <!-- White Contour -->
  <ellipse cx="150" cy="155" rx="105" ry="85" fill="#ffffff" filter="url(#sticker-shadow-3)"/>
  
  <!-- Matcha Bowl -->
  <path d="M72 135 C72 210 105 225 150 225 C195 225 228 210 228 135 Z" fill="#0f172a"/>
  <!-- Matcha Liquid -->
  <ellipse cx="150" cy="135" rx="72" ry="24" fill="url(#matcha-grad)"/>
  <!-- Foam Swirl -->
  <ellipse cx="150" cy="135" rx="50" ry="14" fill="#86efac" opacity="0.7"/>
  <circle cx="142" cy="133" r="6" fill="#bbf7d0"/>
  <circle cx="160" cy="137" r="4" fill="#bbf7d0"/>
  
  <!-- Whisk handle icon in background -->
  <rect x="144" y="65" width="12" height="35" rx="6" fill="#b45309"/>
  
  <rect x="100" y="172" width="100" height="22" rx="11" fill="#22c55e"/>
  <text x="150" y="187" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff" text-anchor="middle">MATCHA TEA</text>
</svg>`;

// 2. Cute Mascots & Animals
const svgLuckyCat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-4" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- White Die-cut Border -->
  <path d="M70 120 C60 70 100 40 125 50 C140 35 160 35 175 50 C200 40 240 70 230 120 C245 140 250 180 240 230 C220 260 80 260 60 230 C50 180 55 140 70 120 Z" fill="#ffffff" filter="url(#sticker-shadow-4)"/>

  <!-- Body -->
  <ellipse cx="150" cy="170" rx="75" ry="75" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3"/>

  <!-- Ears with Pink Inside -->
  <polygon points="85,115 105,55 130,95" fill="#ef4444"/>
  <polygon points="92,108 105,68 122,95" fill="#fecaca"/>
  
  <polygon points="170,95 195,55 215,115" fill="#ef4444"/>
  <polygon points="178,95 195,68 208,108" fill="#fecaca"/>

  <!-- Red Collar & Golden Bell -->
  <path d="M100 170 Q150 195 200 170" stroke="#dc2626" stroke-width="14" fill="none" stroke-linecap="round"/>
  <circle cx="150" cy="184" r="15" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
  <circle cx="150" cy="184" r="4" fill="#713f12"/>

  <!-- Smiling Eyes -->
  <path d="M110 135 Q125 122 140 135" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
  <path d="M160 135 Q175 122 190 135" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
  
  <!-- Whiskers -->
  <line x1="85" y1="140" x2="65" y2="135" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="85" y1="148" x2="65" y2="152" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="215" y1="140" x2="235" y2="135" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="215" y1="148" x2="235" y2="152" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>

  <!-- Waving Lucky Paw (Right) -->
  <ellipse cx="215" cy="105" rx="16" ry="24" transform="rotate(-20 215 105)" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
  <circle cx="218" cy="95" r="5" fill="#fecaca"/>

  <!-- Big Gold Koban Coin in Left Paw -->
  <ellipse cx="130" cy="210" rx="22" ry="30" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
  <text x="130" y="217" font-family="sans-serif" font-weight="900" font-size="16" fill="#854d0e" text-anchor="middle">億</text>
</svg>`;

const svgHappyCorgi = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-5" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="corgi-fur" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <!-- Die-cut White Outline -->
  <path d="M55 75 C40 30 95 30 110 70 C135 60 165 60 190 70 C205 30 260 30 245 75 C265 140 250 240 190 250 C150 255 110 250 55 240 C40 180 40 120 55 75 Z" fill="#ffffff" filter="url(#sticker-shadow-5)"/>
  
  <!-- Corgi Big Ears -->
  <polygon points="65,95 85,35 115,85" fill="url(#corgi-fur)"/>
  <polygon points="75,90 88,48 108,82" fill="#fecdd3"/>
  
  <polygon points="185,85 215,35 235,95" fill="url(#corgi-fur)"/>
  <polygon points="192,82 212,48 225,90" fill="#fecdd3"/>

  <!-- Head Fur -->
  <circle cx="150" cy="145" r="72" fill="url(#corgi-fur)"/>
  <!-- White Blaze down face -->
  <path d="M142 85 L158 85 L175 185 L125 185 Z" fill="#ffffff"/>
  
  <!-- Cute Eyes -->
  <circle cx="118" cy="132" r="8" fill="#1e1b4b"/>
  <circle cx="120" cy="130" r="3" fill="#ffffff"/>
  <!-- Wink on right eye -->
  <path d="M172 135 Q182 124 192 135" fill="none" stroke="#1e1b4b" stroke-width="5" stroke-linecap="round"/>

  <!-- Pink Cheek Blush -->
  <ellipse cx="102" cy="150" rx="9" ry="5" fill="#fda4af"/>
  <ellipse cx="198" cy="150" rx="9" ry="5" fill="#fda4af"/>

  <!-- Snout & Tongue -->
  <ellipse cx="150" cy="162" rx="18" ry="12" fill="#1e1b4b"/>
  <path d="M142 170 C142 192 158 192 158 170 Z" fill="#f43f5e"/>
</svg>`;

// 3. Packaging & Fragile Stickers
const svgFragileHandleWithCare = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-6" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
  </defs>
  <!-- White sticker base with round corners -->
  <rect x="35" y="35" width="230" height="230" rx="28" fill="#ffffff" filter="url(#sticker-shadow-6)"/>
  <!-- Red Warning Border Box -->
  <rect x="47" y="47" width="206" height="206" rx="20" fill="#dc2626"/>

  <!-- Broken Wine Glass Graphic -->
  <g transform="translate(150, 115) scale(0.9)" stroke="#ffffff" stroke-width="6" fill="#ffffff">
    <!-- Top Cup with crack -->
    <path d="M-40 -35 L40 -35 C40 5 15 25 0 28 C-15 25 -40 5 -40 -35 Z" fill="#ffffff"/>
    <!-- Black crack line -->
    <path d="M0 -35 L-8 -15 L8 -2 L-2 15" stroke="#dc2626" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Stem -->
    <line x1="0" y1="28" x2="0" y2="60" stroke="#ffffff" stroke-width="9"/>
    <!-- Base -->
    <ellipse cx="0" cy="62" rx="32" ry="7" fill="#ffffff"/>
  </g>

  <!-- Bilingual Text -->
  <text x="150" y="205" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="1">FRAGILE</text>
  <text x="150" y="228" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#fee2e2" text-anchor="middle">HANDLE WITH CARE • ប្រយ័ត្នបែក</text>
</svg>`;

const svgThankYouFloral = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-7" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="rose-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff1f2"/>
      <stop offset="100%" stop-color="#ffe4e6"/>
    </linearGradient>
  </defs>
  <!-- Die-cut round circle -->
  <circle cx="150" cy="150" r="115" fill="#ffffff" filter="url(#sticker-shadow-7)"/>
  <!-- Rose Gold Soft Background -->
  <circle cx="150" cy="150" r="102" fill="url(#rose-gold)"/>
  <!-- Gold Dotted Inner Border -->
  <circle cx="150" cy="150" r="92" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="4 4"/>
  
  <!-- Heart icon -->
  <path d="M150 102 C146 95 138 92 132 96 C125 101 125 110 132 116 L150 132 L168 116 C175 110 175 101 168 96 C162 92 154 95 150 102 Z" fill="#e11d48"/>

  <text x="150" y="156" font-family="Georgia, serif" font-weight="bold" font-style="italic" font-size="28" fill="#881337" text-anchor="middle">Thank You</text>
  <text x="150" y="178" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#9f1239" text-anchor="middle" letter-spacing="1">FOR SUPPORTING</text>
  <text x="150" y="194" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#be123c" text-anchor="middle">MY SMALL BUSINESS</text>
  <text x="150" y="214" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#e11d48" text-anchor="middle">អរគុណសម្រាប់ការគាំទ្រ</text>
</svg>`;

const svgHandmadeWithLove = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-8" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- Scalloped Stamp Die-Cut Border -->
  <circle cx="150" cy="150" r="115" fill="#ffffff" filter="url(#sticker-shadow-8)"/>
  <circle cx="150" cy="150" r="102" fill="#78350f"/>
  <circle cx="150" cy="150" r="94" fill="none" stroke="#fef3c7" stroke-width="3" stroke-dasharray="6 3"/>

  <!-- Heart with needle/thread -->
  <path d="M150 95 C142 85 128 85 120 95 C110 108 115 122 125 132 L150 155 L175 132 C185 122 190 108 180 95 C172 85 158 85 150 95 Z" fill="#f59e0b"/>
  
  <text x="150" y="185" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">HANDMADE</text>
  <text x="150" y="204" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#fde68a" text-anchor="middle">WITH LOVE</text>
  <text x="150" y="224" font-family="system-ui, sans-serif" font-weight="600" font-size="10" fill="#fef3c7" text-anchor="middle">100% ធ្វើដោយដៃ</text>
</svg>`;

// 4. Tech & Dev
const svgEatSleepCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-9" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Laptop Sticker Contour -->
  <rect x="40" y="55" width="220" height="190" rx="30" fill="#ffffff" filter="url(#sticker-shadow-9)"/>
  <!-- Dark Terminal Surface -->
  <rect x="52" y="67" width="196" height="166" rx="22" fill="#090d16"/>
  <!-- Terminal Header Dots -->
  <circle cx="72" cy="85" r="5" fill="#ef4444"/>
  <circle cx="87" cy="85" r="5" fill="#f59e0b"/>
  <circle cx="102" cy="85" r="5" fill="#10b981"/>

  <!-- Code Syntax Highlighting -->
  <text x="70" y="125" font-family="monospace" font-weight="900" font-size="16" fill="#38bdf8">&gt; const life =</text>
  <text x="70" y="152" font-family="monospace" font-weight="900" font-size="16" fill="#f43f5e">[&quot;Eat&quot;, &quot;Sleep&quot;,</text>
  <text x="70" y="178" font-family="monospace" font-weight="900" font-size="18" fill="#4ade80">&quot;Code&quot;, &quot;Repeat&quot;];</text>
  <text x="70" y="210" font-family="monospace" font-weight="700" font-size="14" fill="#fbbf24">life.loop(); // Dev</text>
</svg>`;

const svgShipItRocket = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-10" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.2"/>
    </filter>
    <linearGradient id="rocket-sky" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <!-- Hexagon Contour -->
  <polygon points="150,30 245,85 245,215 150,270 55,215 55,85" fill="#ffffff" filter="url(#sticker-shadow-10)"/>
  <polygon points="150,42 233,90 233,210 150,258 67,210 67,90" fill="url(#rocket-sky)"/>
  
  <!-- Rocket in 45-degree angle -->
  <g transform="translate(150, 140) rotate(45) scale(1.1)">
    <!-- Exhaust Flames -->
    <polygon points="-8,50 0,75 8,50" fill="#f97316"/>
    <polygon points="-5,50 0,65 5,50" fill="#facc15"/>
    <!-- Rocket Body -->
    <path d="M0 -45 C18 -20 22 25 18 50 L-18 50 C-22 25 -18 -20 0 -45 Z" fill="#f8fafc"/>
    <path d="M0 -45 C9 -20 11 25 9 50 L-9 50 C-11 25 -9 -20 0 -45 Z" fill="#ef4444"/>
    <!-- Window -->
    <circle cx="0" cy="0" r="10" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
    <!-- Fins -->
    <polygon points="-18,25 -32,48 -18,48" fill="#dc2626"/>
    <polygon points="18,25 32,48 18,48" fill="#dc2626"/>
  </g>

  <!-- Stars -->
  <circle cx="95" cy="110" r="3" fill="#facc15"/>
  <circle cx="195" cy="100" r="4" fill="#facc15"/>
  <circle cx="210" cy="180" r="2.5" fill="#ffffff"/>

  <!-- Badge text -->
  <rect x="95" y="215" width="110" height="26" rx="13" fill="#ef4444"/>
  <text x="150" y="233" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle">SHIP IT!</text>
</svg>`;

// 5. Aesthetic & Quotes
const svgGoodVibesRainbow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-11" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- Die-cut oval contour -->
  <ellipse cx="150" cy="150" rx="115" ry="110" fill="#ffffff" filter="url(#sticker-shadow-11)"/>
  <!-- Sunset Retro Background -->
  <ellipse cx="150" cy="150" rx="104" ry="98" fill="#fffbeb"/>

  <!-- 70s Rainbow Arcs -->
  <path d="M75 160 A75 75 0 0 1 225 160" fill="none" stroke="#f43f5e" stroke-width="14" stroke-linecap="round"/>
  <path d="M89 160 A61 61 0 0 1 211 160" fill="none" stroke="#fb923c" stroke-width="14" stroke-linecap="round"/>
  <path d="M103 160 A47 47 0 0 1 197 160" fill="none" stroke="#facc15" stroke-width="14" stroke-linecap="round"/>

  <!-- Typography Badge -->
  <rect x="70" y="172" width="160" height="42" rx="21" fill="#0f172a"/>
  <text x="150" y="198" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#facc15" text-anchor="middle" letter-spacing="1">GOOD VIBES ONLY</text>
  <text x="150" y="235" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle">អារម្មណ៍ល្អជានិច្ច</text>
</svg>`;

const svgGoldenStarVip = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-12" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <!-- Die-cut star contour -->
  <polygon points="150,22 188,98 274,106 208,162 228,246 150,202 72,246 92,162 26,106 112,98" fill="#ffffff" stroke="#ffffff" stroke-width="14" stroke-linejoin="round" filter="url(#sticker-shadow-12)"/>
  <polygon points="150,28 186,102 270,110 206,164 224,244 150,202 76,244 94,164 30,110 114,102" fill="url(#gold-grad)"/>

  <!-- Inner Sparkle -->
  <circle cx="150" cy="145" r="42" fill="#713f12" opacity="0.3"/>
  <text x="150" y="145" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">VIP</text>
  <text x="150" y="165" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#fef08a" text-anchor="middle">PREMIUM</text>
</svg>`;

// 6. Bakery & Food
const svgButterCroissant = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-13" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="cr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Die-cut crescent contour -->
  <path d="M50 160 C50 90 120 70 150 70 C180 70 250 90 250 160 C240 210 180 230 150 230 C120 230 60 210 50 160 Z" fill="#ffffff" filter="url(#sticker-shadow-13)"/>

  <!-- Flaky Crescent Segments -->
  <ellipse cx="150" cy="148" rx="72" ry="52" fill="url(#cr-grad)"/>
  <path d="M120 112 C140 102 160 102 180 112 C185 135 185 165 178 185 C160 195 140 195 122 185 Z" fill="#d97706"/>
  <path d="M136 110 C146 104 154 104 164 110 C168 135 168 165 164 185 C154 190 146 190 136 185 Z" fill="#b45309"/>

  <!-- Butter tag -->
  <rect x="95" y="195" width="110" height="24" rx="12" fill="#fef3c7"/>
  <text x="150" y="211" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#78350f" text-anchor="middle">FRESH CROISSANT</text>
</svg>`;

const svgPizzaSlice = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="sticker-shadow-14" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- Die-cut triangle contour -->
  <polygon points="150,45 245,230 55,230" fill="#ffffff" stroke="#ffffff" stroke-width="16" stroke-linejoin="round" filter="url(#sticker-shadow-14)"/>
  
  <!-- Crust -->
  <path d="M68 220 Q150 240 232 220 L232 205 Q150 220 68 205 Z" fill="#b45309"/>
  <!-- Cheese Body -->
  <polygon points="150,55 230,210 70,210" fill="#facc15"/>

  <!-- Pepperoni Slices -->
  <circle cx="150" cy="115" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
  <circle cx="120" cy="165" r="15" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
  <circle cx="180" cy="165" r="15" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>

  <!-- Herbs / Olives -->
  <circle cx="140" cy="140" r="4" fill="#15803d"/>
  <circle cx="165" cy="135" r="3.5" fill="#15803d"/>
  <circle cx="150" cy="185" r="4" fill="#15803d"/>
</svg>`;

export const PRESET_DESIGNS: PresetDesign[] = [
  // 1. Cafe & Drinks
  {
    id: 'preset-artisan-coffee',
    name: 'Artisan Espresso Coffee Cup',
    nameKm: 'កែវកាហ្វេឡាតេបែបសិល្បៈ (Coffee Cup)',
    category: 'cafe',
    tag: 'Best Seller',
    tagKm: 'ពេញនិយមបំផុត',
    badgeColor: 'amber',
    description: 'Fresh roast hot latte with heart foam art. Perfect for cafe packaging, cups, and laptop covers.',
    descriptionKm: 'កាហ្វេឡាតេស្រស់ៗ ជាមួយសិល្បៈពពុះរូបបេះដូង។ ស័ក្តិសមបំផុតសម្រាប់បិទកែវកាហ្វេ ប្រអប់ ឬកុំព្យូទ័រ។',
    svgDataUri: svgToDataUri(svgArtisanCoffee),
    recommendedMaterialId: 'glossy-vinyl',
    recommendedSizeId: '6x6',
  },
  {
    id: 'preset-boba-cat',
    name: 'Cute Boba Milk Tea Cat',
    nameKm: 'ឆ្មាតែគុជបូបា (Cute Boba Cat)',
    category: 'cafe',
    tag: 'Trending',
    tagKm: 'កំពុងពេញនិយម',
    badgeColor: 'orange',
    description: 'Chewy brown sugar tapioca pearls with adorable anime cat face milk tea.',
    descriptionKm: 'តែគុជស្ករត្នោត ជាមួយមុខកូនឆ្មាគួរឱ្យស្រលាញ់។ ទាក់ទាញយុវវ័យខ្លាំង។',
    svgDataUri: svgToDataUri(svgBobaCat),
    recommendedMaterialId: 'glossy-vinyl',
    recommendedSizeId: '6x6',
  },
  {
    id: 'preset-matcha-tea',
    name: 'Kyoto Matcha Green Tea',
    nameKm: 'តែបៃតងម៉ាត់ឆា (Matcha Bowl)',
    category: 'cafe',
    tag: 'Popular',
    tagKm: 'ពេញនិយម',
    badgeColor: 'emerald',
    description: 'Rich organic green matcha ceremonial bowl design for modern tea houses.',
    descriptionKm: 'ចានតែបៃតងម៉ាត់ឆាប្រពៃណីបែបជប៉ុន សម្រាប់ហាងភេសជ្ជៈ និងតែបៃតង។',
    svgDataUri: svgToDataUri(svgMatchaCup),
    recommendedMaterialId: 'matte-vinyl',
    recommendedSizeId: '5x5',
  },

  // 2. Cute Mascots
  {
    id: 'preset-lucky-cat',
    name: 'Lucky Maneki Neko Cat',
    nameKm: 'ឆ្មាសំណាងហៅលាភ (Lucky Cat)',
    category: 'cute',
    tag: 'Lucky Fortune',
    tagKm: 'ហៅលាភសំណាង',
    badgeColor: 'rose',
    description: 'Traditional Japanese lucky cat with golden coin for good business fortune.',
    descriptionKm: 'ឆ្មាសំណាងលើកដៃហៅលុយហៅភ្ញៀវ នាំសំណាងល្អដល់អាជីវកម្ម និងហាងលក់ទំនិញ។',
    svgDataUri: svgToDataUri(svgLuckyCat),
    recommendedMaterialId: 'holographic',
    recommendedSizeId: '7x7',
  },
  {
    id: 'preset-happy-corgi',
    name: 'Smiling Sunny Corgi Pup',
    nameKm: 'កូនឆ្កែខរហ្គីញញឹម (Sunny Corgi)',
    category: 'cute',
    tag: 'Cute',
    tagKm: 'គួរឱ្យស្រលាញ់',
    badgeColor: 'amber',
    description: 'Happy winking corgi puppy sticker to brighten up personal items and tumblers.',
    descriptionKm: 'កូនឆ្កែ Corgi ញញឹមធ្មេចភ្នែកម្ខាង គួរឱ្យស្រលាញ់ បិទលើដបទឹក ឬកុំព្យូទ័រ។',
    svgDataUri: svgToDataUri(svgHappyCorgi),
    recommendedMaterialId: 'glossy-vinyl',
    recommendedSizeId: '6x6',
  },

  // 3. Packaging & Fragile
  {
    id: 'preset-fragile-glass',
    name: 'Fragile Handle With Care',
    nameKm: 'ប្រយ័ត្នបែក! ងាយបាក់បែក (Fragile)',
    category: 'packaging',
    tag: 'Courier Must-Have',
    tagKm: 'ចាំបាច់សម្រាប់ផ្ញើអីវ៉ាន់',
    badgeColor: 'red',
    description: 'High visibility broken glass warning sticker for couriers, parcels and delivery boxes.',
    descriptionKm: 'ផ្លាកព្រមានទំនិញងាយបែក ពណ៌ក្រហមដិតច្បាស់ សម្រាប់បិទលើកញ្ចប់ផ្ញើតាមឡានក្រុង ឬវីរៈប៊ុនថាំ។',
    svgDataUri: svgToDataUri(svgFragileHandleWithCare),
    recommendedMaterialId: 'glossy-vinyl',
    recommendedSizeId: '8x8',
  },
  {
    id: 'preset-thank-you-business',
    name: 'Thank You For Supporting My Small Business',
    nameKm: 'អរគុណសម្រាប់ការគាំទ្រ (Thank You Floral)',
    category: 'packaging',
    tag: 'Top Packaging',
    tagKm: 'សម្រាប់ខ្ចប់អីវ៉ាន់',
    badgeColor: 'pink',
    description: 'Elegant rose gold floral circle sticker for online shops, boutiques, and gift bags.',
    descriptionKm: 'តែមផ្កាកុលាបអរគុណភ្ញៀវដ៏ប្រណិត សម្រាប់បិទលើថង់យួរ ប្រអប់ទំនិញ ឬកញ្ចប់អំណោយ។',
    svgDataUri: svgToDataUri(svgThankYouFloral),
    recommendedMaterialId: 'kraft-eco',
    recommendedSizeId: '5x5',
  },
  {
    id: 'preset-handmade-love',
    name: '100% Handmade With Love',
    nameKm: 'ផលិតដោយដៃ និងក្តីស្រលាញ់ (Handmade)',
    category: 'packaging',
    tag: 'Artisan',
    tagKm: 'សិល្បៈកែច្នៃ',
    badgeColor: 'amber',
    description: 'Craft seal badge for artisanal creations, bakery goods, and tailored products.',
    descriptionKm: 'តែមបញ្ជាក់ទំនិញផលិតដោយដៃផ្ទាល់ សម្រាប់ហាងនំ សិប្បកម្ម និងផលិតផលច្នៃប្រឌិត។',
    svgDataUri: svgToDataUri(svgHandmadeWithLove),
    recommendedMaterialId: 'kraft-eco',
    recommendedSizeId: '5x5',
  },

  // 4. Tech & Dev
  {
    id: 'preset-code-terminal',
    name: 'Eat Sleep Code Repeat',
    nameKm: 'កូដ គេង ញ៉ាំ (Developer Life)',
    category: 'tech',
    tag: 'Dev Favorite',
    tagKm: 'សម្រាប់អ្នកកូដ',
    badgeColor: 'sky',
    description: 'Dark mode code editor syntax sticker for programmers, laptops, and keyboards.',
    descriptionKm: 'ស្ទីគ័រម៉ូដ Terminal កូដផ្ទៃខ្មៅ សម្រាប់អ្នកសរសេរកម្មវិធី បិទលើកុំព្យូទ័រ Mac/PC។',
    svgDataUri: svgToDataUri(svgEatSleepCode),
    recommendedMaterialId: 'matte-vinyl',
    recommendedSizeId: '8x8',
  },
  {
    id: 'preset-ship-rocket',
    name: 'Ship It! Rocket Launch',
    nameKm: 'រ៉ុក្កែតបញ្ចេញគម្រោង (Ship It!)',
    category: 'tech',
    tag: 'Startup',
    tagKm: 'ស្ដាតអាប់',
    badgeColor: 'indigo',
    description: 'Retro space rocket badge representing speed, innovation, and product launches.',
    descriptionKm: 'រ៉ុក្កែតហោះឡើងលើមេឃ តំណាងឱ្យល្បឿន ការច្នៃប្រឌិត និងភាពជោគជ័យ។',
    svgDataUri: svgToDataUri(svgShipItRocket),
    recommendedMaterialId: 'holographic',
    recommendedSizeId: '7x7',
  },

  // 5. Aesthetic & Quotes
  {
    id: 'preset-good-vibes',
    name: 'Good Vibes Only Retro Sunset',
    nameKm: 'អារម្មណ៍ល្អជានិច្ច (Good Vibes Only)',
    category: 'aesthetic',
    tag: 'Aesthetic',
    tagKm: 'សិល្បៈទាន់សម័យ',
    badgeColor: 'rose',
    description: '70s retro arch rainbow badge bringing cheerful energy and good moods.',
    descriptionKm: 'ឥន្ធនូពណ៌ស្រស់បែប 70s នាំមកនូវអារម្មណ៍ស្រស់ស្រាយ និងភាពវិជ្ជមាន។',
    svgDataUri: svgToDataUri(svgGoodVibesRainbow),
    recommendedMaterialId: 'glossy-vinyl',
    recommendedSizeId: '7x7',
  },
  {
    id: 'preset-golden-star-vip',
    name: 'Golden Star VIP Seal',
    nameKm: 'ផ្កាយមាសតែម VIP (VIP Gold Seal)',
    category: 'aesthetic',
    tag: 'VIP Luxury',
    tagKm: 'ប្រណិត VIP',
    badgeColor: 'amber',
    description: 'Metallic golden star seal for premium packaging, member gifts, and awards.',
    descriptionKm: 'តែមផ្កាយមាសប្រណិត សម្រាប់បិទលើផលិតផលកម្រិតខ្ពស់ ឬកាដូសមាជិក VIP។',
    svgDataUri: svgToDataUri(svgGoldenStarVip),
    recommendedMaterialId: 'brushed-gold',
    recommendedSizeId: '6x6',
  },

  // 6. Bakery & Food
  {
    id: 'preset-butter-croissant',
    name: 'Golden Butter Croissant',
    nameKm: 'នំខ្វាសង់ប៊ឺរមាស (Butter Croissant)',
    category: 'bakery',
    tag: 'Bakery',
    tagKm: 'ហាងនំប៉័ង',
    badgeColor: 'amber',
    description: 'Freshly baked buttery french croissant sticker for cafes and bakeries.',
    descriptionKm: 'នំខ្វាសង់បារាំងស្រួយស្រស់ៗ សម្រាប់ហាងនំប៉័ង ហាងកាហ្វេ និងប្រអប់នំ។',
    svgDataUri: svgToDataUri(svgButterCroissant),
    recommendedMaterialId: 'kraft-eco',
    recommendedSizeId: '6x6',
  },
  {
    id: 'preset-cheesy-pizza',
    name: 'Hot Cheesy Pizza Slice',
    nameKm: 'ភីហ្សាឈីសក្តៅៗ (Cheesy Pizza)',
    category: 'bakery',
    tag: 'Fast Food',
    tagKm: 'អាហាររហ័ស',
    badgeColor: 'yellow',
    description: 'Melted cheese pizza slice with pepperoni for restaurants and food delivery.',
    descriptionKm: 'ភីហ្សាឈីសយឺតក្តៅៗជាមួយ pepperoni សម្រាប់ហាងអាហារ និងប្រអប់ដឹកជញ្ជូន។',
    svgDataUri: svgToDataUri(svgPizzaSlice),
    recommendedMaterialId: 'glossy-vinyl',
    recommendedSizeId: '6x6',
  },
];

export function getPresetDesigns(categoryId?: string): PresetDesign[] {
  if (!categoryId || categoryId === 'all') {
    return PRESET_DESIGNS;
  }
  return PRESET_DESIGNS.filter((p) => p.category === categoryId);
}

export function getPresetDesignById(id: string): PresetDesign | undefined {
  return PRESET_DESIGNS.find((p) => p.id === id);
}
