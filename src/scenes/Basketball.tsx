import { useEffect, useCallback, useRef } from 'react'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Court } from '@/games/basketball/Court'
import { Hoop } from '@/games/basketball/Hoop'
import { BallAndShooter } from '@/games/basketball/BallAndShooter'
import { useBasketball } from '@/games/basketball/useBasketball'
import { BASKETBALL_CONFIG } from '@/games/basketball/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { useGameSession } from '@/hooks/useGameSession'
import { useGameKeyboard } from '@/hooks/useGameKeyboard'

// Shared state for the UI overlay (read by BasketballUI outside Canvas)
import { create } from 'zustand'

interface BasketballUIState {
  hasPowerShot: boolean
  setHasPowerShot: (v: boolean) => void
}

export const useBasketballUI = create<BasketballUIState>((set) => ({
  hasPowerShot: false,
  setHasPowerShot: (v) => set({ hasPowerShot: v }),
}))

function BasketballGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const addScore = useScoreStore((s) => s.addScore)
  const incrementStreak = useScoreStore((s) => s.incrementStreak)
  const currentStreak = useScoreStore((s) => s.currentStreak)

  const hasPowerShot = useBasketballUI((s) => s.hasPowerShot)
  const setHasPowerShot = useBasketballUI((s) => s.setHasPowerShot)

  const {
    shotsRemaining,
    isBallFlying,
    registerBackboardHit,
    registerRimHit,
    registerScore,
    decrementTime,
    resetGame,
  } = useBasketball()

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, initGame, endGame } = useGameSession()
  useGameKeyboard()
  const shotCount = useRef(0)

  // Initialize game
  useEffect(() => {
    initGame(() => {
      resetGame()
      shotCount.current = 0
      setHasPowerShot(false)
    })
  }, [])

  // Timer
  useEffect(() => {
    if (gamePhase !== 'playing') return
    const interval = setInterval(() => {
      const expired = decrementTime()
      if (expired) {
        endGame()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [gamePhase, decrementTime, endGame])

  // Check game over on shots
  useEffect(() => {
    if (shotsRemaining <= 0 && !isBallFlying && gamePhase === 'playing') {
      setTimeout(() => endGame(), 1500)
    }
  }, [shotsRemaining, isBallFlying, gamePhase, endGame])

  // Track shots for quiz trigger
  useEffect(() => {
    const totalShots = BASKETBALL_CONFIG.totalShots
    const currentShot = totalShots - shotsRemaining
    if (currentShot > 0 && currentShot % 3 === 0 && gamePhase === 'playing' && !isBallFlying) {
      if (currentShot !== shotCount.current) {
        shotCount.current = currentShot
        triggerQuiz()
      }
    }
  }, [shotsRemaining, gamePhase, isBallFlying, triggerQuiz])

  const handleScore = useCallback(() => {
    const result = registerScore()
    let points = 0
    let text = ''
    let color = '#F7C948'

    switch (result) {
      case 'swish':
        points = BASKETBALL_CONFIG.swishPoints
        text = `SWISH! +${points}`
        color = '#2ECC71'
        break
      case 'backboard':
        points = BASKETBALL_CONFIG.backboardPoints
        text = `Backboard! +${points}`
        color = '#F7C948'
        break
      case 'rim':
        points = BASKETBALL_CONFIG.rimPoints
        text = `Rim shot! +${points}`
        color = '#FF6B35'
        break
    }

    if (result !== 'miss') {
      const newStreak = currentStreak + 1
      if (newStreak >= BASKETBALL_CONFIG.streakBonusThreshold) {
        points *= BASKETBALL_CONFIG.streakBonusMultiplier
        text += ` x2 STREAK!`
      }

      if (hasPowerShot) {
        points *= 2
        text += ` POWER!`
        color = '#FF6B35'
        setHasPowerShot(false)
      }

      addScore(points)
      incrementStreak()

      addPopup(text, [0, 3.5, -5], color)

      if (result === 'swish') {
        triggerConfetti()
      }
    }
  }, [registerScore, addScore, incrementStreak, currentStreak, hasPowerShot, setHasPowerShot, addPopup, triggerConfetti])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 12, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Skybox scene="basketball" />

      <PhysicsProvider paused={gamePhase !== 'playing'}>
        <Court />
        <Hoop
          onScoreSensor={handleScore}
          onBackboardHit={registerBackboardHit}
          onRimHit={registerRimHit}
        />
        <BallAndShooter />
      </PhysicsProvider>

      {popups.map((popup) => (
        <ScorePopup
          key={popup.id}
          text={popup.text}
          position={popup.position}
          color={popup.color}
          onComplete={() => removePopup(popup.id)}
        />
      ))}

      {showConfetti && <Confetti position={[0, 3.5, -5]} />}
    </>
  )
}

export function Basketball() {
  return <BasketballGame />
}
