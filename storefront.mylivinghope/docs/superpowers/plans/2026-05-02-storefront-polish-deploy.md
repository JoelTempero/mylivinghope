# Storefront Polish & Deployment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the My Living Hope storefront with working contact form, legal pages, favicon, SEO cleanup, and Firebase Hosting deployment config for mylivinghope.org.nz.

**Architecture:** All changes are in `storefront.mylivinghope/`. New pages (Privacy, Terms) follow the existing page pattern (About.jsx). Contact form switches from mailto: to FormSubmit.co POST. Firebase Hosting configured as a second site on the existing `my-living-hope` project.

**Tech Stack:** React 19, React Router v7, Tailwind CSS v4, Vite 7, Firebase Hosting

---

### Task 1: Fix Instagram URL + Remove data-tuner

Quick wins — two small edits.

**Files:**
- Modify: `src/components/layout/Footer.jsx:90`
- Modify: `src/components/sections/Hero.jsx:39`

- [ ] **Step 1: Fix Instagram URL in Footer.jsx**

In `src/components/layout/Footer.jsx`, change line 90:

```jsx
// Old:
<SocialIcon href="https://www.instagram.com/mylivinghope.nz" label="Instagram">

// New:
<SocialIcon href="https://www.instagram.com/mylivinghopenz" label="Instagram">
```

- [ ] **Step 2: Remove data-tuner from Hero.jsx**

In `src/components/sections/Hero.jsx`, remove the `data-tuner="hero-mobile"` attribute from line 39:

```jsx
// Old:
<div
  data-tuner="hero-mobile"
  className="hero-reveal hero-reveal-1 lg:hidden overflow-hidden"
>

// New:
<div className="hero-reveal hero-reveal-1 lg:hidden overflow-hidden">
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.jsx src/components/sections/Hero.jsx
git commit -m "fix: correct Instagram URL and remove data-tuner dev attribute"
```

---

### Task 2: Hero Image Scale Fix

The desktop hero image uses `width: 43%` which shrinks with viewport. It should maintain size and snap to the mobile layout at the `lg` breakpoint.

**Files:**
- Modify: `src/components/sections/Hero.jsx:28-31`

- [ ] **Step 1: Fix desktop image sizing**

In `src/components/sections/Hero.jsx`, change the desktop image container (line 28-31):

```jsx
// Old:
<div
  ref={imageRef}
  className="hero-reveal hero-reveal-3 hidden lg:block absolute pointer-events-none"
  style={{ right: '5%', top: '8%', width: '43%', willChange: 'transform' }}
>

// New:
<div
  ref={imageRef}
  className="hero-reveal hero-reveal-3 hidden lg:block absolute pointer-events-none w-[580px] xl:w-[43%]"
  style={{ right: '5%', top: '8%', willChange: 'transform' }}
>
```

This gives the image a fixed `580px` width from the `lg` breakpoint (1024px) up to `xl` (1280px), then switches to percentage-based at wider screens. The image no longer shrinks between 1024-1280px.

- [ ] **Step 2: Verify in dev server**

