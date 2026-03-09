import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from '@/stores/useProgressStore'

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({
      unlockedGames: ['basketball'],
      totalStars: 0,
      achievements: [],
    })
  })

  describe('isGameUnlocked', () => {
    it('basketball is unlocked by default', () => {
      expect(useProgressStore.getState().isGameUnlocked('basketball')).toBe(true)
    })

    it('base games are always unlocked', () => {
      expect(useProgressStore.getState().isGameUnlocked('soccer')).toBe(true)
      expect(useProgressStore.getState().isGameUnlocked('bowling')).toBe(true)
      expect(useProgressStore.getState().isGameUnlocked('minigolf')).toBe(true)
    })

    it('all games are unlocked (unlock gating disabled)', () => {
      expect(useProgressStore.getState().isGameUnlocked('some-future-game')).toBe(true)
    })
  })

  describe('unlockGame', () => {
    it('unlocks a new game', () => {
      useProgressStore.getState().unlockGame('soccer')
      expect(useProgressStore.getState().isGameUnlocked('soccer')).toBe(true)
    })

    it('does not duplicate if already unlocked', () => {
      useProgressStore.getState().unlockGame('basketball')
      expect(useProgressStore.getState().unlockedGames.filter((g) => g === 'basketball')).toHaveLength(1)
    })
  })

  describe('addStars', () => {
    it('adds stars to total', () => {
      useProgressStore.getState().addStars(5)
      expect(useProgressStore.getState().totalStars).toBe(5)
    })

    it('unlocks soccer at 3 stars', () => {
      useProgressStore.getState().addStars(3)
      expect(useProgressStore.getState().isGameUnlocked('soccer')).toBe(true)
    })

    it('unlocks bowling at 8 stars', () => {
      useProgressStore.getState().addStars(8)
      expect(useProgressStore.getState().isGameUnlocked('bowling')).toBe(true)
    })

    it('unlocks minigolf at 15 stars', () => {
      useProgressStore.getState().addStars(15)
      expect(useProgressStore.getState().isGameUnlocked('minigolf')).toBe(true)
    })

    it('unlocks multiple games at once with enough stars', () => {
      useProgressStore.getState().addStars(15)
      expect(useProgressStore.getState().isGameUnlocked('soccer')).toBe(true)
      expect(useProgressStore.getState().isGameUnlocked('bowling')).toBe(true)
      expect(useProgressStore.getState().isGameUnlocked('minigolf')).toBe(true)
    })
  })

  describe('achievements', () => {
    it('unlocks an achievement', () => {
      useProgressStore.getState().unlockAchievement({
        id: 'first-win',
        name: 'First Win',
        description: 'Win your first game',
        icon: 'trophy',
      })
      expect(useProgressStore.getState().hasAchievement('first-win')).toBe(true)
    })

    it('does not duplicate achievements', () => {
      const achievement = {
        id: 'first-win',
        name: 'First Win',
        description: 'Win your first game',
        icon: 'trophy',
      }
      useProgressStore.getState().unlockAchievement(achievement)
      useProgressStore.getState().unlockAchievement(achievement)
      expect(useProgressStore.getState().achievements).toHaveLength(1)
    })

    it('returns false for unearned achievement', () => {
      expect(useProgressStore.getState().hasAchievement('nonexistent')).toBe(false)
    })
  })
})
