import { useRef, useEffect, useState } from 'react'
import ScrollReveal from '../ScrollReveal'
import BuyButton from '../BuyButton'
import { useProducts, centsToDollars } from '../../hooks/useProducts'

const cardData = [
  {
    id: 1,
    front: '/images/cards/card-1-front.jpg',
    back: '/images/cards/card-1-back.jpg',
    startX: 3,
    startY: 18,
    rotation: -6,
  },
  {
    id: 2,
    front: '/images/cards/card-2-front.jpg',
    back: '/images/cards/card-2-back.jpg',
    startX: 28,
    startY: 8,
    rotation: 3,
  },
  {
    id: 3,
    front: '/images/cards/card-3-front.jpg',
    back: '/images/cards/card-3-back.jpg',
    startX: 53,
    startY: 20,
    rotation: -4,
  },
]

const steps = [
  {
    number: '01',
    title: 'Feel',
    description: 'Find the card that matches where you are.',
    icon: (
      <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Read',
    description: "Flip it over and read the Scripture.",
    icon: (
      <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Pray',
    description: 'Let it carry you into conversation with God.',
    icon: (
      <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
]

function CardPlaceholder({ label }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-soft-blush to-blush-light">
      <div className="text-center p-4">
        <svg className="w-10 h-10 mx-auto mb-2 text-forest-green/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <p className="text-xs text-text-muted font-medium">{label}</p>
      </div>
    </div>
  )
}

function PrayerCard({ card, zIndex, onBringToFront }) {
  const cardRef = useRef(null)
  const stateRef = useRef({
    isDragging: false,
    hasMoved: false,
    startMouseX: 0,
    startMouseY: 0,
    startLeft: 0,
    startTop: 0,
  })
  const [flipped, setFlipped] = useState(false)
  const [frontLoaded, setFrontLoaded] = useState(false)
  const [backLoaded, setBackLoaded] = useState(false)
  const handlersRef = useRef(null)

  useEffect(() => {
    function onMove(e) {
      const s = stateRef.current
      if (!s.isDragging) return
      e.preventDefault()

      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
      const dx = clientX - s.startMouseX
      const dy = clientY - s.startMouseY

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        s.hasMoved = true
      }

      const el = cardRef.current
      if (!el) return
      el.style.left = `${s.startLeft + dx}px`
      el.style.top = `${s.startTop + dy}px`
    }

    function onEnd() {
      const s = stateRef.current
      const el = cardRef.current

      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)

      if (el) el.classList.remove('cursor-grabbing')

      if (!s.hasMoved) {
        setFlipped((f) => !f)
      }

      s.isDragging = false
    }

    handlersRef.current = { onMove, onEnd }

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [])

  function onStart(e) {
    e.preventDefault()
    const el = cardRef.current
    if (!el || !handlersRef.current) return

    onBringToFront(card.id)
    el.classList.add('cursor-grabbing')

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY

    stateRef.current = {
      isDragging: true,
      hasMoved: false,
      startMouseX: clientX,
      startMouseY: clientY,
      startLeft: el.offsetLeft,
      startTop: el.offsetTop,
    }

    const { onMove, onEnd } = handlersRef.current
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
  }

  return (
    <div
      ref={cardRef}
      className={`absolute cursor-grab select-none touch-none card-deal card-deal-${card.id}`}
      style={{
        left: `${card.startX}%`,
        top: `${card.startY}%`,
        width: 'var(--card-w)',
        height: 'var(--card-h)',
        perspective: '1200px',
        zIndex,
        '--card-rotation': `${card.rotation}deg`,
      }}
      onMouseDown={onStart}
      onTouchStart={onStart}
      role="button"
      tabIndex={0}
      aria-label={`Prayer card ${card.id} — ${flipped ? 'showing back, click to flip to front' : 'showing front, click to flip'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onBringToFront(card.id)
          setFlipped((f) => !f)
        }
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl shadow-[0_10px_30px_rgba(33,32,33,0.2)] hover:shadow-[0_20px_50px_rgba(33,32,33,0.25)] transition-shadow duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg) rotate(-90deg)' : 'rotateY(0deg) rotate(0deg)',
        }}
      >
        {/* Front — landscape */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          {frontLoaded ? (
            <img
              src={card.front}
              alt={`Prayer card ${card.id} front`}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          ) : (
            <CardPlaceholder label={`Card ${card.id} front`} />
          )}
        </div>

        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
        >
          {backLoaded ? (
            <img
              src={card.back}
              alt={`Prayer card ${card.id} back — Scripture`}
              className="absolute pointer-events-none"
              style={{
                width: 'var(--card-h)',
                height: 'var(--card-w)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                objectFit: 'cover',
              }}
              draggable={false}
            />
          ) : (
            <CardPlaceholder label={`Card ${card.id} back`} />
          )}
        </div>
      </div>

      <img src={card.front} alt="" className="hidden" onLoad={() => setFrontLoaded(true)} />
      <img src={card.back} alt="" className="hidden" onLoad={() => setBackLoaded(true)} />
    </div>
  )
}

function MobileCard({ card, expanded, onExpand, onClose }) {
  const cardRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [frontLoaded, setFrontLoaded] = useState(false)
  const [backLoaded, setBackLoaded] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [moveTransform, setMoveTransform] = useState('')

  function handleTap() {
    if (phase === 'open') {
      setFlipped((f) => !f)
      return
    }
    if (phase !== 'idle') return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const cardCenterX = rect.left + rect.width / 2
    const cardCenterY = rect.top + rect.height / 2
    const viewCenterX = window.innerWidth / 2
    const viewCenterY = window.innerHeight / 2
    const dx = viewCenterX - cardCenterX
    const dy = viewCenterY - cardCenterY
    const targetW = Math.min(window.innerWidth * 0.9, 400)
    const scale = targetW / rect.width

    setMoveTransform(`translate(${dx}px, ${dy}px) scale(${scale})`)
    onExpand(card.id)
    setPhase('captured')
  }

  useEffect(() => {
    if (phase === 'captured') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('open')
          document.body.style.overflow = 'hidden'
        })
      })
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'open') {
      setFlipped(true)
    }
  }, [phase])

  function handleClose() {
    setFlipped(false)
    setPhase('closing')
    setTimeout(() => {
      document.body.style.overflow = ''
      setPhase('idle')
      setMoveTransform('')
      onClose()
    }, 500)
  }

  const isActive = phase !== 'idle'
  const isOpen = phase === 'open'

  return (
    <div className="w-[85vw] max-w-[320px]">
      {/* Backdrop */}
      {isActive && (
        <div
          className="fixed inset-0 z-[9998] bg-black"
          style={{ opacity: isOpen ? 0.75 : 0, transition: 'opacity 0.4s ease' }}
          onClick={handleClose}
        />
      )}

      {/* Close button */}
      {isActive && (
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-[10001] w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
          style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease 0.2s' }}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}


      {/* The single card element */}
      <div
        ref={cardRef}
        className="relative"
        role="button"
        tabIndex={0}
        aria-label={`Prayer card ${card.id} — tap to read`}
        onClick={handleTap}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTap()
          }
        }}
        style={{
          aspectRatio: '16 / 9',
          perspective: '1200px',
          zIndex: isActive ? 10000 : undefined,
          position: isActive ? 'relative' : undefined,
          transform: isOpen ? moveTransform : 'translate(0, 0) scale(1)',
          transition: isActive ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
        }}
      >
        <div
          className="w-full h-full rounded-2xl shadow-lg"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg) rotate(-90deg)' : 'rotateY(0deg)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
            {frontLoaded ? (
              <img src={card.front} alt={`Prayer card ${card.id} front`} className="w-full h-full object-cover" />
            ) : (
              <CardPlaceholder label={`Card ${card.id} front`} />
            )}
          </div>
          <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
            {backLoaded ? (
              <img
                src={card.back}
                alt={`Prayer card ${card.id} back`}
                className="absolute pointer-events-none"
                style={{
                  width: '56.25%',
                  height: '177.78%',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(90deg)',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <CardPlaceholder label={`Card ${card.id} back`} />
            )}
          </div>
        </div>
      </div>

      <img src={card.front} alt="" className="hidden" onLoad={() => setFrontLoaded(true)} />
      <img src={card.back} alt="" className="hidden" onLoad={() => setBackLoaded(true)} />
    </div>
  )
}

export default function InteractiveCards() {
  const [expandedCard, setExpandedCard] = useState(null)
  const [zIndices, setZIndices] = useState(() => {
    const map = {}
    cardData.forEach((c, i) => { map[c.id] = i + 1 })
    return map
  })
  const highestZ = useRef(cardData.length)

  const { products } = useProducts()
  const flagship = products[0] ?? null

  // Resolved display values — fall back to hard-coded static content when no product loaded
  const productTitle = flagship?.title ?? 'Prayer Portals'
  const productSubtitle = flagship?.subtitle ?? 'For personal devotion, youth groups, and ministry.'
  const productPrice = flagship ? `$${centsToDollars(flagship.priceNZD)}` : null

  function bringToFront(id) {
    highestZ.current += 1
    setZIndices((prev) => ({ ...prev, [id]: highestZ.current }))
  }

  return (
    <section id="cards" className="relative bg-white">
      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">

        <ScrollReveal variant="fade-up" className="text-center mb-8">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-tight">
            {productTitle}
          </h2>
        </ScrollReveal>

        {/* Feel / Read / Pray — compact, above cards */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 sm:gap-8 mb-8 md:mb-10 max-w-xs sm:max-w-none mx-auto">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} variant="fade-up" delay={i * 0.1}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold leading-tight">{step.title}</h3>
                  <p className="text-text-secondary text-xs leading-snug">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Interactive playground — desktop */}
        <div className="hidden sm:block">
          <ScrollReveal variant="scale-up">
            <div
              className="relative mx-auto"
              style={{
                '--card-w': '460px',
                '--card-h': '260px',
                height: '420px',
                maxWidth: '1200px',
              }}
            >
              {cardData.map((card) => (
                <PrayerCard
                  key={card.id}
                  card={card}
                  zIndex={zIndices[card.id]}
                  onBringToFront={bringToFront}
                />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-in" delay={0.2}>
            <p className="text-center mt-6 mb-10 md:mb-14 text-text-muted text-sm">
              Tap to flip
            </p>
          </ScrollReveal>
        </div>

        {/* Mobile card stack */}
        <div className="sm:hidden flex flex-col items-center gap-4 mb-10">
          {cardData.map((card) => (
            <MobileCard
              key={card.id}
              card={card}
              expanded={expandedCard === card.id}
              onExpand={(id) => setExpandedCard(id)}
              onClose={() => setExpandedCard(null)}
            />
          ))}
          <p className="text-text-muted text-sm mt-2">Tap to read</p>
        </div>

        <ScrollReveal variant="fade-up">
          <div id="shop" className="max-w-2xl mx-auto text-center">
            <p className="font-heading italic text-lg text-text-secondary mb-6">
              {productSubtitle}
            </p>
            {productPrice && (
              <p className="text-2xl font-bold text-forest-green mb-4">{productPrice} NZD</p>
            )}
            <BuyButton productId="8845251215491" />
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
