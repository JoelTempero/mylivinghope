import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#contact', label: 'Contact' },
];

const shopLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/collections/prayer-cards', label: 'Prayer Cards' },
];

const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl text-white mb-4">My Living Hope</h3>
            <p className="text-white/70 text-[0.9375rem] leading-relaxed">
              Helping you go deeper with Jesus through Scripture-based prayer prompts.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-blush text-xs font-semibold tracking-wider uppercase mb-3">
                Stay Connected
              </h4>
              <p className="text-white/70 text-sm mb-3">
                Get prayer inspiration delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 border-2 border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-blush"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-blush text-charcoal rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-blush text-xs font-semibold tracking-wider uppercase mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-[0.9375rem] hover:text-blush transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-blush text-xs font-semibold tracking-wider uppercase mb-6">
              Shop
            </h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-[0.9375rem] hover:text-blush transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-blush text-xs font-semibold tracking-wider uppercase mb-6">
              Contact
            </h4>
            <ul className="space-y-2 text-white/70 text-[0.9375rem]">
              <li>Christchurch, New Zealand</li>
              <li>
                <a href="tel:0275690061" className="hover:text-blush transition-colors">
                  027 569 0061
                </a>
              </li>
              <li>
                <a href="mailto:prayerprompts@outlook.com" className="hover:text-blush transition-colors">
                  prayerprompts@outlook.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} My Living Hope. All rights reserved.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[42px] h-[42px] bg-white/10 rounded-full flex items-center justify-center hover:bg-forest hover:-translate-y-1 transition-all"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
