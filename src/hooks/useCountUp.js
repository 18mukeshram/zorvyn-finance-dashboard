import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for animated number counting.
 * Smoothly animates from 0 to the target value.
 *
 * @param {number} target - The target number to animate to
 * @param {number} [duration=1200] - Animation duration in ms
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {number} The current animated value
 */
export function useCountUp(target, duration = 1200, decimals = 2) {
  const [current, setCurrent] = useState(0)
  const prevTarget = useRef(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const start = prevTarget.current
    const diff = target - start
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)

      const value = start + diff * eased
      setCurrent(Number(value.toFixed(decimals)))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        prevTarget.current = target
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, decimals])

  return current
}
