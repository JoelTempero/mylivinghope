# MLH Storefront: Buy Button Pivot

> Replacing the Next.js + Shopify Storefront API headless build with React + Vite + Buy Buttons.

## Why

The Next.js headless storefront (built April 27-28) is:
- **Laggy** — Next.js 16 dev server on Windows, SSR overhead, bleeding-edge framework
- **Blocked** — Shopify Storefront API token has been historically difficult to configure
- **Overkill** — 9 GraphQL queries, full cart management, and a headless commerce stack for 1 product

MLH currently sells 1 flagship card pack. Buy Buttons eliminate the API token problem, remove all Shopify-specific server code, and let us use Joel's standard stack.

## Architecture

### Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 19 + Vite | Joel's standard stack, fast HMR, no SSR overhead |
| Language | JSX (not TypeScript) | Matches the portal, Joel's preference |
| Styling | Tailwind CSS v4 | Already in use, design system carries over |
| Routing | React Router v7 | Same as the portal |
| Icons | Lucide React | Already in use |
| Commerce | Shopify Buy Button | No API token, Shopify handles cart + checkout |
| Hosting | Firebase Hosting | Already configured for `my-living-hope` project |

### What's NOT in the stack

- No Zustand (no cart state to manage — Buy Button handles it)
- No TypeScript
- No Next.js / SSR / Server Components
- No Shopify Storefront API / GraphQL
- No API routes

## Pages

Three pages total:

### Homepage (`/`)
- Hero section with gradient, floating card accents, animations
- **Product showcase** — dedicated section featuring the flagship card pack with description, images, and an embedded Shopify Buy Button
- About snippet (founder story teaser)
- How It Works (3 steps)
- Testimonials (glassmorphism cards)
- CTA section

### About (`/about`)
- Jesse's founder story
- Psalm quote
- Audience cards (who the cards are for)
- Mission section

### Contact (`/contact`)
- Info cards (location, phone, email)
- Contact form → `mailto:` link for now (will revisit with client)

No products listing page. No product detail page. The homepage IS the product page.

**Future:** When Jesse adds more products, we add a `/products` route and individual product pages. Minimal effort when the time comes.

## Commerce Integration

### How Buy Buttons work
1. In Shopify admin, enable the "Buy Button" sales channel
2. Select the product → generate embed code
3. Shopify provides a JavaScript snippet that renders a customisable button
4. Clicking the button opens a Shopify-hosted cart overlay → checkout

### What Shopify still handles
- Product info (price, images, description) — synced from Shopify admin
- Cart UI (overlay)
- Checkout, payments, order management
- Inventory tracking

### Integration in React
- One `BuyButton.jsx` component that loads the Shopify Buy Button SDK script and initialises it
- Styled via Buy Button config options to match MLH design (forest green, Montserrat, etc.)
- Placed in the homepage product showcase section

### Tradeoff
We lose the custom CartDrawer UI we built. For 1 product, "click buy → Shopify checkout" is a better experience than managing a cart. If the catalog grows and we want a custom cart, we revisit the Storefront API at that point.

## Design Carry-Over

### Ports directly (TSX → JSX conversion)
- `Hero` — gradient background, floating card accents, CSS animations
- `About` section — founder story teaser
- `HowItWorks` — 3-step process
- `Testimonials` — glassmorphism on green background
- `CTA` — bottom call-to-action
- `Header` — forest green, fixed, scroll-aware transparency transition, mobile hamburger, skip-to-content
- `Footer` — charcoal 4-column, social links
- About page — Psalm quote, audience cards, mission
- Contact page — info cards + form
- `globals.css` — full MLH design system (colour tokens, font variables, animations, focus-visible styles)

### Gets reworked
- Homepage product section — was `ProductGrid` pulling from API, becomes a dedicated showcase with embedded Buy Button

### Gets deleted
- `lib/shopify.ts`, `lib/queries.ts`, `types/shopify.ts` (Shopify API client)
- `stores/cart.ts` (Zustand cart state)
- `components/cart/*` (CartProvider, CartDrawer, CartLine)
- `components/product/*` (ProductCard, ProductGrid, VariantSelector, AddToCartButton)
- `app/api/cart/route.ts` (Next.js API route)
- `app/products/` (listing + detail pages)
- `app/sitemap.ts` (was pulling from Shopify API)

### Fonts
- Libre Baskerville (headings) + Montserrat (body)
- Switch from `next/font/google` to standard Google Fonts `<link>` tags or self-hosted files

## Project Structure

```
storefront.mylivinghope/
├── index.html
├── vite.config.js
├── postcss.config.js
├── package.json
├── public/
│   └── images/           (hero, about, product photos — TBD from Jesse)
├── src/
│   ├── main.jsx
│   ├── index.css         (MLH design system — ported from globals.css)
│   ├── App.jsx           (React Router setup)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── ProductShowcase.jsx   (new — flagship product + Buy Button)
│   │   │   ├── About.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── CTA.jsx
│   │   └── BuyButton.jsx            (Shopify Buy Button SDK wrapper)
│   └── pages/
│       ├── Home.jsx
│       ├── About.jsx
│       └── Contact.jsx
```

## Deployment

- Firebase Hosting under existing `my-living-hope` project
- Separate hosting site from the portal (portal stays at `my-living-hope.web.app`)
- Vite build output (`dist/`) deployed via `firebase deploy --only hosting:storefront`
- SPA fallback configured in `firebase.json` for React Router

## SEO

- Meta tags via `<Helmet>` or manual `document.title` updates per page
- Open Graph tags for social sharing
- Static `robots.txt` and simple `sitemap.xml` in `public/`
- For 1 product on 3 pages, SSR is unnecessary — crawlers handle client-rendered meta tags fine

## Open Items

- **Product images:** Joel needs to export hero/about/card images and add to `public/images/`
- **Jesse's social URLs:** Facebook/Instagram currently use placeholder URLs
- **Contact form backend:** mailto for now, revisit with client about Formspree/Firebase Function
- **Buy Button styling:** exact colour/font config will be tuned during implementation to match the design system
- **Firebase Hosting site name:** needs to be decided (subdomain or custom domain)
