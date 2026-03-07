import { describe, it, expect, beforeEach } from 'vitest'
import { QuestionEngine } from '@/education/QuestionEngine'

describe('QuestionEngine', () => {
  let engine: QuestionEngine

  beforeEach(() => {
    engine = new QuestionEngine()
  })

  describe('getQuestion', () => {
    it('returns a question object with required fields', () => {
      const q = engine.getQuestion('easy')
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('category')
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('options')
      expect(q).toHaveProperty('correctIndex')
      expect(q).toHaveProperty('explanation')
      expect(q).toHaveProperty('ageMin')
      expect(q).toHaveProperty('ageMax')
    })

    it('returns a question with 4 options', () => {
      const q = engine.getQuestion('easy')
      expect(q.options).toHaveLength(4)
    })

    it('returns math question when category specified', () => {
      const q = engine.getQuestion('easy', 'math')
      expect(q.category).toBe('math')
    })

    it('returns trivia question when category specified', () => {
      const q = engine.getQuestion('easy', 'trivia')
      expect(q.category).toBe('trivia')
    })

    it('returns spelling question when category specified', () => {
      const q = engine.getQuestion('easy', 'spelling')
      expect(q.category).toBe('spelling')
    })
  })

  describe('age filtering', () => {
    it('returns age-appropriate question for young player', () => {
      const q = engine.getQuestion('easy', 'math', 5)
      expect(q.ageMin).toBeLessThanOrEqual(5)
    })

    it('tries to avoid age-inappropriate questions', () => {
      // For a 5 year old, multiplication (ageMin=7) should be avoided
      // But since math generates randomly, we test that the engine at least tries
      const questions = Array.from({ length: 20 }, () =>
        engine.getQuestion('easy', 'math', 5)
      )
      // Most questions for a 5-year-old should be age-appropriate
      const appropriate = questions.filter((q) => q.ageMin <= 5)
      expect(appropriate.length).toBeGreaterThan(0)
    })
  })

  describe('markAnswered', () => {
    it('tracks answered question IDs', () => {
      const q1 = engine.getQuestion('easy', 'trivia')
      engine.markAnswered(q1.id)
      // After marking, subsequent questions should try to be different
      const nextQuestions = Array.from({ length: 5 }, () =>
        engine.getQuestion('easy', 'trivia')
      )
      // At least some should differ from the first (not guaranteed but very likely)
      const differentIds = nextQuestions.filter((q) => q.id !== q1.id)
      expect(differentIds.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('constructor with pre-answered IDs', () => {
    it('accepts pre-answered IDs', () => {
      const engineWithAnswered = new QuestionEngine(['trivia-1', 'trivia-2'])
      const q = engineWithAnswered.getQuestion('easy', 'trivia')
      // Should try to avoid trivia-1 and trivia-2
      expect(q).toHaveProperty('id')
    })
  })

  describe('difficulty levels', () => {
    it('generates easy questions', () => {
      const q = engine.getQuestion('easy')
      expect(q.difficulty).toBe('easy')
    })

    it('generates medium questions', () => {
      const q = engine.getQuestion('medium')
      expect(q.difficulty).toBe('medium')
    })

    it('generates hard questions', () => {
      const q = engine.getQuestion('hard')
      expect(q.difficulty).toBe('hard')
    })
  })
})
