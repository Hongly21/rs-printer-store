import type { Metadata, Viewport } from 'next';
import './globals.css';
import { kantumruy } from '@/lib/font';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { AddToCartToast } from '@/components/common/AddToCartToast';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';
import { NavigationProgressBar } from '@/components/common/NavigationProgressBar';
import { shopConfig } from '@/data/shop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0284c7',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rsprinter.com'),
  title: {
    template: `%s | ${shopConfig.name}`,
    default: `${shopConfig.name} - ${shopConfig.tagline}`,
  },
  description:
    'Custom sticker printing, product packaging labels, archival photo prints, marketing flyers, business cards, and outdoor vinyl banners with live pricing and fast turnaround in Cambodia.',
  keywords: [
    'custom printing',
    'stickers',
    'labels',
    'photo printing',
    'business cards',
    'banners',
    'flyers',
    'die-cut stickers',
    'print shop',
    'បោះពុម្ពស្ទីគ័រ',
    'ព្រីនរូបថត',
    'នាមប័ណ្ណ',
    'បដា',
  ],
  authors: [{ name: shopConfig.name }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icons/apple-touch-icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RS Printer',
  },
  openGraph: {
    title: `${shopConfig.name} - ${shopConfig.tagline}`,
    description:
      'Upload your artwork, configure sizes and finishes with live pricing, and place your order in minutes.',
    siteName: shopConfig.name,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" className={kantumruy.variable}>
      <body className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <NavigationProgressBar />
        <LanguageProvider>
          <CartProvider>
            <CheckoutProvider>
              <Navbar />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <Footer />
              <AddToCartToast />
              <MobileBottomNav />
              <PwaInstallPrompt />
            </CheckoutProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
