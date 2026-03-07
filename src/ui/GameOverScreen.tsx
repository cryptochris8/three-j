import { useScoreStore } from '@/stores/useScoreStore'
import { useGameStore } from '@/stores/useGameStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { STAR_THRESHOLDS } from '@/core/constants'
import type { Scene } from '@/types'

interface GameOverScreenProps {
  game: Scene
  onPlayAgain: () => void
}

function getStars(game: string, score: number): number {
  const thresholds = STAR_THRESHOLDS[game as keyof typeof STAR_THRESHOLDS]
  if (!thresholds) return 0
  if (game === 'minigolf') {
    // Lower score is better for golf
    if (score <= thresholds.three) return 3
    if (score <= thresholds.two) return 2
    if (score <= thresholds.one) return 1
    return 0
  }
  if (score >= thresholds.three) return 3
  if (score >= thresholds.two) return 2
  if (score >= thresholds.one) return 1
  return 0
}

export function GameOverScreen({ game, onPlayAgain }: GameOverScreenProps) {
  const currentScore = useScoreStore((s) => s.currentScore)
  const highScore = useScoreStore((s) => s.getHighScore(game))
  const saveResult = useScoreStore((s) => s.saveResult)
  const returnToHub = useGameStore((s) => s.returnToHub)
  const addStars = useProgressStore((s) => s.addStars)

  const stars = getStars(game, currentScore)
  const isNewHigh = currentScore > highScore

  const handleContinue = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    returnToHub()
  }

  const handlePlayAgain = () => {
    saveResult(game, currentScore, stars)
    addStars(stars)
    onPlayAgain()
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 90,
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Game Over!
      </h2>

      {isNewHigh && (
        <div style={{
          fontSize: '1rem',
          color: '#F7C948',
          marginBottom: '1rem',
          fontWeight: 600,
        }}>
          NEW HIGH SCORE!
        </div>
      )}

      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
        {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </div>

      <div style={{
        fontSize: '3rem',
        fontWeight: 700,
        marginBottom: '0.3rem',
      }}>
        {currentScore}
      </div>
      <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '2rem' }}>
        Best: {Math.max(highScore, currentScore)}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handlePlayAgain}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
            color: '#1A1A2E',
          }}
        >
          Play Again
        </button>
        <button
          onClick={handleContinue}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          Back to Hub
        </button>
      </div>
    </div>
  )
}
