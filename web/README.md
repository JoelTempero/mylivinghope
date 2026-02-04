# My Living Hope - Headless E-commerce

A modern, headless e-commerce site built with Next.js 14, TypeScript, Tailwind CSS, and Shopify Storefront API.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Commerce**: Shopify Storefront API
- **CMS**: Sanity (ready for integration)
- **Hosting**: Firebase Hosting
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Shopify store with Storefront API access
- Firebase CLI (for deployment)

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Sanity CMS (optional for now)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Site URL
NEXT_PUBLIC_SITE_URL=https://mylivinghope.co.nz
```

### 3. Get Shopify Storefront API Token

1. Go to your Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → "Create an app"
3. Name it (e.g., "Headless Storefront")
4. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
5. Install the app and copy the Storefront access token

### 4. Add Images

Copy your images to the `public` folder:

```
public/
├── logo.png              # Header logo
├── hero-image.jpg        # Main hero image
├── about-image.jpg       # About section image
├── card-float-1.jpg      # Floating card 1
├── card-float-2.jpg      # Floating card 2
├── og-image.jpg          # Social share image
└── cards/
    ├── card-1-front.jpg  # Prayer card images
    ├── card-1-back.jpg
    ├── card-2-front.jpg
    ├── card-2-back.jpg
    ├── card-3-front.jpg
    └── card-3-back.jpg
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Firebase

### First-time Setup

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize your Firebase project (if not done):
```bash
firebase init hosting
```
   - Select "Use an existing project" or create one
   - Accept defaults for most options

### Deploy

```bash
npm run firebase:deploy
```

Or manually:

```bash
npm run build
firebase deploy
```

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Products pages
│   │   └── cart/            # Cart page
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── sections/        # Homepage sections
│   │   ├── commerce/        # Product cards, Add to cart
│   │   └── cart/            # Cart provider & drawer
│   └── lib/
│       ├── shopify/         # Shopify API client
│       ├── sanity/          # Sanity CMS client
│       └── utils.ts         # Utility functions
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
└── firebase.json            # Firebase hosting config
```

## Features

- **SEO Optimized**: Server-side rendering, meta tags, JSON-LD
- **Interactive Prayer Cards**: Drag and flip animation
- **Full E-commerce**: Product listings, cart, Shopify checkout
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Skip links, ARIA labels, keyboard navigation
- **Performance**: Image optimization, font preloading

## Customization

### Colors

Edit `tailwind.config.ts` to change brand colors:

```typescript
colors: {
  charcoal: '#212021',
  blush: '#F5D7CF',
  forest: '#336F49',
  cream: '#FDF8F5',
}
```

### Content

Most section content is passed as props. Update the default values in each component file under `src/components/sections/`.

## Future Enhancements

- [ ] Sanity CMS for blog posts
- [ ] Dynamic page builder
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Search functionality
