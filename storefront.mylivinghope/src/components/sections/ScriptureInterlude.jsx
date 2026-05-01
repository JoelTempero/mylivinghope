import { useRef, useEffect, useState, useCallback } from 'react'
import ScrollReveal from '../ScrollReveal'

function useInteractiveGlow(sectionRef) {
  const mouse = useRef({ x: 0, y: 0 })
  const glow = useRef({ x: 0, y: 0 })
  const glowEl = useRef(null)
  const raf = useRef(null)
  const active = useRef(false)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const isSmall = window.matchMedia('(max-width: 767px)').matches
    if (isTouch || isSmall) return

    function animate() {
      glow.current.x += (mouse.current.x - glow.current.x) * 0.12
      glow.current.y += (mouse.current.y - glow.current.y) * 0.12

      if (glowEl.current) {
        glowEl.current.style.transform = `translate(${glow.current.x}px, ${glow.current.y}px) translate(-50%, -50%)`
      }

      const section = sectionRef.current
      if (section && active.current) {
        const words = section.querySelectorAll('.glow-word')
        const rect = section.getBoundingClientRect()
        const mx = mouse.current.x + rect.left
        const my = mouse.current.y + rect.top

        words.forEach((word) => {
          const wr = word.getBoundingClientRect()
          const cx = wr.left + wr.width / 2
          const cy = wr.top + wr.height / 2
          const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
          const radius = 350
          const intensity = Math.max(0, 1 - dist / radius)
          const alpha = 0.2 + intensity * 0.8

          word.style.color = `rgba(255, 255, 255, ${alpha})`
          word.style.textShadow = intensity > 0.05
            ? `0 0 ${intensity * 50}px rgba(245, 215, 207, ${intensity * 0.5}), 0 0 ${intensity * 100}px rgba(245, 215, 207, ${intensity * 0.15})`
            : 'none'
        })
      }

      raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [sectionRef])

  const onMove = useCallback((e) => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    mouse.current.x = e.clientX - rect.left
    mouse.current.y = e.clientY - rect.top

    if (!active.current) {
      active.current = true
      glow.current.x = mouse.current.x
      glow.current.y = mouse.current.y
      if (glowEl.current) glowEl.current.style.opacity = '1'
    }
  }, [sectionRef])

  const onLeave = useCallback(() => {
    active.current = false
    if (glowEl.current) glowEl.current.style.opacity = '0'

    const section = sectionRef.current
    if (!section) return
    const words = section.querySelectorAll('.glow-word')
    words.forEach((word) => {
      word.style.color = ''
      word.style.textShadow = ''
    })
  }, [sectionRef])

  return { glowEl, onMove, onLeave }
}

function useFitText(lineClass = '.fit-line', scale = 1.4) {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function fitAll() {
      const lines = container.querySelectorAll(lineClass)
      const width = container.offsetWidth
      if (width === 0) return

      let firstLineSize = 0
      lines.forEach((line, i) => {
        line.style.fontSize = '100px'
        const smalls = line.querySelectorAll('.scripture-small')
        smalls.forEach((s) => { s.style.fontSize = '100px' })

        const natural = line.scrollWidth
        if (natural > 0) {
          const ideal = (width / natural) * 100
          const maxSize = window.innerHeight * 0.21
          const size = Math.min(ideal * scale, maxSize)
          line.style.fontSize = `${size}px`
          if (i === 0) firstLineSize = size
        }

        smalls.forEach((s) => { s.style.fontSize = `${firstLineSize}px` })
      })
      setReady(true)
    }

    document.fonts.ready.then(() => {
      fitAll()
    })

    window.addEventListener('resize', fitAll)
    return () => window.removeEventListener('resize', fitAll)
  }, [lineClass])

  return { containerRef, ready }
}

function GlowWords({ text, className }) {
  return text.split(' ').map((word, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span className={`glow-word transition-colors duration-100 ${className || ''}`}>{word}</span>
    </span>
  ))
}

