import type { Question, Difficulty, QuestionCategory, GradeLevel } from '@/types'
import { generateMathQuestion } from './questions/math'
import { generateSpellingQuestion } from './questions/spelling'
import { getTriviaQuestion } from './questions/trivia'
import { equivalentFractionsQuestions } from './packs/equivalent-fractions'
import { readingBasketballQuestions } from './packs/reading-basketball'
import { getGradeQuestions } from './packs'

export class QuestionEngine {
  private answeredIds: Set<string>
  private gradeLevel: GradeLevel | null = null

  constructor(answeredIds: string[] = []) {
    this.answeredIds = new Set(answeredIds)
  }

  setGradeLevel(grade: GradeLevel | null) {
    this.gradeLevel = grade
  }

  getGradeLevel(): GradeLevel | null {
    return this.gradeLevel
  }

  getQuestion(
    difficulty: Difficulty,
    category?: QuestionCategory,
    playerAge: number = 8
  ): Question {
    // When a grade level is active, pull from that grade's question pool
    if (this.gradeLevel !== null) {
      return this.getGradeLevelQuestion(difficulty, category, playerAge)
    }

    const cat = category ?? this.randomCategory()

    let question: Question
    let attempts = 0

    do {
      switch (cat) {
        case 'math':
          question = generateMathQuestion(difficulty)
          break
        case 'spelling':
          question = generateSpellingQuestion(difficulty)
          break
        case 'trivia':
          question = getTriviaQuestion(difficulty)
          break
        case 'equivalent-fractions':
          question = this.pickFromPool(equivalentFractionsQuestions, difficulty)
          break
        case 'reading':
          question = this.pickFromPool(readingBasketballQuestions, difficulty)
          break
        default:
          question = generateMathQuestion(difficulty)
      }
      attempts++
    } while (
      (this.answeredIds.has(question.id) || question.ageMin > playerAge) &&
      attempts < 10
    )

    // If we exhausted retries for static pools, fall back to a generated category
    const staticPools: QuestionCategory[] = ['trivia', 'equivalent-fractions', 'reading']
    if (this.answeredIds.has(question.id) && staticPools.includes(cat)) {
      const fallback = Math.random() > 0.5 ? 'math' : 'spelling'
      question = fallback === 'math'
        ? generateMathQuestion(difficulty)
        : generateSpellingQuestion(difficulty)
    }

    return question
  }

  markAnswered(id: string) {
    this.answeredIds.add(id)
  }

  private getGradeLevelQuestion(
    difficulty: Difficulty,
    category?: QuestionCategory,
    playerAge: number = 8
  ): Question {
    const pool = getGradeQuestions(this.gradeLevel!)

    // Filter by category if specified, otherwise use all
    let candidates = category
      ? pool.filter((q) => q.category === category)
      : pool

    // If no questions match the category, use the full pool
    if (candidates.length === 0) candidates = pool

    // Prefer unanswered questions
    const unanswered = candidates.filter((q) => !this.answeredIds.has(q.id))
    if (unanswered.length > 0) candidates = unanswered

    // Prefer matching difficulty
    const byDifficulty = candidates.filter((q) => q.difficulty === difficulty)
    if (byDifficulty.length > 0) candidates = byDifficulty

    // Pick a random question from the remaining candidates
    const question = candidates[Math.floor(Math.random() * candidates.length)]

    // If all grade questions are exhausted, fall back to generated
    if (!question) {
      return Math.random() > 0.5
        ? generateMathQuestion(difficulty)
        : generateSpellingQuestion(difficulty)
    }

    return question
  }

  private pickFromPool(pool: Question[], difficulty: Difficulty): Question {
    // Prefer questions matching the requested difficulty
    const matching = pool.filter((q) => q.difficulty === difficulty)
    const candidates = matching.length > 0 ? matching : pool
    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  private randomCategory(): QuestionCategory {
    const categories: QuestionCategory[] = ['math', 'spelling', 'trivia']
    return categories[Math.floor(Math.random() * categories.length)]
  }
}

// Singleton instance
let engineInstance: QuestionEngine | null = null

export function getQuestionEngine(answeredIds: string[] = []): QuestionEngine {
  if (!engineInstance) {
    engineInstance = new QuestionEngine(answeredIds)
  } else {
    for (const id of answeredIds) {
      engineInstance.markAnswered(id)
    }
  }
  return engineInstance
}

export function resetQuestionEngine(): void {
  engineInstance = null
}
