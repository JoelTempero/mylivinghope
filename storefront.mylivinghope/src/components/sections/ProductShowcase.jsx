import BuyButton from '../BuyButton'
import ScrollReveal from '../ScrollReveal'
import CardTilt from '../CardTilt'
import CardFlip from '../CardFlip'

const steps = [
  {
    number: '01',
    title: 'Feel',
    description: 'Find the card that matches where you are right now.',
    icon: (
      <svg className="w-6 h-6 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Read',
    description: "Flip it over. Scripture that speaks to your situation.",
    icon: (
      <svg className="w-6 h-6 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Pray',
    description: 'Use the starter to begin. The rest comes naturally.',
    icon: (
      <svg className="w-6 h-6 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
]

const emotions = [
  { name: 'Anxiety', verse: 'Phil 4:6-7', gradient: 'from-purple-50 to-purple-100/50' },
  { name: 'Grief', verse: 'Psalm 34:18', gradient: 'from-blue-50 to-blue-100/50' },
  { name: 'Gratitude', verse: 'Psalm 136:1', gradient: 'from-amber-50 to-amber-100/50' },
  { name: 'Confusion', verse: 'Prov 3:5-6', gradient: 'from-slate-50 to-slate-100/50' },
]

export default function ProductShowcase() {
  return (
    <section id="cards" className="py-20 md:py-32 bg-cream">
      <div className="max-w-[1400px] mx-auto px-[5%]">

        {/* Product hero — full width, dramatic */}
        <ScrollReveal variant="fade-up" className="text-center mb-16 md:mb-24">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-tight mb-4">
            Prayer Portals
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            A set of cards, each connecting an emotion with Scripture and
            a prayer starter. For when you want to pray but don't know
            where to begin.
          </p>
        </ScrollReveal>

        {/* Interactive card showcase — emotions fan */}
        <ScrollReveal variant="scale-up" className="mb-20 md:mb-28">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {emotions.map((card, i) => (
              <CardTilt key={card.name} maxDeg={10}>
                <div
                  className={`reveal-fade-up in-view stagger-${i + 1} w-[140px] h-[196px] sm:w-[160px] sm:h-[224px] rounded-2xl bg-gradient-to-br ${card.gradient} shadow-md hover:shadow-xl border border-charcoal/5 flex flex-col items-center justify-center p-4 transition-shadow duration-300`}
                >
                  <div className="w-10 h-10 mb-3 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-charcoal text-center">{card.name}</p>
                  <p className="text-[10px] text-text-muted mt-1 text-center">{card.verse}</p>
                </div>
              </CardTilt>
            ))}
          </div>
        </ScrollReveal>

        {/* How it works — integrated, not separate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-28">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} variant="fade-up" delay={i * 0.15}>
              <div className="relative bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-charcoal/5 group">
                <span className="absolute top-5 right-5 font-heading text-4xl font-bold text-forest-green/10 group-hover:text-forest-green/20 transition-colors">
                  {step.number}
                </span>
                <div className="w-12 h-12 mb-4 rounded-xl bg-forest-green/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Buy section — single focused CTA */}
        <ScrollReveal variant="fade-up">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-heading italic text-lg text-text-secondary mb-6">
              Perfect for personal devotion, youth groups, small groups,
              and ministry.
            </p>
            <BuyButton productId={null} />
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
