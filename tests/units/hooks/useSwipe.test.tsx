import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSwipe } from '@/hooks/useSwipe'

function Harness({ onSwipeUp, onClick }: { onSwipeUp: () => void; onClick: () => void }) {
  const swipeHandlers = useSwipe({ onSwipeUp, threshold: 50 })
  return (
    <div data-testid="surface" {...swipeHandlers}>
      <button onClick={onClick}>inner</button>
    </div>
  )
}

function setup() {
  const onSwipeUp = vi.fn()
  const onClick = vi.fn()
  render(<Harness onSwipeUp={onSwipeUp} onClick={onClick} />)
  return { onSwipeUp, onClick, button: screen.getByRole('button') }
}

function drag(target: Element, from: { x: number; y: number }, to: { x: number; y: number }) {
  fireEvent.pointerDown(target, { clientX: from.x, clientY: from.y, pointerId: 1 })
  fireEvent.pointerUp(target, { clientX: to.x, clientY: to.y, pointerId: 1 })
}

describe('useSwipe', () => {
  it('fires onSwipeUp when dragging up past the threshold', () => {
    const { onSwipeUp, button } = setup()

    drag(button, { x: 100, y: 400 }, { x: 105, y: 300 })

    expect(onSwipeUp).toHaveBeenCalledOnce()
  })

  it('ignores short drags', () => {
    const { onSwipeUp, button } = setup()

    drag(button, { x: 100, y: 400 }, { x: 100, y: 370 })

    expect(onSwipeUp).not.toHaveBeenCalled()
  })

  it('ignores downward drags', () => {
    const { onSwipeUp, button } = setup()

    drag(button, { x: 100, y: 300 }, { x: 100, y: 400 })

    expect(onSwipeUp).not.toHaveBeenCalled()
  })

  it('ignores mostly horizontal drags', () => {
    const { onSwipeUp, button } = setup()

    drag(button, { x: 0, y: 400 }, { x: 200, y: 330 })

    expect(onSwipeUp).not.toHaveBeenCalled()
  })

  it('swallows the click that follows a swipe', () => {
    const { onClick, button } = setup()

    drag(button, { x: 100, y: 400 }, { x: 100, y: 300 })
    fireEvent.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('lets regular taps through', () => {
    const { onClick, onSwipeUp, button } = setup()

    drag(button, { x: 100, y: 400 }, { x: 102, y: 398 })
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledOnce()
    expect(onSwipeUp).not.toHaveBeenCalled()
  })
})
