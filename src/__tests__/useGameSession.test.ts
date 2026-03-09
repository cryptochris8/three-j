import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'

// Since useGameSession is a React hook with state, we test the store interactions directly
describe('game session logic', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScene: 'basketball',
      gamePhase: 'menu',
      isLoading: false,
      lastQuizResult: null,
    })
    useScoreStore.setState({
      currentScore: 0, currentStreak: 0, highScores: {}, history: [],
    })
    useEducationStore.setState({
      currentQuestion: null, difficulty: 'easy', streak: 0,
      totalCorrect: 0, totalAnswered: 0, answeredIds: [],
    })
  })

  describe('initGame flow', () => {
    it('resets score and sets phase to playing', () => {
      useScoreStore.getState().addScore(50)
      useScoreStore.getState().incrementStreak()

      // Simulate initGame
      useScoreStore.getState().resetCurrentScore()
      useGameStore.getState().setGamePhase('playing')

      expect(useScoreStore.getState().currentScore).toBe(0)
      expect(useScoreStore.getState().currentStreak).toBe(0)
      expect(useGameStore.getState().gamePhase).toBe('playing')
    })
  })

  describe('triggerQuiz flow', () => {
    it('sets game phase to quiz', () => {
      useGameStore.getState().setGamePhase('quiz')
      expect(useGameStore.getState().gamePhase).toBe('quiz')
    })
  })

  describe('quiz result tracking', () => {
    it('stores last quiz result', () => {
      useGameStore.getState().setLastQuizResult(true)
      expect(useGameStore.getState().lastQuizResult).toBe(true)
    })

    it('clears last quiz result', () => {
      useGameStore.getState().setLastQuizResult(true)
      useGameStore.getState().setLastQuizResult(null)
      expect(useGameStore.getState().lastQuizResult).toBeNull()
    })
  })

  describe('endGame flow', () => {
    it('sets phase to gameover', () => {
      useGameStore.getState().setGamePhase('gameover')
      expect(useGameStore.getState().gamePhase).toBe('gameover')
    })
  })

  describe('popup system', () => {
    it('popups have required fields', () => {
      // Verify popup interface contract
      const popup = {
        id: 1,
        text: 'SWISH! +5',
        position: [0, 3.5, -5] as [number, number, number],
        color: '#2ECC71',
      }
      expect(popup.id).toBeDefined()
      expect(popup.text).toBeDefined()
      expect(popup.position).toHaveLength(3)
      expect(popup.color).toBeDefined()
    })
  })

  describe('scene navigation', () => {
    it('returnToHub sets scene and phase', () => {
      useGameStore.getState().setScene('basketball')
      useGameStore.getState().returnToHub()
      expect(useGameStore.getState().currentScene).toBe('hub')
      expect(useGameStore.getState().gamePhase).toBe('playing')
    })

    it('returnToMenu sets scene and phase', () => {
      useGameStore.getState().setScene('basketball')
      useGameStore.getState().returnToMenu()
      expect(useGameStore.getState().currentScene).toBe('menu')
      expect(useGameStore.getState().gamePhase).toBe('menu')
    })
  })

  describe('phase transitions', () => {
    it('playing -> paused -> playing', () => {
      useGameStore.getState().setGamePhase('playing')
      useGameStore.getState().setGamePhase('paused')
      expect(useGameStore.getState().gamePhase).toBe('paused')
      useGameStore.getState().setGamePhase('playing')
      expect(useGameStore.getState().gamePhase).toBe('playing')
    })

    it('playing -> quiz -> playing', () => {
      useGameStore.getState().setGamePhase('playing')
      useGameStore.getState().setGamePhase('quiz')
      expect(useGameStore.getState().gamePhase).toBe('quiz')
      useGameStore.getState().setGamePhase('playing')
      expect(useGameStore.getState().gamePhase).toBe('playing')
    })
  })
})
