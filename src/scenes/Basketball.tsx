import { useEffect, useCallback, useState, useRef } from 'react'
import { Environment } from '@react-three/drei'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Court } from '@/games/basketball/Court'
import { Hoop } from '@/games/basketball/Hoop'
import { BallAndShooter } from '@/games/basketball/BallAndShooter'
import { useBasketball } from '@/games/basketball/useBasketball'
import { BASKETBALL_CONFIG } from '@/games/basketball/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { getQuestionEngine } from '@/education/QuestionEngine'

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
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const addScore = useScoreStore((s) => s.addScore)
  const incrementStreak = useScoreStore((s) => s.incrementStreak)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const currentStreak = useScoreStore((s) => s.currentStreak)

  const difficulty = useEducationStore((s) => s.difficulty)
  const answeredIds = useEducationStore((s) => s.answeredIds)
  const activeProfile = usePlayerStore((s) => s.getActiveProfile())

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

  const [popups, setPopups] = useState<{ id: number; text: string; position: [number, number, number]; color: string }[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const popupId = useRef(0)
  const shotCount = useRef(0)

  // Initialize game
  useEffect(() => {
    resetCurrentScore()
    resetGame()
    shotCount.current = 0
    setHasPowerShot(false)
    setGamePhase('playing')
  }, [])

  // Timer
  useEffect(() => {
    if (gamePhase !== 'playing') return
    const interval = setInterval(() => {
      const expired = decrementTime()
      if (expired) {
        setGamePhase('gameover')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [gamePhase, decrementTime, setGamePhase])

  // Check game over on shots
  useEffect(() => {
    if (shotsRemaining <= 0 && !isBallFlying && gamePhase === 'playing') {
      setTimeout(() => setGamePhase('gameover'), 1500)
    }
  }, [shotsRemaining, isBallFlying, gamePhase, setGamePhase])

  // Track shots for quiz trigger
  useEffect(() => {
    const totalShots = BASKETBALL_CONFIG.totalShots
    const currentShot = totalShots - shotsRemaining
    if (currentShot > 0 && currentShot % 3 === 0 && gamePhase === 'playing' && !isBallFlying) {
      if (currentShot !== shotCount.current) {
        shotCount.current = currentShot
        const engine = getQuestionEngine(answeredIds)
        const question = engine.getQuestion(difficulty, undefined, activeProfile?.age ?? 8)
        useEducationStore.getState().setCurrentQuestion(question)
        setGamePhase('quiz')
      }
    }
  }, [shotsRemaining, gamePhase, isBallFlying, difficulty, answeredIds, activeProfile])

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

      const id = ++popupId.current
      setPopups((prev) => [...prev, { id, text, position: [0, 3.5, -5] as [number, number, number], color }])

      if (result === 'swish') {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
  }, [registerScore, addScore, incrementStreak, currentStreak, hasPowerShot, setHasPowerShot])

  const removePopup = useCallback((id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id))
  }, [])

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
      <Environment preset="warehouse" />

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
