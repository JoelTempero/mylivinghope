export default function AboutSection() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-[4/5] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="font-heading text-charcoal font-bold">Our Story</p>
                <p className="text-sm text-text-muted mt-1">Born in Christchurch, NZ</p>
              </div>
            </div>
            {/* Accent border frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-forest-green/20 -z-10" />
          </div>

          {/* Text */}
          <div>
            <p className="section-tag mb-4">Our Story</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6 leading-tight">
              Helping You{' '}
              <span className="text-forest-green italic">Pray</span>
              <br />
              Without Shame or Confusion
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Prayer Portals were born from a simple observation: many of us
                want to connect with God but struggle to find the words. Whether
                you&apos;re feeling overwhelmed, grateful, confused, or hopeful
                &mdash; these cards meet you where you are.
              </p>
              <p>
                Each card connects an emotion or need with relevant Scripture and
                a prayer starter. They won&apos;t pray for you, but they&apos;ll
                help you begin. Created in Christchurch, New Zealand, for youth
                ministries, small groups, and anyone seeking a deeper prayer
                life.
              </p>
            </div>
            <blockquote className="mt-8 pl-6 border-l-4 border-forest-green/30">
              <p className="font-heading italic text-lg text-charcoal leading-relaxed">
                &ldquo;Your word is a lamp for my feet, a light on my
                path.&rdquo;
              </p>
              <cite className="block text-sm text-text-muted mt-2 not-italic">
                &mdash; Psalm 119:105
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
