import { useEffect, useRef } from 'react'
import { addToCart } from '../BuyButton'

export default function Hero() {
  const imageRef = useRef(null)

  useEffect(() => {
    function update() {
      const image = imageRef.current
      if (!image) return
      image.style.transform = `translateY(${window.scrollY * 0.15}px)`
      const vw = window.innerWidth
      // Start shifting at 2190px, fully pushed off by 1024px
      const t = Math.max(0, Math.min(1, (vw - 1024) / (2190 - 1024)))
      const right = -700 + t * 750
      image.style.right = `${right}px`
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section className="sticky-section relative mt-[80px] md:mt-[90px] bg-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[8%] w-80 h-80 bg-soft-blush/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[15%] left-[5%] w-64 h-64 bg-forest-green/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blush-light/30 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div
        ref={imageRef}
        className="hero-reveal hero-reveal-3 hidden lg:block absolute pointer-events-none"
        style={{ width: '1220px', top: '5.5%', willChange: 'transform' }}
      >
        <img
          src="/images/websitehero.webp"
          alt="Hand holding Prayer Portals card set"
          className="w-full h-auto"
        />
      </div>

      <div className="hero-reveal hero-reveal-1 lg:hidden overflow-hidden">
        <img
          src="/images/websitehero.webp"
          alt="Hand holding Prayer Portals card set"
          className="w-full h-[470px] object-cover"
          style={{ objectPosition: '0% 42%' }}
        />
      </div>

      <div className="relative min-h-0 lg:min-h-[85svh] flex items-center max-w-[1400px] mx-auto px-[5%] py-16 md:py-24 w-full">
        <div className="lg:max-w-[50%]">
          <div className="text-center lg:text-left">
            <p className="hero-reveal hero-reveal-2 font-heading text-base md:text-lg italic text-forest-green/80 mb-6">
              You want to pray, but the words won't come.
            </p>

            <h1 className="hero-reveal hero-reveal-3 text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.05] mb-6">
              Find Your Voice
              <br />
              <span className="text-forest-green italic text-shimmer">in Prayer</span>
            </h1>

            <p className="hero-reveal hero-reveal-4 text-lg md:text-xl text-text-secondary max-w-lg mx-auto lg:mx-0 mb-4 leading-relaxed">
              Each card connects an emotion you're feeling with Scripture
              and a prayer starter. You bring what's real. God meets you there.
            </p>

            <div className="hero-reveal hero-reveal-5 flex flex-wrap gap-4 justify-center lg:justify-start mt-8">
              <button
                onClick={addToCart}
                className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3.5 rounded-full text-sm group"
              >
                Get the Cards
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
