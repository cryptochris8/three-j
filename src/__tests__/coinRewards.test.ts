import { describe, it, expect } from 'vitest'
import { getGameCoins } from '@/utils/scoring'

describe('getGameCoins', () => {
  it('returns 0 coins for 0 stars', () => {
    expect(getGameCoins(0, false)).toBe(0)
  })

  it('returns 5 coins for 1 star', () => {
    expect(getGameCoins(1, false)).toBe(5)
  })

  it('returns 10 coins for 2 stars', () => {
    expect(getGameCoins(2, false)).toBe(10)
  })

  it('returns 15 coins for 3 stars', () => {
    expect(getGameCoins(3, false)).toBe(15)
  })

  it('adds 5 bonus coins for new high score', () => {
    expect(getGameCoins(0, true)).toBe(5)
    expect(getGameCoins(1, true)).toBe(10)
    expect(getGameCoins(2, true)).toBe(15)
    expect(getGameCoins(3, true)).toBe(20)
  })

  it('handles out-of-range stars gracefully', () => {
    expect(getGameCoins(4, false)).toBe(0)
    expect(getGameCoins(-1, false)).toBe(0)
  })
})
