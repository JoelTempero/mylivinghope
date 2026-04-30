import { useState } from 'react'

export default function CardFlip({
  front,
  back,
  className = '',
  aspectRatio = '5/7',
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`card-flip-container ${flipped ? 'flipped' : ''} ${className}`}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      aria-label={flipped ? 'Flip card to front' : 'Flip card to back'}
      style={{ aspectRatio }}
    >
      <div className="card-flip-inner">
        <div className="card-flip-front">
          {front}
        </div>
        <div className="card-flip-back">
          {back}
        </div>
      </div>
    </div>
  )
}
