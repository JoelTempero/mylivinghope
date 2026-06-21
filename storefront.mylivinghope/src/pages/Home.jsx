import { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import InteractiveCards from '../components/sections/InteractiveCards'
import ScriptureInterlude from '../components/sections/ScriptureInterlude'
import Testimonials from '../components/sections/Testimonials'
import InstagramFeed from '../components/sections/InstagramFeed'
import CTA from '../components/sections/CTA'
import LatestProduct from '../components/sections/LatestProduct'
export default function Home() {
  // Arriving from another page with #shop (e.g. About's "Buy a Set") — scroll to
  // the product showcase once it's rendered.
  useEffect(() => {
    if (window.location.hash === '#shop') {
      const t = setTimeout(() => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div id="main-content" className="sticky-stack">
      <Hero />
      <InteractiveCards />
      <ScriptureInterlude />
      <Testimonials />
      <InstagramFeed />
      <CTA />
      <LatestProduct />
    </div>
  )
}
