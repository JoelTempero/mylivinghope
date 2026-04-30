import CardTilt from '../CardTilt'
import CardFlip from '../CardFlip'

const sampleCards = [
  { emotion: 'Loneliness', verse: 'Psalm 34:18', color: 'from-blue-100 to-blue-50' },
  { emotion: 'Gratitude', verse: 'Psalm 136:1', color: 'from-amber-100 to-amber-50' },
  { emotion: 'Anxiety', verse: 'Philippians 4:6-7', color: 'from-purple-100 to-purple-50' },
  { emotion: 'Hope', verse: 'Romans 15:13', color: 'from-green-100 to-green-50' },
]

function MiniCard({ emotion, verse, color, className = '', style }) {
  return (
    <CardTilt maxDeg={12} className={className} style={style}>
      <div className={`w-[130px] h-[182px] sm:w-[140px] sm:h-[196px] rounded-2xl bg-gradient-to-br ${color} shadow-lg border border-white/60 flex flex-col items-center justify-center p-4`}>
        <div className="w-8 h-8 mb-2 rounded-full bg-forest-green/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
        <p className="text-xs font-bold text-charcoal text-center">{emotion}</p>
        <p className="text-[10px] text-text-muted mt-0.5 text-center">{verse}</p>
      </div>
    </CardTilt>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-[85svh] mt-[80px] md:mt-[90px] flex items-center bg-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[8%] w-80 h-80 bg-soft-blush/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] left-[5%] w-64 h-64 bg-forest-green/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blush-light/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-[5%] py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="text-center lg:text-left">
            <p className="hero-reveal hero-reveal-1 font-heading text-base md:text-lg italic text-forest-green/80 mb-6">
              You want to pray, but the words won't come.
            </p>

            <h1 className="hero-reveal hero-reveal-2 text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.05] mb-6">
              Find Your Voice
              <br />
              <span className="text-forest-green italic">in Prayer</span>
            </h1>

            <p className="hero-reveal hero-reveal-3 text-lg md:text-xl text-text-secondary max-w-lg mx-auto lg:mx-0 mb-4 leading-relaxed">
              Prayer Portals are cards that meet you where you are &mdash;
              connecting what you feel with what God says.
            </p>

            <p className="hero-reveal hero-reveal-4 text-sm text-text-muted max-w-lg mx-auto lg:mx-0 mb-8">
              One emotion. One Scripture. One way to begin.
            </p>

            <div className="hero-reveal hero-reveal-5 flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#cards"
                className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3.5 rounded-full text-sm"
              >
                Get the Cards
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="relative flex justify-center items-center py-8">
            {/* Main card — flip to show front/back */}
            <div className="card-deal card-deal-1">
              <CardFlip
                className="w-[240px] h-[336px] sm:w-[280px] sm:h-[392px] lg:w-[320px] lg:h-[448px]"
                aspectRatio="5/7"
                front={
                  <div className="w-full h-full bg-gradient-to-br from-forest-green to-green-dark flex flex-col items-center justify-center p-6 rounded-2xl text-white">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white/15 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </div>
                    <p className="font-heading text-xl font-bold mb-1">Loneliness</p>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Prayer Portal</p>
                    <div className="mt-auto pt-6">
                      <p className="text-white/50 text-[10px] uppercase tracking-widest">Tap to flip</p>
                    </div>
                  </div>
                }
                back={
                  <div className="w-full h-full bg-cream flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-forest-green/20">
                    <p className="section-tag mb-3">Psalm 34:18</p>
                    <p className="font-heading italic text-base text-charcoal text-center leading-relaxed mb-4">
                      "The Lord is close to the brokenhearted and saves
                      those who are crushed in spirit."
                    </p>
                    <div className="w-12 h-px bg-forest-green/20 mb-4" />
                    <p className="text-sm text-text-secondary text-center leading-relaxed">
                      God, I feel alone right now. But Your word says
                      You are close to me, especially in this pain...
                    </p>
                  </div>
                }
              />
            </div>

            {/* Floating accent cards */}
            <div className="absolute -top-2 -left-2 sm:-left-6 card-deal card-deal-2 animate-float">
              <MiniCard {...sampleCards[1]} />
            </div>
            <div className="absolute -bottom-2 -right-2 sm:-right-6 card-deal card-deal-3 animate-float-delayed">
              <MiniCard {...sampleCards[3]} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-reveal hero-reveal-6 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-charcoal/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-charcoal/30 rounded-full animate-gentle-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
