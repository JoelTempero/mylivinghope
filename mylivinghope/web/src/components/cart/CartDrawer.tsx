'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart();

  const lines = cart?.lines.edges.map((edge) => edge.node) || [];
  const subtotal = cart?.cost.subtotalAmount;

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-charcoal/50 z-[9999] transition-all duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[10000] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.15)] transition-transform duration-500',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-blush-light">
          <h2 className="font-heading text-xl">Your Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map((line) => (
                <div key={line.id} className="flex gap-4 py-4 border-b border-blush-light">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
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

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {line.merchandise.product.title}
                    </h3>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="text-text-muted text-xs">{line.merchandise.title}</p>
                    )}
                    <p className="text-forest font-semibold mt-1">
                      {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}
                        disabled={isLoading}
                        className="w-6 h-6 rounded border border-blush-light flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        className="w-6 h-6 rounded border border-blush-light flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(line.id)}
                        disabled={isLoading}
                        className="ml-auto text-text-muted text-sm hover:text-charcoal transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="p-6 border-t border-blush-light bg-cream">
            <div className="flex justify-between mb-4 text-lg">
              <span>Subtotal</span>
              <span className="font-heading font-bold">
                {subtotal ? formatPrice(subtotal.amount, subtotal.currencyCode) : '$0.00'}
              </span>
            </div>
            <a
              href={cart?.checkoutUrl}
              className="btn btn-primary w-full"
            >
              Checkout
            </a>
            <button
              onClick={closeCart}
              className="w-full mt-3 text-center text-text-secondary hover:text-charcoal transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
