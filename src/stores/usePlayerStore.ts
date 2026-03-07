import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlayerProfile } from '@/types'

const DEFAULT_PROFILES: PlayerProfile[] = [
  { id: 1, name: 'Player 1', age: 6, avatar: '🌟', coins: 0, totalXP: 0, createdAt: Date.now() },
  { id: 2, name: 'Player 2', age: 8, avatar: '⭐', coins: 0, totalXP: 0, createdAt: Date.now() },
  { id: 3, name: 'Player 3', age: 8, avatar: '💫', coins: 0, totalXP: 0, createdAt: Date.now() },
]

interface PlayerState {
  profiles: PlayerProfile[]
  activeProfileId: number | null
  getActiveProfile: () => PlayerProfile | null
  setActiveProfile: (id: number) => void
  updateProfile: (id: number, updates: Partial<PlayerProfile>) => void
  addCoins: (amount: number) => void
  addXP: (amount: number) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      profiles: DEFAULT_PROFILES,
      activeProfileId: null,

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find((p) => p.id === activeProfileId) ?? null
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      updateProfile: (id, updates) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      addCoins: (amount) => {
        const { activeProfileId } = get()
        if (!activeProfileId) return
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === activeProfileId ? { ...p, coins: p.coins + amount } : p
          ),
        }))
      },

      addXP: (amount) => {
        const { activeProfileId } = get()
        if (!activeProfileId) return
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === activeProfileId ? { ...p, totalXP: p.totalXP + amount } : p
          ),
        }))
      },
    }),
    { name: 'three-j-players' }
  )
)
