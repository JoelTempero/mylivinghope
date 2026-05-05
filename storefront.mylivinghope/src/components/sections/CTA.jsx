import { useEffect, useRef } from 'react'
import ScrollReveal from '../ScrollReveal'
import { addToCart } from '../BuyButton'

export default function CTA() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current
      const image = imageRef.current
      if (!section || !image) return

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      image.style.transform = `translateY(${(1 - progress) * 400}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="sticky-section relative min-h-0 md:min-h-[80vh] flex items-center py-16 md:py-40 bg-cream overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-soft-blush/40 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 bg-forest-green/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div
        ref={imageRef}
        className="hidden xl:block absolute pointer-events-none"
        style={{
          right: '22%',
          bottom: '-7%',
          width: '800px',
          willChange: 'transform',
        }}
      >
        <img
          src="/images/twocards.webp"
          alt="Hand holding two Prayer Portals cards"
          className="w-full h-auto"
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-[5%] w-full">
        <div className="lg:max-w-[50%] lg:ml-[5%]">
          <div className="text-center lg:text-left">
            <ScrollReveal variant="blur-in">
              <p className="font-heading italic text-lg md:text-xl text-forest-green/70 mb-6">
                You don't need the right words.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.15}>
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold mb-8 leading-tight">
                Just begin.
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={addToCart}
                  className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base group"
                >
                  Get Your Cards
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <a
                  href="#contact"
                  className="btn-interactive inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold px-10 py-4 rounded-full text-base"
                  onClick={(e) => { e.preventDefault(); document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  Get in Touch
                </a>
              </div>
            </ScrollReveal>

            <div
              data-tuner="cta-mobile"
              className="xl:hidden mt-12 rounded-2xl"
            >
              <img
                src="/images/twocards.webp"
                alt="Hand holding two Prayer Portals cards"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
