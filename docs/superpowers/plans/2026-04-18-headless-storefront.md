# Headless Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js storefront for My Living Hope that replaces the Shopify Liquid theme, using the Shopify Storefront API for products and checkout, with full creative control over the frontend.

**Architecture:** Next.js App Router with TypeScript and Tailwind CSS v4. Server-side rendering with ISR for product pages (SEO). Client-side cart via Zustand backed by Shopify Storefront API cart mutations. Checkout redirects to Shopify's hosted checkout. Deployed to Vercel.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4, Zustand, Shopify Storefront API (GraphQL)

---

## File Structure

```
storefront.mylivinghope/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing
│   │   │   └── [handle]/page.tsx     # Product detail
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── cart/page.tsx
│   ├── lib/
│   │   ├── shopify.ts               # Storefront API client
│   │   └── queries.ts               # GraphQL query/mutation strings
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── VariantSelector.tsx
│   │   ├── cart/
│   │   │   ├── CartProvider.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartLine.tsx
│   │   └── ui/
│   │       └── Button.tsx
│   ├── stores/
│   │   └── cart.ts                   # Zustand cart store
│   └── types/
│       └── shopify.ts               # Shopify API types
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

### Task 1: Next.js Project Scaffold

**Files:**
- Create: `storefront.mylivinghope/` (full Next.js scaffold)

- [ ] **Step 1: Create the Next.js project**

Run from the project root (`My Living Hope/`):

```bash
npx create-next-app@latest storefront.mylivinghope --typescript --tailwind --app --src-dir --no-import-alias --use-npm
```

When prompted:
- ESLint: Yes
- Turbopack: Yes (for dev)

- [ ] **Step 2: Verify it runs**

Run: `cd storefront.mylivinghope && npm run dev`

Expected: Next.js dev server starts on http://localhost:3000 with the default page.

- [ ] **Step 3: Clean up default content**

Remove the default Next.js content from `src/app/page.tsx` and `src/app/globals.css`. Replace page.tsx with:

```tsx
export default function Home() {
  return (
    <main>
      <h1>My Living Hope</h1>
      <p>Coming soon</p>
    </main>
  )
}
```

Strip `globals.css` down to just the Tailwind directives:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Install additional dependencies**

Run: `cd storefront.mylivinghope && npm install zustand`

- [ ] **Step 5: Commit**

```bash
git add storefront.mylivinghope/
git commit -m "feat: scaffold Next.js storefront project"
```

---

### Task 2: Shopify API Types

**Files:**
- Create: `storefront.mylivinghope/src/types/shopify.ts`

- [ ] **Step 1: Create Shopify type definitions**

```ts
// storefront.mylivinghope/src/types/shopify.ts

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyPrice {
  amount: string
  currencyCode: string
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyPrice
  compareAtPrice: ShopifyPrice | null
  selectedOptions: { name: string; value: string }[]
  image: ShopifyImage | null
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: ShopifyImage[]
  variants: ShopifyProductVariant[]
  tags: string[]
  productType: string
  seo: {
    title: string | null
    description: string | null
  }
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: ShopifyProduct[]
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
    price: ShopifyPrice
    selectedOptions: { name: string; value: string }[]
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyPrice
    totalAmount: ShopifyPrice
    totalTaxAmount: ShopifyPrice | null
  }
  lines: ShopifyCartLine[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/shopify.ts
git commit -m "feat: add Shopify Storefront API type definitions"
```

---

### Task 3: Shopify API Client & GraphQL Queries

**Files:**
- Create: `storefront.mylivinghope/src/lib/shopify.ts`
- Create: `storefront.mylivinghope/src/lib/queries.ts`
- Modify: `storefront.mylivinghope/.env.local` (create)

- [ ] **Step 1: Create .env.local with Shopify credentials**

Create `storefront.mylivinghope/.env.local`:

```
SHOPIFY_STORE_DOMAIN=my-living-hope.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token-here
```

Note: The actual token must be generated from Shopify admin > Settings > Apps and sales channels > Develop apps > Create an app > Configure Storefront API scopes > Install app.

- [ ] **Step 2: Create GraphQL query fragments**

```ts
// storefront.mylivinghope/src/lib/queries.ts

const IMAGE_FRAGMENT = `
  url
  altText
  width
  height
`

const VARIANT_FRAGMENT = `
  id
  title
  availableForSale
  price {
    amount
    currencyCode
  }
  compareAtPrice {
    amount
    currencyCode
  }
  selectedOptions {
    name
    value
  }
  image {
    ${IMAGE_FRAGMENT}
  }
`

const PRODUCT_FRAGMENT = `
  id
  handle
  title
  description
  descriptionHtml
  availableForSale
  productType
  tags
  seo {
    title
    description
  }
  featuredImage {
    ${IMAGE_FRAGMENT}
  }
  images(first: 10) {
    nodes {
      ${IMAGE_FRAGMENT}
    }
  }
  variants(first: 20) {
    nodes {
      ${VARIANT_FRAGMENT}
    }
  }
`

export const GET_PRODUCTS = `
  query GetProducts($first: Int = 20) {
    products(first: $first) {
      nodes {
        ${PRODUCT_FRAGMENT}
      }
    }
  }
`

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ${PRODUCT_FRAGMENT}
    }
  }
