import ScrollReveal from '../ScrollReveal'

export default function AboutSection() {
  return (
    <section className="py-16 md:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-20 items-center">
          <ScrollReveal variant="slide-left">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-8 leading-tight">
              Born from watching
              <br />
              <span className="text-forest-green italic">young people struggle</span>
            </h2>
            <div className="space-y-5 text-text-secondary leading-relaxed text-lg">
              <p>
                Jesse Major noticed something in his youth group that
                broke his heart. Young people wanted to pray &mdash;
                but the silence felt awkward. The words felt wrong.
                Many just gave up.
              </p>
              <p>
                So he created a simple tool: match what you're feeling
                with Scripture, then let that Scripture become your
                prayer. No performance. No right words. Just honest
                conversation with God, starting from where you actually are.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-[4/5] flex items-center justify-center shadow-lg">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </div>
                  <p className="font-heading text-lg text-charcoal font-bold">Jesse Major</p>
                  <p className="text-sm text-text-muted mt-1">Founder, Christchurch NZ</p>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-forest-green/15 -z-10" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
