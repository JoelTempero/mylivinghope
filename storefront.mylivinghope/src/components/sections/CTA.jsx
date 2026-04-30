import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-soft-blush/50 rounded-full blur-3xl" />

      <div className="relative max-w-[700px] mx-auto px-[5%] text-center">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6 leading-tight">
          Ready to Transform Your Prayer Life?
        </h2>
        <p className="text-text-secondary text-lg mb-10 leading-relaxed">
          Join thousands who have discovered a new way to connect with God
          through Prayer Portals. Perfect for personal devotion, youth groups,
          small groups, and ministry.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/#cards"
            className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full transition-colors text-base"
          >
            Get Your Cards Today
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold px-10 py-4 rounded-full transition-colors text-base"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
