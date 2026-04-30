# MLH Storefront Buy Button Pivot — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js + Shopify Storefront API storefront with React + Vite + JSX using Shopify Buy Buttons for commerce.

**Architecture:** Standard SPA (React 19 + Vite + React Router v7 + Tailwind CSS v4). All existing design components port from TSX to JSX with Next.js-specific code (Link, metadata, 'use client') replaced. Commerce handled entirely by Shopify Buy Button SDK — no API token, no GraphQL, no cart state. Contact form uses mailto.

**Tech Stack:** React 19, Vite 7, React Router v7, Tailwind CSS v4, Lucide React, Shopify Buy Button JS SDK

**Spec:** `docs/superpowers/specs/2026-05-01-storefront-buy-button-pivot-design.md`

---

## File Map

```
storefront.mylivinghope/
├── index.html                          — entry HTML with Google Fonts + meta tags
├── package.json                        — dependencies (react, vite, react-router, lucide, tailwind)
├── vite.config.js                      — Vite + React plugin + @ alias
├── postcss.config.js                   — Tailwind + autoprefixer
├── eslint.config.js                    — ESLint flat config (matches portal)
├── public/
│   ├── robots.txt                      — allow all crawlers
│   └── sitemap.xml                     — static 3-page sitemap
├── src/
│   ├── main.jsx                        — React root + BrowserRouter
│   ├── index.css                       — Tailwind + MLH design system (ported from globals.css)
│   ├── App.jsx                         — Routes: /, /about, /contact + scroll-to-top
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx              — forest green, scroll-aware, mobile hamburger (no cart)
│   │   │   └── Footer.jsx              — charcoal 4-column, social links
│   │   ├── sections/
│   │   │   ├── Hero.jsx                — gradient hero with floating card accents
│   │   │   ├── ProductShowcase.jsx     — NEW: flagship product feature + Buy Button
│   │   │   ├── About.jsx               — founder story teaser
│   │   │   ├── HowItWorks.jsx          — 3-step process
│   │   │   ├── Testimonials.jsx        — glassmorphism on green
│   │   │   └── CTA.jsx                 — bottom call-to-action
│   │   ├── BuyButton.jsx               — Shopify Buy Button SDK wrapper
│   │   └── ContactForm.jsx             — mailto form
│   └── pages/
│       ├── Home.jsx                    — hero + showcase + about + how + testimonials + CTA
│       ├── About.jsx                   — founder story + audience cards + mission
│       └── Contact.jsx                 — info cards + contact form
```

---

## Task 1: Scaffold Vite Project

**Files:**
- Create: `storefront.mylivinghope/package.json`
- Create: `storefront.mylivinghope/vite.config.js`
- Create: `storefront.mylivinghope/postcss.config.js`
- Create: `storefront.mylivinghope/index.html`
- Create: `storefront.mylivinghope/eslint.config.js`

**Important:** The existing `storefront.mylivinghope/` folder has a Next.js project in it. Before scaffolding, delete all source files but preserve the folder. Do NOT delete `node_modules` yet — `npm install` will reconcile it.

- [ ] **Step 1: Clean existing Next.js source files**

Delete these files/folders (keep `node_modules/` and the folder itself):
```bash
cd storefront.mylivinghope
rm -rf src/ public/ .next/ .env* next.config.ts next-env.d.ts tsconfig.json postcss.config.mjs eslint.config.mjs README.md package.json package-lock.json
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "mlh-storefront",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/postcss": "^4.1.18",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4"
  }
}
```

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

