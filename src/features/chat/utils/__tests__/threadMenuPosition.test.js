import { describe, expect, it } from 'vitest'
import { computeThreadMenuPosition } from '../threadMenuPosition'

describe('computeThreadMenuPosition', () => {
  it('keeps menu inside viewport horizontally', () => {
    const position = computeThreadMenuPosition({
      top: 40,
      bottom: 60,
      right: window.innerWidth + 100,
    })

    expect(position.left).toBeLessThanOrEqual(window.innerWidth - 176 - 8)
    expect(position.left).toBeGreaterThanOrEqual(8)
  })

  it('opens upward when there is not enough space below', () => {
    const position = computeThreadMenuPosition({
      top: window.innerHeight - 100,
      bottom: window.innerHeight - 80,
      right: 220,
    })

    expect(position.top).toBeLessThan(window.innerHeight - 100)
  })
})
