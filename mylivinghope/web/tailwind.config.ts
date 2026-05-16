import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        charcoal: {
          DEFAULT: '#212021',
          light: '#3a3839',
        },
        blush: {
          DEFAULT: '#F5D7CF',
          light: '#FBE9E4',
          dark: '#E8C4BA',
        },
        forest: {
          DEFAULT: '#336F49',
          light: '#4A8A5F',
          dark: '#265438',
        },
        cream: '#FDF8F5',
        // Text colors
        'text-primary': '#212021',
        'text-secondary': '#5a5758',
        'text-muted': '#8a8788',
      },
      fontFamily: {
        heading: ['var(--font-libre)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'sans-serif'],
      },
      fontSize: {
        'h1': 'clamp(2.5rem, 5vw, 4rem)',
        'h2': 'clamp(2rem, 4vw, 3rem)',
        'h3': 'clamp(1.5rem, 3vw, 2rem)',
        'h4': 'clamp(1.25rem, 2vw, 1.5rem)',
      },
      maxWidth: {
        'container': '1400px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(33, 32, 33, 0.05)',
        'md': '0 4px 6px rgba(33, 32, 33, 0.07)',
        'lg': '0 10px 25px rgba(33, 32, 33, 0.1)',
        'xl': '0 25px 50px rgba(33, 32, 33, 0.15)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
