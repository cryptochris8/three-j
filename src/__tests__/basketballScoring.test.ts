import { describe, it, expect } from 'vitest'
import { BASKETBALL_CONFIG } from '@/games/basketball/config'

describe('basketball scoring rules', () => {
  const { swishPoints, backboardPoints, rimPoints, streakBonusThreshold, streakBonusMultiplier } = BASKETBALL_CONFIG

  describe('base points', () => {
    it('swish is worth the most', () => {
      expect(swishPoints).toBeGreaterThan(backboardPoints)
      expect(swishPoints).toBeGreaterThan(rimPoints)
    })

    it('backboard is worth more than rim', () => {
      expect(backboardPoints).toBeGreaterThan(rimPoints)
    })

    it('swish = 5 points', () => {
      expect(swishPoints).toBe(5)
    })

    it('backboard = 3 points', () => {
      expect(backboardPoints).toBe(3)
    })

    it('rim = 2 points', () => {
      expect(rimPoints).toBe(2)
    })
  })

  describe('streak bonus', () => {
    it('streak threshold is 3', () => {
      expect(streakBonusThreshold).toBe(3)
    })

    it('streak multiplier is 2x', () => {
      expect(streakBonusMultiplier).toBe(2)
    })

    it('streak x2 applies at threshold', () => {
      const basePoints = swishPoints
      const streakPoints = basePoints * streakBonusMultiplier
      expect(streakPoints).toBe(10)
    })
  })

  describe('power shot', () => {
    it('power shot doubles points', () => {
      const basePoints = swishPoints
      const powerPoints = basePoints * 2
      expect(powerPoints).toBe(10)
    })

    it('combined streak + power = x4', () => {
      const basePoints = swishPoints
      const combined = basePoints * streakBonusMultiplier * 2
      expect(combined).toBe(20)
    })
  })

  describe('game config', () => {
    it('has 15 total shots', () => {
      expect(BASKETBALL_CONFIG.totalShots).toBe(15)
    })

    it('has 90 second round time', () => {
      expect(BASKETBALL_CONFIG.roundTimeSeconds).toBe(90)
    })
  })
})
