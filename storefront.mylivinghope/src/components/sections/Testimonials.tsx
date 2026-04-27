const testimonials = [
  {
    initials: "YL",
    text: "The Prayer Prompts were incredibly helpful. Our youth group now has a tangible way to engage with prayer that doesn’t feel forced or awkward. The cards open up real conversations with God.",
  },
  {
    initials: "SM",
    text: "I’ve always struggled to know what to pray. These cards meet me exactly where I am emotionally and help me find words when I have none. They’ve completely changed my quiet times.",
  },
  {
    initials: "DK",
    text: "We use these in our small group and they’ve helped people who’ve never prayed out loud feel comfortable sharing. The Scripture connections are beautiful and relevant.",
  },
  {
    initials: "BYM",
    text: "Leaders could immediately see how these cards open up prayer in a way that’s simple, real, and accessible for young people. Instant hit at our youth leaders conference.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-forest-green">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 mb-4">
            Stories of Impact
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4">
            What People Are Saying
          </h2>
          <p className="text-white/70 text-lg">
            Lives transformed through deeper prayer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.initials}
              className="bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.12] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <svg className="w-8 h-8 text-white/20 mb-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                  </svg>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {t.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
