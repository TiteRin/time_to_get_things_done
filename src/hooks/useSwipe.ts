import { useRef, type MouseEvent, type PointerEvent } from 'react'

export type SwipeHandlers = {
  onPointerDown: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerCancel: () => void
  onClickCapture: (event: MouseEvent) => void
}

/**
 * Detects a vertical swipe up on the element receiving the handlers.
 * The click the browser emits at the end of a swipe is swallowed so it does not
 * also trigger a tap zone underneath.
 */
export function useSwipe({
  onSwipeUp,
  threshold = 50,
}: {
  onSwipeUp: () => void
  threshold?: number
}): SwipeHandlers {
  const origin = useRef<{ x: number; y: number } | null>(null)
  const swallowNextClick = useRef(false)

  return {
    onPointerDown: (event) => {
      origin.current = { x: event.clientX, y: event.clientY }
      swallowNextClick.current = false
    },
    onPointerUp: (event) => {
      if (!origin.current) return
      const dx = event.clientX - origin.current.x
      const dy = origin.current.y - event.clientY
      origin.current = null

      if (dy >= threshold && dy > Math.abs(dx)) {
        swallowNextClick.current = true
        onSwipeUp()
      }
    },
    onPointerCancel: () => {
      origin.current = null
    },
    onClickCapture: (event) => {
      if (!swallowNextClick.current) return
      swallowNextClick.current = false
      event.stopPropagation()
      event.preventDefault()
    },
  }
}
