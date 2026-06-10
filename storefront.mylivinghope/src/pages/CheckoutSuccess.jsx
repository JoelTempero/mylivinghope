import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    document.title = 'Order Confirmed — My Living Hope'
  }, [])

  return (
    <div id="main-content" className="mt-[80px] md:mt-[90px]">
      <div className="max-w-2xl mx-auto px-[5%] py-24 md:py-32 text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-forest-green/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-forest-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank you — your order is confirmed</h1>
        <p className="text-text-secondary leading-relaxed mb-2">
          Your payment went through and your cards are on their way to being packed.
          A confirmation email is headed to your inbox.
        </p>
        {sessionId && (
          <p className="text-text-muted text-xs mb-8">Reference: {sessionId.slice(0, 24)}…</p>
        )}
        <Link
          to="/"
          className="btn-interactive inline-flex items-center gap-2 bg-forest-green hover:bg-green-dark text-white font-semibold px-10 py-4 rounded-full text-base mt-6"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
