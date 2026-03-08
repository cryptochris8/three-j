import { useEffect, useRef, useState } from 'react'
import { useScoreStore } from '@/stores/useScoreStore'
import { useGameStore } from '@/stores/useGameStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { getStarRating } from '@/utils/scoring'
import { COLORS } from '@/core/constants'
import { saveCurrentPlayer } from '@/core/playerScoping'
import { useAchievementCheck } from '@/hooks/useAchievementCheck'
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
  const checkAndUnlock = useAchievementCheck()
  const playAgainRef = useRef<HTMLButtonElement>(null)

  const stars = getStarRating(game, currentScore)
  const isLowerBetter = game === 'minigolf'
  const isNewHigh = isLowerBetter
    ? (highScore === 0 || currentScore < highScore)
    : currentScore > highScore

  // Animated score counter
  const [displayScore, setDisplayScore] = useState(0)
  const [revealedStars, setRevealedStars] = useState(0)

  // Score count-up animation
  useEffect(() => {
    const target = currentScore
    const duration = 1000 // ms
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out
      const eased = 1 - (1 - progress) ** 3
      setDisplayScore(Math.round(target * eased))
      if (progress >= 1) clearInterval(interval)
    }, 16)
    return () => clearInterval(interval)
  }, [currentScore])

  // Sequential star reveal
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= stars; i++) {
      timers.push(setTimeout(() => setRevealedStars(i), 1200 + i * 400))
    }
    return () => timers.forEach(clearTimeout)
  }, [stars])

  // Focus trap
  useEffect(() => {
    const timer = setTimeout(() => playAgainRef.current?.focus(), 1800 + stars * 400)
    return () => clearTimeout(timer)
  }, [stars])

  const handleContinue = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    checkAndUnlock()
    saveCurrentPlayer()
    returnToHub()
  }

  const handleMainMenu = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    checkAndUnlock()
    saveCurrentPlayer()
    returnToMenu()
  }

  const handlePlayAgain = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    checkAndUnlock()
    saveCurrentPlayer()
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
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          NEW HIGH SCORE!
        </div>
      )}

      <div aria-label={`${stars} out of 3 stars`} style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: i < revealedStars ? 'scale(1)' : 'scale(0)',
              transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
              filter: i < revealedStars ? 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))' : undefined,
            }}
          >
            {i < stars ? '\u2605' : '\u2606'}
          </span>
        ))}
      </div>

      <div aria-label={`Score: ${currentScore}`} style={{
        fontSize: 'clamp(2rem, 6vw, 3rem)',
        fontWeight: 700,
        marginBottom: '0.3rem',
      }}>
        {displayScore}
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
