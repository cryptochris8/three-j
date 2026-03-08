import { useEffect, useCallback, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Skybox } from '@/components/Skybox'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Course } from '@/games/minigolf/Course'
import { useMinigolf } from '@/games/minigolf/useMinigolf'
import { MINIGOLF_CONFIG, COURSES, getMinigolfConfig } from '@/games/minigolf/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { useGameScene } from '@/hooks/useGameScene'
import { audioManager } from '@/core/AudioManager'

function GuideLine({ ballPosition }: { ballPosition: [number, number, number] }) {
  const hasGuideLine = useMinigolf((s) => s.hasGuideLine)
  const isDragging = useMinigolf((s) => s.isDragging)
  const dragStartX = useMinigolf((s) => s.dragStartX)
  const dragStartY = useMinigolf((s) => s.dragStartY)
  const dragEndX = useMinigolf((s) => s.dragEndX)
  const dragEndY = useMinigolf((s) => s.dragEndY)

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), [])
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: '#4FC3F7', transparent: true, opacity: 0.7 }), [])
  const lineObj = useMemo(() => new THREE.Line(lineGeometry, lineMaterial), [lineGeometry, lineMaterial])

  useFrame(() => {
    if (!hasGuideLine || !isDragging) return

    const dx = dragStartX - dragEndX
    const dy = dragStartY - dragEndY
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < 1) return

    const dirX = dx / distance
    const dirZ = dy / distance
    const power = Math.min(distance * 0.1, MINIGOLF_CONFIG.maxPuttPower)

    const points: number[] = []
    const lineLength = power * 0.8
    const segments = 8
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * lineLength
      points.push(
        ballPosition[0] + dirX * t,
        ballPosition[1] + 0.05,
        ballPosition[2] + dirZ * t,
      )
    }

    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(points, 3),
    )
    lineGeometry.attributes.position.needsUpdate = true
  })

  if (!hasGuideLine || !isDragging) return null

  return <primitive object={lineObj} />
}

function GolfBall() {
  const ballRef = useRef<RapierRigidBody>(null)
  const { camera } = useThree()

  const phase = useMinigolf((s) => s.phase)
  const currentHole = useMinigolf((s) => s.currentHole)
  const isDragging = useMinigolf((s) => s.isDragging)
  const startDrag = useMinigolf((s) => s.startDrag)
  const updateDrag = useMinigolf((s) => s.updateDrag)
  const releasePutt = useMinigolf((s) => s.releasePutt)
  const saveBallPosition = useMinigolf((s) => s.saveBallPosition)
  const ballStopped = useMinigolf((s) => s.ballStopped)
  const outOfBounds = useMinigolf((s) => s.outOfBounds)
  const resetCounter = useMinigolf((s) => s.resetCounter)

  const holeConfig = COURSES[currentHole]

  // Camera
  useEffect(() => {
    const [tx, , tz] = holeConfig.teePosition
    camera.position.set(tx, 4, tz + 4)
    camera.lookAt(tx, 0, tz - 2)
  }, [camera, currentHole, holeConfig])

  // Ball stopped check + out-of-bounds detection
  useFrame(() => {
    if (phase === 'rolling' && ballRef.current) {
      const pos = ballRef.current.translation()

      if (pos.y < MINIGOLF_CONFIG.outOfBoundsY) {
        outOfBounds()
        return
      }

      const vel = ballRef.current.linvel()
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      if (speed < 0.05) {
        saveBallPosition([pos.x, pos.y, pos.z])
        ballStopped()
      }
    }
  })

  // Reset ball on new hole, water hazard, or out-of-bounds
  useEffect(() => {
    if (ballRef.current) {
      const [tx, ty, tz] = useMinigolf.getState().lastBallPosition
      ballRef.current.setTranslation({ x: tx, y: ty, z: tz }, true)
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }
  }, [resetCounter])

  // Mouse controls for slingshot putt
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (phase === 'aiming') {
        startDrag(e.clientX, e.clientY)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateDrag(e.clientX, e.clientY)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        if (ballRef.current) {
          const pos = ballRef.current.translation()
          saveBallPosition([pos.x, pos.y, pos.z])
        }
        const { dirX, dirZ, power } = releasePutt()
        if (power > 0 && ballRef.current) {
          audioManager.play('putt')
          ballRef.current.setLinvel({
            x: dirX * power,
            y: 0,
            z: dirZ * power,
          }, true)
        }
      }
    }

    // Keyboard controls
    const kbDir = { x: 0, z: 0 }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'aiming') return
      if (e.code === 'ArrowLeft') kbDir.x = -1
      if (e.code === 'ArrowRight') kbDir.x = 1
      if (e.code === 'ArrowUp') kbDir.z = 1
      if (e.code === 'ArrowDown') kbDir.z = -1
      if (e.code === 'Space') {
        e.preventDefault()
        const dx = kbDir.x || 0
        const dz = kbDir.z || 1
        const len = Math.sqrt(dx * dx + dz * dz) || 1
        const power = MINIGOLF_CONFIG.maxPuttPower * 0.5
        if (ballRef.current) {
          const pos = ballRef.current.translation()
          useMinigolf.getState().saveBallPosition([pos.x, pos.y, pos.z])
          ballRef.current.setLinvel({
            x: (dx / len) * power,
            y: 0,
            z: -(dz / len) * power,
          }, true)
          useMinigolf.getState().startDrag(0, 0)
          useMinigolf.getState().releasePutt()
        }
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [phase, isDragging, startDrag, updateDrag, releasePutt])

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      mass={MINIGOLF_CONFIG.ballMass}
      restitution={MINIGOLF_CONFIG.ballRestitution}
      linearDamping={MINIGOLF_CONFIG.ballLinearDamping}
      angularDamping={1}
      position={holeConfig.teePosition}
      name="golfball"
    >
      <mesh castShadow>
        <sphereGeometry args={[MINIGOLF_CONFIG.ballRadius, 16, 16]} />
        <meshStandardMaterial color="#fff" roughness={0.3} />
      </mesh>
    </RigidBody>
  )
}

function MinigolfGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const golfConfig = useMemo(() => getMinigolfConfig(selectedDifficulty), [selectedDifficulty])
  const addScore = useScoreStore((s) => s.addScore)

  const golfPhase = useMinigolf((s) => s.phase)
  const currentHole = useMinigolf((s) => s.currentHole)
  const totalStrokes = useMinigolf((s) => s.totalStrokes)
  const ballHoled = useMinigolf((s) => s.ballHoled)
  const resetGame = useMinigolf((s) => s.resetGame)

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, endGame } = useGameScene('minigolf', () => resetGame(golfConfig.maxStrokes))

  const holeConfig = COURSES[currentHole]

  // Handle ball in hole
  const handleBallInHole = useCallback(() => {
    const mgState = useMinigolf.getState()
    if (mgState.phase !== 'rolling') return

    ballHoled()

    const par = holeConfig.par
    const strokesTaken = mgState.strokes
    let text = ''
    let color = '#F7C948'

    audioManager.play('holeIn')
    audioManager.playVoice('greatPutt')

    if (strokesTaken === 1) {
      text = 'HOLE IN ONE!'
      color = '#FFD700'
      triggerConfetti()
    } else if (strokesTaken <= par - 1) {
      text = 'Birdie!'
      color = '#2ECC71'
    } else if (strokesTaken === par) {
      text = 'Par!'
      color = '#4FC3F7'
    } else {
      text = `+${strokesTaken - par}`
      color = '#FF6B35'
    }

    addPopup(text, [holeConfig.holePosition[0], 1, holeConfig.holePosition[2]], color)
  }, [ballHoled, holeConfig, triggerConfetti, addPopup])

  // Handle water hazard
  const waterHazard = useMinigolf((s) => s.waterHazard)
  const handleWaterHazard = useCallback(() => {
    audioManager.play('splash')
    waterHazard()
    const mgState = useMinigolf.getState()
    const [bx, , bz] = mgState.lastBallPosition
    addPopup('Water! +1 stroke', [bx, 1, bz], '#1E90FF')
  }, [waterHazard, addPopup])

  // Handle holed -> quiz or next hole
  useEffect(() => {
    if (golfPhase === 'holed') {
      setTimeout(() => {
        triggerQuiz('trivia')
      }, 2000)
    }
  }, [golfPhase, triggerQuiz])

  // Game done
  useEffect(() => {
    if (golfPhase === 'done') {
      addScore(totalStrokes)
      endGame()
    }
  }, [golfPhase, totalStrokes, addScore, endGame])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Skybox scene="minigolf" />
      {holeConfig.theme === 'space' && <color attach="background" args={['#0a0a1e']} />}
      {holeConfig.theme === 'underwater' && <fog attach="fog" args={['#1a5276', 5, 20]} />}

      <PhysicsProvider paused={gamePhase !== 'playing'}>
        <Course
          hole={holeConfig}
          onBallInHole={handleBallInHole}
          onWaterHazard={handleWaterHazard}
        />
        <GolfBall />
        <GuideLine ballPosition={useMinigolf.getState().lastBallPosition} />
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

      {showConfetti && <Confetti position={[holeConfig.holePosition[0], 0.5, holeConfig.holePosition[2]]} />}
    </>
  )
}

export function MiniGolf() {
  return <MinigolfGame />
}
