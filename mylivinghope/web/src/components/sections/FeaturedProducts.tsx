'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { ProductCard } from '@/components/commerce/ProductCard';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

interface FeaturedProductsProps {
  tag?: string;
  title?: string;
  description?: string;
  products: ShopifyProduct[];
}

export function FeaturedProducts({
  tag = 'Shop',
  title = 'Prayer Portals',
  description = 'Explore our collection of Scripture-based prayer cards designed to deepen your relationship with God.',
  products,
}: FeaturedProductsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="products" className="section">
      <div className="container-custom">
        {/* Header */}
        <header className="section-header">
          <span className="section-tag">{tag}</span>
          <h2>{title}</h2>
          <p className="text-lg text-text-muted">{description}</p>
        </header>

        {/* Products Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                'transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/products" className="btn btn-secondary">
            View All Products
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
