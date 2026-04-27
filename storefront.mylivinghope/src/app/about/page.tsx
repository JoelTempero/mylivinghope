import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — My Living Hope',
  description:
    'Learn about Prayer Portals and how they help you connect with God through prayer.',
}

export default function AboutPage() {
  return (
    <div className="mt-[80px] md:mt-[90px]">
      {/* Page header */}
      <div className="bg-gradient-to-r from-forest-green to-green-dark py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            About Prayer Portals
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Helping you go deeper with Jesus through prayer
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-[4/5] flex items-center justify-center shadow-lg">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="font-heading text-charcoal font-bold text-lg">
                  Our Story
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Born in Christchurch, NZ
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-forest-green/20 -z-10" />
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p className="section-tag mb-4">Our Story</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 leading-tight">
              Helping You{' '}
              <span className="text-forest-green italic">Pray</span>
              <br />
              Without Shame or Confusion
            </h2>
            <div className="space-y-5 text-text-secondary leading-relaxed text-lg">
              <p>
                Prayer Portals were born from a simple observation: many of us
                want to connect with God but struggle to find the words. Whether
                you&apos;re feeling overwhelmed, grateful, confused, or hopeful
                &mdash; these cards meet you where you are.
              </p>
              <p>
                Each card connects an emotion or need with relevant Scripture and
                a prayer starter. They won&apos;t pray for you, but they&apos;ll
                help you begin.
              </p>
              <p>
                Created in Christchurch, New Zealand, for youth ministries, small
                groups, and anyone seeking a deeper prayer life.
              </p>
            </div>

            <blockquote className="mt-10 pl-6 border-l-4 border-forest-green/30">
              <p className="font-heading italic text-xl text-charcoal leading-relaxed">
                &ldquo;Your word is a lamp for my feet, a light on my
                path.&rdquo;
              </p>
              <cite className="block text-sm text-text-muted mt-2 not-italic">
                &mdash; Psalm 119:105
              </cite>
            </blockquote>

            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Explore our cards
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works mini-section */}
      <div className="bg-soft-blush py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">
              How Prayer Portals Work
            </h2>
            <p className="text-text-secondary text-lg">
              Three simple steps to transform your prayer life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: '1',
                title: 'Identify Your Feeling',
                desc: "Browse the cards until you find the emotion that resonates with what you're experiencing.",
              },
              {
                step: '2',
                title: 'Discover Scripture',
                desc: 'Flip the card to find Bible verses that speak directly to your situation.',
              },
              {
                step: '3',
                title: 'Begin Your Prayer',
                desc: 'Use the prayer starter to guide you into honest conversation with God.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-8 shadow-md text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-forest-green to-green-dark flex items-center justify-center text-white font-bold text-xl">
                  {s.step}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">
                  {s.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
