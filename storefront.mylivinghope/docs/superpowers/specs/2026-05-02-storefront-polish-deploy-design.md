# Storefront Polish & Deployment — Design Spec

**Date:** 2026-05-02
**Project:** My Living Hope Storefront (`storefront.mylivinghope/`)
**Domain:** mylivinghope.org.nz

---

## 1. Contact Form → FormSubmit.co

Convert footer contact form from `mailto:` to FormSubmit.co POST submission.

- **Endpoint:** `https://formsubmit.co/prayerprompts@outlook.com`
- **Fields:** name, email, message (existing)
- **Spam protection:** FormSubmit honeypot field (`_honey`) + built-in captcha on first submission
- **UX:** Show success message after submission, error state on failure. Disable button during submit.
- **Config:** Disable FormSubmit's default captcha page via `_captcha=false`, set `_next` to a thank-you state (stay on page, not redirect)
- **Activation:** Jesse receives a one-time activation email on the first real submission — must click to verify

## 2. Privacy Policy Page (`/privacy`)

Standard NZ-compliant privacy policy for a small business selling greeting cards via Shopify.

- **Data collected:** Name, email, message (contact form); standard Shopify checkout data (payment, shipping)
- **Data use:** Respond to enquiries; fulfil orders via Shopify
- **Third parties:** Shopify (checkout/payment), FormSubmit.co (contact form delivery)
- **Cookies:** Only Shopify Buy Button SDK cookies (no analytics cookies currently)
- **Rights:** Users can request data access/deletion via email
- **NZ compliance:** Reference Privacy Act 2020 information privacy principles
- **Contact:** prayerprompts@outlook.com
- **Style:** Friendly, plain language — not legalese. Matches brand voice.

## 3. Terms & Conditions Page (`/terms`)

Standard terms for a greeting card product business.

- **Products:** Physical greeting cards ("Prayer Portals")
- **Orders & payment:** Processed via Shopify checkout
- **Shipping:** NZ-based, standard shipping. Timeframes noted as estimates.
- **Returns/refunds:** Unopened product within 14 days of receipt. Consumer Guarantees Act rights preserved.
- **Intellectual property:** Card designs, artwork, and scripture selections are My Living Hope IP
- **Liability:** Standard limitation — not liable for indirect/consequential damages
- **Governing law:** New Zealand
- **Style:** Same plain-language approach as privacy policy

## 4. Footer Links

Add `Privacy Policy` and `Terms & Conditions` links to the footer copyright bar.

- **Mobile:** Below copyright text, small centered text
- **Desktop:** Inline with copyright, separated by `·`
- React Router `<Link>` components to `/privacy` and `/terms`

## 5. Favicon

Generate favicon set from existing `public/images/icon.png` (cream lantern icon).

- `favicon.ico` (multi-size: 16x16, 32x32)
- `apple-touch-icon.png` (180x180)
- `favicon-32x32.png`, `favicon-16x16.png`
- Add `<link>` tags to `index.html`
- Use sharp/canvas or manual conversion from the source PNG

## 6. Firebase Hosting

Configure Firebase Hosting for SPA deployment.

- **`firebase.json`:** Hosting config with `dist` as public dir, SPA rewrites (`/**` → `index.html`), cache headers for static assets
- **`.firebaserc`:** Project alias `my-living-hope`
- **Domain:** `mylivinghope.org.nz` — configured via Firebase console after deploy. DNS steps:
  1. Add custom domain in Firebase Hosting console
  2. Add TXT record for verification
  3. Add A records pointing to Firebase IPs
  4. SSL auto-provisioned by Firebase
- **Deploy command:** `firebase deploy --only hosting:storefront --project my-living-hope`

## 7. Instagram URL Fix

Update footer social link from `https://www.instagram.com/mylivinghope.nz` to `https://www.instagram.com/mylivinghopenz`.

## 8. Hero Image Fix

Desktop hero image (`width: 43%`) shrinks with viewport. Fix:

- Add `min-w-[500px]` or similar to prevent shrinking between lg breakpoint and full desktop
- Existing `lg:hidden` / `lg:block` swap handles the mobile snap — no change needed there

## 9. Sitemap & Cleanup

- **Sitemap:** Remove `/contact`, add `/privacy` (monthly, 0.5) and `/terms` (monthly, 0.5). Update domain to `https://mylivinghope.org.nz/`
- **robots.txt:** Update sitemap URL to `https://mylivinghope.org.nz/sitemap.xml`
- **Cleanup:** Remove `data-tuner` attributes from Hero.jsx
- **OG tags:** Update `index.html` OG URL to `mylivinghope.org.nz`

## 10. Router Updates

Add routes in `App.jsx`:
- `/privacy` → `Privacy` page
- `/terms` → `Terms` page
