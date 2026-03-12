import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Court } from '@/games/basketball/Court'
import { Hoop } from '@/games/basketball/Hoop'
import { BallAndShooter } from '@/games/basketball/BallAndShooter'
import { useBasketball } from '@/games/basketball/useBasketball'
import { BASKETBALL_CONFIG, getBasketballConfig } from '@/games/basketball/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { ScreenShake } from '@/components/ScreenShake'
import { useGameScene } from '@/hooks/useGameScene'
import { audioManager } from '@/core/AudioManager'
import { GameAvatar } from '@/components/GameAvatar'
import type { AnimationState } from '@/components/HytopiaAvatar'

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
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const config = useMemo(() => getBasketballConfig(selectedDifficulty), [selectedDifficulty])
  const addScore = useScoreStore((s) => s.addScore)
  const incrementStreak = useScoreStore((s) => s.incrementStreak)
  const currentStreak = useScoreStore((s) => s.currentStreak)

  const hasPowerShot = useBasketballUI((s) => s.hasPowerShot)
  const setHasPowerShot = useBasketballUI((s) => s.setHasPowerShot)

  const {
    shotsRemaining,
    isBallFlying,
    isPowerCharging,
    shotResult,
    registerBackboardHit,
    registerRimHit,
    registerScore,
    decrementTime,
    resetGame,
  } = useBasketball()

  const [shakeActive, setShakeActive] = useState(false)
  const [reactionAnim, setReactionAnim] = useState<AnimationState | null>(null)
  const prevFlyingRef = useRef(false)

  // Compute avatar animation from game state
  const avatarAnimation: AnimationState = useMemo(() => {
    if (reactionAnim) return reactionAnim
    if (isPowerCharging) return 'charge'
    return 'idle'
  }, [reactionAnim, isPowerCharging])

  // Detect transition from charging to flying (throw moment)
  useEffect(() => {
    if (isBallFlying && !prevFlyingRef.current) {
      setReactionAnim('throw')
      const timer = setTimeout(() => setReactionAnim(null), 800)
      return () => clearTimeout(timer)
    }
    prevFlyingRef.current = isBallFlying
  }, [isBallFlying])

  // Celebrate/disappointed on shot result
  useEffect(() => {
    if (!shotResult) return
    if (shotResult === 'miss') {
      setReactionAnim('disappointed')
    } else {
      setReactionAnim('celebrate')
    }
    const timer = setTimeout(() => setReactionAnim(null), 2000)
    return () => clearTimeout(timer)
  }, [shotResult])

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, endGame } = useGameScene('basketball', () => {
    resetGame(config.totalShots, config.roundTimeSeconds)
    shotCount.current = 0
    setHasPowerShot(false)
  })
  const shotCount = useRef(0)

  // Timer
  useEffect(() => {
    if (gamePhase !== 'playing') return
    const interval = setInterval(() => {
      const expired = decrementTime()
      if (expired) endGame()
    }, 1000)
    return () => clearInterval(interval)
  }, [gamePhase, decrementTime, endGame])

  // Check game over on shots
  useEffect(() => {
    if (shotsRemaining <= 0 && !isBallFlying && gamePhase === 'playing') {
      setTimeout(() => endGame(), 1500)
    }
  }, [shotsRemaining, isBallFlying, gamePhase, endGame])

  // Track shots for quiz trigger — wait for shot result + delay
  // so the player can see score/miss feedback before the quiz appears.
  // Use a ref for triggerQuiz to avoid re-triggering when its identity changes.
  const triggerQuizRef = useRef(triggerQuiz)
  triggerQuizRef.current = triggerQuiz

  // Store quiz timer in a ref so it survives effect re-runs.
  // Without this, resetBall() setting shotResult=null would re-run the effect
  // and the cleanup would cancel the pending quiz timer before it fires.
  const quizTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!shotResult || gamePhase !== 'playing') return
    const totalShots = config.totalShots
    const currentShot = totalShots - shotsRemaining
    if (currentShot > 0 && currentShot % 3 === 0 && currentShot !== shotCount.current) {
      shotCount.current = currentShot
      if (quizTimerRef.current) clearTimeout(quizTimerRef.current)
      // 2.5s delay lets the player see the score popup, confetti, and celebration
      quizTimerRef.current = setTimeout(() => {
        quizTimerRef.current = null
        triggerQuizRef.current()
      }, 2500)
    }
  }, [shotResult, shotsRemaining, gamePhase, config.totalShots])

  // Cleanup quiz timer on unmount only
  useEffect(() => {
    return () => {
      if (quizTimerRef.current) clearTimeout(quizTimerRef.current)
    }
  }, [])

  // Show "Miss!" popup when a shot misses
  useEffect(() => {
    if (shotResult === 'miss') {
      addPopup('Miss!', [0, 3, -5], '#888888')
    }
  }, [shotResult, addPopup])

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
        audioManager.playVoice('streak')
        audioManager.play('crowd')
      }

      if (hasPowerShot) {
        points *= 2
        text += ` POWER!`
        color = '#FF6B35'
        setHasPowerShot(false)
      }

      addScore(points)
      incrementStreak()

      // Trigger screen shake
      setShakeActive(true)
      setTimeout(() => setShakeActive(false), 300)

      addPopup(text, [0, 3.5, -5], color)

      if (result === 'swish') {
        audioManager.play('swish')
        audioManager.playVoice('swish')
        triggerConfetti()
      } else {
        audioManager.play('bounce')
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
        <GameAvatar position={[0, 0, 4]} rotationY={0} animation={avatarAnimation} />
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
      <ScreenShake active={shakeActive} intensity={0.1} duration={0.25} />
    </>
  )
}

export function Basketball() {
  return <BasketballGame />
}
