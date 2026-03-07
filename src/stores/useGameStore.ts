import { create } from 'zustand'
import type { Scene, GamePhase } from '@/types'

interface GameState {
  currentScene: Scene
  gamePhase: GamePhase
  isLoading: boolean
  setScene: (scene: Scene) => void
  setGamePhase: (phase: GamePhase) => void
  setLoading: (loading: boolean) => void
  returnToHub: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentScene: 'menu',
  gamePhase: 'menu',
  isLoading: false,

  setScene: (scene) => set({ currentScene: scene, gamePhase: scene === 'menu' ? 'menu' : 'playing' }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setLoading: (loading) => set({ isLoading: loading }),
  returnToHub: () => set({ currentScene: 'hub', gamePhase: 'menu' }),
}))
