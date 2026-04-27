import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductByHandle, getAllProductHandles } from '@/lib/shopify'
import ProductDetail from './ProductDetail'

export const revalidate = 60

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles()
    return handles.map((handle) => ({ handle }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  try {
    const product = await getProductByHandle(handle)
    if (!product) return { title: 'Product Not Found' }

    return {
      title: `${product.seo.title || product.title} — My Living Hope`,
      description: product.seo.description || product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.featuredImage
          ? [{ url: product.featuredImage.url }]
          : [],
      },
    }
  } catch {
    return { title: 'Product Not Found' }
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  let product
  try {
    product = await getProductByHandle(handle)
  } catch {
    notFound()
  }
  if (!product) notFound()

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  )
}
