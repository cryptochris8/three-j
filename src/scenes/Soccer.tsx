import { useEffect, useCallback, useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Field } from '@/games/soccer/Field'
import { Goal } from '@/games/soccer/Goal'
import { Goalkeeper } from '@/games/soccer/Goalkeeper'
import { useSoccer } from '@/games/soccer/useSoccer'
import { SOCCER_CONFIG } from '@/games/soccer/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { getQuestionEngine } from '@/education/QuestionEngine'

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
  useFrame(() => {
    if (phase === 'charging') {
      const t = Date.now() * 0.003
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
        // Ball stopped without scoring = saved or miss
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

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [phase, setAim, startCharging, kick])

  const launchBall = useCallback((p: number, ax: number, ay: number) => {
    if (!ballRef.current) return
    const [bx, by, bz] = SOCCER_CONFIG.ballStartPosition
    ballRef.current.setTranslation({ x: bx, y: by, z: bz }, true)

    // Calculate direction towards aim point on goal
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
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const addScore = useScoreStore((s) => s.addScore)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const difficulty = useEducationStore((s) => s.difficulty)
  const answeredIds = useEducationStore((s) => s.answeredIds)
  const activeProfile = usePlayerStore((s) => s.getActiveProfile())

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

  const [popups, setPopups] = useState<{ id: number; text: string; position: [number, number, number]; color: string }[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const popupId = useRef(0)

  // Initialize
  useEffect(() => {
    resetCurrentScore()
    resetGame()
    setGamePhase('playing')
  }, [])

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
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else if (lastResult === 'saved') {
        text = 'Saved!'
        color = '#E74C3C'
      } else {
        text = 'Miss!'
        color = '#888'
      }

      // Simulate opponent
      const opScored = simulateOpponent()
      if (opScored) {
        setTimeout(() => {
          const id2 = ++popupId.current
          setPopups((prev) => [...prev, { id: id2, text: 'Opponent scores!', position: [0, 1, -5], color: '#E74C3C' }])
        }, 1500)
      }

      const id = ++popupId.current
      setPopups((prev) => [...prev, { id, text, position: [0, 3, -5], color }])

      // Quiz every 2nd kick
      setTimeout(() => {
        if (currentKick % 2 === 0 && currentKick < SOCCER_CONFIG.totalKicks) {
          const engine = getQuestionEngine(answeredIds)
          const question = engine.getQuestion(difficulty, undefined, activeProfile?.age ?? 8)
          useEducationStore.getState().setCurrentQuestion(question)
          setGamePhase('quiz')
        } else {
          nextKick()
        }
      }, 2500)
    }
  }, [soccerPhase, lastResult, addScore, simulateOpponent, currentKick])

  // Game over
  useEffect(() => {
    if (soccerPhase === 'done') {
      setGamePhase('gameover')
    }
  }, [soccerPhase, setGamePhase])

  const removePopup = useCallback((id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id))
  }, [])

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
      <Environment preset="park" />
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

      {/* Score popups */}
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

      {/* Aim crosshair (when aiming) */}
      {soccerPhase === 'aiming' && (
        <mesh position={[aimX, aimY, SOCCER_CONFIG.goalPosition[2] + 0.5]}>
          <ringGeometry args={[0.15, 0.2, 16]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.8} />
        </mesh>
      )}

      {/* UI overlays now rendered outside Canvas via SoccerOverlay */}
    </>
  )
}

export function Soccer() {
  return <SoccerGame />
}
