export default function ProductImage({
  src,
  alt = 'Prayer Portals',
  aspectRatio = '1/1',
  className = '',
}) {
  if (src) {
    return (
      <div className={`rounded-2xl overflow-hidden ${className}`} style={{ aspectRatio }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className={`image-placeholder rounded-2xl flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <div className="text-center p-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-green/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <p className="font-heading text-lg text-charcoal font-bold">Prayer Portals</p>
        <p className="text-sm text-text-muted mt-1">Image coming soon</p>
      </div>
    </div>
  )
}
