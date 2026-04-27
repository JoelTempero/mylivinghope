import { NextResponse } from 'next/server'
import {
  createCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  getCart,
} from '@/lib/shopify'

export async function POST(request: Request) {
  const body = await request.json()
  const { action, cartId, variantId, quantity, lineId, lineIds } = body

  try {
    let cart
    switch (action) {
      case 'create':
        cart = await createCart()
        break
      case 'add':
        cart = await addToCart(cartId, variantId, quantity || 1)
        break
      case 'update':
        cart = await updateCartLine(cartId, lineId, quantity)
        break
      case 'remove':
        cart = await removeFromCart(cartId, lineIds)
        break
      case 'get':
        cart = await getCart(cartId)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    return NextResponse.json({ cart })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