`

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int = 20) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image {
        ${IMAGE_FRAGMENT}
      }
      products(first: $first) {
        nodes {
          ${PRODUCT_FRAGMENT}
        }
      }
    }
  }
`

export const GET_ALL_PRODUCT_HANDLES = `
  query GetAllProductHandles {
    products(first: 100) {
      nodes {
        handle
      }
    }
  }
`

const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          product {
            handle
            title
            featuredImage {
              ${IMAGE_FRAGMENT}
            }
          }
        }
      }
    }
  }
`

export const CREATE_CART = `
  mutation CreateCart {
    cartCreate {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const UPDATE_CART_LINE = `
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FRAGMENT}
    }
  }
`
```

- [ ] **Step 3: Create the Shopify API client**

```ts
// storefront.mylivinghope/src/lib/shopify.ts
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
} from '@/types/shopify'
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_COLLECTION_BY_HANDLE,
  GET_ALL_PRODUCT_HANDLES,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINE,
  REMOVE_FROM_CART,
  GET_CART,
} from './queries'

const domain = process.env.SHOPIFY_STORE_DOMAIN!
const token = process.env.SHOPIFY_STOREFRONT_TOKEN!
const endpoint = `https://${domain}/api/2024-10/graphql.json`

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()

  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '))
  }

  return json.data
}

function reshapeProduct(product: any): ShopifyProduct {
  return {
    ...product,
    images: product.images.nodes,
    variants: product.variants.nodes,
  }
}

// Products
export async function getProducts(count = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: any[] } }>(GET_PRODUCTS, { first: count })
  return data.products.nodes.map(reshapeProduct)
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ productByHandle: any | null }>(GET_PRODUCT_BY_HANDLE, { handle })
  if (!data.productByHandle) return null
  return reshapeProduct(data.productByHandle)
}

export async function getAllProductHandles(): Promise<string[]> {
  const data = await shopifyFetch<{ products: { nodes: { handle: string }[] } }>(GET_ALL_PRODUCT_HANDLES)
  return data.products.nodes.map((p) => p.handle)
}

// Collections
export async function getCollectionByHandle(handle: string, count = 20): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{ collectionByHandle: any | null }>(GET_COLLECTION_BY_HANDLE, { handle, first: count })
  if (!data.collectionByHandle) return null
  return {
    ...data.collectionByHandle,
    products: data.collectionByHandle.products.nodes.map(reshapeProduct),
  }
}

// Cart
export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: any } }>(CREATE_CART)
  return reshapeCart(data.cartCreate.cart)
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: any } }>(ADD_TO_CART, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  })
  return reshapeCart(data.cartLinesAdd.cart)
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>(UPDATE_CART_LINE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  })
  return reshapeCart(data.cartLinesUpdate.cart)
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: any } }>(REMOVE_FROM_CART, {
    cartId,
    lineIds,
  })
  return reshapeCart(data.cartLinesRemove.cart)
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: any | null }>(GET_CART, { cartId })
  if (!data.cart) return null
  return reshapeCart(data.cart)
}

