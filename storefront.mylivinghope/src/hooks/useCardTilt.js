import { useRef, useCallback } from 'react'

export default function useCardTilt(maxDeg = 8) {
  const ref = useRef(null)

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    el.style.transform = `perspective(1000px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg)`
    el.style.transition = 'none'
  }, [maxDeg])

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    el.style.transition = 'transform 0.4s ease'
  }, [])

  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave }
}
