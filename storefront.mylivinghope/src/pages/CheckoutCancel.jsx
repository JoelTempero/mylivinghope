import { useEffect } from 'react'

export default function CheckoutCancel() {
  useEffect(() => {
    document.title = 'Checkout Cancelled — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="max-w-2xl mx-auto px-[5%] py-24 md:py-32 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Checkout cancelled</h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          No payment was taken. Your cards will be here whenever you're ready.
        </p>
        <a
          href="/#shop"
          className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base"
        >
          Back to the shop
        </a>
      </div>
    </div>
  )
}
