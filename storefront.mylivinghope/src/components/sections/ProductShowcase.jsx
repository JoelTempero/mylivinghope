import BuyButton from '../BuyButton'

export default function ProductShowcase() {
  return (
    <section id="cards" className="py-20 md:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-tag mb-4">Our Collection</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4">
            Prayer Portals Card Set
          </h2>
          <p className="text-text-secondary text-lg">
            Beautiful, practical tools for your spiritual journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Product image placeholder */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-square flex items-center justify-center shadow-lg">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="font-heading text-lg text-charcoal font-bold">Prayer Portals</p>
              <p className="text-sm text-text-muted mt-1">Card set</p>
            </div>
          </div>

          {/* Product info + Buy Button */}
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Prayer Portals Card Pack
            </h3>
            <div className="space-y-4 text-text-secondary leading-relaxed mb-8">
              <p>
                A set of beautifully designed cards, each connecting an emotion
                or life situation with relevant Scripture and a prayer starter.
              </p>
              <p>
                Perfect for personal devotion, youth groups, small groups,
                counselling sessions, and ministry. Whether you're feeling
                grateful, anxious, confused, or hopeful &mdash; there's a card
                that meets you where you are.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Connect emotions with Scripture',
                'Prayer starters for every situation',
                'Beautiful, tactile card design',
                'Perfect for groups or personal use',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-secondary">
                  <svg className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <BuyButton productId={null} />
          </div>
        </div>
      </div>
    </section>
  )
}
