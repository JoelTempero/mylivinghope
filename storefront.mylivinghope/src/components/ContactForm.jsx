import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = `mailto:prayerprompts@outlook.com?subject=Website enquiry from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-cream focus:outline-none focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 focus:shadow-[0_0_0_4px_rgba(51,111,73,0.08)] transition-all duration-200 text-charcoal text-base"

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-charcoal/5">
      <h3 className="font-heading text-2xl font-bold mb-6">Send a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="btn-interactive w-full py-4 bg-forest-green hover:bg-green-dark text-white font-semibold rounded-full text-base shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
