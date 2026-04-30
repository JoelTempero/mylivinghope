import { Link } from 'react-router-dom'

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-forest-green hover:text-white hover:-translate-y-[3px] transition-all duration-250"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white [&_a]:text-inherit" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-[1400px] mx-auto px-[5%] pt-16 md:pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">My Living Hope</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-sm">
              Prayer Portals &mdash; helping you go deeper with Jesus through
              prayer. Connect your emotions with Scripture and discover new ways
              to commune with God.
            </p>
            <p className="text-sm text-white/70">
              <a
                href="mailto:prayerprompts@outlook.com"
                className="hover:text-white transition-colors"
              >
                prayerprompts@outlook.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
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
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="/#cards" className="hover:text-white transition-colors">
                  Prayer Portals
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <a href="tel:+64275690061" className="hover:text-white transition-colors">
                  027 569 0061
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} My Living Hope. Made with &hearts;
            in Christchurch, New Zealand.
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://www.facebook.com/MyLivingHopeNZ" label="Facebook">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/mylivinghope.nz" label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  )
}
