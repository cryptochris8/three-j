import { describe, it, expect, beforeEach } from 'vitest'
import { useScoreStore } from '@/stores/useScoreStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { getStarRating } from '@/utils/scoring'

describe('store integration', () => {
  beforeEach(() => {
    useScoreStore.setState({
      currentScore: 0, currentStreak: 0, highScores: {}, history: [],
    })
    useProgressStore.setState({
      unlockedGames: ['basketball'], totalStars: 0, achievements: [], recentUnlocks: [],
    })
    useEducationStore.setState({
      currentQuestion: null, difficulty: 'easy', streak: 0,
      totalCorrect: 0, totalAnswered: 0, answeredIds: [],
    })
    // Reset player profiles to clean coin state
    usePlayerStore.setState({
      profiles: [
        { id: 1, name: 'Player 1', age: 6, avatar: '1', skinId: 1, coins: 0, totalXP: 0, createdAt: Date.now() },
      ],
      activeProfileId: 1,
    })
  })

  describe('score -> stars -> unlock flow', () => {
    it('scoring well earns stars and unlocks games', () => {
      useScoreStore.getState().addScore(50)
      const stars = getStarRating('basketball', 50)
      expect(stars).toBe(3)

      useScoreStore.getState().saveResult('basketball', 50, stars)
      useProgressStore.getState().addStars(stars)

      expect(useProgressStore.getState().totalStars).toBe(3)
      expect(useProgressStore.getState().unlockedGames).toContain('soccer')
    })

    it('all games always unlocked (unlock gating disabled)', () => {
      // With isGameUnlocked always returning true, all games are accessible
      useProgressStore.getState().addStars(3)
      expect(useProgressStore.getState().isGameUnlocked('soccer')).toBe(true)
      expect(useProgressStore.getState().isGameUnlocked('bowling')).toBe(true)

      useProgressStore.getState().addStars(5)
      expect(useProgressStore.getState().isGameUnlocked('bowling')).toBe(true)
      expect(useProgressStore.getState().isGameUnlocked('minigolf')).toBe(true)

      // Stars still accumulate even though games are already unlocked
      useProgressStore.getState().addStars(7)
      expect(useProgressStore.getState().totalStars).toBe(15)
    })
  })

  describe('quiz -> coins -> difficulty adaptation', () => {
    it('correct answers earn coins', () => {
      expect(usePlayerStore.getState().getActiveProfile()!.coins).toBe(0)
      usePlayerStore.getState().addCoins(5)
      expect(usePlayerStore.getState().getActiveProfile()!.coins).toBe(5)
    })

    it('3 correct in a row upgrades difficulty', () => {
      expect(useEducationStore.getState().difficulty).toBe('easy')
      useEducationStore.getState().answerCorrect('q1')
      useEducationStore.getState().answerCorrect('q2')
      useEducationStore.getState().answerCorrect('q3')
      expect(useEducationStore.getState().difficulty).toBe('medium')
    })

    it('2 wrong in a row downgrades difficulty', () => {
      useEducationStore.setState({ difficulty: 'medium', streak: 0 })
      useEducationStore.getState().answerWrong('q1')
      useEducationStore.getState().answerWrong('q2')
      expect(useEducationStore.getState().difficulty).toBe('easy')
    })

    it('full flow: quiz correct -> coins + difficulty up', () => {
      expect(usePlayerStore.getState().getActiveProfile()!.coins).toBe(0)

      for (let i = 0; i < 3; i++) {
        useEducationStore.getState().answerCorrect(`q${i}`)
        usePlayerStore.getState().addCoins(5)
      }

      expect(useEducationStore.getState().difficulty).toBe('medium')
      expect(useEducationStore.getState().totalCorrect).toBe(3)
      expect(usePlayerStore.getState().getActiveProfile()!.coins).toBe(15)
    })

    it('full difficulty progression: easy -> medium -> hard', () => {
      useEducationStore.getState().answerCorrect('q1')
      useEducationStore.getState().answerCorrect('q2')
      useEducationStore.getState().answerCorrect('q3')
      expect(useEducationStore.getState().difficulty).toBe('medium')

      useEducationStore.getState().answerCorrect('q4')
      useEducationStore.getState().answerCorrect('q5')
      useEducationStore.getState().answerCorrect('q6')
      expect(useEducationStore.getState().difficulty).toBe('hard')
    })
  })

  describe('score history tracking', () => {
    it('tracks multiple game results', () => {
      useScoreStore.getState().saveResult('basketball', 30, 2)
      useScoreStore.getState().saveResult('soccer', 3, 2)
      useScoreStore.getState().saveResult('basketball', 50, 3)

      expect(useScoreStore.getState().getGamesPlayed('basketball')).toBe(2)
      expect(useScoreStore.getState().getGamesPlayed('soccer')).toBe(1)
      expect(useScoreStore.getState().getHighScore('basketball')).toBe(50)
      expect(useScoreStore.getState().getBestStars('basketball')).toBe(3)
    })

    it('calculates average score', () => {
      useScoreStore.getState().saveResult('basketball', 20, 1)
      useScoreStore.getState().saveResult('basketball', 40, 2)
      expect(useScoreStore.getState().getAverageScore('basketball')).toBe(30)
    })

    it('minigolf high score uses lower-is-better', () => {
      useScoreStore.getState().saveResult('minigolf', 35, 2)
      useScoreStore.getState().saveResult('minigolf', 28, 3)
      expect(useScoreStore.getState().getHighScore('minigolf')).toBe(28)
    })
  })

  describe('achievements', () => {
    it('can unlock and check achievements', () => {
      expect(useProgressStore.getState().hasAchievement('first_star')).toBe(false)
      useProgressStore.getState().unlockAchievement({
        id: 'first_star', name: 'First Star', description: 'Earn your first star', icon: 'star',
      })
      expect(useProgressStore.getState().hasAchievement('first_star')).toBe(true)
    })

    it('does not duplicate achievements', () => {
      const achievement = {
        id: 'first_star', name: 'First Star', description: 'Earn your first star', icon: 'star',
      }
      useProgressStore.getState().unlockAchievement(achievement)
      useProgressStore.getState().unlockAchievement(achievement)
      expect(useProgressStore.getState().achievements).toHaveLength(1)
    })

    it('tracks recent unlocks for toast display', () => {
      useProgressStore.getState().unlockAchievement({
        id: 'test', name: 'Test', description: 'Test', icon: 'test',
      })
      expect(useProgressStore.getState().recentUnlocks).toHaveLength(1)
      useProgressStore.getState().clearRecentUnlocks()
      expect(useProgressStore.getState().recentUnlocks).toHaveLength(0)
    })
  })

  describe('education accuracy', () => {
    it('tracks accuracy correctly', () => {
      useEducationStore.getState().answerCorrect('q1')
      useEducationStore.getState().answerCorrect('q2')
      useEducationStore.getState().answerWrong('q3')
      expect(useEducationStore.getState().getAccuracy()).toBeCloseTo(2 / 3)
    })

    it('returns 0 accuracy with no answers', () => {
      expect(useEducationStore.getState().getAccuracy()).toBe(0)
    })
  })
})
