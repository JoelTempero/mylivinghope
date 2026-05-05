import Hero from '../components/sections/Hero'
import InteractiveCards from '../components/sections/InteractiveCards'
import ScriptureInterlude from '../components/sections/ScriptureInterlude'
import Testimonials from '../components/sections/Testimonials'
import InstagramFeed from '../components/sections/InstagramFeed'
import CTA from '../components/sections/CTA'
export default function Home() {
  return (
    <div id="main-content" className="sticky-stack">
      <Hero />
      <InteractiveCards />
      <ScriptureInterlude />
      <Testimonials />
      <InstagramFeed />
      <CTA />
    </div>
  )
}
