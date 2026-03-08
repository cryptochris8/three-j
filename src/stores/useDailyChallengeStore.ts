import { create } from 'zustand'
import { generateDailyChallenges, getTodayDateKey, type DailyChallenge } from '@/systems/dailyChallenges'

interface DailyChallengeState {
  dateKey: string
  challenges: DailyChallenge[]
  completedIds: string[]

  refreshIfNeeded: () => void
  isCompleted: (id: string) => boolean
  completeChallenge: (id: string) => void
}

export const useDailyChallengeStore = create<DailyChallengeState>((set, get) => ({
  dateKey: '',
  challenges: [],
  completedIds: [],

  refreshIfNeeded: () => {
    const today = getTodayDateKey()
    if (get().dateKey !== today) {
      set({
        dateKey: today,
        challenges: generateDailyChallenges(),
        completedIds: [],
      })
    }
  },

  isCompleted: (id) => get().completedIds.includes(id),

  completeChallenge: (id) =>
    set((s) =>
      s.completedIds.includes(id)
        ? s
        : { completedIds: [...s.completedIds, id] },
    ),
}))
