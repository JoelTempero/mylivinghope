import { useState } from 'react'
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

function FooterContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://formsubmit.co/ajax/prayerprompts@outlook.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Website enquiry from ${formData.name}`,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-white/15 bg-white/5 focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green/30 transition-all duration-200 text-white text-sm placeholder:text-white/40"

  if (status === 'sent') {
    return (
      <div className="text-center py-6">
        <p className="text-white font-semibold mb-1">Message sent!</p>
        <p className="text-white/60 text-sm">We'll be in touch soon.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-white/50 hover:text-white mt-3 underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          placeholder="Name"
        />
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass}
          placeholder="Email"
        />
      </div>
      <textarea
        required
        rows={3}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className={`${inputClass} resize-none`}
        placeholder="Your message"
      />
      {status === 'error' && (
        <p className="text-red-300 text-sm">Something went wrong. Please try again or email us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-interactive w-full py-2.5 bg-forest-green hover:bg-green-light text-white font-semibold rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

function ContactDetails() {
  return (
    <div className="space-y-3 text-sm text-white/70">
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span>Christchurch, New Zealand</span>
      </div>
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
        <a href="tel:+64275690061" className="hover:text-white transition-colors">027 569 0061</a>
      </div>
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        <a href="mailto:prayerprompts@outlook.com" className="hover:text-white transition-colors break-all">prayerprompts@outlook.com</a>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <SocialIcon href="https://www.instagram.com/mylivinghopenz" label="Instagram">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </SocialIcon>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white [&_a]:text-inherit" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-[1400px] mx-auto px-[5%] pt-16 md:pt-24 pb-8">

        {/* Mobile layout */}
        <div className="md:hidden space-y-10 pb-10">
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider text-cream">
              Contact
            </h4>
            <FooterContactForm />
          </div>

          <ContactDetails />

          <div className="flex flex-col items-center gap-4 pt-2">
            <img
              src="/images/full-logo.png"
              alt="My Living Hope"
              className="h-32 w-auto"
            />
            <p className="text-xs text-white/60 text-center">
              &copy; {new Date().getFullYear()} My Living Hope. Site created by{' '}
              <a href="https://sidequest.nz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
                Sidequest Digital
              </a>
            </p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="flex flex-row gap-14 pb-12 border-b border-white/10">
            <div className="flex-shrink-0">
              <img
                src="/images/full-logo.png"
                alt="My Living Hope"
                className="h-32 w-auto"
              />
            </div>

            <div className="grid grid-cols-3 gap-8 flex-1">
              <ContactDetails />

              <div>
                <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider text-cream">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <a href="/#cards" className="hover:text-white transition-colors">
                      Prayer Portals
                    </a>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider text-cream">
                  Contact
                </h4>
                <FooterContactForm />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-8">
            <p className="text-xs text-white/60">
              &copy; {new Date().getFullYear()} My Living Hope. Site created by{' '}
              <a href="https://sidequest.nz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
                Sidequest Digital
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
