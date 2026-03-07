import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Achievement } from '@/types'

interface ProgressState {
  unlockedGames: string[]
  totalStars: number
  achievements: Achievement[]
  isGameUnlocked: (game: string) => boolean
  unlockGame: (game: string) => void
  addStars: (count: number) => void
  unlockAchievement: (achievement: Achievement) => void
  hasAchievement: (id: string) => boolean
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      unlockedGames: ['basketball'],
      totalStars: 0,
      achievements: [],

      isGameUnlocked: (game) => get().unlockedGames.includes(game),

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
            : { achievements: [...s.achievements, { ...achievement, unlockedAt: Date.now() }] }
        ),

      hasAchievement: (id) => get().achievements.some((a) => a.id === id),
    }),
    { name: 'three-j-progress' }
  )
)
