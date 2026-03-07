import { create } from 'zustand'
import { SOCCER_CONFIG } from './config'

type SoccerPhase = 'aiming' | 'charging' | 'flying' | 'result' | 'done'
type KickResult = 'goal' | 'saved' | 'miss'

interface SoccerState {
  phase: SoccerPhase
  currentKick: number
  playerGoals: number
  opponentGoals: number
  aimX: number
  aimY: number
  power: number
  lastResult: KickResult | null
  keeperSlowed: boolean

  setAim: (x: number, y: number) => void
  startCharging: () => void
  setPower: (p: number) => void
  kick: () => { power: number; aimX: number; aimY: number }
  registerGoal: () => void
  registerSaved: () => void
  registerMiss: () => void
  simulateOpponent: () => boolean
  nextKick: () => void
  setKeeperSlowed: (slowed: boolean) => void
  resetGame: () => void
}

export const useSoccer = create<SoccerState>((set, get) => ({
  phase: 'aiming',
  currentKick: 1,
  playerGoals: 0,
  opponentGoals: 0,
  aimX: 0,
  aimY: 1.2,
  power: 0,
  lastResult: null,
  keeperSlowed: false,

  setAim: (x, y) => set({ aimX: x, aimY: y }),

  startCharging: () => set({ phase: 'charging', power: 0 }),

  setPower: (p) => set({ power: p }),

  kick: () => {
    const { power, aimX, aimY } = get()
    set({ phase: 'flying' })
    return { power, aimX, aimY }
  },

  registerGoal: () =>
    set((s) => ({
      phase: 'result',
      lastResult: 'goal',
      playerGoals: s.playerGoals + 1,
    })),

  registerSaved: () =>
    set({ phase: 'result', lastResult: 'saved' }),

  registerMiss: () =>
    set({ phase: 'result', lastResult: 'miss' }),

  simulateOpponent: () => {
    // Opponent scores ~60% of the time
    const scores = Math.random() < 0.6
    if (scores) {
      set((s) => ({ opponentGoals: s.opponentGoals + 1 }))
    }
    return scores
  },

  nextKick: () => {
    const { currentKick } = get()
    if (currentKick >= SOCCER_CONFIG.totalKicks) {
      set({ phase: 'done' })
    } else {
      set({
        currentKick: currentKick + 1,
        phase: 'aiming',
        aimX: 0,
        aimY: 1.2,
        power: 0,
        lastResult: null,
        keeperSlowed: false,
      })
    }
  },

  setKeeperSlowed: (slowed) => set({ keeperSlowed: slowed }),

  resetGame: () => set({
    phase: 'aiming',
    currentKick: 1,
    playerGoals: 0,
    opponentGoals: 0,
    aimX: 0,
    aimY: 1.2,
    power: 0,
    lastResult: null,
    keeperSlowed: false,
  }),
}))
