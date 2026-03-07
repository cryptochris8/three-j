import { useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { useMinigolf } from '@/games/minigolf/useMinigolf'
import { MINIGOLF_CONFIG, COURSES } from '@/games/minigolf/config'
import { GameOverScreen } from '@/ui/GameOverScreen'
import { QuizModal } from '@/ui/QuizModal'

export function MinigolfOverlay() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const currentQuestion = useEducationStore((s) => s.currentQuestion)

  const currentHole = useMinigolf((s) => s.currentHole)
  const strokes = useMinigolf((s) => s.strokes)
  const totalStrokes = useMinigolf((s) => s.totalStrokes)
  const isDragging = useMinigolf((s) => s.isDragging)
  const dragStartX = useMinigolf((s) => s.dragStartX)
  const dragStartY = useMinigolf((s) => s.dragStartY)
  const dragEndX = useMinigolf((s) => s.dragEndX)
  const dragEndY = useMinigolf((s) => s.dragEndY)
  const nextHole = useMinigolf((s) => s.nextHole)
  const resetGame = useMinigolf((s) => s.resetGame)

  const holeConfig = COURSES[currentHole]

  const dragDistance = isDragging
    ? Math.sqrt((dragStartX - dragEndX) ** 2 + (dragStartY - dragEndY) ** 2)
    : 0
  const powerRatio = Math.min(dragDistance * 0.05 / MINIGOLF_CONFIG.maxPuttPower, 1)
  const powerColor = powerRatio < 0.4 ? '#2ECC71' : powerRatio < 0.7 ? '#F7C948' : '#E74C3C'

  const handlePlayAgain = useCallback(() => {
    resetCurrentScore()
    resetGame()
    setGamePhase('playing')
  }, [resetCurrentScore, resetGame, setGamePhase])

  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)

  const handleQuizComplete = useCallback((correct: boolean) => {
    setLastQuizResult(correct)
    nextHole()
    setGamePhase('playing')
  }, [setLastQuizResult, nextHole, setGamePhase])

  return (
    <>
      {gamePhase === 'playing' && (
        <>
          {/* Hole info header */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '0.6rem 1.5rem',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            zIndex: 60,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>HOLE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{currentHole + 1}/9</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>PAR</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{holeConfig.par}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>STROKES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{strokes}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>TOTAL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalStrokes}</div>
            </div>
          </div>

          {/* Putt power indicator */}
          {isDragging && (
            <div style={{
              position: 'absolute',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '240px',
              pointerEvents: 'none',
              zIndex: 60,
            }}>
              <div style={{ fontSize: '0.85rem', textAlign: 'center', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                POWER {Math.round(powerRatio * 100)}%
              </div>
              <div style={{
                width: '100%',
                height: '20px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.7)',
                overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.3)',
              }}>
                <div style={{
                  width: `${powerRatio * 100}%`,
                  height: '100%',
                  background: powerColor,
                  borderRadius: '7px',
                  boxShadow: `0 0 15px ${powerColor}80`,
                }} />
              </div>
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
            Click & drag back to aim and set power, release to putt
          </div>
        </>
      )}
      {gamePhase === 'quiz' && currentQuestion && (
        <QuizModal question={currentQuestion} onComplete={handleQuizComplete} />
      )}
      {gamePhase === 'gameover' && (
        <GameOverScreen game="minigolf" onPlayAgain={handlePlayAgain} />
      )}
    </>
  )
}
