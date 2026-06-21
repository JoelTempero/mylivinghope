import { Link } from 'react-router-dom'
import ScrollReveal from '../ScrollReveal'
import { useProducts, centsToDollars } from '../../hooks/useProducts'

const ABIDE_SLUG = 'abide-spiritual-practices-booklet'

// Thin Abide-branded band at the very bottom of the home page spotlighting the
// latest product (the booklet). Renders nothing if the booklet isn't live, so the
// homepage stays safe before publish.
export default function LatestProduct() {
  const { products } = useProducts()
  const booklet = products.find((p) => p.slug === ABIDE_SLUG)
  if (!booklet) return null

  const image = booklet.images?.[0]

  return (
    <section className="relative z-10 bg-abide-navy text-white">
      <div className="max-w-[1200px] mx-auto px-[5%] py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Image */}
          {image && (
            <ScrollReveal variant="scale-up" className="shrink-0">
              <img
                src={image}
                alt={booklet.title}
                className="w-28 h-28 md:w-24 md:h-24 rounded-xl object-cover shadow-lg"
              />
            </ScrollReveal>
          )}

          {/* Text */}
          <ScrollReveal variant="fade-up" className="flex-1 text-center md:text-left">
            <p className="font-abide-body text-xs font-semibold uppercase tracking-wider text-abide-malibu mb-1">
              Our latest product
            </p>
            <h2 className="font-abide-heading text-2xl md:text-3xl leading-tight text-white mb-1">
              {booklet.title.replace(/^Abide\s*-\s*/i, 'Abide — ')}
            </h2>
            <p className="font-abide-body text-white/70 text-sm">
              {booklet.subtitle} · ${centsToDollars(booklet.priceNZD)} NZD
            </p>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal variant="fade-up" delay={0.1} className="shrink-0">
            <Link
              to={`/shop/${booklet.slug}`}
              className="btn-interactive inline-flex items-center gap-2 bg-white hover:bg-abide-chiara text-abide-navy font-abide-body font-semibold px-7 py-3 rounded-full text-sm"
            >
              View product
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
