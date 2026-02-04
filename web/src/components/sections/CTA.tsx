'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function CTA({
  title = 'Ready to Transform Your Prayer Life?',
  description = 'Start your journey toward deeper, more meaningful prayer with Scripture-based prompts that guide you into authentic conversation with God.',
  buttonText = 'Shop Prayer Portals',
  buttonLink = '/products',
}: CTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="section text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blush rounded-full opacity-50 blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div
          ref={ref}
          className={cn(
            'max-w-[700px] mx-auto transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2 className="mb-6">{title}</h2>
          <p className="text-lg text-text-secondary mb-10">{description}</p>
          <Link href={buttonLink} className="btn btn-primary btn-large">
            {buttonText}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
