import { useEffect, useRef } from 'react'

export default function BuyButton({ productId }) {
  const containerRef = useRef(null)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!productId || clientRef.current) return

    const script = document.createElement('script')
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
    script.async = true
    script.onload = () => {
      if (!window.ShopifyBuy || clientRef.current) return

      const client = window.ShopifyBuy.buildClient({
        domain: 'my-living-hope.myshopify.com',
        storefrontAccessToken: 'PLACEHOLDER_TOKEN',
      })
      clientRef.current = client

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent('product', {
          id: productId,
          node: containerRef.current,
          moneyFormat: '${{amount}}',
          options: {
            product: {
              styles: {
                product: { '@media (min-width: 601px)': { 'max-width': '100%' } },
                button: {
                  'background-color': '#336F49',
                  ':hover': { 'background-color': '#265438' },
                  'border-radius': '9999px',
                  'font-family': '"Montserrat", sans-serif',
                  'font-weight': '600',
                  'font-size': '16px',
                  'padding': '14px 32px',
                },
                title: {
                  'font-family': '"Libre Baskerville", serif',
                  'font-weight': '700',
                  'color': '#212021',
                },
                price: {
                  'font-family': '"Montserrat", sans-serif',
                  'color': '#336F49',
                  'font-weight': '600',
                },
              },
              contents: {
                img: false,
                title: false,
                price: false,
                description: false,
              },
              text: { button: 'Buy Now' },
            },
            cart: {
              styles: {
                button: {
                  'background-color': '#336F49',
                  ':hover': { 'background-color': '#265438' },
                  'border-radius': '9999px',
                  'font-family': '"Montserrat", sans-serif',
                  'font-weight': '600',
                },
              },
            },
          },
        })
      })
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [productId])

  if (!productId) {
    return (
      <a
        href="https://my-living-hope.myshopify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full transition-colors text-base"
      >
        Buy Now
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    )
  }

  return <div ref={containerRef} />
}
