import { describe, it, expect } from 'vitest'
import { DIFFICULTY_TIERS, getDifficultyOverrides } from '@/systems/difficultyTiers'

describe('difficultyTiers', () => {
  it('has easy, medium, and hard tiers', () => {
    expect(DIFFICULTY_TIERS).toHaveProperty('easy')
    expect(DIFFICULTY_TIERS).toHaveProperty('medium')
    expect(DIFFICULTY_TIERS).toHaveProperty('hard')
  })

  it('getDifficultyOverrides returns correct tier', () => {
    expect(getDifficultyOverrides('easy')).toBe(DIFFICULTY_TIERS.easy)
    expect(getDifficultyOverrides('hard')).toBe(DIFFICULTY_TIERS.hard)
  })

  describe('basketball', () => {
    it('easy has more shots than medium', () => {
      expect(DIFFICULTY_TIERS.easy.basketball.totalShots).toBeGreaterThan(
        DIFFICULTY_TIERS.medium.basketball.totalShots,
      )
    })

    it('hard has fewer shots than medium', () => {
      expect(DIFFICULTY_TIERS.hard.basketball.totalShots).toBeLessThan(
        DIFFICULTY_TIERS.medium.basketball.totalShots,
      )
    })

    it('easy has more time than hard', () => {
      expect(DIFFICULTY_TIERS.easy.basketball.roundTimeSeconds).toBeGreaterThan(
        DIFFICULTY_TIERS.hard.basketball.roundTimeSeconds,
      )
    })

    it('easy has wider hoop', () => {
      expect(DIFFICULTY_TIERS.easy.basketball.hoopRadiusScale).toBeGreaterThan(
        DIFFICULTY_TIERS.hard.basketball.hoopRadiusScale,
      )
    })
  })

  describe('soccer', () => {
    it('easy has more kicks than hard', () => {
      expect(DIFFICULTY_TIERS.easy.soccer.totalKicks).toBeGreaterThan(
        DIFFICULTY_TIERS.hard.soccer.totalKicks,
      )
    })

    it('easy has slower keeper', () => {
      expect(DIFFICULTY_TIERS.easy.soccer.keeperSpeedScale).toBeLessThan(
        DIFFICULTY_TIERS.hard.soccer.keeperSpeedScale,
      )
    })
  })

  describe('bowling', () => {
    it('easy has bumpers', () => {
      expect(DIFFICULTY_TIERS.easy.bowling.hasBumpers).toBe(true)
    })

    it('medium and hard have no bumpers', () => {
      expect(DIFFICULTY_TIERS.medium.bowling.hasBumpers).toBe(false)
      expect(DIFFICULTY_TIERS.hard.bowling.hasBumpers).toBe(false)
    })

    it('easy has wider lane than hard', () => {
      expect(DIFFICULTY_TIERS.easy.bowling.laneWidthScale).toBeGreaterThan(
        DIFFICULTY_TIERS.hard.bowling.laneWidthScale,
      )
    })
  })

  describe('minigolf', () => {
    it('easy has more max strokes', () => {
      expect(DIFFICULTY_TIERS.easy.minigolf.maxStrokes).toBeGreaterThan(
        DIFFICULTY_TIERS.hard.minigolf.maxStrokes,
      )
    })

    it('easy has higher par scale', () => {
      expect(DIFFICULTY_TIERS.easy.minigolf.parScale).toBeGreaterThan(
        DIFFICULTY_TIERS.hard.minigolf.parScale,
      )
    })

    it('medium has default par scale of 1.0', () => {
      expect(DIFFICULTY_TIERS.medium.minigolf.parScale).toBe(1.0)
    })
  })

  describe('all games covered', () => {
    const games = ['basketball', 'soccer', 'bowling', 'minigolf'] as const
    for (const game of games) {
      it(`${game} has overrides in all tiers`, () => {
        expect(DIFFICULTY_TIERS.easy).toHaveProperty(game)
        expect(DIFFICULTY_TIERS.medium).toHaveProperty(game)
        expect(DIFFICULTY_TIERS.hard).toHaveProperty(game)
      })
    }
  })
})
