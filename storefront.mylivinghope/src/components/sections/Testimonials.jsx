import ScrollReveal from '../ScrollReveal'

export default function Testimonials() {
  return (
    <section className="sticky-section py-24 md:py-36 bg-forest-green relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-float-delayed" />
        <div className="absolute top-1/2 right-[10%] w-64 h-64 bg-white/3 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative max-w-4xl mx-auto px-[5%] text-center">
        <ScrollReveal variant="scale-up">
          <svg className="w-16 h-16 md:w-20 md:h-20 text-white/15 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
          </svg>
        </ScrollReveal>

        <ScrollReveal variant="blur-in" delay={0.15}>
          <blockquote className="font-heading italic text-white text-lg md:text-2xl lg:text-[1.7rem] leading-relaxed md:leading-relaxed mb-8 md:mb-10">
            The Prayer Prompts created by Jesse were incredibly helpful to our
            youth ministry. Many of the teens in our youth group weren't sure
            how to pray or where to begin, so I used the prompts to help guide
            them.
          </blockquote>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.35}>
          <p className="text-white/75 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-10 md:mb-12">
            I especially love how each card features an emotion on one side,
            paired with encouraging Scripture on the other, along with a simple
            prayer starter at the bottom that connects to that emotion. The
            feedback from our youth group has been fantastic! They said the
            prompts were easy to understand and really appreciated how they
            helped kickstart their prayers.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.5}>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-white/20" />
            <div>
              <p className="text-white font-semibold text-base">Youth Leader</p>
              <p className="text-white/50 text-sm">Christchurch, New Zealand</p>
            </div>
            <div className="h-px w-12 bg-white/20" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
