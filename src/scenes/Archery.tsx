import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { useThree, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { Range } from '@/games/archery/Range'
import { TargetSpawner } from '@/games/archery/TargetSpawner'
import { useArchery } from '@/games/archery/useArchery'
import { ARCHERY_CONFIG, getArcheryConfig } from '@/games/archery/config'
import { FirstPersonBow } from '@/games/archery/FirstPersonBow'
import { ArrowProjectile } from '@/games/archery/ArrowProjectile'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { ParticleExplosion } from '@/components/ParticleExplosion'
import { ScreenShake } from '@/components/ScreenShake'
import { GameAvatar } from '@/components/GameAvatar'
import type { AnimationState } from '@/components/HytopiaAvatar'
import { useGameScene } from '@/hooks/useGameScene'
import { audioManager } from '@/core/AudioManager'

interface PendingShot {
  type: 'hit' | 'miss'
  points?: number
  position: [number, number, number]
  label?: string
  color?: string
}

function ArcheryGame() {
  const { camera } = useThree()
  const gamePhase = useGameStore((s) => s.gamePhase)
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const config = useMemo(() => getArcheryConfig(selectedDifficulty), [selectedDifficulty])
  const addScore = useScoreStore((s) => s.addScore)
  const incrementStreak = useScoreStore((s) => s.incrementStreak)
  const currentStreak = useScoreStore((s) => s.currentStreak)
  const resetStreak = useScoreStore((s) => s.resetStreak)

  const {
    shotsFired,
    shotResult,
    decrementTime,
    shoot,
    registerHit,
    registerMiss,
    startCharging,
    setPower,
    releaseShot,
    isPowerCharging,
    resetGame,
  } = useArchery()

  const prevShotsFired = useRef(0)
  const [shakeActive, setShakeActive] = useState(false)
  const [reactionAnim, setReactionAnim] = useState<AnimationState | null>(null)
  const [explosions, setExplosions] = useState<{ id: number; position: [number, number, number]; color: string }[]>([])
  const explosionIdRef = useRef(0)
  const [arrows, setArrows] = useState<{ id: number; start: [number, number, number]; end: [number, number, number] }[]>([])
  const arrowIdRef = useRef(0)
  const [shooting, setShooting] = useState(false)
  const pendingShotRef = useRef<PendingShot | null>(null)

  // Compute avatar animation from game state
  const avatarAnimation: AnimationState = reactionAnim ?? 'idle'

  // React to shot results for avatar animation
  useEffect(() => {
    if (!shotResult) return
    if (shotResult === 'hit') {
      setReactionAnim('celebrate')
    } else {
      setReactionAnim('disappointed')
    }
    const timer = setTimeout(() => setReactionAnim(null), 2000)
    return () => clearTimeout(timer)
  }, [shotResult])

  // Position camera to look at the range
  useEffect(() => {
    camera.position.set(...ARCHERY_CONFIG.cameraPosition)
    camera.lookAt(...ARCHERY_CONFIG.cameraLookAt)
  }, [camera])

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, endGame } = useGameScene('archery', () => {
    resetGame(config.roundTimeSeconds)
    prevShotsFired.current = 0
  })

  // Timer
  useEffect(() => {
    if (gamePhase !== 'playing') return
    const interval = setInterval(() => {
      const expired = decrementTime()
      if (expired) endGame()
    }, 1000)
    return () => clearInterval(interval)
  }, [gamePhase, decrementTime, endGame])

  // Quiz trigger based on shots fired
  useEffect(() => {
    if (shotsFired > 0 && shotsFired % config.quizEveryNShots === 0 && shotsFired !== prevShotsFired.current && gamePhase === 'playing') {
      prevShotsFired.current = shotsFired
      triggerQuiz()
    }
  }, [shotsFired, config.quizEveryNShots, gamePhase, triggerQuiz])

  // Spawn a visual arrow and trigger bow recoil
  const spawnArrow = useCallback((endPos: [number, number, number]) => {
    const startPos: [number, number, number] = [
      ARCHERY_CONFIG.cameraPosition[0],
      ARCHERY_CONFIG.cameraPosition[1],
      ARCHERY_CONFIG.cameraPosition[2] - 1,
    ]
    const id = arrowIdRef.current++
    setArrows((prev) => [...prev, { id, start: startPos, end: endPos }])
    setShooting(true)
    setTimeout(() => setShooting(false), 100)
  }, [])

  // Power meter oscillation
  useFrame((state) => {
    if (!isPowerCharging) return
    const t = state.clock.elapsedTime * ARCHERY_CONFIG.chargeSpeed
    const normalized = (Math.sin(t) + 1) / 2
    setPower(ARCHERY_CONFIG.minPower + normalized * (ARCHERY_CONFIG.maxPower - ARCHERY_CONFIG.minPower))
  })

  // PointerDown on canvas → start charging power meter
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (gamePhase !== 'playing') return
      if (!(e.target instanceof HTMLCanvasElement)) return
      startCharging()
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [gamePhase, startCharging])

  // Target hit — called from Target onPointerUp (target dies on release)
  // Just records the hit info; scoring happens in the window pointerup handler
  const handleTargetHit = useCallback((points: number, position: [number, number, number], label: string, targetColor: string) => {
    if (gamePhase !== 'playing') return
    pendingShotRef.current = { type: 'hit', points, position, label, color: targetColor }
  }, [gamePhase])

  // Backdrop pointerUp — records miss with release position
  const handleBackdropPointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (gamePhase !== 'playing') return
    if (!useArchery.getState().isPowerCharging) return
    const p = event.point
    pendingShotRef.current = { type: 'miss', position: [p.x, p.y, p.z] }
  }, [gamePhase])

  // Window pointerUp → finalize the shot with power multiplier
  // R3F onPointerUp handlers fire first (setting pendingShotRef), then this runs
  useEffect(() => {
    const handlePointerUp = () => {
      if (!useArchery.getState().isPowerCharging) return
      const pending = pendingShotRef.current
      pendingShotRef.current = null
      const { power } = releaseShot()

      // No valid interaction (released off-screen or on empty space) — cancel
      if (!pending) return

      shoot() // count the shot
      audioManager.play('arrowShoot')
      spawnArrow(pending.position)

      const powerRatio = power / ARCHERY_CONFIG.maxPower

      if (pending.type === 'hit') {
        const basePoints = pending.points ?? 1
        const finalMultipliedPoints = Math.max(1, Math.round(basePoints * powerRatio * 2))

        registerHit(basePoints)
        incrementStreak()
        audioManager.play('targetHit')

        let finalPoints = finalMultipliedPoints
        const multiplierText = `(${(powerRatio * 2).toFixed(1)}x)`
        let text = `${pending.label} +${finalMultipliedPoints} ${multiplierText}`
        let color = '#F7C948'

        if (basePoints >= 20) {
          text = `DIAMOND! ${pending.label} +${finalMultipliedPoints} ${multiplierText}`
          color = '#9B59B6'
          audioManager.playVoice('bullseye')
          triggerConfetti()
        } else if (basePoints >= 10) {
          text = `BULLSEYE! ${pending.label} +${finalMultipliedPoints} ${multiplierText}`
          color = '#E74C3C'
          triggerConfetti()
        } else if (basePoints >= 5) {
          text = `GREAT! ${pending.label} +${finalMultipliedPoints} ${multiplierText}`
          color = '#F7C948'
        } else if (basePoints >= 3) {
          color = '#2ECC71'
        }

        // Streak bonus
        const newStreak = currentStreak + 1
        if (newStreak >= ARCHERY_CONFIG.streakBonusThreshold) {
          finalPoints *= ARCHERY_CONFIG.streakBonusMultiplier
          text += ` x2 STREAK!`
          audioManager.playVoice('streak')
          audioManager.play('crowd')
        }

        addScore(finalPoints)

        // Screen shake on big hits (5+ base points)
        if (basePoints >= 5) {
          setShakeActive(true)
          setTimeout(() => setShakeActive(false), 300)
        }

        // Particle explosion at hit position
        const explosionId = explosionIdRef.current++
        setExplosions((prev) => [...prev, { id: explosionId, position: pending.position, color: pending.color ?? '#F7C948' }])

        addPopup(text, pending.position, color)
      } else {
        // Miss
        registerMiss()
        resetStreak()
      }
    }

    window.addEventListener('pointerup', handlePointerUp)
    return () => window.removeEventListener('pointerup', handlePointerUp)
  }, [releaseShot, shoot, registerHit, registerMiss, incrementStreak, currentStreak, resetStreak, addScore, addPopup, triggerConfetti, spawnArrow])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 12, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Skybox scene="archery" />

      <Range />

      {/* Large invisible backdrop plane to catch missed shots on release */}
      <mesh
        position={[0, 4, -20]}
        onPointerUp={handleBackdropPointerUp}
      >
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <TargetSpawner
        maxTargets={config.maxTargets}
        speedScale={config.targetSpeedScale}
        sizeScale={config.targetSizeScale}
        paused={gamePhase !== 'playing'}
        onTargetHit={handleTargetHit}
      />

      <FirstPersonBow shooting={shooting} />

      {arrows.map((a) => (
        <ArrowProjectile
          key={a.id}
          startPosition={a.start}
          endPosition={a.end}
          onComplete={() => setArrows((prev) => prev.filter((x) => x.id !== a.id))}
        />
      ))}

      <GameAvatar position={[-3, 0, 5]} rotationY={0.3} animation={avatarAnimation} showBow />

      {popups.map((popup) => (
        <ScorePopup
          key={popup.id}
          text={popup.text}
          position={popup.position}
          color={popup.color}
          onComplete={() => removePopup(popup.id)}
        />
      ))}

      {explosions.map((e) => (
        <ParticleExplosion
          key={e.id}
          position={e.position}
          color={e.color}
          onComplete={() => setExplosions((prev) => prev.filter((x) => x.id !== e.id))}
        />
      ))}

      {showConfetti && <Confetti position={[0, 3, -5]} />}
      <ScreenShake active={shakeActive} intensity={0.08} duration={0.2} />
    </>
  )
}

export function Archery() {
  return <ArcheryGame />
}