export default function ScriptureInterlude() {
  const { containerRef, ready } = useFitText('.fit-line')
  const { containerRef: mobileRef, ready: mobileReady } = useFitText('.fit-line-mobile', 0.9)
  const sectionRef = useRef(null)
  const { glowEl, onMove, onLeave } = useInteractiveGlow(sectionRef)

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="sticky-section relative min-h-[70vh] md:min-h-screen flex items-center py-16 md:py-28 bg-charcoal overflow-hidden cursor-default"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-forest-green/8 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-soft-blush/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-forest-green/5 rounded-full blur-3xl animate-float" />
      </div>

      <div
        ref={glowEl}
        className="absolute top-0 left-0 w-[1200px] h-[1200px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245, 215, 207, 0.1) 0%, rgba(51, 111, 73, 0.06) 40%, transparent 70%)',
          opacity: 0,
          transition: 'opacity 0.6s ease',
          willChange: 'transform',
        }}
      />

      {/* Desktop — 3-line layout */}
      <div
        ref={containerRef}
        className="relative w-full px-[3%] hidden md:block"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <ScrollReveal variant="blur-in">
          <p className="leading-none">
            <span className="fit-line font-heading italic text-white/20 whitespace-nowrap inline-block w-full text-center">
              <GlowWords text="Your word is a" className="text-white/20" />
            </span>
          </p>
        </ScrollReveal>

        <ScrollReveal variant="blur-in" delay={0.2}>
          <p className="leading-none my-3">
            <span className="fit-line font-heading italic whitespace-nowrap inline-flex w-full items-baseline justify-center">
              <span className="glow-word scripture-glow font-bold transition-colors duration-100">lamp</span>
              <span className="ml-[0.3em] scripture-small whitespace-nowrap">
                <GlowWords text="for my feet," className="text-white/30" />
              </span>
            </span>
          </p>
        </ScrollReveal>

        <ScrollReveal variant="blur-in" delay={0.5}>
          <p className="leading-none my-3">
            <span className="fit-line font-heading italic whitespace-nowrap inline-flex w-full items-baseline justify-center">
              <span className="mr-[0.3em] scripture-small whitespace-nowrap">
                <GlowWords text="a" className="text-white/20" />
              </span>
              <span className="glow-word scripture-glow font-bold transition-colors duration-100">light</span>
              <span className="ml-[0.3em] scripture-small whitespace-nowrap">
                <GlowWords text="on my path." className="text-white/30" />
              </span>
            </span>
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.9}>
          <div className="flex items-center justify-center gap-5 mt-20">
            <div className="w-20 h-px bg-white/10 line-draw" />
            <p className="text-white/25 text-base tracking-[0.3em] uppercase font-body">
              Psalm 119:105
            </p>
            <div className="w-20 h-px bg-white/10 line-draw" />
          </div>
        </ScrollReveal>
      </div>

      {/* Mobile — each phrase on its own line */}
      <div
        ref={mobileRef}
        className="relative w-full px-[5%] md:hidden"
        style={{ opacity: mobileReady ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <ScrollReveal variant="blur-in">
          <p className="leading-none">
            <span className="fit-line-mobile font-heading italic text-white/20 whitespace-nowrap inline-block w-full text-center">
              <GlowWords text="Your word" className="text-white/20" />
            </span>
          </p>
        </ScrollReveal>
        <ScrollReveal variant="blur-in" delay={0.1}>
          <p className="leading-none">
            <span className="fit-line-mobile font-heading italic text-white/20 whitespace-nowrap inline-block w-full text-center">
              <GlowWords text="is a" className="text-white/20" />
            </span>
          </p>
        </ScrollReveal>
        <ScrollReveal variant="blur-in" delay={0.2}>
          <p className="leading-none mt-1">
            <span className="fit-line-mobile font-heading italic whitespace-nowrap inline-block w-full text-center">
              <span className="glow-word scripture-glow font-bold transition-colors duration-100">lamp</span>
            </span>
          </p>
        </ScrollReveal>
        <ScrollReveal variant="blur-in" delay={0.3}>
          <p className="leading-none">
            <span className="fit-line-mobile font-heading italic text-white/30 whitespace-nowrap inline-block w-full text-center">
              <GlowWords text="for my feet," className="text-white/30" />
            </span>
          </p>
        </ScrollReveal>
        <ScrollReveal variant="blur-in" delay={0.4}>
          <p className="leading-none mt-1">
            <span className="fit-line-mobile font-heading italic whitespace-nowrap inline-block w-full text-center">
              <GlowWords text="a" className="text-white/20" />
              <span className="glow-word scripture-glow font-bold transition-colors duration-100 ml-[0.3em]">light</span>
            </span>
          </p>
        </ScrollReveal>
        <ScrollReveal variant="blur-in" delay={0.5}>
          <p className="leading-none">
            <span className="fit-line-mobile font-heading italic text-white/30 whitespace-nowrap inline-block w-full text-center">
              <GlowWords text="on my path." className="text-white/30" />
            </span>
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.7}>
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="w-12 h-px bg-white/10 line-draw" />
            <p className="text-white/25 text-sm tracking-[0.3em] uppercase font-body">
              Psalm 119:105
            </p>
            <div className="w-12 h-px bg-white/10 line-draw" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
