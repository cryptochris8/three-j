import { create } from 'zustand'
import type { Scene, GamePhase, Difficulty } from '@/types'
import type { GameMode } from '@/systems/gameModes'

interface GameState {
  currentScene: Scene
  gamePhase: GamePhase
  isLoading: boolean
  lastQuizResult: boolean | null
  selectedDifficulty: Difficulty
  gameMode: GameMode
  setScene: (scene: Scene) => void
  setGamePhase: (phase: GamePhase) => void
  setLoading: (loading: boolean) => void
  setLastQuizResult: (correct: boolean | null) => void
  setSelectedDifficulty: (d: Difficulty) => void
  setGameMode: (mode: GameMode) => void
  returnToHub: () => void
  returnToMenu: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentScene: 'menu',
  gamePhase: 'menu',
  isLoading: false,
  lastQuizResult: null,
  selectedDifficulty: 'medium',
  gameMode: 'classic',

  setScene: (scene) => set({ currentScene: scene, gamePhase: scene === 'menu' ? 'menu' : 'playing' }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLastQuizResult: (correct) => set({ lastQuizResult: correct }),
  setSelectedDifficulty: (d) => set({ selectedDifficulty: d }),
  setGameMode: (mode) => set({ gameMode: mode }),
  returnToHub: () => set({ currentScene: 'hub', gamePhase: 'menu' }),
  returnToMenu: () => set({ currentScene: 'menu', gamePhase: 'menu' }),
}))
