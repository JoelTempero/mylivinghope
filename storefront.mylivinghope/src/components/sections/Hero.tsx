import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-90px)] mt-[80px] md:mt-[90px] flex items-center bg-gradient-to-br from-cream via-cream to-blush-light overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-soft-blush/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[15%] left-[10%] w-56 h-56 bg-forest-green/5 rounded-full blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <p className="section-tag mb-4 animate-reveal">Light in the Darkness</p>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] mb-6 animate-reveal animate-reveal-delay-1">
              Go Deeper{' '}
              <br />
              <span className="text-forest-green italic">
                With Jesus
              </span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8 animate-reveal animate-reveal-delay-2">
              Prayer Portals are beautifully designed cards that help you bring
              both your joys and struggles to God. Connect your emotions with
              Scripture and discover new ways to pray.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-reveal animate-reveal-delay-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Explore Cards
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero visuals */}
          <div className="relative flex justify-center items-center overflow-hidden py-8 sm:py-0 sm:overflow-visible">
            {/* Main image placeholder */}
            <div className="relative w-[280px] h-[380px] sm:w-[340px] sm:h-[460px] lg:w-[400px] lg:h-[540px] rounded-3xl bg-gradient-to-br from-forest-green/10 to-soft-blush/40 shadow-xl overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="font-heading text-lg text-charcoal font-bold">Prayer Portals</p>
                <p className="text-sm text-text-muted mt-1">Cards for deeper prayer</p>
              </div>
            </div>

            {/* Floating accent cards — hidden on very small screens */}
            <div className="hidden sm:flex absolute -top-4 -left-8 w-[140px] h-[190px] rounded-2xl bg-white shadow-lg animate-float items-center justify-center border border-soft-blush/30">
              <div className="text-center p-3">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-charcoal">Gratitude</p>
                <p className="text-[10px] text-text-muted mt-0.5">Psalm 136:1</p>
              </div>
            </div>
            <div className="hidden sm:flex absolute -bottom-4 -right-8 w-[140px] h-[190px] rounded-2xl bg-white shadow-lg animate-float-delayed items-center justify-center border border-soft-blush/30">
              <div className="text-center p-3">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-charcoal">Hope</p>
                <p className="text-[10px] text-text-muted mt-0.5">Romans 15:13</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
