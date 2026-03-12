import { create } from 'zustand'
import type { Achievement } from '@/types'

interface ProgressState {
  unlockedGames: string[]
  totalStars: number
  achievements: Achievement[]
  recentUnlocks: Achievement[]
  isGameUnlocked: (game: string) => boolean
  unlockGame: (game: string) => void
  addStars: (count: number) => void
  unlockAchievement: (achievement: Achievement) => void
  hasAchievement: (id: string) => boolean
  clearRecentUnlocks: () => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  unlockedGames: ['basketball', 'soccer', 'bowling', 'minigolf', 'archery', 'football'],
  totalStars: 0,
  achievements: [],
  recentUnlocks: [],

  isGameUnlocked: (_game) => true, // All base games always unlocked

  unlockGame: (game) =>
    set((s) =>
      s.unlockedGames.includes(game)
        ? s
        : { unlockedGames: [...s.unlockedGames, game] }
    ),

  addStars: (count) =>
    set((s) => {
      const newTotal = s.totalStars + count
      const unlocks: string[] = []
      if (newTotal >= 3 && !s.unlockedGames.includes('soccer')) unlocks.push('soccer')
      if (newTotal >= 8 && !s.unlockedGames.includes('bowling')) unlocks.push('bowling')
      if (newTotal >= 15 && !s.unlockedGames.includes('minigolf')) unlocks.push('minigolf')
      return {
        totalStars: newTotal,
        unlockedGames: [...s.unlockedGames, ...unlocks],
      }
    }),

  unlockAchievement: (achievement) =>
    set((s) =>
      s.achievements.some((a) => a.id === achievement.id)
        ? s
        : {
            achievements: [...s.achievements, { ...achievement, unlockedAt: Date.now() }],
            recentUnlocks: [...s.recentUnlocks, { ...achievement, unlockedAt: Date.now() }],
          }
    ),

  hasAchievement: (id) => get().achievements.some((a) => a.id === id),

  clearRecentUnlocks: () => set({ recentUnlocks: [] }),
}))
