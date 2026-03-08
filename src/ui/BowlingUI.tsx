import { useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useBowling } from '@/games/bowling/useBowling'
import { BOWLING_CONFIG } from '@/games/bowling/config'
import { HUD } from '@/ui/HUD'
import { BaseGameOverlay, useOverlayHandlers } from '@/ui/BaseGameOverlay'
import { PowerMeter } from '@/components/PowerMeter'

export function BowlingOverlay() {
  const bowlingPhase = useBowling((s) => s.phase)
  const currentFrame = useBowling((s) => s.currentFrame)
  const effectiveTotalFrames = useBowling((s) => s.effectiveTotalFrames)
  const power = useBowling((s) => s.power)
  const spinAngle = useBowling((s) => s.spinAngle)
  const hasExtraBall = useBowling((s) => s.hasExtraBall)
  const grantExtraBall = useBowling((s) => s.grantExtraBall)
  const resetGame = useBowling((s) => s.resetGame)
  const nextFrame = useBowling((s) => s.nextFrame)

  const showControls = bowlingPhase === 'positioning' || bowlingPhase === 'charging' || bowlingPhase === 'spinning'

  const { handlePlayAgain } = useOverlayHandlers(resetGame)

  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)
  const setGamePhase = useGameStore((s) => s.setGamePhase)

  const handleQuizComplete = useCallback((correct: boolean) => {
    setLastQuizResult(correct)
    if (correct) {
      grantExtraBall()
    }
    nextFrame()
    setGamePhase('playing')
  }, [setLastQuizResult, nextFrame, setGamePhase, grantExtraBall])

  return (
    <BaseGameOverlay game="bowling" onPlayAgain={handlePlayAgain} onQuizComplete={handleQuizComplete}>
      <HUD gameName="Bowling" />

      {/* Frame indicator */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)',
        padding: '0.4rem 1rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 60,
      }}>
        Frame {currentFrame} / {effectiveTotalFrames}
      </div>

      {hasExtraBall && (
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
          padding: '0.3rem 0.8rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#1A1A2E',
          pointerEvents: 'none',
          zIndex: 60,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          EXTRA BALL!
        </div>
      )}

      {bowlingPhase === 'charging' && (
        <PowerMeter
          power={power}
          maxPower={BOWLING_CONFIG.maxBallSpeed}
          isCharging
        />
      )}

      {bowlingPhase === 'spinning' && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          zIndex: 60,
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '0.85rem', textAlign: 'center', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            SPIN
          </div>
          <div style={{
            width: '100%',
            height: '24px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.7)',
            position: 'relative',
            border: '3px solid rgba(255,255,255,0.3)',
          }}>
            <div style={{
              position: 'absolute',
              left: `${50 + (spinAngle / 3) * 50}%`,
              top: '-3px',
              width: '6px',
              height: '30px',
              background: '#F7C948',
              borderRadius: '3px',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 10px #F7C94880',
            }} />
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '4px',
              width: '2px',
              height: '16px',
              background: 'rgba(255,255,255,0.3)',
              transform: 'translateX(-50%)',
            }} />
          </div>
        </div>
      )}

      {showControls && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.85rem',
          opacity: 0.6,
          pointerEvents: 'none',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          textAlign: 'center',
          zIndex: 60,
        }}>
          {bowlingPhase === 'positioning' && 'Move mouse to position | Click to set power'}
          {bowlingPhase === 'charging' && 'Click to set spin'}
          {bowlingPhase === 'spinning' && 'Click to release!'}
        </div>
      )}
    </BaseGameOverlay>
  )
}
