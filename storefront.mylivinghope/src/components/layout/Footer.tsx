'use client'

import Link from 'next/link'
import { useState } from 'react'

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-[42px] h-[42px] rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-forest-green hover:text-white hover:-translate-y-[3px] transition-all duration-250"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-[1400px] mx-auto px-[5%] pt-16 md:pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-12 border-b border-white/10">
          {/* Brand + Newsletter */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">My Living Hope</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-sm">
              Prayer Portals &mdash; helping you go deeper with Jesus through
              prayer. Connect your emotions with Scripture and discover new ways
              to commune with God.
            </p>
            <h4 className="font-body text-sm font-semibold mb-2">
              Join Our Email List
            </h4>
            <p className="text-xs text-white/50 mb-3">
              Get updates, encouragement, and early access to new products.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setEmail('')
              }}
              className="flex gap-2 max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green transition-colors"
              />
              <button
                type="submit"
                className="bg-forest-green hover:bg-green-light text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Prayer Portals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <a href="mailto:prayerprompts@outlook.com" className="hover:text-white transition-colors">
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} My Living Hope. Made with &hearts;
            in Christchurch, New Zealand.
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://facebook.com" label="Facebook">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://instagram.com" label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://youtube.com" label="YouTube">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  )
}
