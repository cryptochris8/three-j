export type Scene = 'menu' | 'hub' | 'basketball' | 'soccer' | 'bowling' | 'minigolf'

export type GamePhase = 'menu' | 'playing' | 'paused' | 'quiz' | 'gameover'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type QuestionCategory = 'math' | 'spelling' | 'trivia'

export interface PlayerProfile {
  id: number
  name: string
  age: number
  avatar: string
  coins: number
  totalXP: number
  createdAt: number
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
}

export interface StarRating {
  one: number
  two: number
  three: number
}
