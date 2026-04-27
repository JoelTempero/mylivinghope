'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

export default function Header() {
  const { cart, openCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = cart?.totalQuantity || 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-forest-green shadow-lg'
          : 'bg-forest-green/90 backdrop-blur-sm'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-forest-green focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      <nav className="max-w-[1400px] mx-auto px-[5%] h-[80px] md:h-[90px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-tight">
            My Living Hope
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            Contact
          </Link>

          <button
            onClick={openCart}
            className="relative text-white/90 hover:text-white transition-colors p-3"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-soft-blush text-charcoal text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={openCart}
            className="relative text-white/90 hover:text-white transition-colors p-2"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-soft-blush text-charcoal text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-green-dark border-t border-white/10 px-[5%] pb-6 pt-4 space-y-1 animate-reveal">
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block text-white/90 hover:text-white transition-colors py-3 text-lg font-medium"
          >
            Shop
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-white/90 hover:text-white transition-colors py-3 text-lg font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-white/90 hover:text-white transition-colors py-3 text-lg font-medium"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  )
}
