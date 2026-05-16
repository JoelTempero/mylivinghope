'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroProps {
  tagline?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function Hero({
  tagline = 'Prayer Prompts',
  title = 'Go Deeper',
  titleAccent = 'With Jesus',
  description = 'Discover meaningful prayer through Scripture-based prompts. Our Prayer Portals guide you into deeper connection with God through His Word.',
  primaryButtonText = 'Shop Now',
  primaryButtonLink = '/products',
  secondaryButtonText = 'Learn More',
  secondaryButtonLink = '#about',
}: HeroProps) {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-cream to-blush-light pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23336F49' fill-opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Glow */}
        <div className="absolute top-[20%] right-[5%] w-[600px] h-[600px] bg-blush rounded-full opacity-60 blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-[5%] py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.5, 0, 0, 1] }}
        >
          <span className="inline-flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-4">
            <span className="hidden lg:block w-10 h-0.5 bg-forest" />
            {tagline}
          </span>

          <h1 className="mb-6 leading-[1.1]">
            {title}{' '}
            <span className="text-forest italic">{titleAccent}</span>
          </h1>

          <p className="text-lg text-text-secondary mb-8 max-w-[500px] lg:mx-0 mx-auto">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link href={primaryButtonLink} className="btn btn-primary btn-large">
              {primaryButtonText}
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
            <Link href={secondaryButtonLink} className="btn btn-secondary btn-large">
              {secondaryButtonText}
            </Link>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.5, 0, 0, 1] }}
        >
          <div className="relative">
            <Image
              src="/hero-image.jpg"
              alt="Prayer cards spread on table"
              width={500}
              height={400}
              className="rounded-2xl shadow-xl hover:scale-[1.02] hover:rotate-1 transition-transform duration-500"
              priority
            />
            {/* Floating images */}
            <motion.div
              className="absolute -bottom-5 -left-8 hidden md:block"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/card-float-1.jpg"
                alt="Prayer card"
                width={150}
                height={100}
                className="rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div
              className="absolute top-8 -right-5 hidden md:block"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            >
              <Image
                src="/card-float-2.jpg"
                alt="Prayer card"
                width={150}
                height={100}
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
