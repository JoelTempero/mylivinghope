import ScrollReveal from '../ScrollReveal'

export default function ScriptureInterlude({
  verse,
  reference,
  bgClass = 'bg-soft-blush',
}) {
  return (
    <section className={`${bgClass} py-16 md:py-24`}>
      <ScrollReveal variant="blur-in" className="max-w-3xl mx-auto px-[5%] text-center">
        <blockquote className="scripture-interlude">
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            &ldquo;{verse}&rdquo;
          </p>
          <cite className="block text-sm text-text-muted mt-4 not-italic tracking-wider uppercase">
            &mdash; {reference}
          </cite>
        </blockquote>
      </ScrollReveal>
    </section>
  )
}
