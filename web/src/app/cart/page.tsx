'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartProvider';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, updateItem, removeItem, isLoading } = useCart();

  const lines = cart?.lines.edges.map((edge) => edge.node) || [];
  const subtotal = cart?.cost.subtotalAmount;

  if (lines.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container-custom">
          <div className="text-center py-16">
            <h1 className="mb-4">Your Cart</h1>
            <p className="text-text-secondary text-lg mb-8">Your cart is currently empty.</p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="text-center mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-6 border-b border-blush-light text-sm font-semibold text-text-muted">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span className="w-10"></span>
              </div>

              {/* Items */}
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 p-6 border-b border-blush-light items-center"
                >
                  {/* Product */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                      {line.merchandise.product.featuredImage ? (
                        <Image
                          src={line.merchandise.product.featuredImage.url}
                          alt={line.merchandise.product.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/products/${line.merchandise.product.handle}`}
                        className="font-semibold hover:text-forest"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-text-muted text-sm">{line.merchandise.title}</p>
                      )}
                      <p className="text-forest font-semibold md:hidden mt-1">
                        {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}
                      disabled={isLoading}
                      className="w-8 h-8 rounded-full border border-blush-light flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{line.quantity}</span>
                    <button
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={isLoading}
                      className="w-8 h-8 rounded-full border border-blush-light flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="hidden md:block text-right font-semibold">
                    {formatPrice(
                      (parseFloat(line.merchandise.price.amount) * line.quantity).toString(),
                      line.merchandise.price.currencyCode
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(line.id)}
                    disabled={isLoading}
                    className="text-text-muted hover:text-charcoal transition-colors disabled:opacity-50 justify-self-end md:justify-self-auto"
                    aria-label="Remove item"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-24">
              <h2 className="text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-blush-light">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>
                    {subtotal ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold mb-8">
                <span>Total</span>
                <span className="font-heading">
                  {subtotal ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}
                </span>
              </div>

              <a href={cart?.checkoutUrl} className="btn btn-primary w-full btn-large">
                Proceed to Checkout
              </a>

              <Link
                href="/products"
                className="block text-center mt-4 text-text-secondary hover:text-charcoal transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
