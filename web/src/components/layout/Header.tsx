'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartProvider';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#try-cards', label: 'Try It' },
  { href: '/products', label: 'Shop' },
  { href: '/#contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCart();

  const itemCount = cart?.lines.edges.reduce((acc, edge) => acc + edge.node.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[1000] bg-forest transition-all duration-300',
          isScrolled && 'shadow-lg'
        )}
      >
        <div className="flex justify-between items-center px-[5%] py-4 max-w-container mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="My Living Hope"
              width={50}
              height={50}
              className="h-[50px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white text-[0.9375rem] font-medium relative py-1 hover:text-blush transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blush after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative text-white p-2 hover:text-blush transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blush text-charcoal text-[0.7rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Desktop CTA */}
            <Link
              href="/products"
              className="hidden lg:inline-flex btn btn-small bg-blush text-charcoal border-blush hover:bg-white hover:border-white"
            >
              Shop Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col gap-[5px] p-2"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="w-6 h-0.5 bg-white transition-all" />
              <span className="w-6 h-0.5 bg-white transition-all" />
              <span className="w-6 h-0.5 bg-white transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-forest z-[999] pt-24 px-[5%] pb-8 flex flex-col transform transition-transform duration-500 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex-1">
          <ul className="list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-heading text-3xl font-bold text-white py-4 border-b border-white/20 hover:text-blush transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/products"
          onClick={() => setIsMobileMenuOpen(false)}
          className="btn btn-primary w-full mt-8"
        >
          Shop Now
        </Link>
      </div>
    </>
  );
}