- [ ] **Step 4: Create `postcss.config.js`**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Living Hope — Prayer Portals</title>
    <meta name="description" content="Beautifully designed cards that help you bring both your joys and struggles to God. Connect your emotions with Scripture and discover new ways to pray." />

    <!-- Open Graph -->
    <meta property="og:title" content="My Living Hope — Prayer Portals" />
    <meta property="og:description" content="Beautifully designed cards that help you bring both your joys and struggles to God." />
    <meta property="og:type" content="website" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `eslint.config.js`**

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
```

- [ ] **Step 7: Install dependencies**

```bash
cd storefront.mylivinghope
rm -rf node_modules
npm install
```

- [ ] **Step 8: Commit**

```bash
git add storefront.mylivinghope/package.json storefront.mylivinghope/vite.config.js storefront.mylivinghope/postcss.config.js storefront.mylivinghope/index.html storefront.mylivinghope/eslint.config.js
git commit -m "feat(storefront): scaffold Vite + React project replacing Next.js"
```

---

## Task 2: CSS + Entry Point + Router Shell

**Files:**
- Create: `storefront.mylivinghope/src/index.css`
- Create: `storefront.mylivinghope/src/main.jsx`
- Create: `storefront.mylivinghope/src/App.jsx`

- [ ] **Step 1: Create `src/index.css`**

Port directly from the existing `globals.css`. Identical content — the Tailwind v4 `@import "tailwindcss"` + `@theme inline` block + all custom classes. No changes needed:

```css
@import "tailwindcss";

@theme inline {
  --color-charcoal: #212021;
  --color-charcoal-light: #3a3839;
  --color-soft-blush: #F5D7CF;
  --color-blush-light: #FBE9E4;
  --color-blush-dark: #E8C4BA;
  --color-forest-green: #336F49;
  --color-green-light: #4A8A5F;
  --color-green-dark: #265438;
  --color-cream: #FDF8F5;
  --color-off-white: #FAFAFA;
  --color-text-secondary: #5a5758;
  --color-text-muted: #706e6f;

  --font-heading: "Libre Baskerville", "Goudy Old Style", Georgia, serif;
  --font-body: "Montserrat", "Proxima Nova", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--color-charcoal);
  background-color: var(--color-cream);
  line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-charcoal);
}

main a {
  color: var(--color-forest-green);
  transition: color 250ms;
}
main a:hover {
  color: var(--color-green-dark);
}

.section-tag {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-forest-green);
}

