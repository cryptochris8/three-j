import { describe, it, expect, beforeEach } from 'vitest'
import { useEducationStore } from '@/stores/useEducationStore'

describe('useEducationStore', () => {
  beforeEach(() => {
    useEducationStore.setState({
      currentQuestion: null,
      difficulty: 'easy',
      streak: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      answeredIds: [],
    })
  })

  describe('answerCorrect', () => {
    it('increments streak and correct count', () => {
      useEducationStore.getState().answerCorrect('q1')
      const s = useEducationStore.getState()
      expect(s.streak).toBe(1)
      expect(s.totalCorrect).toBe(1)
      expect(s.totalAnswered).toBe(1)
    })

    it('adds question ID to answered list', () => {
      useEducationStore.getState().answerCorrect('q1')
      expect(useEducationStore.getState().answeredIds).toContain('q1')
    })

    it('increases difficulty after 3 correct in a row', () => {
      useEducationStore.getState().answerCorrect('q1')
      useEducationStore.getState().answerCorrect('q2')
      useEducationStore.getState().answerCorrect('q3')
      expect(useEducationStore.getState().difficulty).toBe('medium')
    })

    it('increases from medium to hard after another 3 correct', () => {
      useEducationStore.setState({ difficulty: 'medium', streak: 2 })
      useEducationStore.getState().answerCorrect('q1')
      expect(useEducationStore.getState().difficulty).toBe('hard')
    })
  })

  describe('answerWrong', () => {
    it('sets negative streak', () => {
      useEducationStore.getState().answerWrong('q1')
      expect(useEducationStore.getState().streak).toBe(-1)
    })

    it('decreases difficulty after 2 wrong in a row', () => {
      useEducationStore.setState({ difficulty: 'hard', streak: -1 })
      useEducationStore.getState().answerWrong('q1')
      expect(useEducationStore.getState().difficulty).toBe('medium')
    })

    it('preserves current question for result display', () => {
      const q = { id: 'test' } as any
      useEducationStore.setState({ currentQuestion: q })
      useEducationStore.getState().answerWrong('q1')
      // currentQuestion stays mounted so QuizModal can show feedback for 3 seconds
      expect(useEducationStore.getState().currentQuestion).toEqual(q)
    })
  })

  describe('getAccuracy', () => {
    it('returns 0 when no questions answered', () => {
      expect(useEducationStore.getState().getAccuracy()).toBe(0)
    })

    it('returns correct accuracy', () => {
      useEducationStore.setState({ totalCorrect: 3, totalAnswered: 4 })
      expect(useEducationStore.getState().getAccuracy()).toBe(0.75)
    })
  })

  describe('resetSession', () => {
    it('resets streak and current question', () => {
      useEducationStore.setState({ streak: 5, currentQuestion: { id: 'test' } as any })
      useEducationStore.getState().resetSession()
      expect(useEducationStore.getState().streak).toBe(0)
      expect(useEducationStore.getState().currentQuestion).toBeNull()
    })
  })
})
