import { create } from 'zustand'
import { BOWLING_CONFIG } from './config'

type BowlingPhase = 'positioning' | 'charging' | 'spinning' | 'rolling' | 'scoring' | 'frameover' | 'done'

interface BowlingState {
  phase: BowlingPhase
  currentFrame: number
  effectiveTotalFrames: number
  ballsThisFrame: number
  frameScores: number[]
  pinsKnocked: boolean[]
  totalPinsThisFrame: number
  bowlerX: number
  power: number
  spinAngle: number
  isStrike: boolean
  isSpare: boolean
  hasExtraBall: boolean

  setBowlerX: (x: number) => void
  startCharging: () => void
  setPower: (p: number) => void
  startSpinning: () => void
  setSpinAngle: (a: number) => void
  release: () => { power: number; spin: number; bowlerX: number }
  setPinsKnocked: (knocked: boolean[]) => void
  endBall: () => void
  nextFrame: () => void
  grantExtraBall: () => void
  resetGame: (totalFrames?: number) => void
}

export const useBowling = create<BowlingState>((set, get) => ({
  phase: 'positioning',
  currentFrame: 1,
  effectiveTotalFrames: BOWLING_CONFIG.totalFrames,
  ballsThisFrame: 0,
  frameScores: [],
  pinsKnocked: Array(10).fill(false),
  totalPinsThisFrame: 0,
  bowlerX: 0,
  power: 0,
  spinAngle: 0,
  isStrike: false,
  isSpare: false,
  hasExtraBall: false,

  setBowlerX: (x) => set({ bowlerX: x }),

  startCharging: () => set({ phase: 'charging', power: 0 }),

  setPower: (p) => set({ power: p }),

  startSpinning: () => set({ phase: 'spinning', spinAngle: 0 }),

  setSpinAngle: (a) => set({ spinAngle: a }),

  release: () => {
    const { power, spinAngle, bowlerX } = get()
    set({ phase: 'rolling', ballsThisFrame: get().ballsThisFrame + 1 })
    return { power, spin: spinAngle, bowlerX }
  },

  setPinsKnocked: (knocked) => {
    const count = knocked.filter(Boolean).length
    set({ pinsKnocked: knocked, totalPinsThisFrame: count })
  },

  endBall: () => {
    const { pinsKnocked, ballsThisFrame, hasExtraBall } = get()
    const knockedCount = pinsKnocked.filter(Boolean).length

    if (knockedCount === 10 && ballsThisFrame === 1) {
      // Strike!
      const score = BOWLING_CONFIG.strikePoints
      set((s) => ({
        phase: 'frameover',
        isStrike: true,
        isSpare: false,
        frameScores: [...s.frameScores, score],
      }))
    } else if (knockedCount === 10 && ballsThisFrame === 2) {
      // Spare
      const score = BOWLING_CONFIG.sparePoints
      set((s) => ({
        phase: 'frameover',
        isStrike: false,
        isSpare: true,
        frameScores: [...s.frameScores, score],
      }))
    } else if (ballsThisFrame >= 2 && hasExtraBall) {
      // Extra ball powerup: get one more try
      set({ phase: 'positioning', hasExtraBall: false })
    } else if (ballsThisFrame >= 2) {
      // Open frame
      const score = knockedCount * BOWLING_CONFIG.pinPoint
      set((s) => ({
        phase: 'frameover',
        isStrike: false,
        isSpare: false,
        frameScores: [...s.frameScores, score],
      }))
    } else {
      // First ball, not a strike - second ball
      set({ phase: 'positioning' })
    }
  },

  grantExtraBall: () => set({ hasExtraBall: true }),

  nextFrame: () => {
    const { currentFrame, effectiveTotalFrames } = get()
    if (currentFrame >= effectiveTotalFrames) {
      set({ phase: 'done' })
    } else {
      set({
        currentFrame: currentFrame + 1,
        phase: 'positioning',
        ballsThisFrame: 0,
        pinsKnocked: Array(10).fill(false),
        totalPinsThisFrame: 0,
        bowlerX: 0,
        power: 0,
        spinAngle: 0,
        isStrike: false,
        isSpare: false,
        hasExtraBall: false,
      })
    }
  },

  resetGame: (totalFrames?: number) => set({
    phase: 'positioning',
    currentFrame: 1,
    effectiveTotalFrames: totalFrames ?? BOWLING_CONFIG.totalFrames,
    ballsThisFrame: 0,
    frameScores: [],
    pinsKnocked: Array(10).fill(false),
    totalPinsThisFrame: 0,
    bowlerX: 0,
    power: 0,
    spinAngle: 0,
    isStrike: false,
    isSpare: false,
    hasExtraBall: false,
  }),
}))
