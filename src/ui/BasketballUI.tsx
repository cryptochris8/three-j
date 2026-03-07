import { useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { useBasketball } from '@/games/basketball/useBasketball'
import { useBasketballUI } from '@/scenes/Basketball'
import { BASKETBALL_CONFIG } from '@/games/basketball/config'
import { HUD } from '@/ui/HUD'
import { GameOverScreen } from '@/ui/GameOverScreen'
import { QuizModal } from '@/ui/QuizModal'
import { PowerMeter } from '@/components/PowerMeter'

export function BasketballOverlay() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const currentQuestion = useEducationStore((s) => s.currentQuestion)

  const shotsRemaining = useBasketball((s) => s.shotsRemaining)
  const timeRemaining = useBasketball((s) => s.timeRemaining)
  const power = useBasketball((s) => s.power)
  const isPowerCharging = useBasketball((s) => s.isPowerCharging)
  const resetGame = useBasketball((s) => s.resetGame)

  const hasPowerShot = useBasketballUI((s) => s.hasPowerShot)
  const setHasPowerShot = useBasketballUI((s) => s.setHasPowerShot)

  const handlePlayAgain = useCallback(() => {
    resetCurrentScore()
    resetGame()
    setHasPowerShot(false)
    setGamePhase('playing')
  }, [resetCurrentScore, resetGame, setHasPowerShot, setGamePhase])

  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)

  const handleQuizComplete = useCallback((correct: boolean) => {
    if (correct) {
      setHasPowerShot(true)
    }
    setLastQuizResult(correct)
    setGamePhase('playing')
  }, [setGamePhase, setHasPowerShot, setLastQuizResult])

  return (
    <>
      {gamePhase === 'playing' && (
        <>
          <HUD
            gameName="Basketball"
            shotsRemaining={shotsRemaining}
            timeRemaining={timeRemaining}
          />
          <PowerMeter
            power={power}
            maxPower={BASKETBALL_CONFIG.maxPower}
            isCharging={isPowerCharging}
          />
          {hasPowerShot && (
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1A1A2E',
              pointerEvents: 'none',
              zIndex: 60,
              boxShadow: '0 4px 15px rgba(255,107,53,0.5)',
            }}>
              POWER SHOT ACTIVE!
            </div>
          )}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.85rem',
            opacity: 0.6,
            pointerEvents: 'none',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            zIndex: 60,
          }}>
            Move mouse to aim | Click & hold to charge | Release to shoot
          </div>
        </>
      )}
      {gamePhase === 'quiz' && currentQuestion && (
        <QuizModal
          question={currentQuestion}
          onComplete={handleQuizComplete}
        />
      )}
      {gamePhase === 'gameover' && (
        <GameOverScreen game="basketball" onPlayAgain={handlePlayAgain} />
      )}
    </>
  )
}
