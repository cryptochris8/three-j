export type Scene = 'menu' | 'hub' | 'basketball' | 'soccer' | 'bowling' | 'minigolf' | 'archery' | 'football' | 'soccer-match'

export type GamePhase = 'menu' | 'playing' | 'paused' | 'quiz' | 'gameover'

export type PlayMode = 'openWorld' | 'education'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type QuestionCategory = 'math' | 'spelling' | 'trivia' | 'equivalent-fractions' | 'reading' | 'science' | 'social-studies'

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface PlayerProfile {
  id: number
  name: string
  age: number
  avatar: string
  skinId: number
  coins: number
  totalXP: number
  createdAt: number
}

export interface FractionBar {
  label: string
  totalParts: number
  shadedParts: number
  color: string
}

export interface FractionDiagram {
  type: 'fraction-bars'
  bars: FractionBar[]
}

export interface Question {
  id: string
  category: QuestionCategory
  difficulty: Difficulty
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  ageMin: number
  ageMax: number
  passage?: string
  diagram?: FractionDiagram
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: number
}

export interface GameResult {
  game: Scene
  score: number
  stars: number
  date: number
  difficulty?: Difficulty
}

export interface StarRating {
  one: number
  two: number
  three: number
}
