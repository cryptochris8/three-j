import { useCallback, type ReactNode } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { GameOverScreen } from '@/ui/GameOverScreen'
import { QuizModal } from '@/ui/QuizModal'
import type { Scene } from '@/types'

interface BaseGameOverlayProps {
  game: Scene
  children: ReactNode
  onPlayAgain: () => void
  onQuizComplete: (correct: boolean) => void
}

/**
 * Wraps the common overlay pattern shared by all 4 game UIs:
 * - Renders children (HUD) when playing
 * - Renders QuizModal when quiz phase
 * - Renders GameOverScreen when gameover phase
 */
export function BaseGameOverlay({ game, children, onPlayAgain, onQuizComplete }: BaseGameOverlayProps) {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const currentQuestion = useEducationStore((s) => s.currentQuestion)

  return (
    <>
      {gamePhase === 'playing' && children}
      {gamePhase === 'quiz' && currentQuestion && (
        <QuizModal question={currentQuestion} onComplete={onQuizComplete} />
      )}
      {gamePhase === 'gameover' && (
        <GameOverScreen game={game} onPlayAgain={onPlayAgain} />
      )}
    </>
  )
}

/**
 * Hook that returns standard handlers for play-again and quiz-complete.
 * Games can extend these with game-specific logic.
 */
export function useOverlayHandlers(resetGameFn: () => void, extraReset?: () => void) {
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)

  const handlePlayAgain = useCallback(() => {
    resetCurrentScore()
    resetGameFn()
    extraReset?.()
    setGamePhase('playing')
  }, [resetCurrentScore, resetGameFn, extraReset, setGamePhase])

  const handleQuizComplete = useCallback((correct: boolean) => {
    setLastQuizResult(correct)
    setGamePhase('playing')
  }, [setLastQuizResult, setGamePhase])

  return { handlePlayAgain, handleQuizComplete }
}
