import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'

export async function startCheckout(product, qty = 1) {
  const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession')
  const result = await createCheckoutSession({ items: [{ productId: product.id, qty }] })
  window.location.href = result.data.url
}
