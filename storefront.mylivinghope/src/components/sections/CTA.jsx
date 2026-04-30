import { Link } from 'react-router-dom'
import ScrollReveal from '../ScrollReveal'

export default function CTA() {
  return (
    <section className="relative py-24 md:py-36 bg-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-soft-blush/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[650px] mx-auto px-[5%] text-center">
        <ScrollReveal variant="blur-in">
          <p className="font-heading italic text-lg md:text-xl text-forest-green/70 mb-6">
            You don't need the right words.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.15}>
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold mb-8 leading-tight">
            Just begin.
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.3}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/#cards"
              className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base"
            >
              Get Your Cards
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <Link
              to="/contact"
              className="btn-interactive inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold px-10 py-4 rounded-full text-base"
            >
              Get in Touch
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
