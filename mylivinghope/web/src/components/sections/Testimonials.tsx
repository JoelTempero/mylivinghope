'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

interface TestimonialsProps {
  tag?: string;
  title?: string;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'These prayer cards have transformed our youth group sessions. The kids actually want to pray now!',
    name: 'Sarah M.',
    role: 'Youth Leader',
    initials: 'SM',
  },
  {
    id: '2',
    quote: "I've never felt so connected to Scripture during my prayer time. These cards bridge the gap beautifully.",
    name: 'David L.',
    role: 'Church Member',
    initials: 'DL',
  },
  {
    id: '3',
    quote: 'Simple yet profound. My personal devotions have never been more meaningful.',
    name: 'Rachel K.',
    role: 'Small Group Leader',
    initials: 'RK',
  },
  {
    id: '4',
    quote: "We use these in our family devotions. Even our youngest can participate now. It's brought us closer together.",
    name: 'Michael & Jane T.',
    role: 'Parents',
    initials: 'MT',
  },
];

export function Testimonials({
  tag = 'Testimonials',
  title = 'What People Are Saying',
  testimonials = defaultTestimonials,
}: TestimonialsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="section bg-forest">
      <div className="container-custom">
        {/* Header */}
        <header className="section-header">
          <span className="section-tag !text-blush-light !bg-white/15">{tag}</span>
          <h2 className="text-white">{title}</h2>
        </header>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                'bg-white/[0.08] backdrop-blur-sm p-10 rounded-2xl border border-white/10 transition-all duration-700 hover:bg-white/[0.12] hover:-translate-y-1',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote */}
              <blockquote className="font-heading text-[1.1875rem] italic text-white leading-relaxed mb-6 relative">
                <span className="text-blush text-5xl leading-none block mb-4">&ldquo;</span>
                {testimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-[50px] h-[50px] bg-gradient-to-br from-blush to-blush-dark rounded-full flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-charcoal">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <cite className="not-italic font-semibold text-white block">
                    {testimonial.name}
                  </cite>
                  <span className="text-blush text-sm">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
