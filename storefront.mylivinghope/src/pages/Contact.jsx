import { useEffect } from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import ScrollReveal from '../components/ScrollReveal'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-br from-forest-green via-green-dark to-forest-green py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="hero-reveal hero-reveal-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="hero-reveal hero-reveal-2 text-white/80 text-lg max-w-xl mx-auto">
            Questions, bulk orders, or just saying hello
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal variant="slide-left">
            <h2 className="font-heading text-3xl font-bold mb-6">
              Let's Connect
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-10">
              Got a question about Prayer Portals? Want to order a set for
              your youth group or church? Drop us a line.
            </p>

            <div className="space-y-6">
              {[
                { Icon: MapPin, title: 'Location', content: 'Christchurch, New Zealand' },
                { Icon: Phone, title: 'Phone', href: 'tel:+64275690061', content: '027 569 0061' },
                { Icon: Mail, title: 'Email', href: 'mailto:prayerprompts@outlook.com', content: 'prayerprompts@outlook.com' },
              ].map((item, i) => (
                <ScrollReveal key={item.title} variant="fade-up" delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                      <item.Icon className="w-5 h-5 text-forest-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-forest-green hover:text-green-dark transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-text-secondary">{item.content}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={0.2}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