function reshapeCart(cart: any): ShopifyCart {
  return {
    ...cart,
    lines: cart.lines.nodes,
  }
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd storefront.mylivinghope && npx tsc --noEmit`

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ .env.local.example
git commit -m "feat: add Shopify Storefront API client and GraphQL queries"
```

Note: Create `.env.local.example` (without the real token) to track the required env vars:
```
SHOPIFY_STORE_DOMAIN=my-living-hope.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-token-here
```

---

### Task 4: Cart Store (Zustand)

**Files:**
- Create: `storefront.mylivinghope/src/stores/cart.ts`

- [ ] **Step 1: Create the cart store**

```ts
// storefront.mylivinghope/src/stores/cart.ts
import { create } from 'zustand'
import type { ShopifyCart } from '@/types/shopify'

interface CartState {
  cart: ShopifyCart | null
  isOpen: boolean
  loading: boolean
  openCart: () => void
  closeCart: () => void
  setCart: (cart: ShopifyCart) => void
  setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isOpen: false,
  loading: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ loading }),
}))
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/cart.ts
git commit -m "feat: add Zustand cart store"
```

---

### Task 5: Cart Provider (Client Component)

**Files:**
- Create: `storefront.mylivinghope/src/components/cart/CartProvider.tsx`

- [ ] **Step 1: Create the CartProvider**

This component initializes the cart from localStorage on mount and provides cart action functions.

```tsx
// storefront.mylivinghope/src/components/cart/CartProvider.tsx
'use client'

import { useEffect, useCallback } from 'react'
import { useCartStore } from '@/stores/cart'

const CART_ID_KEY = 'mlh-cart-id'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { setCart, setLoading } = useCartStore()

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return

    setLoading(true)
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', cartId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) setCart(data.cart)
        else localStorage.removeItem(CART_ID_KEY)
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY))
      .finally(() => setLoading(false))
  }, [setCart, setLoading])

  return <>{children}</>
}

export async function cartAction(
  action: 'create' | 'add' | 'update' | 'remove',
  params: Record<string, unknown> = {}
) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  })
  const data = await res.json()

  if (data.cart) {
    localStorage.setItem(CART_ID_KEY, data.cart.id)
    useCartStore.getState().setCart(data.cart)
  }

  return data.cart
}
```

- [ ] **Step 2: Create the cart API route**

Create `storefront.mylivinghope/src/app/api/cart/route.ts`:

```ts
// storefront.mylivinghope/src/app/api/cart/route.ts
import { NextResponse } from 'next/server'
import { createCart, addToCart, updateCartLine, removeFromCart, getCart } from '@/lib/shopify'

export async function POST(request: Request) {
  const body = await request.json()
  const { action, cartId, variantId, quantity, lineId, lineIds } = body

  try {
    let cart
    switch (action) {
      case 'create':
        cart = await createCart()
        break
      case 'add':
        cart = await addToCart(cartId, variantId, quantity || 1)
        break
      case 'update':
        cart = await updateCartLine(cartId, lineId, quantity)
        break
      case 'remove':
        cart = await removeFromCart(cartId, lineIds)
        break
      case 'get':
        cart = await getCart(cartId)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    return NextResponse.json({ cart })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cart/CartProvider.tsx src/app/api/cart/route.ts
git commit -m "feat: add CartProvider and cart API route"
```

---

### Task 6: Layout Shell (Header + Footer)

**Files:**
- Create: `storefront.mylivinghope/src/components/layout/Header.tsx`
- Create: `storefront.mylivinghope/src/components/layout/Footer.tsx`
- Modify: `storefront.mylivinghope/src/app/layout.tsx`

- [ ] **Step 1: Create Header component**

```tsx
// storefront.mylivinghope/src/components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

export default function Header() {
  const { cart, openCart } = useCartStore()
  const itemCount = cart?.totalQuantity || 0

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F5]/90 backdrop-blur-md border-b border-[#336F49]/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#336F49]">
          My Living Hope
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/products" className="text-sm text-[#212021] hover:text-[#336F49] transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm text-[#212021] hover:text-[#336F49] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-[#212021] hover:text-[#336F49] transition-colors">
            Contact
          </Link>
          <button onClick={openCart} className="relative text-[#212021] hover:text-[#336F49] transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#336F49] text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create Footer component**

```tsx
// storefront.mylivinghope/src/components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#336F49] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">My Living Hope</h3>
            <p className="text-sm text-white/70">
              Prayer Portals — connecting your emotions with Scripture and prayer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/products" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Made in New Zealand</h4>
            <p className="text-sm text-white/70">
              Christchurch, NZ
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} My Living Hope. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update root layout**

