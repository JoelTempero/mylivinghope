import ScrollReveal from '../ScrollReveal'
import CardTilt from '../CardTilt'

const testimonials = [
  {
    name: "Youth Leader",
    context: "Youth group, Christchurch",
    text: "Our youth group now has a tangible way to engage with prayer that doesn't feel forced or awkward. The cards open up real conversations with God.",
  },
  {
    name: "Small Group Member",
    context: "Community group",
    text: "I've always struggled to know what to pray. These cards meet me exactly where I am emotionally and help me find words when I have none.",
  },
  {
    name: "Pastor",
    context: "Sunday worship",
    text: "We use these in our small group and they've helped people who've never prayed out loud feel comfortable sharing. The Scripture connections are beautiful.",
  },
  {
    name: "Youth Conference Attendee",
    context: "National youth leaders conference",
    text: "Leaders could immediately see how these cards open up prayer in a way that's simple, real, and accessible for young people. Instant hit.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-forest-green relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-[5%]">
        <ScrollReveal variant="fade-up" className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4">
            Stories of Impact
          </h2>
          <p className="text-white/80 text-lg">
            Real people, finding their voice in prayer
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal
              key={t.name}
              variant={i % 2 === 0 ? 'slide-left' : 'slide-right'}
              delay={i * 0.1}
            >
              <CardTilt maxDeg={4}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-7 md:p-8 hover:bg-white/15 transition-colors duration-300 h-full">
                  <svg className="w-7 h-7 text-white/25 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                  </svg>
                  <p className="text-white/90 text-sm leading-relaxed mb-5">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {t.name.split(' ').map(w => w[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-white/50 text-xs">{t.context}</p>
                    </div>
                  </div>
                </div>
              </CardTilt>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
