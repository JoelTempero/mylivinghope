'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  tag?: string;
  title?: string;
  description?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    number: 1,
    title: 'Identify',
    description: 'Choose a card that resonates with where you are spiritually or emotionally today.',
  },
  {
    number: 2,
    title: 'Discover Scripture',
    description: 'Flip the card to reveal a carefully selected Bible verse that speaks to your situation.',
  },
  {
    number: 3,
    title: 'Begin Prayer',
    description: 'Use the guided prompts to start a meaningful conversation with God through His Word.',
  },
];

export function HowItWorks({
  tag = 'Simple Process',
  title = 'How It Works',
  description = 'Getting started with Prayer Portals is easy. Follow these three simple steps to deepen your prayer life.',
  steps = defaultSteps,
}: HowItWorksProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="how-it-works" className="section bg-blush">
      <div className="container-custom">
        {/* Header */}
        <header className="section-header">
          <span className="section-tag">{tag}</span>
          <h2>{title}</h2>
          <p className="text-lg text-text-muted">{description}</p>
        </header>

        {/* Steps */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                'bg-white p-10 rounded-2xl text-center shadow-md relative overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-xl group',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-forest scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Number badge */}
              <div className="w-[70px] h-[70px] bg-gradient-to-br from-forest to-forest-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-heading text-3xl font-bold text-white">{step.number}</span>
              </div>

              <h3 className="mb-4">{step.title}</h3>
              <p className="text-[0.9375rem] text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
