import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'

const ABIDE_SLUG = 'abide-spiritual-practices-booklet'
const SEEN_KEY = 'mlh_abide_promo_seen_v1'

// First-visit "whisper" — a big centered card that fades in ~2.5s after landing,
// introducing Obi and the booklet. Shows once per visitor in production
// (localStorage), always in DEV, never on the booklet page, and only if the
// booklet is live.
export default function AbidePromoPopup() {
  const { pathname } = useLocation()
  const { products } = useProducts()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const onBookletPage = pathname === `/shop/${ABIDE_SLUG}`
  const bookletLive = products.some((p) => p.slug === ABIDE_SLUG)

  // In DEV always show (easy to preview on each reload). In prod, once per visitor.
  let alreadySeen = false
  if (!import.meta.env.DEV) {
    try {
      alreadySeen = localStorage.getItem(SEEN_KEY) === '1'
    } catch {
      alreadySeen = false
    }
  }

  const shouldShow = !alreadySeen && !onBookletPage && bookletLive

  useEffect(() => {
    if (!shouldShow) return
    const t = setTimeout(() => {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    }, 2500)
    return () => clearTimeout(t)
  }, [shouldShow])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    setTimeout(() => setMounted(false), 350)
  }

  useEffect(() => {
    if (!mounted) return
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 motion-safe:transition-opacity motion-safe:duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-abide-navy/40 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New product from My Living Hope"
        className="relative w-full max-w-lg rounded-3xl bg-white border border-abide-navy/10 shadow-[0_24px_70px_rgba(15,25,124,0.35)] p-7 sm:p-9 motion-safe:transition-transform motion-safe:duration-300 ease-out"
        style={{ transform: visible ? 'scale(1)' : 'scale(0.94)' }}
      >
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center text-abide-navy/60 hover:text-abide-navy hover:bg-abide-navy/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
          <img
            src="/images/abide/obi.png"
            alt="Obi, the Abide mascot"
            className="w-28 sm:w-36 h-auto shrink-0 drop-shadow-sm"
          />

          <div className="text-center sm:text-left">
            <p className="font-abide-body text-xs font-semibold uppercase tracking-[0.15em] text-abide-navy/60 mb-2">
              Something new
            </p>
            <h2 className="font-abide-heading text-3xl sm:text-4xl leading-tight text-abide-navy mb-3">
              Meet Obi and our latest My Living Hope resource!
            </h2>
            <p className="font-abide-body text-abide-navy/80 leading-relaxed mb-5">
              Our new booklet of spiritual practices for everyday faith. Simple ways to walk with God, day to day.
            </p>
            <Link
              to={`/shop/${ABIDE_SLUG}`}
              onClick={dismiss}
              className="btn-interactive inline-flex items-center gap-2 bg-abide-navy hover:bg-[#0a1156] text-white font-abide-body font-semibold px-6 py-3 rounded-full"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
