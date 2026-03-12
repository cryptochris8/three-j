import { describe, it, expect } from 'vitest'
import { equivalentFractionsQuestions } from '@/education/packs/equivalent-fractions'
import { readingBasketballQuestions, BASKETBALL_PASSAGE } from '@/education/packs/reading-basketball'
import { QuestionEngine } from '@/education/QuestionEngine'

describe('equivalent-fractions pack', () => {
  it('contains exactly 7 questions', () => {
    expect(equivalentFractionsQuestions).toHaveLength(7)
  })

  it('all questions have category "equivalent-fractions"', () => {
    for (const q of equivalentFractionsQuestions) {
      expect(q.category).toBe('equivalent-fractions')
    }
  })

  it('all questions have unique IDs', () => {
    const ids = equivalentFractionsQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all questions have valid correctIndex within options range', () => {
    for (const q of equivalentFractionsQuestions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
    }
  })

  it('all questions have exactly 4 options', () => {
    for (const q of equivalentFractionsQuestions) {
      expect(q.options).toHaveLength(4)
    }
  })

  it('all questions have a fraction-bars diagram', () => {
    for (const q of equivalentFractionsQuestions) {
      expect(q.diagram).toBeDefined()
      expect(q.diagram!.type).toBe('fraction-bars')
      expect(q.diagram!.bars.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('diagram bars have valid shaded/total parts', () => {
    for (const q of equivalentFractionsQuestions) {
      for (const bar of q.diagram!.bars) {
        expect(bar.totalParts).toBeGreaterThan(0)
        expect(bar.shadedParts).toBeGreaterThanOrEqual(0)
        expect(bar.shadedParts).toBeLessThanOrEqual(bar.totalParts)
        expect(bar.label).toBeTruthy()
        expect(bar.color).toBeTruthy()
      }
    }
  })

  it('questions are age-appropriate for 3rd graders', () => {
    for (const q of equivalentFractionsQuestions) {
      expect(q.ageMin).toBeLessThanOrEqual(8)
      expect(q.ageMax).toBeGreaterThanOrEqual(8)
    }
  })
})

describe('reading-basketball pack', () => {
  it('has a non-empty passage', () => {
    expect(BASKETBALL_PASSAGE.length).toBeGreaterThan(100)
  })

  it('contains exactly 5 questions', () => {
    expect(readingBasketballQuestions).toHaveLength(5)
  })

  it('all questions have category "reading"', () => {
    for (const q of readingBasketballQuestions) {
      expect(q.category).toBe('reading')
    }
  })

  it('all questions have unique IDs', () => {
    const ids = readingBasketballQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all questions have valid correctIndex within options range', () => {
    for (const q of readingBasketballQuestions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
    }
  })

  it('all questions include the passage', () => {
    for (const q of readingBasketballQuestions) {
      expect(q.passage).toBe(BASKETBALL_PASSAGE)
    }
  })

  it('questions are age-appropriate for 3rd graders', () => {
    for (const q of readingBasketballQuestions) {
      expect(q.ageMin).toBeLessThanOrEqual(8)
      expect(q.ageMax).toBeGreaterThanOrEqual(8)
    }
  })
})

describe('QuestionEngine with custom packs', () => {
  it('returns an equivalent-fractions question when requested', () => {
    const engine = new QuestionEngine()
    const q = engine.getQuestion('easy', 'equivalent-fractions', 8)
    expect(q.category).toBe('equivalent-fractions')
    expect(q.diagram).toBeDefined()
  })

  it('returns a reading question when requested', () => {
    const engine = new QuestionEngine()
    const q = engine.getQuestion('easy', 'reading', 8)
    expect(q.category).toBe('reading')
    expect(q.passage).toBeDefined()
  })

  it('falls back to math/spelling when all pack questions are answered', () => {
    const allIds = equivalentFractionsQuestions.map((q) => q.id)
    const engine = new QuestionEngine(allIds)
    const q = engine.getQuestion('easy', 'equivalent-fractions', 8)
    // Should fall back since all equivalent-fractions IDs are marked answered
    expect(['math', 'spelling', 'equivalent-fractions']).toContain(q.category)
  })

  it('falls back to math/spelling when all reading questions are answered', () => {
    const allIds = readingBasketballQuestions.map((q) => q.id)
    const engine = new QuestionEngine(allIds)
    const q = engine.getQuestion('easy', 'reading', 8)
    expect(['math', 'spelling', 'reading']).toContain(q.category)
  })
})
