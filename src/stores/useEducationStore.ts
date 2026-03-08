import { create } from 'zustand'
import type { Difficulty, Question } from '@/types'

interface EducationState {
  currentQuestion: Question | null
  difficulty: Difficulty
  streak: number
  totalCorrect: number
  totalAnswered: number
  answeredIds: string[]
  setCurrentQuestion: (q: Question | null) => void
  answerCorrect: (questionId: string) => void
  answerWrong: (questionId: string) => void
  getAccuracy: () => number
  resetSession: () => void
}

export const useEducationStore = create<EducationState>((set, get) => ({
  currentQuestion: null,
  difficulty: 'easy',
  streak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  answeredIds: [],

  setCurrentQuestion: (q) => set({ currentQuestion: q }),

  answerCorrect: (questionId) =>
    set((s) => {
      const newStreak = s.streak + 1
      const newCorrect = s.totalCorrect + 1
      const newTotal = s.totalAnswered + 1
      let newDifficulty = s.difficulty
      if (newStreak >= 3) {
        if (s.difficulty === 'easy') newDifficulty = 'medium'
        else if (s.difficulty === 'medium') newDifficulty = 'hard'
      }
      return {
        streak: newStreak,
        totalCorrect: newCorrect,
        totalAnswered: newTotal,
        difficulty: newDifficulty,
        answeredIds: [...s.answeredIds, questionId],
        currentQuestion: null,
      }
    }),

  answerWrong: (questionId) =>
    set((s) => {
      const newTotal = s.totalAnswered + 1
      const wrongsInRow = s.streak < 0 ? s.streak - 1 : -1
      let newDifficulty = s.difficulty
      if (wrongsInRow <= -2) {
        if (s.difficulty === 'hard') newDifficulty = 'medium'
        else if (s.difficulty === 'medium') newDifficulty = 'easy'
      }
      return {
        streak: wrongsInRow,
        totalAnswered: newTotal,
        difficulty: newDifficulty,
        answeredIds: [...s.answeredIds, questionId],
        currentQuestion: null,
      }
    }),

  getAccuracy: () => {
    const { totalCorrect, totalAnswered } = get()
    return totalAnswered === 0 ? 0 : totalCorrect / totalAnswered
  },

  resetSession: () =>
    set({
      currentQuestion: null,
      streak: 0,
    }),
}))
