import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function BoxReveal({ videoSrc, posterSrc, children }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })
  const [videoLoaded, setVideoLoaded] = useState(false)

  if (videoSrc) {
    return (
      <div ref={ref} className="relative w-full max-w-lg mx-auto">
        <video
          src={isVisible ? videoSrc : undefined}
          poster={posterSrc}
          autoPlay={isVisible}
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full rounded-2xl shadow-2xl transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!videoLoaded && (
          <div className="absolute inset-0 image-placeholder rounded-2xl" />
        )}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-lg mx-auto reveal-scale-up ${isVisible ? 'in-view' : ''}`}
    >
      <div className="relative bg-gradient-to-br from-forest-green/5 to-soft-blush/60 rounded-2xl p-8 shadow-2xl border border-charcoal/5">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-forest-green/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-forest-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <p className="font-heading text-charcoal font-bold">3D Box Reveal</p>
          <p className="text-sm text-text-muted mt-1">Video/animation coming soon</p>
        </div>
        {children}
      </div>
    </div>
  )
}
