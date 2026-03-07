import { create } from 'zustand'
import type { Scene, GamePhase } from '@/types'

interface GameState {
  currentScene: Scene
  gamePhase: GamePhase
  isLoading: boolean
  lastQuizResult: boolean | null
  setScene: (scene: Scene) => void
  setGamePhase: (phase: GamePhase) => void
  setLoading: (loading: boolean) => void
  setLastQuizResult: (correct: boolean | null) => void
  returnToHub: () => void
  returnToMenu: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentScene: 'menu',
  gamePhase: 'menu',
  isLoading: false,
  lastQuizResult: null,

  setScene: (scene) => set({ currentScene: scene, gamePhase: scene === 'menu' ? 'menu' : 'playing' }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLastQuizResult: (correct) => set({ lastQuizResult: correct }),
  returnToHub: () => set({ currentScene: 'hub', gamePhase: 'menu' }),
  returnToMenu: () => set({ currentScene: 'menu', gamePhase: 'menu' }),
}))
