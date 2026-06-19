import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import CardTilt from '../components/CardTilt'
import { goToShop } from '../lib/shop'
import InstagramFeed from '../components/sections/InstagramFeed'

const audiences = [
  {
    title: 'Youth Groups',
    description:
      'Hand a young person a card and watch them start praying. No pressure, no awkward silence.',
    icon: (
      <svg className="w-9 h-9 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    title: 'Small Groups',
    description:
      "People who've never prayed out loud will start sharing. The cards give them a way in.",
    icon: (
      <svg className="w-9 h-9 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Personal Devotion',
    description:
      "Pick up a card, read the Scripture, and start talking to God. No guide needed, no right way to do it.",
    icon: (
      <svg className="w-9 h-9 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Ministry & Counselling',
    description:
      'Pastors, chaplains, and counsellors use these with people in hard seasons. A starting point when words fail.',
    icon: (
      <svg className="w-9 h-9 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
]

export default function About() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'About — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      {/* Page header — dramatic, no section-tag pattern */}
      <div className="bg-gradient-to-br from-forest-green via-green-dark to-forest-green py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="hero-reveal hero-reveal-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            About Prayer Portals
          </h1>
          <p className="hero-reveal hero-reveal-2 text-white/80 text-lg max-w-xl mx-auto">
            Helping you go deeper with Jesus through prayer
          </p>
        </div>
      </div>

      {/* Founder story */}
      <div className="max-w-[1400px] mx-auto px-[5%] py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal variant="slide-left" className="order-1 lg:order-1">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/Jesse01.webp"
                  alt="Jesse Major — Founder of My Living Hope"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-forest-green/15 -z-10" />
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={0.15} className="order-2 lg:order-2">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 leading-tight">
              A Heart for{' '}
              <span className="text-forest-green italic">Prayer</span>
            </h2>
            <div className="space-y-5 text-text-secondary leading-relaxed text-lg">
              <p>
                Jesse Major kept seeing the same thing in his youth group.
                Young people wanted to pray. They didn't know how to start.
                The silence stretched. The words wouldn't come. Most of them
                stopped trying.
              </p>
              <p>
                He made the first set of cards as a way in: pick the emotion
                you're feeling, read the Scripture on the back, and let that
                become your prayer. Honest conversation with God, starting
                from where you are.
              </p>
              <p>
                It started with one youth group in Christchurch. Now churches,
                small groups, counsellors, and families across New Zealand
                use Prayer Portals to open up prayer.
              </p>
            </div>

            <ScrollReveal variant="blur-in" delay={0.3} as="blockquote" className="mt-10 pl-6 border-l-4 border-forest-green/30">
              <p className="font-heading italic text-xl text-charcoal leading-relaxed">
                &ldquo;He has sent me to bind up the brokenhearted, to
                proclaim freedom for the captives.&rdquo;
              </p>
              <cite className="block text-sm text-text-muted mt-2 not-italic">
                &mdash; Isaiah 61:1
              </cite>
            </ScrollReveal>
          </ScrollReveal>
        </div>
      </div>

      {/* Who they're for */}
      <div className="bg-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-[5%]">
          <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Made For Everyone
            </h2>
            <p className="text-text-secondary text-lg">
              Anyone who wants to pray but doesn't know where to start
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {audiences.map((a, i) => (
              <ScrollReveal key={a.title} variant="scale-up" delay={i * 0.1}>
                <CardTilt maxDeg={5}>
                  <div className="bg-cream rounded-2xl p-7 border border-charcoal/5 hover:shadow-lg transition-shadow duration-300 h-full text-center">
                    <div className="w-16 h-16 mb-5 rounded-2xl bg-forest-green/10 flex items-center justify-center mx-auto">
                      {a.icon}
                    </div>
                    <h3 className="font-heading text-lg font-bold mb-2">{a.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{a.description}</p>
                  </div>
                </CardTilt>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-soft-blush py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-[5%] text-center">
          <ScrollReveal variant="blur-in">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 leading-tight">
              To help every person find their voice in prayer
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p className="text-text-secondary text-lg leading-relaxed mb-10">
              Prayer is for everyone. You don't need the right words or years
              of practice. Pick a card that matches how you feel, read the
              Scripture, and start talking to God. That's it.
            </p>
            <button
              onClick={() => goToShop(navigate)}
              className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base group"
            >
              Buy a Set
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </ScrollReveal>
        </div>
      </div>

      <InstagramFeed sticky={false} />
    </div>
  )
}
