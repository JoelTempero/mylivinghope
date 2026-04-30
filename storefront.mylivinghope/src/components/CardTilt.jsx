import useCardTilt from '../hooks/useCardTilt'

export default function CardTilt({ children, className = '', maxDeg = 8, ...props }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(maxDeg)

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`card-tilt ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
