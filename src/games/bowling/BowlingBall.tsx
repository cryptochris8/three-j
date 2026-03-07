import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useBowling } from './useBowling'
import { BOWLING_CONFIG } from './config'

interface BowlingBallProps {
  onBallStopped: () => void
}

export function BowlingBall({ onBallStopped }: BowlingBallProps) {
  const ballRef = useRef<RapierRigidBody>(null)
  const { camera } = useThree()

  const {
    phase,
    bowlerX,
    setBowlerX,
    startCharging,
    setPower,
    startSpinning,
    setSpinAngle,
    release,
  } = useBowling()

  const { ballStartPosition, maxBallSpeed, minBallSpeed, ballRadius } = BOWLING_CONFIG

  // Position camera
  useEffect(() => {
    camera.position.set(0, 2.5, 10)
    camera.lookAt(0, 0.5, -7)
  }, [camera])

  // Handle ball positioning during aiming
  useFrame((state) => {
    if (phase === 'positioning' && ballRef.current) {
      ballRef.current.setTranslation(
        { x: bowlerX, y: ballStartPosition[1], z: ballStartPosition[2] },
        true
      )
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }

    // Power meter oscillation
    if (phase === 'charging') {
      const t = state.clock.elapsedTime * 3
      const normalized = (Math.sin(t) + 1) / 2
      setPower(minBallSpeed + normalized * (maxBallSpeed - minBallSpeed))
    }

    // Spin needle oscillation
    if (phase === 'spinning') {
      const t = state.clock.elapsedTime * 5
      setSpinAngle(Math.sin(t) * 3)
    }

    // Check if rolling ball has stopped
    if (phase === 'rolling' && ballRef.current) {
      const vel = ballRef.current.linvel()
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      const pos = ballRef.current.translation()

      // Ball stopped or fell off lane
      if (speed < 0.1 || pos.y < -1 || pos.z < -9) {
        onBallStopped()
      }
    }
  })

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (phase === 'positioning') {
        const x = (e.clientX / window.innerWidth - 0.5) * BOWLING_CONFIG.laneWidth * 0.9
        setBowlerX(x)
      }
    }

    const handleMouseDown = () => {
      if (phase === 'positioning') {
        startCharging()
      } else if (phase === 'charging') {
        startSpinning()
      } else if (phase === 'spinning') {
        const { power, spin, bowlerX: bx } = release()
        launchBall(power, spin, bx)
      }
    }

    // Keyboard controls: Arrow keys to position, Space to advance phases
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (phase === 'positioning') {
          startCharging()
        } else if (phase === 'charging') {
          startSpinning()
        } else if (phase === 'spinning') {
          const { power, spin, bowlerX: bx } = release()
          launchBall(power, spin, bx)
        }
      }
      if (phase === 'positioning') {
        const step = 0.1
        if (e.code === 'ArrowLeft') setBowlerX(Math.max(-BOWLING_CONFIG.laneWidth * 0.45, useBowling.getState().bowlerX - step))
        if (e.code === 'ArrowRight') setBowlerX(Math.min(BOWLING_CONFIG.laneWidth * 0.45, useBowling.getState().bowlerX + step))
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [phase, setBowlerX, startCharging, startSpinning, release])

  const launchBall = useCallback((power: number, spin: number, bx: number) => {
    if (!ballRef.current) return
    ballRef.current.setTranslation(
      { x: bx, y: ballStartPosition[1], z: ballStartPosition[2] },
      true
    )
    ballRef.current.setLinvel({ x: spin * 0.5, y: 0, z: -power }, true)
    ballRef.current.setAngvel({ x: -power * 2, y: spin * 2, z: 0 }, true)
  }, [ballStartPosition])

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      mass={BOWLING_CONFIG.ballMass}
      restitution={BOWLING_CONFIG.ballRestitution}
      linearDamping={0.3}
      position={ballStartPosition}
      name="bowlingball"
    >
      <mesh castShadow>
        <sphereGeometry args={[ballRadius, 32, 32]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Finger holes */}
      <mesh position={[0, ballRadius * 0.7, -ballRadius * 0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.02, ballRadius * 0.7, -ballRadius * 0.15]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.02, ballRadius * 0.7, -ballRadius * 0.15]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </RigidBody>
  )
}
