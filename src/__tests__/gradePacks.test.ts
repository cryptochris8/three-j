import { describe, it, expect, beforeEach } from 'vitest'
import { QuestionEngine, resetQuestionEngine } from '@/education/QuestionEngine'
import { getGradeQuestions, getAllGradeQuestions } from '@/education/packs'
import { grade1Questions } from '@/education/packs/grade1'
import { grade2ComprehensiveQuestions } from '@/education/packs/grade2-comprehensive'
import { grade3Questions } from '@/education/questions/grade3'
import { grade4Questions } from '@/education/packs/grade4'
import { grade5Questions } from '@/education/packs/grade5'
import { grade6Questions } from '@/education/packs/grade6'
import type { GradeLevel, Question } from '@/types'

function validatePack(questions: Question[], grade: number, minCount: number) {
  describe(`Grade ${grade} pack`, () => {
    it(`has at least ${minCount} questions`, () => {
      expect(questions.length).toBeGreaterThanOrEqual(minCount)
    })

    it('all questions have unique IDs', () => {
      const ids = questions.map((q) => q.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all questions have valid correctIndex', () => {
      for (const q of questions) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      }
    })

    it('all questions have exactly 4 options', () => {
      for (const q of questions) {
        expect(q.options).toHaveLength(4)
      }
    })

    it('all questions have required fields', () => {
      for (const q of questions) {
        expect(q.id).toBeTruthy()
        expect(q.category).toBeTruthy()
        expect(q.difficulty).toBeTruthy()
        expect(q.question).toBeTruthy()
        expect(q.explanation).toBeTruthy()
        expect(typeof q.ageMin).toBe('number')
        expect(typeof q.ageMax).toBe('number')
      }
    })

    it('has math questions', () => {
      const math = questions.filter((q) => q.category === 'math')
      expect(math.length).toBeGreaterThan(0)
    })

    it('has reading questions with passages', () => {
      const reading = questions.filter((q) => q.category === 'reading')
      expect(reading.length).toBeGreaterThan(0)
      for (const q of reading) {
        expect(q.passage).toBeTruthy()
      }
    })

    it('has spelling questions', () => {
      const spelling = questions.filter((q) => q.category === 'spelling')
      expect(spelling.length).toBeGreaterThan(0)
    })

    it('has a mix of difficulties', () => {
      const difficulties = new Set(questions.map((q) => q.difficulty))
      expect(difficulties.size).toBeGreaterThanOrEqual(2)
    })
  })
}

// Validate all 6 grade packs
validatePack(grade1Questions, 1, 50)
validatePack(grade2ComprehensiveQuestions, 2, 50)
validatePack(grade3Questions, 3, 50)
validatePack(grade4Questions, 4, 50)
validatePack(grade5Questions, 5, 50)
validatePack(grade6Questions, 6, 50)

describe('getGradeQuestions', () => {
  it('returns correct pack for each grade', () => {
    expect(getGradeQuestions(1)).toBe(grade1Questions)
    expect(getGradeQuestions(2)).toBe(grade2ComprehensiveQuestions)
    expect(getGradeQuestions(3)).toBe(grade3Questions)
    expect(getGradeQuestions(4)).toBe(grade4Questions)
    expect(getGradeQuestions(5)).toBe(grade5Questions)
    expect(getGradeQuestions(6)).toBe(grade6Questions)
  })
})

describe('getAllGradeQuestions', () => {
  it('returns questions from all grades combined', () => {
    const all = getAllGradeQuestions()
    const totalExpected =
      grade1Questions.length +
      grade2ComprehensiveQuestions.length +
      grade3Questions.length +
      grade4Questions.length +
      grade5Questions.length +
      grade6Questions.length
    expect(all.length).toBe(totalExpected)
  })
})

describe('QuestionEngine grade-level mode', () => {
  beforeEach(() => {
    resetQuestionEngine()
  })

  it('returns grade-specific questions when grade is set', () => {
    const engine = new QuestionEngine()
    engine.setGradeLevel(3)
    const q = engine.getQuestion('easy', undefined, 8)
    const grade3Ids = grade3Questions.map((q) => q.id)
    expect(grade3Ids).toContain(q.id)
  })

  it('returns questions from any category within the grade', () => {
    const engine = new QuestionEngine()
    engine.setGradeLevel(1)
    const categories = new Set<string>()
    for (let i = 0; i < 50; i++) {
      const q = engine.getQuestion('easy', undefined, 6)
      categories.add(q.category)
    }
    expect(categories.size).toBeGreaterThan(1)
  })

  it('filters by category when specified', () => {
    const engine = new QuestionEngine()
    engine.setGradeLevel(3)
    const q = engine.getQuestion('easy', 'math', 8)
    expect(q.category).toBe('math')
  })

  it('returns null grade level by default', () => {
    const engine = new QuestionEngine()
    expect(engine.getGradeLevel()).toBeNull()
  })

  it('can clear grade level', () => {
    const engine = new QuestionEngine()
    engine.setGradeLevel(5)
    expect(engine.getGradeLevel()).toBe(5)
    engine.setGradeLevel(null)
    expect(engine.getGradeLevel()).toBeNull()
  })

  it('prefers unanswered questions', () => {
    const engine = new QuestionEngine()
    engine.setGradeLevel(1)
    // Answer a question, then check the next one is different
    const first = engine.getQuestion('easy', undefined, 6)
    engine.markAnswered(first.id)
    const second = engine.getQuestion('easy', undefined, 6)
    // With 50+ questions, second should be different from first
    expect(second.id).not.toBe(first.id)
  })
})
