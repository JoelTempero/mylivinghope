# Headless Storefront — Design Spec

## Overview

Replace the Shopify Liquid theme (`mylivinghope/`) with a fully custom Next.js storefront. Shopify remains the commerce backend (products, inventory, checkout, orders). The new site owns 100% of the frontend — design, layout, animations, content — using Joel's design playbooks for creative direction.

**Motivation:** Shopify's Liquid templating is too constraining creatively. The existing design playbooks (DesignSystem, Creativity) produce far better results than what's achievable within Shopify theme constraints.

## Architecture

### Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS v4
- **Commerce API:** Shopify Storefront API (GraphQL)
- **Hosting:** Vercel
- **Domain:** mylivinghope.org.nz (main storefront)
- **Checkout:** Shopify-hosted checkout (redirect from cart)

### Relationship to Other Systems

- **Portal** (`portal.mylivinghope.org.nz`): Completely separate app and repo. No shared code. Both use Firebase but for different purposes.
- **Shopify Admin:** Founder (Jesse) continues managing products, inventory, and orders through Shopify's admin UI as normal.
- **Shopify Liquid Theme:** Retired after the headless storefront launches. Can be kept as a fallback during transition.

## App Structure

```
storefront.mylivinghope/
├── src/app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Homepage
│   ├── products/
│   │   ├── page.tsx            # Product listing / collections
│   │   └── [handle]/page.tsx   # Individual product page (SSR)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── cart/page.tsx           # Cart page (client-side)
├── src/lib/
│   ├── shopify.ts              # Storefront API client
│   └── queries.ts              # GraphQL query fragments
├── src/components/
│   ├── layout/                 # Header, Footer, Nav
│   ├── product/                # ProductCard, ProductGrid, VariantSelector
│   ├── cart/                   # CartDrawer, CartLine, CartProvider
│   └── ui/                    # Shared primitives (Button, etc.)
├── next.config.js
└── package.json
```

## Pages & Shopify API Mapping

| Page | Shopify Data | Rendering Strategy |
|------|-------------|-------------------|
| Homepage | Featured products (by collection handle), product images | ISR (revalidate ~60s) |
| Products listing | All products or by collection, with filtering | ISR |
| Product detail `[handle]` | Single product: variants, pricing, images, description | ISR with `generateStaticParams` |
| Cart | Cart lines, quantities, totals | Client-side (Storefront API cart mutations) |
| Checkout | N/A — redirect to Shopify checkout URL | Redirect |
| About | None — static content | Static |
| Contact | None — static content or Firebase form submission | Static |

## Shopify Storefront API Operations

### Queries (server-side, SSR/ISR)
- `products` — fetch all/filtered products for listing page
- `productByHandle` — fetch single product for detail page
- `collectionByHandle` — fetch products within a collection

### Mutations (client-side, cart management)
- `cartCreate` — create a new cart session
- `cartLinesAdd` — add product variant to cart
- `cartLinesUpdate` — update quantity of a cart line
- `cartLinesRemove` — remove item from cart
- Access `cart.checkoutUrl` to redirect to Shopify-hosted checkout

## Data Flow

1. **Product pages:** Next.js fetches product data from Storefront API at build time (or on revalidation). Pages are statically generated — fast loads, fully crawlable by search engines.
2. **Cart:** Client-side Zustand store manages cart state (consistent with portal's state management choice). Cart mutations hit the Storefront API directly from the browser. Cart ID persisted in localStorage.
3. **Checkout:** When the user clicks "Checkout", redirect to the Shopify-hosted checkout URL from the cart object. Shopify handles payment, shipping, and order creation.
4. **Product images:** Served directly from Shopify's CDN — no need to host or process images.
5. **ISR revalidation:** Product changes made in Shopify admin (new cards, price updates, stock changes) appear on the storefront within the revalidation window (~60s) without requiring a redeploy.

## Shopify Setup Required

1. Create a custom app in Shopify admin with Storefront API access
2. Generate a Storefront API access token
3. Token stored in environment variables (`SHOPIFY_STOREFRONT_TOKEN`, `SHOPIFY_STORE_DOMAIN`)
4. No changes needed to existing Shopify product/inventory management workflow

## Responsibility Split

| Shopify Handles | Custom Storefront Handles |
|----------------|--------------------------|
| Products, inventory, pricing, variants | All frontend design, layout, animations |
| Checkout, payments, shipping | SEO meta tags, Open Graph, structured data |
| Order management, fulfillment | Content pages (About, Contact) |
| Product images (CDN) | Brand experience, creative direction |
| Customer accounts (optional) | Product browsing, filtering, search |

## SEO Considerations

- SSR/ISR ensures all product pages are fully crawlable
- Next.js `generateMetadata` for per-page title, description, Open Graph tags
- Product structured data (JSON-LD) on product detail pages
- Sitemap generation via `next-sitemap` or Next.js built-in
- Product images with proper alt text from Shopify product data

## Design Approach

The storefront will be built using Joel's standard website rebuild workflow and design playbooks (DesignSystem, Creativity). The existing Shopify theme's content and sections (hero, about, interactive cards, how-it-works, testimonials, CTA, contact) inform the page structure, but the design itself is a fresh creative build with full freedom.

Brand colors: green (#336F49), salmon (#F5D7CF), cream (#FDF8F5).
