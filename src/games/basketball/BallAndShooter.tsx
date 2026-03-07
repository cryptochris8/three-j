import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useBasketball } from './useBasketball'
import { BASKETBALL_CONFIG } from './config'

export function BallAndShooter() {
  const ballRef = useRef<RapierRigidBody>(null)
  const missTimerRef = useRef<number | null>(null)
  const { camera } = useThree()

  const {
    isBallFlying,
    isPowerCharging,
    shotsRemaining,
    aimAngle,
    startCharging,
    setPower,
    shoot,
    registerMiss,
    resetBall,
    shotResult,
  } = useBasketball()

  const { ballStartPosition, minPower, maxPower, launchAngle } = BASKETBALL_CONFIG

  // Camera setup
  useEffect(() => {
    camera.position.set(0, 3.5, 8)
    camera.lookAt(0, 2.5, -5)
  }, [camera])

  // Power meter oscillation while charging
  useFrame(() => {
    if (isPowerCharging) {
      const t = Date.now() * 0.003
      const normalizedPower = (Math.sin(t) + 1) / 2
      setPower(minPower + normalizedPower * (maxPower - minPower))
    }
  })

  // Mouse movement for aim
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isBallFlying) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const angle = x * BASKETBALL_CONFIG.maxAimAngle
      useBasketball.getState().setAimAngle(angle)
    }

    const handleMouseDown = () => {
      if (!isBallFlying && shotsRemaining > 0) {
        startCharging()
      }
    }

    const handleMouseUp = () => {
      if (!isPowerCharging) return
      const { power: shotPower, aimAngle: shotAngle } = shoot()
      launchBall(shotPower, shotAngle)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isBallFlying, isPowerCharging, shotsRemaining, startCharging, shoot])

  const launchBall = useCallback((shotPower: number, shotAngle: number) => {
    if (!ballRef.current) return

    // Reset ball position
    ballRef.current.setTranslation(
      { x: ballStartPosition[0], y: ballStartPosition[1], z: ballStartPosition[2] },
      true
    )
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

    // Calculate launch velocity
    const angleRad = (launchAngle * Math.PI) / 180
    const aimRad = (shotAngle * Math.PI) / 180

    const vx = Math.sin(aimRad) * shotPower * 0.3
    const vy = Math.sin(angleRad) * shotPower
    const vz = -Math.cos(aimRad) * Math.cos(angleRad) * shotPower

    ballRef.current.setLinvel({ x: vx, y: vy, z: vz }, true)

    // Set miss timer - if ball doesn't score in 4 seconds, it's a miss
    if (missTimerRef.current) clearTimeout(missTimerRef.current)
    missTimerRef.current = window.setTimeout(() => {
      const state = useBasketball.getState()
      if (state.isBallFlying) {
        registerMiss()
        setTimeout(() => resetBallPosition(), 1000)
      }
    }, 4000)
  }, [registerMiss])

  // Reset ball to starting position
  const resetBallPosition = useCallback(() => {
    if (!ballRef.current) return
    ballRef.current.setTranslation(
      { x: ballStartPosition[0], y: ballStartPosition[1], z: ballStartPosition[2] },
      true
    )
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    resetBall()
  }, [resetBall, ballStartPosition])

  // When shot result is processed, reset ball after delay
  useEffect(() => {
    if (shotResult && shotResult !== 'miss') {
      if (missTimerRef.current) clearTimeout(missTimerRef.current)
      const timer = setTimeout(resetBallPosition, 1500)
      return () => clearTimeout(timer)
    }
  }, [shotResult, resetBallPosition])

  return (
    <>
      {/* Basketball */}
      <RigidBody
        ref={ballRef}
        colliders="ball"
        mass={BASKETBALL_CONFIG.ballMass}
        restitution={BASKETBALL_CONFIG.ballRestitution}
        linearDamping={0.3}
        position={ballStartPosition}
        name="basketball"
      >
        <mesh castShadow>
          <sphereGeometry args={[BASKETBALL_CONFIG.ballRadius, 32, 32]} />
          <meshStandardMaterial color="#FF6B00" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Aim indicator (when not flying) */}
      {!isBallFlying && (
        <mesh
          position={[
            ballStartPosition[0] + Math.sin((aimAngle * Math.PI) / 180) * 2,
            ballStartPosition[1] + 1,
            ballStartPosition[2] - 2,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#F7C948" emissive="#F7C948" emissiveIntensity={2} />
        </mesh>
      )}
    </>
  )
}
