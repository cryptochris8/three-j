import { useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useBasketball } from '@/games/basketball/useBasketball'
import { useBasketballUI } from '@/scenes/Basketball'
import { BASKETBALL_CONFIG } from '@/games/basketball/config'
import { HUD } from '@/ui/HUD'
import { BaseGameOverlay, useOverlayHandlers } from '@/ui/BaseGameOverlay'
import { PowerMeter } from '@/components/PowerMeter'

export function BasketballOverlay() {
  const shotsRemaining = useBasketball((s) => s.shotsRemaining)
  const timeRemaining = useBasketball((s) => s.timeRemaining)
  const power = useBasketball((s) => s.power)
  const isPowerCharging = useBasketball((s) => s.isPowerCharging)
  const resetGame = useBasketball((s) => s.resetGame)

  const hasPowerShot = useBasketballUI((s) => s.hasPowerShot)
  const setHasPowerShot = useBasketballUI((s) => s.setHasPowerShot)

  const extraReset = useCallback(() => setHasPowerShot(false), [setHasPowerShot])
  const { handlePlayAgain } = useOverlayHandlers(resetGame, extraReset)

  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)
  const setGamePhase = useGameStore((s) => s.setGamePhase)

  const handleQuizComplete = useCallback((correct: boolean) => {
    if (correct) setHasPowerShot(true)
    setLastQuizResult(correct)
    setGamePhase('playing')
  }, [setHasPowerShot, setLastQuizResult, setGamePhase])

  return (
    <BaseGameOverlay game="basketball" onPlayAgain={handlePlayAgain} onQuizComplete={handleQuizComplete}>
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
    </BaseGameOverlay>
  )
}
