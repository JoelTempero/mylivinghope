import { shopifyFetch, isShopifyConfigured } from './client';

export { isShopifyConfigured };
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCTS_BY_COLLECTION,
  GET_ALL_COLLECTIONS,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINE,
  REMOVE_FROM_CART,
  GET_CART,
} from './queries';
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  GetAllProductsResponse,
  GetProductByHandleResponse,
  GetProductsByCollectionResponse,
  GetAllCollectionsResponse,
  CartCreateResponse,
  CartLinesAddResponse,
  GetCartResponse,
} from './types';

/**
 * Get all products
 */
export async function getAllProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<GetAllProductsResponse>({
    query: GET_ALL_PRODUCTS,
    variables: { first },
  });

  return data.products.edges.map((edge) => edge.node);
}

/**
 * Get a single product by handle
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<GetProductByHandleResponse>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle },
  });

  return data.product;
}

/**
 * Get products by collection handle
 */
export async function getProductsByCollection(
  handle: string,
  first: number = 20
): Promise<{ collection: ShopifyCollection | null; products: ShopifyProduct[] }> {
  const data = await shopifyFetch<GetProductsByCollectionResponse>({
    query: GET_PRODUCTS_BY_COLLECTION,
    variables: { handle, first },
  });

  if (!data.collection) {
    return { collection: null, products: [] };
  }

  const products = data.collection.products?.edges.map((edge) => edge.node) || [];

  return { collection: data.collection, products };
}

/**
 * Get all collections
 */
export async function getAllCollections(first: number = 10): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<GetAllCollectionsResponse>({
    query: GET_ALL_COLLECTIONS,
    variables: { first },
  });

  return data.collections.edges.map((edge) => edge.node);
}

/**
 * Create a new cart
 */
export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CREATE_CART,
    variables: {
      input: { lines },
    },
    cache: 'no-store',
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartCreate.cart;
}

/**
 * Add items to cart
 */
export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesAddResponse>({
    query: ADD_TO_CART,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesAdd.cart;
}

/**
 * Update cart line quantity
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> } }>({
    query: UPDATE_CART_LINE,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: 'no-store',
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesUpdate.cart;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> } }>({
    query: REMOVE_FROM_CART,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesRemove.cart;
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<GetCartResponse>({
    query: GET_CART,
    variables: { cartId },
    cache: 'no-store',
  });

  return data.cart;
}

// Re-export types
export * from './types';
