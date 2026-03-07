import { useEffect, useRef } from 'react'
import { useScoreStore } from '@/stores/useScoreStore'
import { useGameStore } from '@/stores/useGameStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { getStarRating } from '@/utils/scoring'
import { COLORS } from '@/core/constants'
import type { Scene } from '@/types'

interface GameOverScreenProps {
  game: Scene
  onPlayAgain: () => void
}

export function GameOverScreen({ game, onPlayAgain }: GameOverScreenProps) {
  const currentScore = useScoreStore((s) => s.currentScore)
  const highScore = useScoreStore((s) => s.getHighScore(game))
  const saveResult = useScoreStore((s) => s.saveResult)
  const returnToHub = useGameStore((s) => s.returnToHub)
  const returnToMenu = useGameStore((s) => s.returnToMenu)
  const addStars = useProgressStore((s) => s.addStars)
  const playAgainRef = useRef<HTMLButtonElement>(null)

  const stars = getStarRating(game, currentScore)
  const isLowerBetter = game === 'minigolf'
  const isNewHigh = isLowerBetter
    ? (highScore === 0 || currentScore < highScore)
    : currentScore > highScore

  // Focus trap
  useEffect(() => {
    playAgainRef.current?.focus()
  }, [])

  const handleContinue = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    returnToHub()
  }

  const handleMainMenu = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    returnToMenu()
  }

  const handlePlayAgain = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    onPlayAgain()
  }

  const bestScore = isLowerBetter
    ? (highScore === 0 ? currentScore : Math.min(highScore, currentScore))
    : Math.max(highScore, currentScore)

  return (
    <div
      role="dialog"
      aria-label="Game over"
      aria-modal="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 90,
        pointerEvents: 'auto',
      }}
    >
      <h2 style={{
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        fontWeight: 700,
        marginBottom: '0.5rem',
        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Game Over!
      </h2>

      {isNewHigh && (
        <div
          role="status"
          aria-live="polite"
          style={{
            fontSize: '1rem',
            color: COLORS.accent,
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          NEW HIGH SCORE!
        </div>
      )}

      <div aria-label={`${stars} out of 3 stars`} style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
        {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </div>

      <div aria-label={`Score: ${currentScore}`} style={{
        fontSize: 'clamp(2rem, 6vw, 3rem)',
        fontWeight: 700,
        marginBottom: '0.3rem',
      }}>
        {currentScore}
      </div>
      <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '2rem' }}>
        Best: {bestScore}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0 1rem' }}>
        <button
          ref={playAgainRef}
          onClick={handlePlayAgain}
          aria-label="Play again"
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            color: COLORS.dark,
          }}
        >
          Play Again
        </button>
        <button
          onClick={handleContinue}
          aria-label="Back to hub"
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            color: COLORS.white,
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          Back to Hub
        </button>
        <button
          onClick={handleMainMenu}
          aria-label="Main menu"
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            color: COLORS.white,
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          Main Menu
        </button>
      </div>
    </div>
  )
}
