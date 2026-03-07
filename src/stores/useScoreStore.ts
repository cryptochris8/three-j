import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Scene, GameResult } from '@/types'

interface ScoreState {
  currentScore: number
  currentStreak: number
  highScores: Record<string, number>
  history: GameResult[]
  addScore: (points: number) => void
  incrementStreak: () => void
  resetStreak: () => void
  resetCurrentScore: () => void
  saveResult: (game: Scene, score: number, stars: number) => void
  getHighScore: (game: string) => number
  getBestStars: (game: string) => number
}

export const useScoreStore = create<ScoreState>()(
  persist(
    (set, get) => ({
      currentScore: 0,
      currentStreak: 0,
      highScores: {},
      history: [],

      addScore: (points) =>
        set((s) => ({ currentScore: s.currentScore + points })),

      incrementStreak: () =>
        set((s) => ({ currentStreak: s.currentStreak + 1 })),

      resetStreak: () => set({ currentStreak: 0 }),

      resetCurrentScore: () => set({ currentScore: 0, currentStreak: 0 }),

      saveResult: (game, score, stars) =>
        set((s) => {
          const key = game
          const prevHigh = s.highScores[key] ?? 0
          const isLowerBetter = game === 'minigolf'
          const newHigh = prevHigh === 0
            ? score
            : isLowerBetter
              ? Math.min(prevHigh, score)
              : Math.max(prevHigh, score)
          return {
            highScores: {
              ...s.highScores,
              [key]: newHigh,
            },
            history: [...s.history, { game, score, stars, date: Date.now() }],
          }
        }),

      getHighScore: (game) => get().highScores[game] ?? 0,

      getBestStars: (game) => {
        const results = get().history.filter((r) => r.game === game)
        return results.length ? Math.max(...results.map((r) => r.stars)) : 0
      },
    }),
    { name: 'three-j-scores' }
  )
)
