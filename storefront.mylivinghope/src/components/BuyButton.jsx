import { useEffect, useRef } from 'react'

const SHOPIFY_DOMAIN = '5ywgef-rd.myshopify.com'
const STOREFRONT_TOKEN = '427cc512121d05a6cc9f4903b554b77f'

let shopifyUI = null
let cartRef = null
let toggleRef = null
const cartListeners = new Set()
let currentCount = 0

function notifyCartListeners(count) {
  currentCount = count
  cartListeners.forEach((fn) => fn(count))
}

export function onCartCount(fn) {
  cartListeners.add(fn)
  fn(currentCount)
  return () => cartListeners.delete(fn)
}

export function openCart() {
  const cart = cartRef || shopifyUI?.components?.cart?.[0]
  if (!cart) {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  cart.open()
}

export function addToCart() {
  if (!shopifyUI) {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
    return
  }

  const products = shopifyUI.components.product
  const carts = shopifyUI.components.cart

  if (!products?.length || !carts?.length) {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
    return
  }

  const product = products[0]
  const cart = cartRef || carts[0]
  const variant = product.selectedVariant || product.model?.variants?.[0]

  if (variant) {
    cart.addVariantToCart(variant, 1).then(() => {
      notifyCartListeners(cart.model?.lineItems?.length || 0)
      cart.open()
    })
  }
}

export default function BuyButton({ productId }) {
  const hiddenRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!productId || initializedRef.current) return
    initializedRef.current = true

    function init() {
      const client = window.ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: STOREFRONT_TOKEN,
      })

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        shopifyUI = ui

        ui.createComponent('product', {
          id: productId,
          node: hiddenRef.current,
          moneyFormat: '${{amount}}',
          options: {
            product: {
              contents: {
                img: false,
                title: false,
                price: false,
                description: false,
                button: false,
              },
            },
            cart: {
              styles: {
                button: {
                  'background-color': '#336F49',
                  ':hover': { 'background-color': '#265438' },
                  ':focus': { 'background-color': '#265438' },
                  'border-radius': '28px',
                  'font-family': '"Montserrat", sans-serif',
                  'font-weight': '600',
                },
              },
              text: { total: 'Subtotal', button: 'Checkout' },
              popup: false,
              events: {
                afterInit: (cart) => {
                  cartRef = cart
                  notifyCartListeners(cart.model?.lineItems?.length || 0)
                },
                updateItemQuantity: (cart) => {
                  notifyCartListeners(cart.model?.lineItems?.length || 0)
                },
                addVariantToCart: (cart) => {
                  notifyCartListeners(cart.model?.lineItems?.length || 0)
                },
              },
            },
            toggle: {
              styles: {
                toggle: {
                  position: 'fixed',
                  top: '-9999px',
                  left: '-9999px',
                  opacity: '0',
                },
              },
              events: {
                afterInit: (toggle) => {
                  toggleRef = toggle
                },
              },
            },
          },
        })
      })
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      init()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
    script.async = true
    script.onload = init
    document.head.appendChild(script)
  }, [productId])

  return (
    <>
      <div ref={hiddenRef} className="shopify-sdk-container" />
      <button
        onClick={addToCart}
        className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base group"
      >
        Buy Now
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </>
  )
}
