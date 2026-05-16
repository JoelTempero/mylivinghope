import { Metadata } from 'next';
import {
  Hero,
  About,
  HowItWorks,
  InteractiveCards,
  FeaturedProducts,
  Testimonials,
  CTA,
  Contact,
} from '@/components/sections';
import { getProductsByCollection, isShopifyConfigured } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'My Living Hope | Prayer Prompts for Deeper Faith',
  description:
    'Discover meaningful prayer through Scripture-based prompts. Prayer Portals help you go deeper with Jesus through guided, biblical prayer.',
};

export default async function HomePage() {
  // Fetch featured products from the "frontpage" collection
  let products: Awaited<ReturnType<typeof getProductsByCollection>>['products'] = [];

  if (isShopifyConfigured()) {
    try {
      const result = await getProductsByCollection('frontpage', 6);
      products = result.products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Will show empty products section
    }
  }

  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <InteractiveCards />
      {products.length > 0 && <FeaturedProducts products={products} />}
      <Testimonials />
      <CTA />
      <Contact />
    </>
  );
}
