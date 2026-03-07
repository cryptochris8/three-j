import { useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { useSoccer } from '@/games/soccer/useSoccer'
import { SOCCER_CONFIG } from '@/games/soccer/config'
import { GameOverScreen } from '@/ui/GameOverScreen'
import { QuizModal } from '@/ui/QuizModal'
import { PowerMeter } from '@/components/PowerMeter'

export function SoccerOverlay() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const currentQuestion = useEducationStore((s) => s.currentQuestion)

  const soccerPhase = useSoccer((s) => s.phase)
  const currentKick = useSoccer((s) => s.currentKick)
  const playerGoals = useSoccer((s) => s.playerGoals)
  const opponentGoals = useSoccer((s) => s.opponentGoals)
  const power = useSoccer((s) => s.power)
  const keeperSlowed = useSoccer((s) => s.keeperSlowed)
  const nextKick = useSoccer((s) => s.nextKick)
  const setKeeperSlowed = useSoccer((s) => s.setKeeperSlowed)
  const resetGame = useSoccer((s) => s.resetGame)

  const handlePlayAgain = useCallback(() => {
    resetCurrentScore()
    resetGame()
    setGamePhase('playing')
  }, [resetCurrentScore, resetGame, setGamePhase])

  const setLastQuizResult = useGameStore((s) => s.setLastQuizResult)

  const handleQuizComplete = useCallback((correct: boolean) => {
    if (correct) {
      setKeeperSlowed(true)
    }
    setLastQuizResult(correct)
    nextKick()
    setGamePhase('playing')
  }, [setKeeperSlowed, setLastQuizResult, nextKick, setGamePhase])

  return (
    <>
      {gamePhase === 'playing' && (
        <>
          {/* Scoreboard */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '0.8rem 1.5rem',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            zIndex: 60,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>YOU</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2ECC71' }}>{playerGoals}</div>
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.5 }}>
              Kick {currentKick}/{SOCCER_CONFIG.totalKicks}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>OPP</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#E74C3C' }}>{opponentGoals}</div>
            </div>
          </div>

          {soccerPhase === 'charging' && (
            <PowerMeter
              power={power}
              maxPower={SOCCER_CONFIG.maxKickPower}
              isCharging
            />
          )}

          {keeperSlowed && (
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
              padding: '0.4rem 1.2rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#1A1A2E',
              pointerEvents: 'none',
              zIndex: 60,
            }}>
              KEEPER SLOWED!
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
            {soccerPhase === 'aiming' && 'Move mouse to aim | Click & hold to charge power'}
            {soccerPhase === 'charging' && 'Release to kick!'}
          </div>
        </>
      )}
      {gamePhase === 'quiz' && currentQuestion && (
        <QuizModal question={currentQuestion} onComplete={handleQuizComplete} />
      )}
      {gamePhase === 'gameover' && (
        <GameOverScreen game="soccer" onPlayAgain={handlePlayAgain} />
      )}
    </>
  )
}
