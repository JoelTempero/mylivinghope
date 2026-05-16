import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Only create client if credentials are available
let shopifyClient: StorefrontApiClient | null = null;

if (domain && storefrontAccessToken) {
  shopifyClient = createStorefrontApiClient({
    storeDomain: `https://${domain}`,
    apiVersion: '2025-04',
    publicAccessToken: storefrontAccessToken,
  });
}

/**
 * Check if Shopify is configured
 */
export function isShopifyConfigured(): boolean {
  return shopifyClient !== null;
}

/**
 * Execute a GraphQL query against Shopify Storefront API
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<T> {
  if (!shopifyClient) {
    throw new Error('Shopify client not configured. Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.');
  }

  try {
    const { data, errors } = await shopifyClient.request(query, {
      variables,
    });

    if (errors) {
      const errorMessage = errors.message || JSON.stringify(errors);
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}
