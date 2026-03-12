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
    selectedDifficulty: 'medium',
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
    it('unlocks when all 6 games unlocked', () => {
      const results = checkAchievements(makeCtx({
        unlockedGames: ['basketball', 'soccer', 'bowling', 'minigolf', 'archery', 'football'],
      }))
      expect(results.some((a) => a.id === 'all-unlocked')).toBe(true)
    })

    it('does not unlock with only 5 games', () => {
      const results = checkAchievements(makeCtx({
        unlockedGames: ['basketball', 'soccer', 'bowling', 'minigolf', 'archery'],
      }))
      expect(results.some((a) => a.id === 'all-unlocked')).toBe(false)
    })
  })

  describe('well rounded', () => {
    it('unlocks when all 6 games played', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 10, stars: 1 },
          { game: 'soccer', score: 2, stars: 1 },
          { game: 'bowling', score: 30, stars: 1 },
          { game: 'minigolf', score: 20, stars: 1 },
          { game: 'archery', score: 50, stars: 1 },
          { game: 'football', score: 40, stars: 1 },
        ],
      }))
      expect(results.some((a) => a.id === 'all-played')).toBe(true)
    })

    it('does not unlock with only 5 games played', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 10, stars: 1 },
          { game: 'soccer', score: 2, stars: 1 },
          { game: 'bowling', score: 30, stars: 1 },
          { game: 'minigolf', score: 20, stars: 1 },
          { game: 'archery', score: 50, stars: 1 },
        ],
      }))
      expect(results.some((a) => a.id === 'all-played')).toBe(false)
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
        achievements: [{ id: 'first-star', name: 'Rising Star', description: '', icon: 'star' }],
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

  // --- Football achievements ---
  describe('football achievements', () => {
    it('football-first unlocks on any football game', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'football', score: 10, stars: 1 }],
      }))
      expect(results.some((a) => a.id === 'football-first')).toBe(true)
    })

    it('football-3star unlocks with 3 stars', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'football', score: 80, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'football-3star')).toBe(true)
    })

    it('football-100 unlocks with 100+ score', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'football', score: 100, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'football-100')).toBe(true)
    })

    it('football-100 does not unlock below 100', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'football', score: 99, stars: 2 }],
      }))
      expect(results.some((a) => a.id === 'football-100')).toBe(false)
    })
  })

  // --- Mastery achievements ---
  describe('mastery achievements', () => {
    it('bowling-perfect unlocks at 150+', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'bowling', score: 150, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'bowling-perfect')).toBe(true)
    })

    it('bowling-perfect does not unlock below 150', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'bowling', score: 149, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'bowling-perfect')).toBe(false)
    })

    it('golf-hole-in-one unlocks at 9 or fewer strokes', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'minigolf', score: 9, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'golf-hole-in-one')).toBe(true)
    })

    it('golf-hole-in-one does not unlock above 9', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'minigolf', score: 10, stars: 2 }],
      }))
      expect(results.some((a) => a.id === 'golf-hole-in-one')).toBe(false)
    })

    it('archery-sharpshooter unlocks at 200+', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'archery', score: 200, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'archery-sharpshooter')).toBe(true)
    })

    it('soccer-clean-sheet unlocks at 5+ goals', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'soccer', score: 5, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'soccer-clean-sheet')).toBe(true)
    })

    it('basketball-60 unlocks at 60+ score', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 60, stars: 3 }],
      }))
      expect(results.some((a) => a.id === 'basketball-60')).toBe(true)
    })
  })

  // --- Difficulty achievements ---
  describe('difficulty achievements', () => {
    it('win-easy unlocks with 3 stars on easy', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 50, stars: 3, difficulty: 'easy' }],
      }))
      expect(results.some((a) => a.id === 'win-easy')).toBe(true)
    })

    it('win-medium unlocks with 3 stars on medium', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 50, stars: 3, difficulty: 'medium' }],
      }))
      expect(results.some((a) => a.id === 'win-medium')).toBe(true)
    })

    it('win-hard unlocks with 3 stars on hard', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 50, stars: 3, difficulty: 'hard' }],
      }))
      expect(results.some((a) => a.id === 'win-hard')).toBe(true)
    })

    it('win-hard does not unlock with 2 stars on hard', () => {
      const results = checkAchievements(makeCtx({
        history: [{ game: 'basketball', score: 30, stars: 2, difficulty: 'hard' }],
      }))
      expect(results.some((a) => a.id === 'win-hard')).toBe(false)
    })
  })

  // --- Cumulative achievements ---
  describe('cumulative achievements', () => {
    it('twenty-five-games unlocks at 25 games', () => {
      const history = Array.from({ length: 25 }, () => ({ game: 'basketball', score: 10, stars: 1 }))
      const results = checkAchievements(makeCtx({ history }))
      expect(results.some((a) => a.id === 'twenty-five-games')).toBe(true)
    })

    it('fifty-games unlocks at 50 games', () => {
      const history = Array.from({ length: 50 }, () => ({ game: 'soccer', score: 2, stars: 1 }))
      const results = checkAchievements(makeCtx({ history }))
      expect(results.some((a) => a.id === 'fifty-games')).toBe(true)
    })

    it('star-100 unlocks at 100 total stars', () => {
      const results = checkAchievements(makeCtx({ totalStars: 100 }))
      expect(results.some((a) => a.id === 'star-100')).toBe(true)
    })

    it('total-score-500 unlocks with 500+ total (excl minigolf)', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 300, stars: 3 },
          { game: 'bowling', score: 200, stars: 3 },
        ],
      }))
      expect(results.some((a) => a.id === 'total-score-500')).toBe(true)
    })

    it('total-score-500 excludes minigolf scores', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 200, stars: 3 },
          { game: 'minigolf', score: 300, stars: 1 },
        ],
      }))
      expect(results.some((a) => a.id === 'total-score-500')).toBe(false)
    })
  })

  // --- Cross-game achievements ---
  describe('cross-game achievements', () => {
    it('three-star-trio unlocks with 3 stars in 3 different games', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 60, stars: 3 },
          { game: 'soccer', score: 5, stars: 3 },
          { game: 'bowling', score: 100, stars: 3 },
        ],
      }))
      expect(results.some((a) => a.id === 'three-star-trio')).toBe(true)
    })

    it('three-star-trio does not unlock with only 2 games', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 60, stars: 3 },
          { game: 'soccer', score: 5, stars: 3 },
        ],
      }))
      expect(results.some((a) => a.id === 'three-star-trio')).toBe(false)
    })

    it('three-star-all unlocks with 3 stars in all 6 games', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 60, stars: 3 },
          { game: 'soccer', score: 5, stars: 3 },
          { game: 'bowling', score: 150, stars: 3 },
          { game: 'minigolf', score: 9, stars: 3 },
          { game: 'archery', score: 200, stars: 3 },
          { game: 'football', score: 100, stars: 3 },
        ],
      }))
      expect(results.some((a) => a.id === 'three-star-all')).toBe(true)
    })

    it('three-star-all does not unlock missing one game', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 60, stars: 3 },
          { game: 'soccer', score: 5, stars: 3 },
          { game: 'bowling', score: 150, stars: 3 },
          { game: 'minigolf', score: 9, stars: 3 },
          { game: 'archery', score: 200, stars: 3 },
        ],
      }))
      expect(results.some((a) => a.id === 'three-star-all')).toBe(false)
    })

    it('hard-trio unlocks with 3 stars on hard in 3 games', () => {
      const results = checkAchievements(makeCtx({
        history: [
          { game: 'basketball', score: 60, stars: 3, difficulty: 'hard' },
          { game: 'soccer', score: 5, stars: 3, difficulty: 'hard' },
          { game: 'bowling', score: 150, stars: 3, difficulty: 'hard' },
        ],
      }))
      expect(results.some((a) => a.id === 'hard-trio')).toBe(true)
    })
  })

  // --- Education milestones ---
  describe('education milestones', () => {
    it('quiz-100 unlocks at 100 correct', () => {
      const results = checkAchievements(makeCtx({ totalCorrect: 100 }))
      expect(results.some((a) => a.id === 'quiz-100')).toBe(true)
    })

    it('quiz-streak-20 unlocks at 20 streak', () => {
      const results = checkAchievements(makeCtx({ educationStreak: 20 }))
      expect(results.some((a) => a.id === 'quiz-streak-20')).toBe(true)
    })
  })
})
