import { useState, useCallback, useRef, useEffect } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { getQuestionEngine } from '@/education/QuestionEngine'
import { audioManager } from '@/core/AudioManager'
import type { QuestionCategory } from '@/types'

interface Popup {
  id: number
  text: string
  position: [number, number, number]
  color: string
}

export function useGameSession() {
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const gamePhase = useGameStore((s) => s.gamePhase)
  const lastQuizResult = useGameStore((s) => s.lastQuizResult)
  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const difficulty = useEducationStore((s) => s.difficulty)
  const answeredIds = useEducationStore((s) => s.answeredIds)
  const activeProfile = usePlayerStore((s) => s.getActiveProfile())

  const [popups, setPopups] = useState<Popup[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const popupId = useRef(0)

  // Show a 3D popup when returning from a quiz
  useEffect(() => {
    if (gamePhase === 'playing' && lastQuizResult !== null) {
      const id = ++popupId.current
      setPopups((prev) => [...prev, {
        id,
        text: lastQuizResult ? 'Correct!' : 'Incorrect',
        position: [0, 3, 0],
        color: lastQuizResult ? '#2ECC71' : '#E74C3C',
      }])

      // Play voice feedback for quiz result
      if (lastQuizResult) {
        audioManager.playVoice('quizCorrect')
      } else {
        audioManager.playVoice('quizWrong')
      }

      setLastQuizResult(null)
    }
  }, [gamePhase, lastQuizResult, setLastQuizResult])

  const initGame = useCallback((resetGameFn: () => void) => {
    resetCurrentScore()
    resetGameFn()
    setGamePhase('playing')
  }, [resetCurrentScore, setGamePhase])

  const addPopup = useCallback((text: string, position: [number, number, number], color: string) => {
    const id = ++popupId.current
    setPopups((prev) => [...prev, { id, text, position, color }])
    return id
  }, [])

  const removePopup = useCallback((id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const triggerConfetti = useCallback((durationMs = 3000) => {
    setShowConfetti(true)
    audioManager.play('confetti')
    setTimeout(() => setShowConfetti(false), durationMs)
  }, [])

  const triggerQuiz = useCallback((category?: QuestionCategory) => {
    const engine = getQuestionEngine(answeredIds)
    const question = engine.getQuestion(difficulty, category, activeProfile?.age ?? 8)
    useEducationStore.getState().setCurrentQuestion(question)
    audioManager.playVoice('quizTime')
    setGamePhase('quiz')
  }, [answeredIds, difficulty, activeProfile, setGamePhase])

  const endGame = useCallback(() => {
    audioManager.playVoice('gameOver')
    setGamePhase('gameover')
  }, [setGamePhase])

  return {
    popups,
    showConfetti,
    addPopup,
    removePopup,
    triggerConfetti,
    triggerQuiz,
    initGame,
    endGame,
  }
}
