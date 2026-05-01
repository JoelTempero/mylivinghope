import { useEffect } from 'react'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms & Conditions — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-br from-forest-green via-green-dark to-forest-green py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Terms & Conditions
          </h1>
          <p className="text-white/70 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-[5%] py-16 md:py-20 prose-mlh">
        <p className="text-text-secondary leading-relaxed mb-8">
          These terms apply when you use the My Living Hope website or purchase
          our products. By using this site, you agree to these terms.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Products</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          My Living Hope sells physical greeting cards ("Prayer Portals"). Product
          images and descriptions on this site are as accurate as possible, but
          slight colour variations may occur between screens and printed cards.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Orders & payment</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          All orders are processed through Shopify's secure checkout. Prices are
          listed in New Zealand Dollars (NZD) and include GST where applicable.
          We'll confirm your order by email once it's placed.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Shipping</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          We ship within New Zealand. Delivery timeframes are estimates and may
          vary depending on your location and courier availability. We'll provide
          tracking information where available.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Returns & refunds</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          If you're not happy with your purchase, you can return unopened products
          within 14 days of receiving them for a full refund. To arrange a return,
          email us at{' '}
          <a href="mailto:prayerprompts@outlook.com">prayerprompts@outlook.com</a>.
        </p>
        <p className="text-text-secondary leading-relaxed mb-6">
          Your rights under the Consumer Guarantees Act 1993 are not affected by
          these terms. If a product is faulty or doesn't match its description,
          you're entitled to a remedy regardless of this returns policy.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Intellectual property</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          All card designs, artwork, and content on this website are the property
          of My Living Hope. You may not reproduce, distribute, or use our designs
          without written permission.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Limitation of liability</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          To the extent permitted by New Zealand law, My Living Hope is not liable
          for any indirect or consequential loss arising from the use of this
          website or our products.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Changes to these terms</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          We may update these terms from time to time. The "last updated" date at
          the top of this page will reflect any changes.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Governing law</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          These terms are governed by the laws of New Zealand.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Contact us</h2>
        <p className="text-text-secondary leading-relaxed">
          Questions about these terms? Email us at{' '}
          <a href="mailto:prayerprompts@outlook.com">prayerprompts@outlook.com</a>.
        </p>
      </div>
    </div>
  )
}
