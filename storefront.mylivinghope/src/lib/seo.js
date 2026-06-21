import { useEffect } from 'react'

// Sets document.title and <meta name="description"> for the lifetime of a page,
// restoring the previous values on unmount. Client-side only — good for Google
// (renders JS) but social/OG scrapers won't see these without prerender.
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    let tag = document.querySelector('meta[name="description"]')
    const created = !tag
    const prevDesc = tag ? tag.getAttribute('content') : null
    if (description) {
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (description && tag) {
        if (created) tag.remove()
        else if (prevDesc != null) tag.setAttribute('content', prevDesc)
      }
    }
  }, [title, description])
}
