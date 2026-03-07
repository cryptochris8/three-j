import { describe, it, expect } from 'vitest'
import { getStarRating, getScoreLabel } from '@/utils/scoring'

describe('getStarRating', () => {
  describe('basketball', () => {
    it('returns 0 stars below threshold', () => {
      expect(getStarRating('basketball', 10)).toBe(0)
    })

    it('returns 1 star at one-star threshold', () => {
      expect(getStarRating('basketball', 15)).toBe(1)
    })

    it('returns 2 stars at two-star threshold', () => {
      expect(getStarRating('basketball', 30)).toBe(2)
    })

    it('returns 3 stars at three-star threshold', () => {
      expect(getStarRating('basketball', 50)).toBe(3)
    })

    it('returns 3 stars above three-star threshold', () => {
      expect(getStarRating('basketball', 100)).toBe(3)
    })
  })

  describe('minigolf (lower is better)', () => {
    it('returns 3 stars for low score', () => {
      expect(getStarRating('minigolf', 25)).toBe(3)
    })

    it('returns 2 stars at two-star threshold', () => {
      expect(getStarRating('minigolf', 36)).toBe(2)
    })

    it('returns 1 star at one-star threshold', () => {
      expect(getStarRating('minigolf', 45)).toBe(1)
    })

    it('returns 0 stars for high score', () => {
      expect(getStarRating('minigolf', 50)).toBe(0)
    })
  })

  describe('unknown game', () => {
    it('returns 0 for unknown game', () => {
      expect(getStarRating('unknown', 100)).toBe(0)
    })
  })
})

describe('getScoreLabel', () => {
  it('returns Amazing for 3 stars', () => {
    expect(getScoreLabel('basketball', 3)).toBe('Amazing!')
  })

  it('returns Great job for 2 stars', () => {
    expect(getScoreLabel('basketball', 2)).toBe('Great job!')
  })

  it('returns Good try for 1 star', () => {
    expect(getScoreLabel('basketball', 1)).toBe('Good try!')
  })

  it('returns Keep practicing for 0 stars', () => {
    expect(getScoreLabel('basketball', 0)).toBe('Keep practicing!')
  })
})
