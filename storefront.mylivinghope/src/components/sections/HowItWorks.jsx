const steps = [
  {
    number: 1,
    title: 'Identify Your Feeling',
    description:
      "Browse the cards until you find the emotion, need, or desire that resonates with what you're experiencing right now.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Discover Scripture',
    description:
      "Flip the card over to find Bible verses that speak directly to your situation, connecting God's Word to your heart.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Begin Your Prayer',
    description:
      'Use the prayer starter as a launching point. Let it guide you into honest, meaningful conversation with God.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-soft-blush">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-tag mb-4">Simple &amp; Meaningful</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4">
            How Prayer Portals Work
          </h2>
          <p className="text-text-secondary text-lg">
            Three simple steps to transform your prayer life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center relative group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-forest-green rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="w-[70px] h-[70px] mx-auto mb-6 rounded-full bg-gradient-to-br from-forest-green to-green-dark flex items-center justify-center shadow-md">
                {step.icon}
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
