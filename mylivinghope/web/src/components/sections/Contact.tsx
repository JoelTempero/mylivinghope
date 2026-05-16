'use client';

import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ContactProps {
  tag?: string;
  title?: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
}

export function Contact({
  tag = 'Get In Touch',
  title = 'Contact Us',
  description = "Have questions about Prayer Portals or want to learn more? We'd love to hear from you.",
  location = 'Christchurch, New Zealand',
  phone = '027 569 0061',
  email = 'prayerprompts@outlook.com',
}: ContactProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Here you would integrate with your form handling service
    // For now, we'll simulate a successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus('success');
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="section bg-blush">
      <div className="container-custom">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div
            className={cn(
              'transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <span className="section-tag">{tag}</span>
            <h2 className="mb-6">{title}</h2>
            <p className="text-[1.0625rem] mb-10">{description}</p>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center gap-6">
                <div className="w-[55px] h-[55px] bg-gradient-to-br from-forest to-forest-dark rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-forest block mb-1">
                    Location
                  </span>
                  <span className="text-charcoal">{location}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-6">
                <div className="w-[55px] h-[55px] bg-gradient-to-br from-forest to-forest-dark rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-forest block mb-1">
                    Phone
                  </span>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-charcoal hover:text-forest">
                    {phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-6">
                <div className="w-[55px] h-[55px] bg-gradient-to-br from-forest to-forest-dark rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-forest block mb-1">
                    Email
                  </span>
                  <a href={`mailto:${email}`} className="text-charcoal hover:text-forest">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            className={cn(
              'bg-white p-10 rounded-2xl shadow-lg transition-all duration-700 delay-200',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-forest"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl mb-2">Message Sent!</h3>
                <p className="text-text-secondary">Thank you for reaching out. We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-charcoal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-charcoal mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    className="form-input"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                    className="form-input resize-y min-h-[150px]"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn btn-primary w-full disabled:opacity-70"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
