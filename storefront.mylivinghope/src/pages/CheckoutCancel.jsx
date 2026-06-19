import { Navigate } from 'react-router-dom'

// Stripe sends cancelled/abandoned checkouts here (and the Stripe "back" button).
// The cart is still intact, so send the shopper straight back to it.
export default function CheckoutCancel() {
  return <Navigate to="/cart" replace />
}
