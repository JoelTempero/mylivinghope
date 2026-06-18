import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'

// items: [{ productId, qty }] — the Cloud Function re-prices each line server-side.
export async function startCheckout(items) {
  const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession')
  const result = await createCheckoutSession({ items })
  window.location.href = result.data.url
}
