import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'

const ABIDE_SLUG = 'abide-spiritual-practices-booklet'
const SEEN_KEY = 'mlh_abide_promo_seen_v1'

// First-visit "whisper" — a small, soft card that slides up bottom-left ~2.5s after
// landing. Shows once per visitor (localStorage), never on the booklet page itself,
// and only if the booklet is actually live.
export default function AbidePromoPopup() {
  const { pathname } = useLocation()
  const { products } = useProducts()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const onBookletPage = pathname === `/shop/${ABIDE_SLUG}`
  const bookletLive = products.some((p) => p.slug === ABIDE_SLUG)

  // In DEV always show (so the feature is easy to preview on each reload). In
  // production it's once per visitor via localStorage.
  let alreadySeen = false
  if (!import.meta.env.DEV) {
    try {
      alreadySeen = localStorage.getItem(SEEN_KEY) === '1'
    } catch {
      alreadySeen = false
    }
  }

  const shouldShow = !alreadySeen && !onBookletPage && bookletLive

  // Mount, then trigger the slide-in on the next frame.
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

  // Esc to close.
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
      role="dialog"
      aria-label="New product from My Living Hope"
      className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs motion-safe:transition-all motion-safe:duration-300 ease-out"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(1rem)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="relative rounded-2xl shadow-[0_12px_40px_rgba(15,25,124,0.25)] bg-abide-chiara border border-abide-navy/10 overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-abide-navy/60 hover:text-abide-navy hover:bg-abide-navy/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 pr-10">
          <p className="font-abide-body text-xs font-semibold uppercase tracking-wider text-abide-navy/60 mb-1">
            Psst — something new
          </p>
          <h2 className="font-abide-heading text-2xl leading-tight text-abide-navy mb-2">
            Meet Abide
          </h2>
          <p className="font-abide-body text-sm text-abide-navy/80 leading-relaxed mb-4">
            Our new booklet of spiritual practices for everyday faith. Simple, doable ways to walk with God.
          </p>
          <Link
            to={`/shop/${ABIDE_SLUG}`}
            onClick={dismiss}
            className="btn-interactive inline-flex items-center gap-2 bg-abide-navy hover:bg-[#0a1156] text-white font-abide-body font-semibold text-sm px-5 py-2.5 rounded-full"
          >
            Explore the booklet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
