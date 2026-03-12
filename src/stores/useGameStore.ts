import { create } from 'zustand'
import type { Scene, GamePhase, Difficulty, PlayMode, GradeLevel } from '@/types'
import type { GameMode } from '@/systems/gameModes'

interface GameState {
  currentScene: Scene
  gamePhase: GamePhase
  isLoading: boolean
  lastQuizResult: boolean | null
  selectedDifficulty: Difficulty
  gameMode: GameMode
  playMode: PlayMode
  selectedGrade: GradeLevel | null
  setScene: (scene: Scene) => void
  setGamePhase: (phase: GamePhase) => void
  setLoading: (loading: boolean) => void
  setLastQuizResult: (correct: boolean | null) => void
  setSelectedDifficulty: (d: Difficulty) => void
  setGameMode: (mode: GameMode) => void
  setPlayMode: (mode: PlayMode) => void
  setSelectedGrade: (grade: GradeLevel | null) => void
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
  playMode: 'education',
  selectedGrade: null,

  setScene: (scene) => set({ currentScene: scene, gamePhase: scene === 'menu' ? 'menu' : 'playing' }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLastQuizResult: (correct) => set({ lastQuizResult: correct }),
  setSelectedDifficulty: (d) => set({ selectedDifficulty: d }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setPlayMode: (mode) => set({ playMode: mode }),
  setSelectedGrade: (grade) => set({ selectedGrade: grade }),
  returnToHub: () => set({ currentScene: 'hub', gamePhase: 'playing' }),
  returnToMenu: () => set({ currentScene: 'menu', gamePhase: 'menu' }),
}))
