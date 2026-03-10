import { useEffect, useCallback, useRef, useMemo, useState } from 'react'
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
import { BallTrail } from '@/components/BallTrail'
import { GameAvatar } from '@/components/GameAvatar'
import type { AnimationState } from '@/components/HytopiaAvatar'

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

  // Pre-allocated vectors for smooth camera (avoids GC pressure)
  const camTarget = useRef(new THREE.Vector3())
  const camLookTarget = useRef(new THREE.Vector3())

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
  const lastBallPosition = useMinigolf((s) => s.lastBallPosition)

  const holeConfig = COURSES[currentHole]

  // Putt direction indicator: dashed dotted line showing aim direction + power
  // Ground surface is at y=0.05, so dots must be above that
  const aimDotsCount = 12
  const aimDots = useMemo(() => {
    const group = new THREE.Group()
    for (let i = 0; i < aimDotsCount; i++) {
      const geo = new THREE.CircleGeometry(0.025 - i * 0.001, 8)
      const mat = new THREE.MeshBasicMaterial({ color: 0x44cc44, transparent: true, opacity: 0.8 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.x = -Math.PI / 2
      mesh.position.y = 0.055 // above ground surface (0.05)
      mesh.visible = false
      group.add(mesh)
    }
    group.visible = false
    return group
  }, [])

  useEffect(() => {
    return () => {
      aimDots.children.forEach((child) => {
        const mesh = child as THREE.Mesh
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      })
    }
  }, [aimDots])

  // Snap camera instantly on new hole (no lerp delay)
  useEffect(() => {
    const tee = holeConfig.teePosition
    const hole = holeConfig.holePosition
    const dx = hole[0] - tee[0]
    const dz = hole[2] - tee[2]
    const dist = Math.sqrt(dx * dx + dz * dz)
    const dirX = dx / (dist || 1)
    const dirZ = dz / (dist || 1)
    const t = Math.min(dist / 8, 1)
    const camHeight = 1.8 + t * 2.2
    const camBack = 2.0 + t * 2.0

    camera.position.set(tee[0] - dirX * camBack, camHeight, tee[2] - dirZ * camBack)
    camera.lookAt(tee[0] + dirX * 2, 0, tee[2] + dirZ * 2)
    camTarget.current.copy(camera.position)
  }, [camera, currentHole, holeConfig])

  // Dynamic camera + ball physics + putt direction indicator
  useFrame(() => {
    const holePos = holeConfig.holePosition
    let bx: number, by: number, bz: number

    if (phase === 'rolling' && ballRef.current) {
      const pos = ballRef.current.translation()
      bx = pos.x; by = pos.y; bz = pos.z

      // Out of bounds: ball fell off the course
      if (by < MINIGOLF_CONFIG.outOfBoundsY) {
        outOfBounds()
        return
      }

      // Ball stopped check
      const vel = ballRef.current.linvel()
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      if (speed < 0.05) {
        saveBallPosition([bx, by, bz])
        ballStopped()
      }
    } else {
      // During aiming/holed phases, use the saved ball position
      bx = lastBallPosition[0]
      by = lastBallPosition[1]
      bz = lastBallPosition[2]
    }

    // --- DYNAMIC CAMERA ---
    // Direction from ball toward hole
    const dx = holePos[0] - bx
    const dz = holePos[2] - bz
    const dist = Math.sqrt(dx * dx + dz * dz)
    const dirX = dx / (dist || 1)
    const dirZ = dz / (dist || 1)

    // Camera height and distance scale with ball-to-hole distance
    // Close to hole: camera is low and tight for a clear view
    // Far from hole: camera is higher and further back for overview
    const maxDist = 8
    const t = Math.min(dist / maxDist, 1) // 0 = at hole, 1 = far away
    const camHeight = 1.8 + t * 2.2       // 1.8 (close) to 4.0 (far)
    const camBack = 2.0 + t * 2.0         // 2.0 (close) to 4.0 (far)

    // Position camera behind ball (opposite direction to hole)
    camTarget.current.set(
      bx - dirX * camBack,
      camHeight,
      bz - dirZ * camBack
    )

    // Look ahead toward hole
    const lookAhead = Math.min(dist * 0.5, 2)
    camLookTarget.current.set(
      bx + dirX * lookAhead,
      0,
      bz + dirZ * lookAhead
    )

    // Smooth lerp: faster settle during aiming, slower follow during rolling
    const lerpSpeed = phase === 'rolling' ? 0.04 : 0.08
    camera.position.lerp(camTarget.current, lerpSpeed)
    camera.lookAt(camLookTarget.current)

    // --- PUTT DIRECTION INDICATOR (dotted aim line with power color) ---
    if (isDragging) {
      const state = useMinigolf.getState()
      const ddx = state.dragStartX - state.dragEndX
      const ddy = state.dragStartY - state.dragEndY
      const dragDist = Math.sqrt(ddx * ddx + ddy * ddy)
      if (dragDist > 5) {
        const power = Math.min(dragDist * 0.1, MINIGOLF_CONFIG.maxPuttPower)
        const pDirX = ddx / dragDist
        const pDirZ = ddy / dragDist
        const arrowLen = Math.min(power * 0.15, 2.0)
        const powerRatio = power / MINIGOLF_CONFIG.maxPuttPower

        // Color: green (low) → yellow (mid) → red (high)
        const r = powerRatio < 0.5 ? powerRatio * 2 : 1
        const g = powerRatio < 0.5 ? 1 : 1 - (powerRatio - 0.5) * 2
        const dotColor = new THREE.Color(r, g, 0.1)

        aimDots.visible = true
        for (let i = 0; i < aimDotsCount; i++) {
          const dot = aimDots.children[i] as THREE.Mesh
          const t = (i + 1) / aimDotsCount
          if (t * arrowLen > arrowLen) {
            dot.visible = false
            continue
          }
          dot.visible = true
          dot.position.x = bx + pDirX * t * arrowLen
          dot.position.z = bz + pDirZ * t * arrowLen
          ;(dot.material as THREE.MeshBasicMaterial).color.copy(dotColor)
          ;(dot.material as THREE.MeshBasicMaterial).opacity = 0.9 - t * 0.4
        }
      } else {
        aimDots.visible = false
      }
    } else {
      aimDots.visible = false
    }
  })

  // Stop ball immediately when holed so it doesn't roll back out
  useEffect(() => {
    if (phase === 'holed' && ballRef.current) {
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      // Sink ball into cup visually
      const pos = ballRef.current.translation()
      ballRef.current.setTranslation({ x: pos.x, y: pos.y - 0.03, z: pos.z }, true)
    }
  }, [phase])

  // Reset ball on new hole, water hazard, or out-of-bounds
  // The key prop forces remount, but this effect is a safety net for velocity reset
  useEffect(() => {
    // Small delay to ensure the RigidBody has been created after remount
    const timer = setTimeout(() => {
      if (ballRef.current) {
        const [tx, ty, tz] = useMinigolf.getState().lastBallPosition
        ballRef.current.setTranslation({ x: tx, y: ty, z: tz }, true)
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [resetCounter, currentHole])

  // Mouse controls for slingshot putt
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (useGameStore.getState().gamePhase !== 'playing') return
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
      if (useGameStore.getState().gamePhase !== 'playing') return
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
      if (useGameStore.getState().gamePhase !== 'playing') return
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
    <>
      <RigidBody
        key={`ball-${currentHole}-${resetCounter}`}
        ref={ballRef}
        colliders="ball"
        mass={MINIGOLF_CONFIG.ballMass}
        restitution={MINIGOLF_CONFIG.ballRestitution}
        linearDamping={MINIGOLF_CONFIG.ballLinearDamping}
        angularDamping={1}
        position={lastBallPosition}
        name="golfball"
      >
        <mesh castShadow>
          <sphereGeometry args={[MINIGOLF_CONFIG.ballRadius, 16, 16]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Ball trail effect */}
      <BallTrail
        getPosition={() => ballRef.current?.translation() ?? null}
        color="#88ccff"
        isActive={phase === 'rolling'}
      />

      {/* Putt direction indicator (dotted line) */}
      <primitive object={aimDots} />
    </>
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
  const lastEvent = useMinigolf((s) => s.lastEvent)

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, endGame } = useGameScene('minigolf', () => resetGame(golfConfig.maxStrokes))

  const holeConfig = COURSES[currentHole]
  const isDragging = useMinigolf((s) => s.isDragging)

  const [reactionAnim, setReactionAnim] = useState<AnimationState | null>(null)
  const prevGolfPhaseRef = useRef(golfPhase)

  // Compute avatar animation from minigolf phase
  const avatarAnimation: AnimationState = useMemo(() => {
    if (reactionAnim) return reactionAnim
    if (isDragging) return 'charge'
    return 'idle'
  }, [reactionAnim, isDragging])

  // Detect swing moment (transition to rolling)
  useEffect(() => {
    if (golfPhase === 'rolling' && prevGolfPhaseRef.current === 'aiming') {
      setReactionAnim('swing')
      const timer = setTimeout(() => setReactionAnim(null), 800)
      return () => clearTimeout(timer)
    }
    prevGolfPhaseRef.current = golfPhase
  }, [golfPhase])

  // Celebrate on holed
  useEffect(() => {
    if (golfPhase === 'holed') {
      setReactionAnim('celebrate')
      const timer = setTimeout(() => setReactionAnim(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [golfPhase])

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
    if (golfPhase !== 'holed') return
    const timer = setTimeout(() => {
      triggerQuiz('trivia')
    }, 2000)
    return () => clearTimeout(timer)
  }, [golfPhase, triggerQuiz])

  // Game done
  useEffect(() => {
    if (golfPhase === 'done') {
      addScore(totalStrokes)
      endGame()
    }
  }, [golfPhase, totalStrokes, addScore, endGame])

  // Announce hole name on hole change
  useEffect(() => {
    if (gamePhase === 'playing') {
      const name = holeConfig.name
      addPopup(name, [holeConfig.teePosition[0], 1.5, holeConfig.teePosition[2]], '#F7C948')
    }
  }, [currentHole]) // Only trigger on hole change

  // Out of bounds feedback
  useEffect(() => {
    if (lastEvent === 'oob') {
      addPopup('Out of Bounds!', [0, 1, 0], '#FF6B35')
      useMinigolf.setState({ lastEvent: null })
    }
  }, [lastEvent, addPopup])

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
        <GameAvatar
          position={[holeConfig.teePosition[0] + 0.3, 0, holeConfig.teePosition[2]]}
          rotationY={Math.PI / 2}
          animation={avatarAnimation}
        />
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
