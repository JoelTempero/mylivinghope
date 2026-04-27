import { getProducts } from '@/lib/shopify'
import Hero from '@/components/sections/Hero'
import AboutSection from '@/components/sections/About'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import CTA from '@/components/sections/CTA'
import ProductGrid from '@/components/product/ProductGrid'

export const revalidate = 60

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = []
  try {
    products = await getProducts(4)
  } catch {
    // Shopify token not configured yet
  }

  return (
    <div id="main-content">
      <Hero />

      {/* Featured Products — first thing after the hero */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-[5%]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="section-tag mb-4">Our Collection</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4">
              Prayer Card Sets
            </h2>
            <p className="text-text-secondary text-lg">
              Beautiful, practical tools for your spiritual journey
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      <AboutSection />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  )
}
