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

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
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
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join(', ')
    )
  }

  return json.data
}

function reshapeProduct(product: Record<string, unknown>): ShopifyProduct {
  const p = product as Record<string, unknown>
  const images = p.images as { nodes: unknown[] }
  const variants = p.variants as { nodes: unknown[] }
  return {
    ...p,
    images: images.nodes,
    variants: variants.nodes,
  } as unknown as ShopifyProduct
}

export async function getProducts(count = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { nodes: Record<string, unknown>[] }
  }>(GET_PRODUCTS, { first: count })
  return data.products.nodes.map(reshapeProduct)
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    productByHandle: Record<string, unknown> | null
  }>(GET_PRODUCT_BY_HANDLE, { handle })
  if (!data.productByHandle) return null
  return reshapeProduct(data.productByHandle)
}

export async function getAllProductHandles(): Promise<string[]> {
  const data = await shopifyFetch<{
    products: { nodes: { handle: string }[] }
  }>(GET_ALL_PRODUCT_HANDLES)
  return data.products.nodes.map((p) => p.handle)
}

export async function getCollectionByHandle(
  handle: string,
  count = 20
): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<{
    collectionByHandle: Record<string, unknown> | null
  }>(GET_COLLECTION_BY_HANDLE, { handle, first: count })
  if (!data.collectionByHandle) return null
  const col = data.collectionByHandle as Record<string, unknown>
  const products = col.products as { nodes: Record<string, unknown>[] }
  return {
    ...col,
    products: products.nodes.map(reshapeProduct),
  } as unknown as ShopifyCollection
}

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Record<string, unknown> }
  }>(CREATE_CART)
  return reshapeCart(data.cartCreate.cart)
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Record<string, unknown> }
  }>(ADD_TO_CART, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  })
  return reshapeCart(data.cartLinesAdd.cart)
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Record<string, unknown> }
  }>(UPDATE_CART_LINE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  })
  return reshapeCart(data.cartLinesUpdate.cart)
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Record<string, unknown> }
  }>(REMOVE_FROM_CART, {
    cartId,
    lineIds,
  })
  return reshapeCart(data.cartLinesRemove.cart)
}

export async function getCart(
  cartId: string
): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{
    cart: Record<string, unknown> | null
  }>(GET_CART, { cartId })
  if (!data.cart) return null
  return reshapeCart(data.cart)
}

function reshapeCart(cart: Record<string, unknown>): ShopifyCart {
  const lines = cart.lines as { nodes: unknown[] }
  return {
    ...cart,
    lines: lines.nodes,
  } as unknown as ShopifyCart
}