Replace `storefront.mylivinghope/src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/CartProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Living Hope — Prayer Portals',
  description: 'Beautifully designed cards that help you bring both your joys and struggles to God. Connect your emotions with Scripture and discover new ways to pray.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FDF8F5] text-[#212021]`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Install lucide-react**

Run: `cd storefront.mylivinghope && npm install lucide-react`

- [ ] **Step 5: Verify it renders**

Run: `cd storefront.mylivinghope && npm run dev`

Expected: Page loads with header (logo, nav, cart icon) and footer.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add Header, Footer, and root layout with CartProvider"
```

---

### Task 7: Product Card & Grid Components

**Files:**
- Create: `storefront.mylivinghope/src/components/product/ProductCard.tsx`
- Create: `storefront.mylivinghope/src/components/product/ProductGrid.tsx`

- [ ] **Step 1: Create ProductCard**

```tsx
// storefront.mylivinghope/src/components/product/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'

interface ProductCardProps {
  product: ShopifyProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants[0]?.price
  const comparePrice = product.variants[0]?.compareAtPrice

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute top-3 right-3 bg-[#212021] text-white text-xs px-2 py-1 rounded">
            Sold out
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-medium text-[#212021] group-hover:text-[#336F49] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#336F49] font-semibold">
            ${parseFloat(price?.amount || '0').toFixed(2)} {price?.currencyCode}
          </span>
          {comparePrice && parseFloat(comparePrice.amount) > parseFloat(price?.amount || '0') && (
            <span className="text-sm text-gray-400 line-through">
              ${parseFloat(comparePrice.amount).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create ProductGrid**

```tsx
// storefront.mylivinghope/src/components/product/ProductGrid.tsx
import type { ShopifyProduct } from '@/types/shopify'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: ShopifyProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/product/
git commit -m "feat: add ProductCard and ProductGrid components"
```

---

### Task 8: Products Listing Page

**Files:**
- Create: `storefront.mylivinghope/src/app/products/page.tsx`

- [ ] **Step 1: Create the products listing page**

```tsx
// storefront.mylivinghope/src/app/products/page.tsx
import type { Metadata } from 'next'
import { getProducts } from '@/lib/shopify'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Shop — My Living Hope',
  description: 'Browse our collection of Prayer Portals and other products.',
}

export const revalidate = 60

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#212021]">Shop</h1>
        <p className="mt-2 text-gray-600">Browse our collection of Prayer Portals</p>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}
```

- [ ] **Step 2: Verify it renders (requires Shopify token)**

Run: `cd storefront.mylivinghope && npm run dev`

Navigate to http://localhost:3000/products. If the Shopify token isn't set yet, you'll see an error — that's expected. With a valid token, products should render in a grid.

- [ ] **Step 3: Commit**

```bash
git add src/app/products/page.tsx
git commit -m "feat: add products listing page with ISR"
```

---

### Task 9: Product Detail Page

**Files:**
- Create: `storefront.mylivinghope/src/app/products/[handle]/page.tsx`
- Create: `storefront.mylivinghope/src/components/product/VariantSelector.tsx`
- Create: `storefront.mylivinghope/src/components/product/AddToCartButton.tsx`

- [ ] **Step 1: Create VariantSelector**

```tsx
// storefront.mylivinghope/src/components/product/VariantSelector.tsx
'use client'

import type { ShopifyProductVariant } from '@/types/shopify'

interface VariantSelectorProps {
  variants: ShopifyProductVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
}

export default function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  if (variants.length <= 1) return null

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#212021]">Options</label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            disabled={!variant.availableForSale}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              selectedVariantId === variant.id
                ? 'border-[#336F49] bg-[#336F49] text-white'
                : variant.availableForSale
                  ? 'border-gray-300 hover:border-[#336F49] text-[#212021]'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {variant.title}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create AddToCartButton**

```tsx
// storefront.mylivinghope/src/components/product/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { cartAction } from '@/components/cart/CartProvider'

interface AddToCartButtonProps {
  variantId: string
  availableForSale: boolean
}

export default function AddToCartButton({ variantId, availableForSale }: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const { cart, openCart } = useCartStore()

  const handleAdd = async () => {
    setAdding(true)
    try {
      if (!cart) {
        const newCart = await cartAction('create')
        await cartAction('add', { cartId: newCart.id, variantId })
      } else {
        await cartAction('add', { cartId: cart.id, variantId })
      }
      openCart()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setAdding(false)
    }
  }

  if (!availableForSale) {
    return (
      <button disabled className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
        Sold Out
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className="w-full py-3 px-6 bg-[#336F49] hover:bg-[#2a5a3b] text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <ShoppingBag className="w-5 h-5" />
      {adding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
```

- [ ] **Step 3: Create the product detail page**

```tsx
// storefront.mylivinghope/src/app/products/[handle]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProductByHandle, getAllProductHandles } from '@/lib/shopify'
import ProductDetail from './ProductDetail'

export const revalidate = 60

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  const handles = await getAllProductHandles()
  return handles.map((handle) => ({ handle }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.seo.title || product.title} — My Living Hope`,
    description: product.seo.description || product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()

  return <ProductDetail product={product} />
}
```

- [ ] **Step 4: Create the ProductDetail client component**

Create `storefront.mylivinghope/src/app/products/[handle]/ProductDetail.tsx`:

```tsx
// storefront.mylivinghope/src/app/products/[handle]/ProductDetail.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyProduct } from '@/types/shopify'
import VariantSelector from '@/components/product/VariantSelector'
import AddToCartButton from '@/components/product/AddToCartButton'

interface ProductDetailProps {
  product: ShopifyProduct
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-white">
            {product.images[selectedImageIdx] ? (
              <Image
                src={product.images[selectedImageIdx].url}
                alt={product.images[selectedImageIdx].altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    idx === selectedImageIdx ? 'border-[#336F49]' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt={img.altText || ''} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#336F49] font-medium mb-2">{product.productType}</p>
            <h1 className="text-3xl font-bold text-[#212021]">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#336F49]">
              ${parseFloat(selectedVariant.price.amount).toFixed(2)} {selectedVariant.price.currencyCode}
            </span>
            {selectedVariant.compareAtPrice &&
              parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                <span className="text-lg text-gray-400 line-through">
                  ${parseFloat(selectedVariant.compareAtPrice.amount).toFixed(2)}
                </span>
              )}
          </div>

          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />

          <AddToCartButton variantId={selectedVariantId} availableForSale={selectedVariant.availableForSale} />

          <div
            className="prose prose-green max-w-none text-[#212021]"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/products/\[handle\]/ src/components/product/
git commit -m "feat: add product detail page with variant selection and add-to-cart"
```

---

### Task 10: Cart Drawer

**Files:**
- Create: `storefront.mylivinghope/src/components/cart/CartDrawer.tsx`
- Create: `storefront.mylivinghope/src/components/cart/CartLine.tsx`
- Modify: `storefront.mylivinghope/src/app/layout.tsx`

- [ ] **Step 1: Create CartLine component**

```tsx
// storefront.mylivinghope/src/components/cart/CartLine.tsx
'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import type { ShopifyCartLine } from '@/types/shopify'
import { useCartStore } from '@/stores/cart'
import { cartAction } from '@/components/cart/CartProvider'

interface CartLineProps {
  line: ShopifyCartLine
}

export default function CartLineItem({ line }: CartLineProps) {
  const { cart } = useCartStore()

  const updateQuantity = async (quantity: number) => {
    if (!cart) return
    if (quantity === 0) {
      await cartAction('remove', { cartId: cart.id, lineIds: [line.id] })
    } else {
      await cartAction('update', { cartId: cart.id, lineId: line.id, quantity })
    }
  }

  return (
    <div className="flex gap-4 py-4">
      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
        {line.merchandise.product.featuredImage ? (
          <Image
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-[#212021] truncate">{line.merchandise.product.title}</h4>
        {line.merchandise.title !== 'Default Title' && (
          <p className="text-xs text-gray-500">{line.merchandise.title}</p>
        )}
        <p className="text-sm font-semibold text-[#336F49] mt-1">
          ${parseFloat(line.merchandise.price.amount).toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(line.quantity - 1)}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm w-6 text-center">{line.quantity}</span>
          <button
            onClick={() => updateQuantity(line.quantity + 1)}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <button
        onClick={() => updateQuantity(0)}
        className="text-gray-400 hover:text-red-500 transition-colors self-start"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create CartDrawer**

```tsx
// storefront.mylivinghope/src/components/cart/CartDrawer.tsx
'use client'

import { X } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import CartLineItem from './CartLine'

export default function CartDrawer() {
  const { cart, isOpen, closeCart } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FDF8F5] z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#336F49]/10">
          <h2 className="text-lg font-bold text-[#212021]">Cart</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-[#212021] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart lines */}
        <div className="flex-1 overflow-y-auto px-4">
          {!cart || cart.lines.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="p-4 border-t border-[#336F49]/10 space-y-4">
            <div className="flex justify-between text-lg font-bold text-[#212021]">
              <span>Total</span>
              <span>
                ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)} {cart.cost.totalAmount.currencyCode}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="block w-full py-3 bg-[#336F49] hover:bg-[#2a5a3b] text-white text-center rounded-lg font-medium transition-colors"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Add CartDrawer to root layout**

Add `<CartDrawer />` to the layout, after `<Footer />`:

```tsx
import CartDrawer from '@/components/cart/CartDrawer'

// Inside the body, after Footer:
<CartDrawer />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/cart/ src/app/layout.tsx
git commit -m "feat: add CartDrawer with line items, quantity controls, and checkout link"
```

---

### Task 11: Static Pages (About, Contact) & Homepage Stub

**Files:**
- Create: `storefront.mylivinghope/src/app/about/page.tsx`
- Create: `storefront.mylivinghope/src/app/contact/page.tsx`
- Modify: `storefront.mylivinghope/src/app/page.tsx`

- [ ] **Step 1: Create About page**

```tsx
// storefront.mylivinghope/src/app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — My Living Hope',
  description: 'Learn about Prayer Portals and how they help you connect with God.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#212021] mb-8">About Prayer Portals</h1>
      <div className="prose prose-lg prose-green max-w-none">
        <p>
          Prayer Portals were born from a simple observation: many of us want to connect with God
          but struggle to find the words. Whether you&apos;re feeling overwhelmed, grateful, confused,
          or hopeful — these cards meet you where you are.
        </p>
        <p>
          Each card connects an emotion or need with relevant Scripture and a prayer starter.
          They won&apos;t pray for you, but they&apos;ll help you begin.
        </p>
        <p>
          Created in Christchurch, New Zealand, for youth ministries, small groups,
          and anyone seeking a deeper prayer life.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Contact page**

```tsx
// storefront.mylivinghope/src/app/contact/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — My Living Hope',
  description: 'Get in touch with the My Living Hope team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#212021] mb-8">Contact Us</h1>
      <p className="text-lg text-gray-600">
        Get in touch with the My Living Hope team. We&apos;d love to hear from you.
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Update homepage with featured products**

```tsx
// storefront.mylivinghope/src/app/page.tsx
import Link from 'next/link'
import { getProducts } from '@/lib/shopify'
import ProductGrid from '@/components/product/ProductGrid'

export const revalidate = 60

export default async function Home() {
  const products = await getProducts(4)

  return (
    <div>
      {/* Hero — placeholder for creative design phase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-sm text-[#336F49] font-medium tracking-wider uppercase mb-4">
          Light in the Darkness
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#212021] mb-6">
          Go Deeper With <span className="text-[#336F49]">Jesus</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Prayer Portals are beautifully designed cards that help you bring both your joys
          and struggles to God. Connect your emotions with Scripture and discover new ways to pray.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-[#336F49] hover:bg-[#2a5a3b] text-white rounded-lg font-medium transition-colors"
        >
          Explore Cards
        </Link>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-[#212021] mb-8">Featured Products</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/about/ src/app/contact/ src/app/page.tsx
git commit -m "feat: add About, Contact pages and homepage with featured products"
```

---

### Task 12: Next.js Config & Image Domains

**Files:**
- Modify: `storefront.mylivinghope/next.config.ts`

- [ ] **Step 1: Configure Shopify image domain**

```ts
// storefront.mylivinghope/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: configure Next.js for Shopify CDN images"
```

---

### Task 13: SEO — Sitemap & Structured Data

**Files:**
- Create: `storefront.mylivinghope/src/app/sitemap.ts`
- Modify: `storefront.mylivinghope/src/app/products/[handle]/page.tsx`

- [ ] **Step 1: Create dynamic sitemap**

```ts
// storefront.mylivinghope/src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllProductHandles } from '@/lib/shopify'

const BASE_URL = 'https://mylivinghope.org.nz'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const handles = await getAllProductHandles()

  const productUrls = handles.map((handle) => ({
    url: `${BASE_URL}/products/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ]
}
```

- [ ] **Step 2: Add JSON-LD structured data to product pages**

Add a `<script type="application/ld+json">` block to the product detail page. Modify `storefront.mylivinghope/src/app/products/[handle]/page.tsx` — add after the metadata generation, inside the page component before returning `<ProductDetail>`:

```tsx
// Add to the ProductPage component, before the return:
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description,
  image: product.featuredImage?.url,
  offers: {
    '@type': 'Offer',
    price: product.variants[0]?.price.amount,
    priceCurrency: product.variants[0]?.price.currencyCode,
    availability: product.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
}

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <ProductDetail product={product} />
  </>
)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts src/app/products/\[handle\]/page.tsx
git commit -m "feat: add sitemap and product structured data for SEO"
```

---

### Task 14: Verify Full Flow End-to-End

- [ ] **Step 1: Set up Shopify Storefront API token**

In Shopify admin:
1. Settings > Apps and sales channels > Develop apps
2. Create app, configure Storefront API scopes (read products, read collections, write/read cart)
3. Install app, copy the Storefront API access token
4. Add to `storefront.mylivinghope/.env.local`

- [ ] **Step 2: Run the dev server**

Run: `cd storefront.mylivinghope && npm run dev`

- [ ] **Step 3: Verify homepage**

Navigate to http://localhost:3000. Expected: Hero section with featured products below.

- [ ] **Step 4: Verify products page**

Navigate to /products. Expected: Grid of products from Shopify.

- [ ] **Step 5: Verify product detail**

Click a product. Expected: Product images, description, variant selector, add-to-cart button.

- [ ] **Step 6: Verify cart flow**

Add a product to cart. Expected: Cart drawer opens with the item. Quantity controls work. Checkout button links to Shopify checkout.

- [ ] **Step 7: Verify SEO**

Check page source on a product page. Expected: SSR'd HTML with product content, meta tags, JSON-LD structured data.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "chore: finalize headless storefront with full Shopify integration"
```
