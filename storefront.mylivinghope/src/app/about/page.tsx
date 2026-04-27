import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — My Living Hope',
  description:
    'Learn about Prayer Portals and how they help you connect with God.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[#212021] mb-8">
        About Prayer Portals
      </h1>
      <div className="prose prose-lg prose-green max-w-none">
        <p>
          Prayer Portals were born from a simple observation: many of us want to
          connect with God but struggle to find the words. Whether you&apos;re
          feeling overwhelmed, grateful, confused, or hopeful &mdash; these
          cards meet you where you are.
        </p>
        <p>
          Each card connects an emotion or need with relevant Scripture and a
          prayer starter. They won&apos;t pray for you, but they&apos;ll help
          you begin.
        </p>
        <p>
          Created in Christchurch, New Zealand, for youth ministries, small
          groups, and anyone seeking a deeper prayer life.
        </p>
      </div>
    </div>
  )
}
