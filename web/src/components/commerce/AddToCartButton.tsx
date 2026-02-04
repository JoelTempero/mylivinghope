'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
  availableForSale: boolean;
  className?: string;
}

export function AddToCartButton({
  variantId,
  quantity = 1,
  availableForSale,
  className,
}: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    if (!availableForSale || isLoading || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(variantId, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  if (!availableForSale) {
    return (
      <button
        disabled
        className={cn('btn bg-gray-300 text-gray-600 cursor-not-allowed', className)}
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isAdding}
      className={cn('btn btn-primary disabled:opacity-70', className)}
    >
      {isAdding ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adding...
        </>
      ) : (
        <>
          Add to Cart
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </>
      )}
    </button>
  );
}
