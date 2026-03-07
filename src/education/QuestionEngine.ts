import type { Question, Difficulty, QuestionCategory } from '@/types'
import { generateMathQuestion } from './questions/math'
import { generateSpellingQuestion } from './questions/spelling'
import { getTriviaQuestion } from './questions/trivia'

export class QuestionEngine {
  private answeredIds: Set<string>

  constructor(answeredIds: string[] = []) {
    this.answeredIds = new Set(answeredIds)
  }

  getQuestion(
    difficulty: Difficulty,
    category?: QuestionCategory,
    playerAge: number = 8
  ): Question {
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
        default:
          question = generateMathQuestion(difficulty)
      }
      attempts++
    } while (
      this.answeredIds.has(question.id) &&
      attempts < 10 &&
      question.ageMin <= playerAge
    )

    return question
  }

  markAnswered(id: string) {
    this.answeredIds.add(id)
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
  }
  return engineInstance
}
