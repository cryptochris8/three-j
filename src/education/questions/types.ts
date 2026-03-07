import type { Question, Difficulty, QuestionCategory } from '@/types'

export type QuestionGenerator = (difficulty: Difficulty) => Question

export interface QuestionBank {
  category: QuestionCategory
  questions: Question[]
  generators?: QuestionGenerator[]
}
