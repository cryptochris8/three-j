import { describe, it, expect } from 'vitest'
import { TARGET_TYPES, ARCHERY_CONFIG, pickTargetType, getArcheryConfig } from '@/games/archery/config'

describe('archery config', () => {
  describe('TARGET_TYPES', () => {
    it('has 5 target types', () => {
      expect(TARGET_TYPES).toHaveLength(5)
    })

    it('weights sum to 100', () => {
      const total = TARGET_TYPES.reduce((sum, t) => sum + t.weight, 0)
      expect(total).toBe(100)
    })

    it('all target types have positive points', () => {
      for (const t of TARGET_TYPES) {
        expect(t.points).toBeGreaterThan(0)
      }
    })

    it('all target types have a model path and label', () => {
      for (const t of TARGET_TYPES) {
        expect(t.model).toMatch(/^\/models\/npcs\//)
        expect(t.label.length).toBeGreaterThan(0)
        expect(t.runAnim.trim().length).toBeGreaterThan(0)
      }
    })
  })

  describe('pickTargetType', () => {
    it('returns a valid target type', () => {
      const target = pickTargetType()
      expect(TARGET_TYPES).toContain(target)
    })
  })

  describe('streak config', () => {
    it('has streakBonusThreshold of 3', () => {
      expect(ARCHERY_CONFIG.streakBonusThreshold).toBe(3)
    })

    it('has streakBonusMultiplier of 2', () => {
      expect(ARCHERY_CONFIG.streakBonusMultiplier).toBe(2)
    })
  })

  describe('getArcheryConfig', () => {
    it('returns easy config with longer time', () => {
      const config = getArcheryConfig('easy')
      expect(config.roundTimeSeconds).toBe(120)
      expect(config.maxTargets).toBe(4)
      expect(config.targetSpeedScale).toBe(0.7)
      expect(config.targetSizeScale).toBe(1.3)
    })

    it('returns medium config with default time', () => {
      const config = getArcheryConfig('medium')
      expect(config.roundTimeSeconds).toBe(90)
      expect(config.maxTargets).toBe(6)
    })

    it('returns hard config with shorter time', () => {
      const config = getArcheryConfig('hard')
      expect(config.roundTimeSeconds).toBe(60)
      expect(config.maxTargets).toBe(8)
      expect(config.targetSpeedScale).toBe(1.4)
      expect(config.targetSizeScale).toBe(0.8)
    })
  })
})
