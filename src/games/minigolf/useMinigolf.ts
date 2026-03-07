import { create } from 'zustand'
import { COURSES, MINIGOLF_CONFIG } from './config'

type GolfPhase = 'aiming' | 'rolling' | 'holed' | 'nexthole' | 'done'

interface MinigolfState {
  phase: GolfPhase
  currentHole: number
  strokes: number
  strokesPerHole: number[]
  totalStrokes: number
  dragStartX: number
  dragStartY: number
  dragEndX: number
  dragEndY: number
  isDragging: boolean

  startDrag: (x: number, y: number) => void
  updateDrag: (x: number, y: number) => void
  releasePutt: () => { dirX: number; dirZ: number; power: number }
  ballStopped: () => void
  ballHoled: () => void
  nextHole: () => void
  getCurrentHoleConfig: () => typeof COURSES[0]
  resetGame: () => void
}

export const useMinigolf = create<MinigolfState>((set, get) => ({
  phase: 'aiming',
  currentHole: 0,
  strokes: 0,
  strokesPerHole: [],
  totalStrokes: 0,
  dragStartX: 0,
  dragStartY: 0,
  dragEndX: 0,
  dragEndY: 0,
  isDragging: false,

  startDrag: (x, y) => set({ isDragging: true, dragStartX: x, dragStartY: y, dragEndX: x, dragEndY: y }),

  updateDrag: (x, y) => set({ dragEndX: x, dragEndY: y }),

  releasePutt: () => {
    const { dragStartX, dragStartY, dragEndX, dragEndY, strokes } = get()
    const dx = dragStartX - dragEndX
    const dy = dragStartY - dragEndY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const power = Math.min(distance * 0.05, MINIGOLF_CONFIG.maxPuttPower)

    if (power < MINIGOLF_CONFIG.minPuttPower) {
      set({ isDragging: false })
      return { dirX: 0, dirZ: 0, power: 0 }
    }

    const dirX = dx / (distance || 1)
    const dirZ = dy / (distance || 1)

    set({
      phase: 'rolling',
      isDragging: false,
      strokes: strokes + 1,
    })

    return { dirX, dirZ, power }
  },

  ballStopped: () => {
    const { phase, strokes } = get()
    if (phase === 'rolling') {
      if (strokes >= MINIGOLF_CONFIG.maxStrokes) {
        // Max strokes reached, move on
        set((s) => ({
          phase: 'holed',
          strokesPerHole: [...s.strokesPerHole, MINIGOLF_CONFIG.maxStrokes],
          totalStrokes: s.totalStrokes + MINIGOLF_CONFIG.maxStrokes,
        }))
      } else {
        set({ phase: 'aiming' })
      }
    }
  },

  ballHoled: () => {
    const { strokes } = get()
    set((s) => ({
      phase: 'holed',
      strokesPerHole: [...s.strokesPerHole, strokes],
      totalStrokes: s.totalStrokes + strokes,
    }))
  },

  nextHole: () => {
    const { currentHole } = get()
    if (currentHole >= COURSES.length - 1) {
      set({ phase: 'done' })
    } else {
      set({
        currentHole: currentHole + 1,
        phase: 'aiming',
        strokes: 0,
        isDragging: false,
      })
    }
  },

  getCurrentHoleConfig: () => COURSES[get().currentHole],

  resetGame: () => set({
    phase: 'aiming',
    currentHole: 0,
    strokes: 0,
    strokesPerHole: [],
    totalStrokes: 0,
    dragStartX: 0,
    dragStartY: 0,
    dragEndX: 0,
    dragEndY: 0,
    isDragging: false,
  }),
}))
