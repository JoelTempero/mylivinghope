import Hero from '../components/sections/Hero'
import ProductShowcase from '../components/sections/ProductShowcase'
import AboutSection from '../components/sections/About'
import HowItWorks from '../components/sections/HowItWorks'
import Testimonials from '../components/sections/Testimonials'
import CTA from '../components/sections/CTA'

export default function Home() {
  return (
    <div id="main-content">
      <Hero />
      <ProductShowcase />
      <AboutSection />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  )
}
