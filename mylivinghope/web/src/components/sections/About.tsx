'use client';

import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface AboutProps {
  title?: string;
  titleHighlight?: string;
  paragraphs?: string[];
  verseText?: string;
  verseReference?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function About({
  title = 'What is',
  titleHighlight = 'My Living Hope?',
  paragraphs = [
    'My Living Hope creates tools to help you connect with God through Scripture-based prayer. Our Prayer Portals are designed to guide you into meaningful conversation with Jesus, using His Word as the foundation.',
    'Whether you\'re new to prayer or looking to deepen your spiritual practice, our cards provide prompts that lead you through identification, Scripture discovery, and guided prayer.',
  ],
  verseText = '"Your word is a lamp for my feet, a light on my path."',
  verseReference = 'Psalm 119:105',
  imageSrc = '/about-image.jpg',
  imageAlt = 'Prayer cards in use',
}: AboutProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="about" className="section relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blush opacity-40 -top-[200px] -left-[200px] blur-[60px]" />

      <div className="container-custom">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Image */}
          <div
            className={cn(
              'relative transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={600}
              height={500}
              className="rounded-2xl shadow-xl w-full"
            />
            {/* Decorative border */}
            <div className="absolute -bottom-5 -right-5 w-[60%] h-[60%] border-[3px] border-forest rounded-2xl -z-10 hidden md:block" />
          </div>

          {/* Content */}
          <div
            className={cn(
              'transition-all duration-700 delay-200',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <h2 className="mb-6">
              {title} <span className="text-forest">{titleHighlight}</span>
            </h2>

            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[1.0625rem] leading-[1.9] mb-4">
                {paragraph}
              </p>
            ))}

            {/* Verse block */}
            <div className="bg-gradient-to-br from-blush-light to-blush p-8 rounded-xl mt-8 border-l-4 border-forest">
              <p className="font-heading text-xl italic text-charcoal mb-2 leading-relaxed">
                {verseText}
              </p>
              <cite className="text-sm font-semibold text-forest not-italic">
                {verseReference}
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
