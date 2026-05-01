import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-br from-forest-green via-green-dark to-forest-green py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-[5%] py-16 md:py-20 prose-mlh">
        <p className="text-text-secondary leading-relaxed mb-8">
          My Living Hope respects your privacy. This policy explains what information
          we collect, how we use it, and your rights under New Zealand's Privacy Act 2020.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">What we collect</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We collect information you give us directly:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li><strong>Contact form:</strong> Your name, email address, and message.</li>
          <li><strong>Orders:</strong> When you purchase through our Shopify checkout, Shopify
            collects your name, email, shipping address, and payment details. We receive
            order and shipping information but never see your full payment details.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">How we use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li>To respond to your enquiries.</li>
          <li>To fulfil and ship your orders.</li>
          <li>To let you know about new products or updates, only if you've asked us to.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">Who we share it with</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We only share your information with services that help us run the business:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li><strong>Shopify:</strong> Processes payments and manages orders.</li>
          <li><strong>FormSubmit.co:</strong> Delivers contact form messages to our inbox.</li>
        </ul>
        <p className="text-text-secondary leading-relaxed mb-6">
          We don't sell your information to anyone.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Cookies</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          This website uses cookies only through the Shopify Buy Button, which needs
          them to manage your shopping cart. We don't use analytics cookies or
          tracking tools.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Your rights</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Under the Privacy Act 2020, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li>Ask what personal information we hold about you.</li>
          <li>Request corrections to your information.</li>
          <li>Ask us to delete your information.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">Contact us</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          If you have questions about your privacy or want to make a request,
          email us at{' '}
          <a href="mailto:prayerprompts@outlook.com">prayerprompts@outlook.com</a>.
        </p>
        <p className="text-text-secondary leading-relaxed">
          If you're not satisfied with our response, you can contact the{' '}
          <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer">
            Office of the Privacy Commissioner
          </a>.
        </p>
      </div>
    </div>
  )
}
