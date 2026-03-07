import { useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { useBowling } from '@/games/bowling/useBowling'
import { BOWLING_CONFIG } from '@/games/bowling/config'
import { HUD } from '@/ui/HUD'
import { GameOverScreen } from '@/ui/GameOverScreen'
import { QuizModal } from '@/ui/QuizModal'
import { PowerMeter } from '@/components/PowerMeter'

export function BowlingOverlay() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const currentQuestion = useEducationStore((s) => s.currentQuestion)

  const bowlingPhase = useBowling((s) => s.phase)
  const currentFrame = useBowling((s) => s.currentFrame)
  const power = useBowling((s) => s.power)
  const spinAngle = useBowling((s) => s.spinAngle)
  const resetGame = useBowling((s) => s.resetGame)
  const nextFrame = useBowling((s) => s.nextFrame)

  const showControls = bowlingPhase === 'positioning' || bowlingPhase === 'charging' || bowlingPhase === 'spinning'

  const handlePlayAgain = useCallback(() => {
    resetCurrentScore()
    resetGame()
    setGamePhase('playing')
  }, [resetCurrentScore, resetGame, setGamePhase])

  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)

  const handleQuizComplete = useCallback((correct: boolean) => {
    setLastQuizResult(correct)
    nextFrame()
    setGamePhase('playing')
  }, [setLastQuizResult, nextFrame, setGamePhase])

  return (
    <>
      {gamePhase === 'playing' && (
        <>
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
            Frame {currentFrame} / {BOWLING_CONFIG.totalFrames}
          </div>

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
                {/* Center line */}
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
        </>
      )}
      {gamePhase === 'quiz' && currentQuestion && (
        <QuizModal question={currentQuestion} onComplete={handleQuizComplete} />
      )}
      {gamePhase === 'gameover' && (
        <GameOverScreen game="bowling" onPlayAgain={handlePlayAgain} />
      )}
    </>
  )
}
