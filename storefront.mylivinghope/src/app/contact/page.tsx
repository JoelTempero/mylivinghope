import type { Metadata } from 'next'
import { MapPin, Phone, Mail } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — My Living Hope',
  description: 'Get in touch with the My Living Hope team.',
}

export default function ContactPage() {
  return (
    <div className="mt-[80px] md:mt-[90px]">
      {/* Page header */}
      <div className="bg-gradient-to-r from-forest-green to-green-dark py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            We&apos;d love to hear from you
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">
              Let&apos;s Connect
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-10">
              Whether you have a question about Prayer Portals, want to order in
              bulk for your ministry, or just want to say hello &mdash;
              we&apos;re here for you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">
                    Location
                  </h3>
                  <p className="text-text-secondary">
                    Christchurch, New Zealand
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Phone</h3>
                  <a
                    href="tel:+64275690061"
                    className="text-forest-green hover:text-green-dark transition-colors"
                  >
                    027 569 0061
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Email</h3>
                  <a
                    href="mailto:prayerprompts@outlook.com"
                    className="text-forest-green hover:text-green-dark transition-colors"
                  >
                    prayerprompts@outlook.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
