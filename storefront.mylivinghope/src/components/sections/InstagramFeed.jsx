import { useEffect, useRef } from 'react'
import ScrollReveal from '../ScrollReveal'

const POSTS = [
  'https://www.instagram.com/p/DTLbvyhmBAk/',
  'https://www.instagram.com/p/DRnUE_gk4xd/',
  'https://www.instagram.com/p/DVZJVylkuXW/',
  'https://www.instagram.com/p/DW0KhUDEVRC/',
]

const PROFILE_URL = 'https://www.instagram.com/mylivinghopenz'

function InstagramEmbed({ url }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      data-instgrm-captioned=""
      style={{
        background: '#FFF',
        border: 0,
        borderRadius: '12px',
        boxShadow: 'none',
        margin: 0,
        maxWidth: '100%',
        minWidth: '100%',
        padding: 0,
        width: '100%',
      }}
    />
  )
}

export default function InstagramFeed({ sticky = true }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }
    document.body.appendChild(script)
  }, [])

  return (
    <section
      ref={containerRef}
      className={`${sticky ? 'sticky-section ' : ''}bg-cream py-16 md:py-24`}
    >
      <div className="max-w-[1600px] mx-auto px-[3%]">
        <ScrollReveal variant="fade-up" className="text-center mb-12">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <svg className="w-7 h-7 text-forest-green" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span className="font-heading text-2xl md:text-3xl font-bold group-hover:text-forest-green transition-colors">
              @mylivinghopenz
            </span>
          </a>
          <p className="text-text-secondary mt-3 text-lg">
            Follow along for encouragement, Scripture, and prayer
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POSTS.map((url, i) => (
            <ScrollReveal key={url} variant="fade-up" delay={i * 0.08}>
              <InstagramEmbed url={url} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fade-up" delay={0.3} className="text-center mt-10">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive inline-flex items-center gap-2 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white font-semibold px-8 py-3 rounded-full text-base transition-colors duration-300"
          >
            Follow on Instagram
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
