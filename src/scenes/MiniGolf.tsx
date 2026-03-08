import { useEffect, useCallback, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Skybox } from '@/components/Skybox'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Course } from '@/games/minigolf/Course'
import { useMinigolf } from '@/games/minigolf/useMinigolf'
import { MINIGOLF_CONFIG, COURSES } from '@/games/minigolf/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { useGameSession } from '@/hooks/useGameSession'
import { useGameKeyboard } from '@/hooks/useGameKeyboard'
import { audioManager } from '@/core/AudioManager'

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
  const lastBallPosition = useMinigolf((s) => s.lastBallPosition)
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

      // Out of bounds: ball fell off the course
      if (pos.y < MINIGOLF_CONFIG.outOfBoundsY) {
        outOfBounds()
        return
      }

      const vel = ballRef.current.linvel()
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      if (speed < 0.05) {
        // Save where ball stopped so next putt starts here
        saveBallPosition([pos.x, pos.y, pos.z])
        ballStopped()
      }
    }
  })

  // Reset ball only on new hole, water hazard, or out-of-bounds (not when ball stops normally)
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
        // Save current ball position before putting (for water hazard reset)
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

    // Keyboard controls: Arrow keys for direction, Space to putt
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
        const dz = kbDir.z || 1 // default forward
        const len = Math.sqrt(dx * dx + dz * dz) || 1
        const power = MINIGOLF_CONFIG.maxPuttPower * 0.5
        if (ballRef.current) {
          // Save ball position before putt (for water hazard reset)
          const pos = ballRef.current.translation()
          useMinigolf.getState().saveBallPosition([pos.x, pos.y, pos.z])
          ballRef.current.setLinvel({
            x: (dx / len) * power,
            y: 0,
            z: -(dz / len) * power,  // keyboard: up arrow = -Z = toward hole
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
  const addScore = useScoreStore((s) => s.addScore)

  const golfPhase = useMinigolf((s) => s.phase)
  const currentHole = useMinigolf((s) => s.currentHole)
  const totalStrokes = useMinigolf((s) => s.totalStrokes)
  const ballHoled = useMinigolf((s) => s.ballHoled)
  const resetGame = useMinigolf((s) => s.resetGame)

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, initGame, endGame } = useGameSession()
  useGameKeyboard()

  const holeConfig = COURSES[currentHole]

  // Initialize
  useEffect(() => {
    initGame(resetGame)
  }, [])

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
      // Use total strokes as score (lower is better)
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

      {showConfetti && <Confetti position={[holeConfig.holePosition[0], 0.5, holeConfig.holePosition[2]]} />}

      {/* UI overlays now rendered outside Canvas via MinigolfOverlay */}
    </>
  )
}

export function MiniGolf() {
  return <MinigolfGame />
}