.prose-mlh h1, .prose-mlh h2, .prose-mlh h3 {
  font-family: var(--font-heading);
  color: var(--color-charcoal);
}
.prose-mlh p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}
.prose-mlh a {
  color: var(--color-forest-green);
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-reveal {
  animation: reveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.animate-reveal-delay-1 { animation-delay: 0.1s; }
.animate-reveal-delay-2 { animation-delay: 0.2s; }
.animate-reveal-delay-3 { animation-delay: 0.3s; }
.animate-reveal-delay-4 { animation-delay: 0.4s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 2s;
}

.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

:focus-visible {
  outline: 2px solid var(--color-forest-green);
  outline-offset: 2px;
  border-radius: 4px;
}

footer :focus-visible {
  outline-color: white;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

- [ ] **Step 3: Create `src/App.jsx`**

```jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add storefront.mylivinghope/src/
git commit -m "feat(storefront): add CSS design system, entry point, and router shell"
```

---

## Task 3: Header + Footer (Layout Components)

**Files:**
- Create: `storefront.mylivinghope/src/components/layout/Header.jsx`
- Create: `storefront.mylivinghope/src/components/layout/Footer.jsx`

**Changes from Next.js version:**
- Replace `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
- Replace `href=` → `to=` on all `<Link>` elements
- Remove `'use client'` directive
- Remove cart store import and cart button entirely
- Remove `/products` nav link — replace with anchor link `/#cards` to the product showcase section on the homepage

- [ ] **Step 1: Create `src/components/layout/Header.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-forest-green shadow-lg'
          : 'bg-forest-green/90 backdrop-blur-sm'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-forest-green focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      <nav className="max-w-[1400px] mx-auto px-[5%] h-[80px] md:h-[90px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-tight">
            My Living Hope
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#cards"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            Shop
          </a>
          <Link
            to="/about"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase"
          >
            Contact
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-green-dark border-t border-white/10 px-[5%] pb-6 pt-4 space-y-1 animate-reveal">
          <a
            href="/#cards"
            onClick={() => setMobileOpen(false)}
            className="block text-white/90 hover:text-white transition-colors py-3 text-lg font-medium"
          >
            Shop
          </a>
          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-white/90 hover:text-white transition-colors py-3 text-lg font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-white/90 hover:text-white transition-colors py-3 text-lg font-medium"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/Footer.jsx`**

```jsx
import { Link } from 'react-router-dom'

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-forest-green hover:text-white hover:-translate-y-[3px] transition-all duration-250"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white [&_a]:text-inherit">
      <div className="max-w-[1400px] mx-auto px-[5%] pt-16 md:pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">My Living Hope</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-sm">
              Prayer Portals &mdash; helping you go deeper with Jesus through
              prayer. Connect your emotions with Scripture and discover new ways
              to commune with God.
            </p>
            <p className="text-sm text-white/70">
              <a
                href="mailto:prayerprompts@outlook.com"
                className="hover:text-white transition-colors"
              >
                prayerprompts@outlook.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="/#cards" className="hover:text-white transition-colors">
                  Prayer Portals
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body text-sm font-semibold mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <a href="tel:+64275690061" className="hover:text-white transition-colors">
                  027 569 0061
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} My Living Hope. Made with &hearts;
            in Christchurch, New Zealand.
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://www.facebook.com/MyLivingHopeNZ" label="Facebook">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/mylivinghope.nz" label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add storefront.mylivinghope/src/components/layout/
git commit -m "feat(storefront): add Header and Footer layout components"
```

---

## Task 4: Homepage Section Components

**Files:**
- Create: `storefront.mylivinghope/src/components/sections/Hero.jsx`
- Create: `storefront.mylivinghope/src/components/sections/About.jsx`
- Create: `storefront.mylivinghope/src/components/sections/HowItWorks.jsx`
- Create: `storefront.mylivinghope/src/components/sections/Testimonials.jsx`
- Create: `storefront.mylivinghope/src/components/sections/CTA.jsx`

**Changes from Next.js versions:**
- Replace `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
- Replace `href=` → `to=` on `<Link>` elements
- Replace `/products` links with `/#cards` anchor links
- Remove TypeScript annotations
- Replace `&apos;` with `'` (JSX handles this fine), keep `&mdash;`, `&ldquo;`, `&rdquo;`, `&hearts;`

- [ ] **Step 1: Create `src/components/sections/Hero.jsx`**

```jsx
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-90px)] mt-[80px] md:mt-[90px] flex items-center bg-gradient-to-br from-cream via-cream to-blush-light overflow-hidden">
      <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-soft-blush/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[15%] left-[10%] w-56 h-56 bg-forest-green/5 rounded-full blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <p className="section-tag mb-4 animate-reveal">Light in the Darkness</p>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] mb-6 animate-reveal animate-reveal-delay-1">
              Go Deeper{' '}
              <br />
              <span className="text-forest-green italic">With Jesus</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8 animate-reveal animate-reveal-delay-2">
              Prayer Portals are beautifully designed cards that help you bring
              both your joys and struggles to God. Connect your emotions with
              Scripture and discover new ways to pray.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-reveal animate-reveal-delay-3">
              <a
                href="#cards"
                className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Explore Cards
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center overflow-hidden py-8 sm:py-0 sm:overflow-visible">
            <div className="relative w-[280px] h-[380px] sm:w-[340px] sm:h-[460px] lg:w-[400px] lg:h-[540px] rounded-3xl bg-gradient-to-br from-forest-green/10 to-soft-blush/40 shadow-xl overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="font-heading text-lg text-charcoal font-bold">Prayer Portals</p>
                <p className="text-sm text-text-muted mt-1">Cards for deeper prayer</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -top-4 -left-8 w-[140px] h-[190px] rounded-2xl bg-white shadow-lg animate-float items-center justify-center border border-soft-blush/30">
              <div className="text-center p-3">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-charcoal">Gratitude</p>
                <p className="text-[10px] text-text-muted mt-0.5">Psalm 136:1</p>
              </div>
            </div>
            <div className="hidden sm:flex absolute -bottom-4 -right-8 w-[140px] h-[190px] rounded-2xl bg-white shadow-lg animate-float-delayed items-center justify-center border border-soft-blush/30">
              <div className="text-center p-3">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-charcoal">Hope</p>
                <p className="text-[10px] text-text-muted mt-0.5">Romans 15:13</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/sections/About.jsx`**

Direct port from existing `About.tsx`. No Next.js imports to change — this component has no imports. Remove TypeScript, keep all JSX identical.

```jsx
export default function AboutSection() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-[4/5] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="font-heading text-charcoal font-bold">Our Story</p>
                <p className="text-sm text-text-muted mt-1">Born in Christchurch, NZ</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-forest-green/20 -z-10" />
          </div>

          <div>
            <p className="section-tag mb-4">Our Story</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6 leading-tight">
              Helping You{' '}
              <span className="text-forest-green italic">Pray</span>
              <br />
              Without Shame or Confusion
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Prayer Portals were born from a simple observation: many of us
                want to connect with God but struggle to find the words. Whether
                you're feeling overwhelmed, grateful, confused, or hopeful
                &mdash; these cards meet you where you are.
              </p>
              <p>
                Each card connects an emotion or need with relevant Scripture and
                a prayer starter. They won't pray for you, but they'll
                help you begin. Created in Christchurch, New Zealand, for youth
                ministries, small groups, and anyone seeking a deeper prayer
                life.
              </p>
            </div>
            <blockquote className="mt-8 pl-6 border-l-4 border-forest-green/30">
              <p className="font-heading italic text-lg text-charcoal leading-relaxed">
                &ldquo;Your word is a lamp for my feet, a light on my
                path.&rdquo;
              </p>
              <cite className="block text-sm text-text-muted mt-2 not-italic">
                &mdash; Psalm 119:105
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `src/components/sections/HowItWorks.jsx`**

Direct port. No imports to change. Remove TypeScript.

```jsx
const steps = [
  {
    number: 1,
    title: 'Identify Your Feeling',
    description:
      "Browse the cards until you find the emotion, need, or desire that resonates with what you're experiencing right now.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Discover Scripture',
    description:
      "Flip the card over to find Bible verses that speak directly to your situation, connecting God's Word to your heart.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Begin Your Prayer',
    description:
      'Use the prayer starter as a launching point. Let it guide you into honest, meaningful conversation with God.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-soft-blush">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-tag mb-4">Simple &amp; Meaningful</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4">
            How Prayer Portals Work
          </h2>
          <p className="text-text-secondary text-lg">
            Three simple steps to transform your prayer life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center relative group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-forest-green rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="w-[70px] h-[70px] mx-auto mb-6 rounded-full bg-gradient-to-br from-forest-green to-green-dark flex items-center justify-center shadow-md">
                {step.icon}
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/sections/Testimonials.jsx`**

Direct port. No imports, no TypeScript.

```jsx
const testimonials = [
  {
    initials: "YL",
    text: "The Prayer Prompts were incredibly helpful. Our youth group now has a tangible way to engage with prayer that doesn't feel forced or awkward. The cards open up real conversations with God.",
  },
  {
    initials: "SM",
    text: "I've always struggled to know what to pray. These cards meet me exactly where I am emotionally and help me find words when I have none. They've completely changed my quiet times.",
  },
  {
    initials: "DK",
    text: "We use these in our small group and they've helped people who've never prayed out loud feel comfortable sharing. The Scripture connections are beautiful and relevant.",
  },
  {
    initials: "BYM",
    text: "Leaders could immediately see how these cards open up prayer in a way that's simple, real, and accessible for young people. Instant hit at our youth leaders conference.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-forest-green">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/85 mb-4">
            Stories of Impact
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4">
            What People Are Saying
          </h2>
          <p className="text-white/85 text-lg">
            Lives transformed through deeper prayer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.initials}
              className="bg-white/[0.15] backdrop-blur-sm border border-white/15 rounded-2xl p-8 hover:bg-white/[0.20] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <svg className="w-8 h-8 text-white/35 mb-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                  </svg>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {t.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `src/components/sections/CTA.jsx`**

Replace `Link` from Next.js with React Router `Link`. Change `/products` to `/#cards`.

```jsx
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-soft-blush/50 rounded-full blur-3xl" />

      <div className="relative max-w-[700px] mx-auto px-[5%] text-center">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6 leading-tight">
          Ready to Transform Your Prayer Life?
        </h2>
        <p className="text-text-secondary text-lg mb-10 leading-relaxed">
          Join thousands who have discovered a new way to connect with God
          through Prayer Portals. Perfect for personal devotion, youth groups,
          small groups, and ministry.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/#cards"
            className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full transition-colors text-base"
          >
            Get Your Cards Today
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold px-10 py-4 rounded-full transition-colors text-base"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add storefront.mylivinghope/src/components/sections/
git commit -m "feat(storefront): port all homepage section components from TSX to JSX"
```

---

## Task 5: Buy Button + Product Showcase

**Files:**
- Create: `storefront.mylivinghope/src/components/BuyButton.jsx`
- Create: `storefront.mylivinghope/src/components/sections/ProductShowcase.jsx`

- [ ] **Step 1: Create `src/components/BuyButton.jsx`**

This component loads the Shopify Buy Button SDK and initialises it against a container div. The `domain` and `storefrontAccessToken` come from the Buy Button sales channel in Shopify admin (different from the Storefront API token — this one is generated automatically when you create the Buy Button).

The component accepts a `productId` prop (Shopify numeric product ID, found in Shopify admin URL). When no `productId` is provided, it renders a placeholder button linking to the Shopify store directly.

```jsx
import { useEffect, useRef } from 'react'

export default function BuyButton({ productId }) {
  const containerRef = useRef(null)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!productId || clientRef.current) return

    const script = document.createElement('script')
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
    script.async = true
    script.onload = () => {
      if (!window.ShopifyBuy || clientRef.current) return

      const client = window.ShopifyBuy.buildClient({
        domain: 'my-living-hope.myshopify.com',
        storefrontAccessToken: 'PLACEHOLDER_TOKEN',
      })
      clientRef.current = client

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent('product', {
          id: productId,
          node: containerRef.current,
          moneyFormat: '${{amount}}',
          options: {
            product: {
              styles: {
                product: { '@media (min-width: 601px)': { 'max-width': '100%' } },
                button: {
                  'background-color': '#336F49',
                  ':hover': { 'background-color': '#265438' },
                  'border-radius': '9999px',
                  'font-family': '"Montserrat", sans-serif',
                  'font-weight': '600',
                  'font-size': '16px',
                  'padding': '14px 32px',
                },
                title: {
                  'font-family': '"Libre Baskerville", serif',
                  'font-weight': '700',
                  'color': '#212021',
                },
                price: {
                  'font-family': '"Montserrat", sans-serif',
                  'color': '#336F49',
                  'font-weight': '600',
                },
              },
              contents: {
                img: false,
                title: false,
                price: false,
                description: false,
              },
              text: { button: 'Buy Now' },
            },
            cart: {
              styles: {
                button: {
                  'background-color': '#336F49',
                  ':hover': { 'background-color': '#265438' },
                  'border-radius': '9999px',
                  'font-family': '"Montserrat", sans-serif',
                  'font-weight': '600',
                },
              },
            },
          },
        })
      })
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [productId])

  if (!productId) {
    return (
      <a
        href="https://my-living-hope.myshopify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full transition-colors text-base"
      >
        Buy Now
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    )
  }

  return <div ref={containerRef} />
}
```

**Note:** `PLACEHOLDER_TOKEN` and `productId` will be configured once Jesse enables the Buy Button sales channel. The placeholder fallback links to the Shopify store directly until then.

- [ ] **Step 2: Create `src/components/sections/ProductShowcase.jsx`**

New component — features the flagship card pack with description and embedded Buy Button.

```jsx
import BuyButton from '../BuyButton'

export default function ProductShowcase() {
  return (
    <section id="cards" className="py-20 md:py-28 bg-white">
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-tag mb-4">Our Collection</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4">
            Prayer Portals Card Set
          </h2>
          <p className="text-text-secondary text-lg">
            Beautiful, practical tools for your spiritual journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Product image placeholder */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-square flex items-center justify-center shadow-lg">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="font-heading text-lg text-charcoal font-bold">Prayer Portals</p>
              <p className="text-sm text-text-muted mt-1">Card set</p>
            </div>
          </div>

          {/* Product info + Buy Button */}
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Prayer Portals Card Pack
            </h3>
            <div className="space-y-4 text-text-secondary leading-relaxed mb-8">
              <p>
                A set of beautifully designed cards, each connecting an emotion
                or life situation with relevant Scripture and a prayer starter.
              </p>
              <p>
                Perfect for personal devotion, youth groups, small groups,
                counselling sessions, and ministry. Whether you're feeling
                grateful, anxious, confused, or hopeful &mdash; there's a card
                that meets you where you are.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Connect emotions with Scripture',
                'Prayer starters for every situation',
                'Beautiful, tactile card design',
                'Perfect for groups or personal use',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-secondary">
                  <svg className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <BuyButton productId={null} />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add storefront.mylivinghope/src/components/BuyButton.jsx storefront.mylivinghope/src/components/sections/ProductShowcase.jsx
git commit -m "feat(storefront): add Buy Button component and product showcase section"
```

---

## Task 6: Contact Form + Page Components

**Files:**
- Create: `storefront.mylivinghope/src/components/ContactForm.jsx`
- Create: `storefront.mylivinghope/src/pages/Home.jsx`
- Create: `storefront.mylivinghope/src/pages/About.jsx`
- Create: `storefront.mylivinghope/src/pages/Contact.jsx`

- [ ] **Step 1: Create `src/components/ContactForm.jsx`**

Port from existing. Remove `'use client'`, remove TypeScript type annotations.

```jsx
import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = `mailto:prayerprompts@outlook.com?subject=Website enquiry from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
      <h3 className="font-heading text-2xl font-bold mb-6">Send a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-cream focus:outline-none focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all text-charcoal"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-cream focus:outline-none focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all text-charcoal"
            placeholder="your@email.com"
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
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-cream focus:outline-none focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all text-charcoal resize-none"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-forest-green hover:bg-green-dark text-white font-semibold rounded-full transition-colors text-base shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/pages/Home.jsx`**

```jsx
import Hero from '../components/sections/Hero'
import ProductShowcase from '../components/sections/ProductShowcase'
import AboutSection from '../components/sections/About'
import HowItWorks from '../components/sections/HowItWorks'
import Testimonials from '../components/sections/Testimonials'
import CTA from '../components/sections/CTA'

export default function Home() {
  return (
    <div id="main-content">
      <Hero />
      <ProductShowcase />
      <AboutSection />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/pages/About.jsx`**

Port from existing `app/about/page.tsx`. Remove `Metadata` import/export, replace `Link` import, replace `&apos;` with `'`. Set document title via `useEffect`.

```jsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const audiences = [
  {
    title: 'Youth Groups',
    description:
      'Give young people a tangible, non-intimidating way to engage with prayer and Scripture.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    title: 'Small Groups',
    description:
      'Open up prayer in your community group — even for people who have never prayed out loud before.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Personal Devotion',
    description:
      "When you want to pray but don't know where to start, let the cards guide you into conversation with God.",
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Ministry & Counselling',
    description:
      'A practical resource for pastors, chaplains, and counsellors walking alongside people through difficult seasons.',
    icon: (
      <svg className="w-7 h-7 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
]

export default function About() {
  useEffect(() => {
    document.title = 'About — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-r from-forest-green to-green-dark py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            About Prayer Portals
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Helping you go deeper with Jesus through prayer
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-soft-blush/50 to-blush-light aspect-[4/5] flex items-center justify-center shadow-lg">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className="font-heading text-charcoal font-bold text-lg">Jesse Major</p>
                <p className="text-sm text-text-muted mt-1">Founder, Christchurch NZ</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-forest-green/20 -z-10" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="section-tag mb-4">The Founder</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 leading-tight">
              A Heart for{' '}
              <span className="text-forest-green italic">Prayer</span>
            </h2>
            <div className="space-y-5 text-text-secondary leading-relaxed text-lg">
              <p>
                Prayer Portals started with Jesse Major watching young people
                struggle to pray. Not because they didn't want to &mdash;
                but because they didn't know how to begin. The silence
                felt awkward. The words felt wrong. Many just gave up.
              </p>
              <p>
                Jesse created the first set of cards as a simple tool: match
                what you're feeling with Scripture, then let that
                Scripture become your prayer. No performance. No right words.
                Just honest conversation with God, starting from where you
                actually are.
              </p>
              <p>
                What began as a resource for one youth group in Christchurch
                has grown into something much bigger. Churches, small groups,
                counsellors, and families across New Zealand are using Prayer
                Portals to open up prayer in ways they never expected.
              </p>
            </div>

            <blockquote className="mt-10 pl-6 border-l-4 border-forest-green/30">
              <p className="font-heading italic text-xl text-charcoal leading-relaxed">
                &ldquo;He has sent me to bind up the brokenhearted, to
                proclaim freedom for the captives.&rdquo;
              </p>
              <cite className="block text-sm text-text-muted mt-2 not-italic">
                &mdash; Isaiah 61:1
              </cite>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-[5%]">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-tag mb-4">Who They're For</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Prayer Portals Are Made For
            </h2>
            <p className="text-text-secondary text-lg">
              Anyone who wants to pray more honestly and deeply
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {audiences.map((a) => (
              <div key={a.title} className="bg-cream rounded-2xl p-7 border border-charcoal/5">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-forest-green/10 flex items-center justify-center">
                  {a.icon}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">{a.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-soft-blush py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-[5%] text-center">
          <p className="section-tag mb-4">Our Mission</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 leading-tight">
            To help every person find their voice in prayer
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            We believe prayer is for everyone &mdash; not just the people who
            find it easy. Prayer Portals remove the pressure of finding the
            &ldquo;right&rdquo; words and replace it with an invitation to be
            honest. Every card is a door into deeper conversation with God.
          </p>
          <a
            href="/#cards"
            className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
          >
            Explore our cards
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/Contact.jsx`**

Port from existing. Remove `Metadata`, replace `Link`, use `useEffect` for title.

```jsx
import { useEffect } from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-r from-forest-green to-green-dark py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            We'd love to hear from you
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">
              Let's Connect
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-10">
              Whether you have a question about Prayer Portals, want to order in
              bulk for your ministry, or just want to say hello &mdash;
              we're here for you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Location</h3>
                  <p className="text-text-secondary">Christchurch, New Zealand</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Phone</h3>
                  <a href="tel:+64275690061" className="text-forest-green hover:text-green-dark transition-colors">
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
                  <a href="mailto:prayerprompts@outlook.com" className="text-forest-green hover:text-green-dark transition-colors">
                    prayerprompts@outlook.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add storefront.mylivinghope/src/components/ContactForm.jsx storefront.mylivinghope/src/pages/
git commit -m "feat(storefront): add contact form and all page components"
```

---

## Task 7: Static SEO Assets + Build Verification

**Files:**
- Create: `storefront.mylivinghope/public/robots.txt`
- Create: `storefront.mylivinghope/public/sitemap.xml`

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://mylivinghope.co.nz/sitemap.xml
```

- [ ] **Step 2: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mylivinghope.co.nz/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mylivinghope.co.nz/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mylivinghope.co.nz/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Run build**

```bash
cd storefront.mylivinghope && npm run build
```

Expected: Clean build, no errors. Output in `dist/`.

- [ ] **Step 4: Run lint**

```bash
cd storefront.mylivinghope && npm run lint
```

Expected: No errors, warnings are acceptable.

- [ ] **Step 5: Start dev server and verify**

```bash
cd storefront.mylivinghope && npm run dev
```

Open `http://localhost:5173` in browser. Verify:
- Homepage loads with hero, product showcase, about, how it works, testimonials, CTA
- Header: forest green, scroll-aware, mobile hamburger works
- Footer: 4-column, social links work
- Navigate to `/about` — page loads, title updates
- Navigate to `/contact` — page loads, form renders, mailto works
- Shop links scroll to `#cards` section on homepage
- All fonts load (Libre Baskerville headings, Montserrat body)
- Animations work (reveal, float)
- Responsive: check mobile breakpoints

- [ ] **Step 6: Commit**

```bash
git add storefront.mylivinghope/public/robots.txt storefront.mylivinghope/public/sitemap.xml
git commit -m "feat(storefront): add SEO assets, build verified clean"
```

---

## Task 8: Clean Up Old Next.js Files from Git

**Files:**
- Delete (from git tracking): all previously committed Next.js storefront files

- [ ] **Step 1: Remove old Next.js source files from git**

The old Next.js files were already deleted from disk in Task 1. If any were tracked by git, stage the deletions:

```bash
cd storefront.mylivinghope && git add -A .
```

Review what's staged to make sure only old Next.js files are being removed:

```bash
git diff --cached --stat
```

- [ ] **Step 2: Commit cleanup**

```bash
git commit -m "chore(storefront): remove old Next.js source files"
```

- [ ] **Step 3: Final full build + lint check**

```bash
cd storefront.mylivinghope && npm run build && npm run lint
```

Expected: clean build, no lint errors.
