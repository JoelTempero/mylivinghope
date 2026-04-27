import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — My Living Hope',
  description: 'Get in touch with the My Living Hope team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#212021] mb-8">Contact Us</h1>
      <p className="text-lg text-gray-600">
        Get in touch with the My Living Hope team. We&apos;d love to hear from
        you.
      </p>
    </div>
  )
}
