'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

export default function Header() {
  const { cart, openCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = cart?.totalQuantity || 0

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F5]/90 backdrop-blur-md border-b border-[#336F49]/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#336F49]">
          My Living Hope
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm text-[#212021] hover:text-[#336F49] transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-sm text-[#212021] hover:text-[#336F49] transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm text-[#212021] hover:text-[#336F49] transition-colors"
          >
            Contact
          </Link>
          <button
            onClick={openCart}
            className="relative text-[#212021] hover:text-[#336F49] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#336F49] text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex sm:hidden items-center gap-4">
          <button
            onClick={openCart}
            className="relative text-[#212021] hover:text-[#336F49] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#336F49] text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#212021]"
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
        <div className="sm:hidden bg-[#FDF8F5] border-b border-[#336F49]/10 px-4 pb-4 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block text-[#212021] hover:text-[#336F49] transition-colors py-2"
          >
            Shop
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-[#212021] hover:text-[#336F49] transition-colors py-2"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-[#212021] hover:text-[#336F49] transition-colors py-2"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  )
}
