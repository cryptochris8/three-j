import { useEffect, useCallback, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Skybox } from '@/components/Skybox'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Field } from '@/games/soccer/Field'
import { Goal } from '@/games/soccer/Goal'
import { Goalkeeper } from '@/games/soccer/Goalkeeper'
import { useSoccer } from '@/games/soccer/useSoccer'
import { SOCCER_CONFIG, getSoccerConfig } from '@/games/soccer/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { useGameScene } from '@/hooks/useGameScene'
import { audioManager } from '@/core/AudioManager'

function SoccerBall() {
  const ballRef = useRef<RapierRigidBody>(null)
  const { camera } = useThree()

  const phase = useSoccer((s) => s.phase)
  const setAim = useSoccer((s) => s.setAim)
  const startCharging = useSoccer((s) => s.startCharging)
  const setPower = useSoccer((s) => s.setPower)
  const kick = useSoccer((s) => s.kick)
  const registerSaved = useSoccer((s) => s.registerSaved)
  const registerMiss = useSoccer((s) => s.registerMiss)

  // Camera
  useEffect(() => {
    camera.position.set(0, 2, 6)
    camera.lookAt(0, 1.2, -8)
  }, [camera])

  // Power charge
  useFrame((state) => {
    if (phase === 'charging') {
      const t = state.clock.elapsedTime * 3
      const normalized = (Math.sin(t) + 1) / 2
      setPower(SOCCER_CONFIG.minKickPower + normalized * (SOCCER_CONFIG.maxKickPower - SOCCER_CONFIG.minKickPower))
    }

    // Ball position reset when aiming
    if (phase === 'aiming' && ballRef.current) {
      const [bx, by, bz] = SOCCER_CONFIG.ballStartPosition
      ballRef.current.setTranslation({ x: bx, y: by, z: bz }, true)
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }

    // Check if flying ball has stopped
    if (phase === 'flying' && ballRef.current) {
      const vel = ballRef.current.linvel()
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      const pos = ballRef.current.translation()

      if (speed < 0.3 || pos.z < -12 || pos.y < -2) {
        if (pos.x > -SOCCER_CONFIG.goalWidth / 2 && pos.x < SOCCER_CONFIG.goalWidth / 2 && pos.z < -7) {
          registerSaved()
        } else {
          registerMiss()
        }
      }
    }
  })

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (phase === 'aiming') {
        const x = (e.clientX / window.innerWidth - 0.5) * SOCCER_CONFIG.maxAimAngleX * 2
        const y = (1 - e.clientY / window.innerHeight) * SOCCER_CONFIG.maxAimAngleY
        setAim(x, Math.max(0.3, y))
      }
    }

    const handleMouseDown = () => {
      if (phase === 'aiming') {
        startCharging()
      }
    }

    const handleMouseUp = () => {
      if (phase === 'charging') {
        const { power: p, aimX: ax, aimY: ay } = kick()
        launchBall(p, ax, ay)
      }
    }

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (phase === 'aiming') startCharging()
      }
      if (phase === 'aiming') {
        const state = useSoccer.getState()
        const step = 0.3
        if (e.code === 'ArrowLeft') setAim(state.aimX - step, state.aimY)
        if (e.code === 'ArrowRight') setAim(state.aimX + step, state.aimY)
        if (e.code === 'ArrowUp') setAim(state.aimX, Math.min(SOCCER_CONFIG.maxAimAngleY, state.aimY + step))
        if (e.code === 'ArrowDown') setAim(state.aimX, Math.max(0.3, state.aimY - step))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && phase === 'charging') {
        const { power: p, aimX: ax, aimY: ay } = kick()
        launchBall(p, ax, ay)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [phase, setAim, startCharging, kick])

  const launchBall = useCallback((p: number, ax: number, ay: number) => {
    if (!ballRef.current) return
    audioManager.play('kick')
    const [bx, by, bz] = SOCCER_CONFIG.ballStartPosition
    ballRef.current.setTranslation({ x: bx, y: by, z: bz }, true)

    const targetZ = SOCCER_CONFIG.goalPosition[2]
    const dz = targetZ - bz
    const dx = ax
    const dy = ay

    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    ballRef.current.setLinvel({
      x: (dx / dist) * p,
      y: (dy / dist) * p * 0.7 + 2,
      z: (dz / dist) * p,
    }, true)
    ballRef.current.setAngvel({
      x: -p * 2,
      y: ax * 3,
      z: 0,
    }, true)
  }, [])

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      mass={SOCCER_CONFIG.ballMass}
      restitution={SOCCER_CONFIG.ballRestitution}
      linearDamping={0.3}
      position={SOCCER_CONFIG.ballStartPosition}
      name="soccerball"
    >
      <mesh castShadow>
        <icosahedronGeometry args={[SOCCER_CONFIG.ballRadius, 1]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
    </RigidBody>
  )
}

function SoccerGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const soccerConfig = useMemo(() => getSoccerConfig(selectedDifficulty), [selectedDifficulty])
  const addScore = useScoreStore((s) => s.addScore)
  const difficulty = useEducationStore((s) => s.difficulty)

  const {
    phase: soccerPhase,
    currentKick,
    aimX,
    aimY,
    lastResult,
    keeperSlowed,
    simulateOpponent,
    nextKick,
    resetGame,
  } = useSoccer()

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, endGame } = useGameScene('soccer', () => resetGame(soccerConfig.totalKicks))

  // Handle goal scored
  const handleGoalScored = useCallback(() => {
    useSoccer.getState().registerGoal()
  }, [])

  // Handle result phase
  useEffect(() => {
    if (soccerPhase === 'result') {
      let text = ''
      let color = '#F7C948'

      if (lastResult === 'goal') {
        text = 'GOAL!'
        color = '#2ECC71'
        addScore(1)
        audioManager.play('goalCheer')
        audioManager.playVoice('goal')
        triggerConfetti()
      } else if (lastResult === 'saved') {
        text = 'Saved!'
        color = '#E74C3C'
        audioManager.playVoice('greatSave')
      } else {
        text = 'Miss!'
        color = '#888'
      }

      const opScored = simulateOpponent()
      if (opScored) {
        setTimeout(() => {
          addPopup('Opponent scores!', [0, 1, -5], '#E74C3C')
        }, 1500)
      }

      addPopup(text, [0, 3, -5], color)

      setTimeout(() => {
        if (currentKick % 2 === 0 && currentKick < soccerConfig.totalKicks) {
          triggerQuiz()
        } else {
          nextKick()
        }
      }, 2500)
    }
  }, [soccerPhase, lastResult, addScore, simulateOpponent, currentKick, triggerConfetti, addPopup, triggerQuiz, nextKick])

  // Game over
  useEffect(() => {
    if (soccerPhase === 'done') {
      endGame()
    }
  }, [soccerPhase, endGame])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 15, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Skybox scene="soccer" />
      <fog attach="fog" args={['#87CEEB', 30, 60]} />

      <PhysicsProvider paused={gamePhase !== 'playing'}>
        <Field />
        <Goal onGoalScored={handleGoalScored} />
        <Goalkeeper
          difficulty={difficulty}
          ballAimX={aimX}
          ballAimY={aimY}
          isBallKicked={soccerPhase === 'flying'}
          isSlowed={keeperSlowed}
        />
        <SoccerBall />
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

      {showConfetti && <Confetti position={[0, 2, -8]} />}

      {soccerPhase === 'aiming' && (
        <mesh position={[aimX, aimY, SOCCER_CONFIG.goalPosition[2] + 0.5]}>
          <ringGeometry args={[0.15, 0.2, 16]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.8} />
        </mesh>
      )}
    </>
  )
}

export function Soccer() {
  return <SoccerGame />
}
