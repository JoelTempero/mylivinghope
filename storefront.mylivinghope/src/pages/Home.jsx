import Hero from '../components/sections/Hero'
import AboutSection from '../components/sections/About'
import ScriptureInterlude from '../components/sections/ScriptureInterlude'
import ProductShowcase from '../components/sections/ProductShowcase'
import Testimonials from '../components/sections/Testimonials'
import CTA from '../components/sections/CTA'

export default function Home() {
  return (
    <div id="main-content">
      {/* 1. The wound — hero that makes you feel seen */}
      <Hero />

      {/* 2. The origin — why these exist */}
      <AboutSection />

      {/* Breathing pause */}
      <ScriptureInterlude
        verse="Your word is a lamp for my feet, a light on my path."
        reference="Psalm 119:105"
      />

      {/* 3. The product + how it works (merged) */}
      <ProductShowcase />

      {/* 4. The proof */}
      <Testimonials />

      {/* 5. The invitation — echoes the wound */}
      <CTA />
    </div>
  )
}
