import { describe, it, expect, beforeEach } from 'vitest'
import { useScoreStore } from '@/stores/useScoreStore'

describe('useScoreStore', () => {
  beforeEach(() => {
    useScoreStore.setState({
      currentScore: 0,
      currentStreak: 0,
      highScores: {},
      history: [],
    })
  })

  describe('addScore', () => {
    it('adds points to current score', () => {
      useScoreStore.getState().addScore(10)
      expect(useScoreStore.getState().currentScore).toBe(10)
    })

    it('accumulates score across multiple calls', () => {
      useScoreStore.getState().addScore(10)
      useScoreStore.getState().addScore(5)
      expect(useScoreStore.getState().currentScore).toBe(15)
    })
  })

  describe('streak', () => {
    it('increments streak', () => {
      useScoreStore.getState().incrementStreak()
      useScoreStore.getState().incrementStreak()
      expect(useScoreStore.getState().currentStreak).toBe(2)
    })

    it('resets streak', () => {
      useScoreStore.getState().incrementStreak()
      useScoreStore.getState().resetStreak()
      expect(useScoreStore.getState().currentStreak).toBe(0)
    })
  })

  describe('resetCurrentScore', () => {
    it('resets both score and streak', () => {
      useScoreStore.getState().addScore(50)
      useScoreStore.getState().incrementStreak()
      useScoreStore.getState().resetCurrentScore()
      expect(useScoreStore.getState().currentScore).toBe(0)
      expect(useScoreStore.getState().currentStreak).toBe(0)
    })
  })

  describe('saveResult', () => {
    it('saves high score for regular game (higher is better)', () => {
      useScoreStore.getState().saveResult('basketball', 30, 2)
      expect(useScoreStore.getState().getHighScore('basketball')).toBe(30)
    })

    it('keeps higher score for regular game', () => {
      useScoreStore.getState().saveResult('basketball', 30, 2)
      useScoreStore.getState().saveResult('basketball', 20, 1)
      expect(useScoreStore.getState().getHighScore('basketball')).toBe(30)
    })

    it('updates high score when beaten for regular game', () => {
      useScoreStore.getState().saveResult('basketball', 30, 2)
      useScoreStore.getState().saveResult('basketball', 50, 3)
      expect(useScoreStore.getState().getHighScore('basketball')).toBe(50)
    })

    it('saves lower score as high score for minigolf', () => {
      useScoreStore.getState().saveResult('minigolf', 40, 1)
      useScoreStore.getState().saveResult('minigolf', 30, 2)
      expect(useScoreStore.getState().getHighScore('minigolf')).toBe(30)
    })

    it('keeps lower score for minigolf when worse score played', () => {
      useScoreStore.getState().saveResult('minigolf', 30, 2)
      useScoreStore.getState().saveResult('minigolf', 40, 1)
      expect(useScoreStore.getState().getHighScore('minigolf')).toBe(30)
    })

    it('appends to history', () => {
      useScoreStore.getState().saveResult('basketball', 30, 2)
      useScoreStore.getState().saveResult('soccer', 3, 2)
      expect(useScoreStore.getState().history).toHaveLength(2)
    })
  })

  describe('getBestStars', () => {
    it('returns 0 when no history', () => {
      expect(useScoreStore.getState().getBestStars('basketball')).toBe(0)
    })

    it('returns best stars from history', () => {
      useScoreStore.getState().saveResult('basketball', 20, 1)
      useScoreStore.getState().saveResult('basketball', 35, 2)
      useScoreStore.getState().saveResult('basketball', 25, 1)
      expect(useScoreStore.getState().getBestStars('basketball')).toBe(2)
    })
  })
})
