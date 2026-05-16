'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ShopifyCart } from '@/lib/shopify/types';
import { createCart, addToCart, updateCartLine, removeFromCart, getCart } from '@/lib/shopify';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const initCart = async () => {
      const cartId = localStorage.getItem(CART_ID_KEY);

      if (cartId) {
        try {
          const existingCart = await getCart(cartId);
          if (existingCart) {
            setCart(existingCart);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch existing cart:', error);
        }
      }

      // Create new cart if none exists
      try {
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      } catch (error) {
        console.error('Failed to create cart:', error);
      }
    };

    initCart();
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!cart) return;

      setIsLoading(true);
      try {
        const updatedCart = await addToCart(cart.id, [{ merchandiseId: variantId, quantity }]);
        setCart(updatedCart);
        openCart();
      } catch (error) {
        console.error('Failed to add item:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, openCart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;

      setIsLoading(true);
      try {
        const updatedCart = await updateCartLine(cart.id, lineId, quantity);
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to update item:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;

      setIsLoading(true);
      try {
        const updatedCart = await removeFromCart(cart.id, [lineId]);
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
