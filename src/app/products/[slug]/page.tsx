import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, getProductBySlug } from '@/data/products';
import { ProductConfigurator } from '@/components/products/ProductConfigurator';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { shopConfig } from '@/data/shop';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Custom Printing`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${shopConfig.name}`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="py-24 px-4 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Product not found.</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The printing product you are looking for might have been moved or removed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 pb-36 lg:pb-16 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <Link href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Configurator Core Component */}
        <ProductConfigurator product={product} />
      </div>
    </div>
  );
}
