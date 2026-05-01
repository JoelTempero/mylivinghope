import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { openCart, onCartCount } from '../BuyButton'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => onCartCount(setCartCount), [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-forest-green shadow-lg'
          : 'bg-forest-green/90 backdrop-blur-sm'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-forest-green focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      <nav className="max-w-[1400px] mx-auto px-[5%] h-[80px] md:h-[90px] flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/images/icon.png"
            alt="My Living Hope"
            className="h-[50px] md:h-[60px] w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#shop"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            Shop
          </a>
          <Link
            to="/about"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            About
          </Link>
          <a
            href="#contact"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
            onClick={(e) => { e.preventDefault(); document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Contact
          </a>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); openCart() }}
            className="relative text-white/90 hover:text-white transition-colors p-2 cursor-pointer z-[99999]"
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-soft-blush text-charcoal text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); openCart() }}
            className="relative text-white/90 hover:text-white transition-colors p-3 cursor-pointer z-[99999]"
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-soft-blush text-charcoal text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-3"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden bg-green-dark border-t border-white/10 px-[5%] overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-60 pb-6 pt-4' : 'max-h-0'
        }`}
      >
        <div className="space-y-1">
          {[
            { href: '/#cards', label: 'Shop', isLink: false },
            { to: '/about', label: 'About', isLink: true },
            { href: '#contact', label: 'Contact', isLink: false, scrollToFooter: true },
          ].map((item, i) => {
            const cls = `block text-white/90 hover:text-white transition-all py-3 text-lg font-medium ${
              mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`
            const style = { transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms' }

            return item.isLink ? (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cls}
                style={style}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setMobileOpen(false)
                  if (item.scrollToFooter) {
                    e.preventDefault()
                    document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={cls}
                style={style}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      </div>
    </header>
  )
}
