import type { MetadataRoute } from 'next'
import { getAllProductHandles } from '@/lib/shopify'

const BASE_URL = 'https://mylivinghope.org.nz'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let handles: string[] = []
  try {
    handles = await getAllProductHandles()
  } catch {
    // Shopify token not configured yet
  }

  const productUrls = handles.map((handle) => ({
    url: `${BASE_URL}/products/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}
