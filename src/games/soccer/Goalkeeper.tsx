import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { SOCCER_CONFIG, KEEPER_DIFFICULTY } from './config'
import type { Difficulty } from '@/types'

interface GoalkeeperProps {
  difficulty: Difficulty
  ballAimX: number
  ballAimY: number
  isBallKicked: boolean
  isSlowed: boolean
}

export function Goalkeeper({ difficulty, ballAimX, ballAimY, isBallKicked, isSlowed }: GoalkeeperProps) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const targetX = useRef(0)
  const targetY = useRef(SOCCER_CONFIG.keeperStartPosition[1])
  const hasDived = useRef(false)
  const diveTimer = useRef<number | null>(null)

  const keeperSettings = KEEPER_DIFFICULTY[difficulty]
  const effectiveSpeed = isSlowed ? keeperSettings.diveSpeed * 0.5 : keeperSettings.diveSpeed

  // Reset on new kick
  useEffect(() => {
    if (!isBallKicked) {
      hasDived.current = false
      targetX.current = 0
      targetY.current = SOCCER_CONFIG.keeperStartPosition[1]
      if (bodyRef.current) {
        const [sx, sy, sz] = SOCCER_CONFIG.keeperStartPosition
        bodyRef.current.setTranslation({ x: sx, y: sy, z: sz }, true)
        bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
      if (diveTimer.current) {
        clearTimeout(diveTimer.current)
        diveTimer.current = null
      }
    }
  }, [isBallKicked])

  // Decide where to dive when ball is kicked
  useEffect(() => {
    if (isBallKicked && !hasDived.current) {
      hasDived.current = true
      const delay = isSlowed ? keeperSettings.reactionDelayMs * 2 : keeperSettings.reactionDelayMs

      diveTimer.current = window.setTimeout(() => {
        // Keeper guesses based on accuracy
        if (Math.random() < keeperSettings.accuracy) {
          // Correct guess - dive towards ball
          targetX.current = ballAimX * 0.85
          targetY.current = Math.max(0.5, ballAimY * 0.8)
        } else {
          // Wrong guess - dive the other way
          targetX.current = -ballAimX * 0.7 + (Math.random() - 0.5) * 2
          targetY.current = Math.random() * SOCCER_CONFIG.goalHeight * 0.6
        }
      }, delay)
    }
  }, [isBallKicked, ballAimX, ballAimY, keeperSettings, isSlowed])

  useFrame((state, delta) => {
    if (!bodyRef.current) return
    const pos = bodyRef.current.translation()

    if (isBallKicked && hasDived.current) {
      // Move towards target
      const dx = targetX.current - pos.x
      const dy = targetY.current - pos.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 0.1) {
        const speed = effectiveSpeed * delta
        bodyRef.current.setTranslation({
          x: pos.x + (dx / dist) * speed * 10,
          y: Math.max(0.5, pos.y + (dy / dist) * speed * 5),
          z: pos.z,
        }, true)
      }
    } else if (!isBallKicked) {
      // Idle sway
      const sway = Math.sin(state.clock.elapsedTime * 2) * 0.3
      bodyRef.current.setTranslation({
        x: sway,
        y: pos.y,
        z: pos.z,
      }, true)
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={SOCCER_CONFIG.keeperStartPosition}
      colliders="cuboid"
    >
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[SOCCER_CONFIG.keeperWidth, SOCCER_CONFIG.keeperHeight, SOCCER_CONFIG.keeperDepth]} />
        <meshStandardMaterial color="#FFD700" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, SOCCER_CONFIG.keeperHeight * 0.55, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFDAB9" />
      </mesh>
      {/* Arms (simplified) */}
      <mesh position={[-0.4, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.12, 0.12]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.4, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.12, 0.12]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </RigidBody>
  )
}
