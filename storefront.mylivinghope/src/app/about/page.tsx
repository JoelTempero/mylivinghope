import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — My Living Hope',
  description:
    'Learn about Prayer Portals and how they help you connect with God through prayer.',
}

const audiences = [
  {
    title: 'Youth Groups',
    description:
      'Give young people a tangible, non-intimidating way to engage with prayer and Scripture.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    title: 'Small Groups',
    description:
      'Open up prayer in your community group — even for people who have never prayed out loud before.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Personal Devotion',
    description:
      'When you want to pray but don\'t know where to start, let the cards guide you into conversation with God.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Ministry & Counselling',
    description:
      'A practical resource for pastors, chaplains, and counsellors walking alongside people through difficult seasons.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="mt-[80px] md:mt-[90px]">
      {/* Page header */}
      <div className="bg-gradient-to-r from-forest-green to-green-dark py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            About Prayer Portals
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Helping you go deeper with Jesus through prayer
          </p>
        </div>
      </div>

      {/* Founder story */}
      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-[4/5] flex items-center justify-center shadow-lg">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="font-heading text-charcoal font-bold text-lg">
                  Jesse Major
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Founder, Christchurch NZ
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-forest-green/20 -z-10" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="section-tag mb-4">The Founder</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 leading-tight">
              A Heart for{' '}
              <span className="text-forest-green italic">Prayer</span>
            </h2>
            <div className="space-y-5 text-text-secondary leading-relaxed text-lg">
              <p>
                Prayer Portals started with Jesse Major watching young people
                struggle to pray. Not because they didn&apos;t want to &mdash;
                but because they didn&apos;t know how to begin. The silence
                felt awkward. The words felt wrong. Many just gave up.
              </p>
              <p>
                Jesse created the first set of cards as a simple tool: match
                what you&apos;re feeling with Scripture, then let that
                Scripture become your prayer. No performance. No right words.
                Just honest conversation with God, starting from where you
                actually are.
              </p>
              <p>
                What began as a resource for one youth group in Christchurch
                has grown into something much bigger. Churches, small groups,
                counsellors, and families across New Zealand are using Prayer
                Portals to open up prayer in ways they never expected.
              </p>
            </div>

            <blockquote className="mt-10 pl-6 border-l-4 border-forest-green/30">
              <p className="font-heading italic text-xl text-charcoal leading-relaxed">
                &ldquo;He has sent me to bind up the brokenhearted, to
                proclaim freedom for the captives.&rdquo;
              </p>
              <cite className="block text-sm text-text-muted mt-2 not-italic">
                &mdash; Isaiah 61:1
              </cite>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Who they're for */}
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-[5%]">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-tag mb-4">Who They&apos;re For</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Prayer Portals Are Made For
            </h2>
            <p className="text-text-secondary text-lg">
              Anyone who wants to pray more honestly and deeply
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {audiences.map((a) => (
              <div
                key={a.title}
                className="bg-cream rounded-2xl p-7 border border-charcoal/5"
              >
                <div className="w-14 h-14 mb-4 rounded-2xl bg-forest-green/10 flex items-center justify-center">
                  {a.icon}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">
                  {a.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-soft-blush py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-[5%] text-center">
          <p className="section-tag mb-4">Our Mission</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 leading-tight">
            To help every person find their voice in prayer
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            We believe prayer is for everyone &mdash; not just the people who
            find it easy. Prayer Portals remove the pressure of finding the
            &ldquo;right&rdquo; words and replace it with an invitation to be
            honest. Every card is a door into deeper conversation with God.
          </p>
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
  )
}
