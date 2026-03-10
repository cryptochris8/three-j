import { describe, it, expect } from 'vitest'
import { checkAchievements, type AchievementContext } from '@/systems/achievements'

function makeCtx(overrides: Partial<AchievementContext> = {}): AchievementContext {
  return {
    totalStars: 0,
    unlockedGames: ['basketball'],
    highScores: {},
    history: [],
    totalCorrect: 0,
    totalAnswered: 0,
    educationStreak: 0,
    achievements: [],
    ...overrides,
  }
}

describe('achievements', () => {
  describe('first star', () => {
    it('unlocks with 1+ total stars', () => {
      const results = checkAchievements(makeCtx({ totalStars: 1 }))
      expect(results.some((a) => a.id === 'first-star')).toBe(true)
    })

    it('does not unlock with 0 stars', () => {
      const results = checkAchievements(makeCtx())
      expect(results.some((a) => a.id === 'first-star')).toBe(false)
    })
  })

  describe('star collector', () => {
    it('unlocks at 10 stars', () => {
      const results = checkAchievements(makeCtx({ totalStars: 10 }))
      expect(results.some((a) => a.id === 'star-10')).toBe(true)
    })
  })

  describe('all access', () => {
    it('unlocks when all 5 games unlocked', () => {
      const results = checkAchievements(makeCtx({
        unlockedGames: ['basketball', 'soccer', 'bowling', 'minigolf', 'archery'],
      }))
      expect(results.some((a) => a.id === 'all-unlocked')).toBe(true)
    })
  })

  describe('quiz achievements', () => {
    it('quick learner at 5 correct', () => {
      const results = checkAchievements(makeCtx({ totalCorrect: 5 }))
      expect(results.some((a) => a.id === 'quiz-5')).toBe(true)
    })

    it('quiz whiz at 20 correct', () => {
      const results = checkAchievements(makeCtx({ totalCorrect: 20 }))
      expect(results.some((a) => a.id === 'quiz-20')).toBe(true)
    })

    it('perfect accuracy with 10+ answered', () => {
      const results = checkAchievements(makeCtx({ totalCorrect: 10, totalAnswered: 10 }))
      expect(results.some((a) => a.id === 'perfect-accuracy')).toBe(true)
    })

    it('no perfect accuracy with wrong answers', () => {
      const results = checkAchievements(makeCtx({ totalCorrect: 9, totalAnswered: 10 }))
      expect(results.some((a) => a.id === 'perfect-accuracy')).toBe(false)
    })
  })

  describe('game-specific', () => {
    it('basketball 3-star', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 60, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'basketball-3star')).toBe(true)
    })

    it('hat trick for 3+ soccer goals', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'soccer', score: 3, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'hat-trick')).toBe(true)
    })

    it('air ball for 0-point basketball', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 0, stars: 0 }],
      }))
      expect(results.some((a) => a.id === 'air-ball')).toBe(true)
    })
  })

  describe('deduplication', () => {
    it('does not re-unlock already earned achievements', () => {
      const results = checkAchievements(makeCtx({
        totalStars: 5,
        achievements: [{ id: 'first-star', name: 'Rising Star', description: '', icon: '⭐' }],
      }))
      expect(results.some((a) => a.id === 'first-star')).toBe(false)
    })
  })

  describe('multiple unlocks', () => {
    it('can unlock multiple achievements at once', () => {
      const results = checkAchievements(makeCtx({
        totalStars: 10,
        totalCorrect: 5,
        history: [{ game: 'basketball', score: 50, stars: 3 }],
      }))
      expect(results.length).toBeGreaterThanOrEqual(3)
    })
  })
})