Run `npm run dev` and test:
- At 1024px wide: image should be 580px, not shrinking
- At 1280px+: image scales at 43% of viewport
- Below 1024px: mobile full-bleed image shown (no change)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.jsx
git commit -m "fix: hero image holds scale at mid-widths, snaps to mobile at lg breakpoint"
```

---

### Task 3: Contact Form → FormSubmit.co

Replace the mailto: fallback with a real form submission via FormSubmit.co.

**Files:**
- Modify: `src/components/layout/Footer.jsx` (FooterContactForm component, lines 18-64)

- [ ] **Step 1: Rewrite FooterContactForm**

Replace the entire `FooterContactForm` function in `src/components/layout/Footer.jsx`:

```jsx
function FooterContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://formsubmit.co/ajax/prayerprompts@outlook.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Website enquiry from ${formData.name}`,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-white/15 bg-white/5 focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green/30 transition-all duration-200 text-white text-sm placeholder:text-white/40"

  if (status === 'sent') {
    return (
      <div className="text-center py-6">
        <p className="text-white font-semibold mb-1">Message sent!</p>
        <p className="text-white/60 text-sm">We'll be in touch soon.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-white/50 hover:text-white mt-3 underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          placeholder="Name"
        />
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass}
          placeholder="Email"
        />
      </div>
      <textarea
        required
        rows={3}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className={`${inputClass} resize-none`}
        placeholder="Your message"
      />
      {status === 'error' && (
        <p className="text-red-300 text-sm">Something went wrong. Please try again or email us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-interactive w-full py-2.5 bg-forest-green hover:bg-green-light text-white font-semibold rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

Key changes from the old version:
- Uses `fetch` POST to FormSubmit.co's AJAX endpoint instead of `mailto:`
- Three states: idle (form), sending (disabled button), sent (success message), error
- Includes `_subject` for email subject line
- Success state shows confirmation + "Send another" link
- Error state shows inline message

- [ ] **Step 2: Verify in dev server**

Test the form in the browser:
- Fill in and submit → should show "Sending..." then "Message sent!"
- First real submission triggers FormSubmit.co's activation email to prayerprompts@outlook.com (Jesse must click to verify)
- Test error state by disconnecting network

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.jsx
git commit -m "feat: wire contact form to FormSubmit.co with success/error states"
```

---

### Task 4: Privacy Policy Page

Create a standard NZ-compliant privacy policy page.

**Files:**
- Create: `src/pages/Privacy.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create Privacy.jsx**

Create `src/pages/Privacy.jsx`:

```jsx
import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-br from-forest-green via-green-dark to-forest-green py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-[5%] py-16 md:py-20 prose-mlh">
        <p className="text-text-secondary leading-relaxed mb-8">
          My Living Hope respects your privacy. This policy explains what information
          we collect, how we use it, and your rights under New Zealand's Privacy Act 2020.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">What we collect</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We collect information you give us directly:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li><strong>Contact form:</strong> Your name, email address, and message.</li>
          <li><strong>Orders:</strong> When you purchase through our Shopify checkout, Shopify
            collects your name, email, shipping address, and payment details. We receive
            order and shipping information but never see your full payment details.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">How we use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li>To respond to your enquiries.</li>
          <li>To fulfil and ship your orders.</li>
          <li>To let you know about new products or updates, only if you've asked us to.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">Who we share it with</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We only share your information with services that help us run the business:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li><strong>Shopify:</strong> Processes payments and manages orders.</li>
          <li><strong>FormSubmit.co:</strong> Delivers contact form messages to our inbox.</li>
        </ul>
        <p className="text-text-secondary leading-relaxed mb-6">
          We don't sell your information to anyone.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Cookies</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          This website uses cookies only through the Shopify Buy Button, which needs
          them to manage your shopping cart. We don't use analytics cookies or
          tracking tools.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Your rights</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Under the Privacy Act 2020, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-6">
          <li>Ask what personal information we hold about you.</li>
          <li>Request corrections to your information.</li>
          <li>Ask us to delete your information.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">Contact us</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          If you have questions about your privacy or want to make a request,
          email us at{' '}
          <a href="mailto:prayerprompts@outlook.com">prayerprompts@outlook.com</a>.
        </p>
        <p className="text-text-secondary leading-relaxed">
          If you're not satisfied with our response, you can contact the{' '}
          <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer">
            Office of the Privacy Commissioner
          </a>.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add route to App.jsx**

In `src/App.jsx`, add the import and route:

```jsx
// Add import after About:
import Privacy from './pages/Privacy'

// Add route after /about:
<Route path="/privacy" element={<Privacy />} />
```

- [ ] **Step 3: Verify in dev server**

Navigate to `/privacy` — page should render with green header, body content, and working email link.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Privacy.jsx src/App.jsx
git commit -m "feat: add privacy policy page with NZ Privacy Act 2020 compliance"
```

---

### Task 5: Terms & Conditions Page

Create a standard terms page for a greeting card product business.

**Files:**
- Create: `src/pages/Terms.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create Terms.jsx**

Create `src/pages/Terms.jsx`:

```jsx
import { useEffect } from 'react'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms & Conditions — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="bg-gradient-to-br from-forest-green via-green-dark to-forest-green py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-[5%] text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Terms & Conditions
          </h1>
          <p className="text-white/70 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-[5%] py-16 md:py-20 prose-mlh">
        <p className="text-text-secondary leading-relaxed mb-8">
          These terms apply when you use the My Living Hope website or purchase
          our products. By using this site, you agree to these terms.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Products</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          My Living Hope sells physical greeting cards ("Prayer Portals"). Product
          images and descriptions on this site are as accurate as possible, but
          slight colour variations may occur between screens and printed cards.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Orders & payment</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          All orders are processed through Shopify's secure checkout. Prices are
          listed in New Zealand Dollars (NZD) and include GST where applicable.
          We'll confirm your order by email once it's placed.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Shipping</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          We ship within New Zealand. Delivery timeframes are estimates and may
          vary depending on your location and courier availability. We'll provide
          tracking information where available.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Returns & refunds</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          If you're not happy with your purchase, you can return unopened products
          within 14 days of receiving them for a full refund. To arrange a return,
          email us at{' '}
          <a href="mailto:prayerprompts@outlook.com">prayerprompts@outlook.com</a>.
        </p>
        <p className="text-text-secondary leading-relaxed mb-6">
          Your rights under the Consumer Guarantees Act 1993 are not affected by
          these terms. If a product is faulty or doesn't match its description,
          you're entitled to a remedy regardless of this returns policy.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Intellectual property</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          All card designs, artwork, and content on this website are the property
          of My Living Hope. You may not reproduce, distribute, or use our designs
          without written permission.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Limitation of liability</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          To the extent permitted by New Zealand law, My Living Hope is not liable
          for any indirect or consequential loss arising from the use of this
          website or our products.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Changes to these terms</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          We may update these terms from time to time. The "last updated" date at
          the top of this page will reflect any changes.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Governing law</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          These terms are governed by the laws of New Zealand.
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-10">Contact us</h2>
        <p className="text-text-secondary leading-relaxed">
          Questions about these terms? Email us at{' '}
          <a href="mailto:prayerprompts@outlook.com">prayerprompts@outlook.com</a>.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add route to App.jsx**

In `src/App.jsx`, add the import and route:

```jsx
// Add import after Privacy:
import Terms from './pages/Terms'

// Add route after /privacy:
<Route path="/terms" element={<Terms />} />
```

- [ ] **Step 3: Verify in dev server**

Navigate to `/terms` — page should render with green header, body content, Consumer Guarantees Act reference, and working email links.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Terms.jsx src/App.jsx
git commit -m "feat: add terms & conditions page with Consumer Guarantees Act compliance"
```

---

### Task 6: Footer Links for Privacy & Terms

Add small links in the copyright bar of the footer.

**Files:**
- Modify: `src/components/layout/Footer.jsx`

- [ ] **Step 1: Add links to mobile footer**

In `Footer.jsx`, find the mobile copyright block (around line 125). Add the legal links between the copyright and the Sidequest credit:

```jsx
// Replace the mobile copyright <p> (lines ~124-130):
<p className="text-xs text-white/60 text-center">
  &copy; {new Date().getFullYear()} My Living Hope. Site created by{' '}
  <a href="https://sidequest.nz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
    Sidequest Digital
  </a>
</p>

// With:
<p className="text-xs text-white/60 text-center">
  &copy; {new Date().getFullYear()} My Living Hope. Site created by{' '}
  <a href="https://sidequest.nz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
    Sidequest Digital
  </a>
</p>
<p className="text-xs text-white/40 text-center mt-2">
  <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
  <span className="mx-2">·</span>
  <Link to="/terms" className="hover:text-white/60 transition-colors">Terms & Conditions</Link>
</p>
```

- [ ] **Step 2: Add links to desktop footer**

In `Footer.jsx`, find the desktop copyright block (around line 179-186). Add legal links inline:

```jsx
// Replace the desktop copyright <div> (lines ~179-186):
<div className="flex items-center justify-between gap-4 pt-8">
  <p className="text-xs text-white/60">
    &copy; {new Date().getFullYear()} My Living Hope. Site created by{' '}
    <a href="https://sidequest.nz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
      Sidequest Digital
    </a>
  </p>
</div>

// With:
<div className="flex items-center justify-between gap-4 pt-8">
  <p className="text-xs text-white/60">
    &copy; {new Date().getFullYear()} My Living Hope. Site created by{' '}
    <a href="https://sidequest.nz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
      Sidequest Digital
    </a>
  </p>
  <p className="text-xs text-white/40">
    <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
    <span className="mx-2">·</span>
    <Link to="/terms" className="hover:text-white/60 transition-colors">Terms & Conditions</Link>
  </p>
</div>
```

- [ ] **Step 3: Verify in dev server**

Check both mobile and desktop footer — links should be small, muted, and navigate to the correct pages.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.jsx
git commit -m "feat: add privacy policy and terms links to footer"
```

---

### Task 7: Favicon Setup

Generate favicon files from the existing lantern icon and wire them into index.html.

**Files:**
- Create: `public/favicon.ico`
- Create: `public/apple-touch-icon.png`
- Create: `public/favicon-32x32.png`
- Create: `public/favicon-16x16.png`
- Modify: `index.html`

- [ ] **Step 1: Install sharp as dev dependency**

```bash
cd storefront.mylivinghope && npm install --save-dev sharp
```

- [ ] **Step 2: Create favicon generation script**

Create `scripts/generate-favicons.js`:

```js
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = resolve(__dirname, '../public/images/icon.png')
const pub = resolve(__dirname, '../public')

async function generate() {
  await sharp(src).resize(16, 16).png().toFile(resolve(pub, 'favicon-16x16.png'))
  await sharp(src).resize(32, 32).png().toFile(resolve(pub, 'favicon-32x32.png'))
  await sharp(src).resize(180, 180).png().toFile(resolve(pub, 'apple-touch-icon.png'))

  // favicon.ico — 32x32 PNG renamed (browsers accept PNG-in-ICO)
  const ico = await sharp(src).resize(32, 32).png().toBuffer()
  writeFileSync(resolve(pub, 'favicon.ico'), ico)

  console.log('Favicons generated.')
}

generate()
```

- [ ] **Step 3: Run the script**

```bash
cd storefront.mylivinghope && node scripts/generate-favicons.js
```

Verify the files exist: `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`.

- [ ] **Step 4: Add link tags to index.html**

In `index.html`, add favicon links inside `<head>` after the viewport meta tag:

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

- [ ] **Step 5: Verify in dev server**

Reload the site — the browser tab should show the cream lantern icon.

- [ ] **Step 6: Commit**

```bash
git add public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png scripts/generate-favicons.js index.html
git commit -m "feat: add favicon set generated from lantern icon"
```

---

### Task 8: SEO Cleanup — Sitemap, robots.txt, OG Tags

Update all URLs to the correct domain and fix sitemap page list.

**Files:**
- Modify: `public/sitemap.xml`
- Modify: `public/robots.txt`
- Modify: `index.html`

- [ ] **Step 1: Update sitemap.xml**

Replace `public/sitemap.xml` entirely:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mylivinghope.org.nz/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mylivinghope.org.nz/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mylivinghope.org.nz/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://mylivinghope.org.nz/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Update robots.txt**

Replace `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://mylivinghope.org.nz/sitemap.xml
```

- [ ] **Step 3: Update OG tags in index.html**

In `index.html`, add the `og:url` tag and update existing OG tags:

```html
<!-- Add after og:type -->
<meta property="og:url" content="https://mylivinghope.org.nz/" />
```

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml public/robots.txt index.html
git commit -m "fix: update sitemap, robots.txt, and OG tags to mylivinghope.org.nz"
```

---

### Task 9: Firebase Hosting Configuration

Configure Firebase Hosting as a second site on the existing `my-living-hope` project. The portal already uses the default hosting site, so the storefront needs a named site.

**Files:**
- Create: `firebase.json`
- Create: `.firebaserc`

- [ ] **Step 1: Create firebase.json**

Create `storefront.mylivinghope/firebase.json`:

```json
{
  "hosting": {
    "site": "mlh-storefront",
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

The `"site": "mlh-storefront"` tells Firebase to deploy to that specific hosting site, not the portal's default site.

- [ ] **Step 2: Create .firebaserc**

Create `storefront.mylivinghope/.firebaserc`:

```json
{
  "projects": {
    "default": "my-living-hope"
  }
}
```

- [ ] **Step 3: Add deploy script to package.json**

Add a deploy script to `storefront.mylivinghope/package.json`:

```json
"deploy": "npm run build && firebase deploy --only hosting:mlh-storefront"
```

- [ ] **Step 4: Create the hosting site in Firebase (manual step — Joel)**

Before first deploy, Joel needs to create the hosting site:

```bash
cd storefront.mylivinghope && firebase hosting:sites:create mlh-storefront --project my-living-hope
```

- [ ] **Step 5: Build and deploy**

```bash
cd storefront.mylivinghope && npm run deploy
```

The site will be live at `mlh-storefront.web.app`. Then connect the custom domain:

1. Go to Firebase Console → Hosting → mlh-storefront
2. Click "Add custom domain" → enter `mylivinghope.org.nz`
3. Add the TXT record to the domain's DNS for verification
4. Add the A records Firebase provides
5. Wait for SSL provisioning (can take up to 24 hours)

- [ ] **Step 6: Commit**

```bash
git add firebase.json .firebaserc package.json
git commit -m "feat: configure Firebase Hosting for storefront deployment"
```
