import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useKeyboard } from '@/hooks/useKeyboard'
import { HytopiaAvatar } from './HytopiaAvatar'
import { HUB } from '@/core/constants'

/** Pure function: compute movement direction from pressed keys */
export function calculateMoveDirection(keys: Set<string>): THREE.Vector3 {
  const dir = new THREE.Vector3()
  if (keys.has('KeyW') || keys.has('ArrowUp')) dir.z -= 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) dir.z += 1
  if (keys.has('KeyA') || keys.has('ArrowLeft')) dir.x -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) dir.x += 1
  if (dir.lengthSq() > 0) dir.normalize()
  return dir
}

/** Pure function: clamp position within world bounds */
export function clampToWorld(pos: THREE.Vector3, halfSize: number): THREE.Vector3 {
  return new THREE.Vector3(
    Math.max(-halfSize, Math.min(halfSize, pos.x)),
    pos.y,
    Math.max(-halfSize, Math.min(halfSize, pos.z)),
  )
}

/** Pure function: calculate camera position given player position and offset */
export function calculateCameraPosition(
  playerPos: THREE.Vector3,
  offset: [number, number, number],
): THREE.Vector3 {
  return new THREE.Vector3(
    playerPos.x + offset[0],
    playerPos.y + offset[1],
    playerPos.z + offset[2],
  )
}

export function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return a + diff * t
}

interface PlayerControllerProps {
  onPositionChange?: (pos: THREE.Vector3) => void
}

export function PlayerController({ onPositionChange }: PlayerControllerProps) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const avatarGroupRef = useRef<THREE.Group>(null)
  const keys = useKeyboard()
  const { camera } = useThree()
  const currentFacing = useRef(0)
  const [isMoving, setIsMoving] = useState(false)
  const isFirstFrame = useRef(true)

  useFrame((_, delta) => {
    if (!bodyRef.current) return

    const moveDir = calculateMoveDirection(keys)
    const moving = moveDir.lengthSq() > 0

    // Only trigger re-render when moving state changes
    if (moving !== isMoving) setIsMoving(moving)

    const currentPos = bodyRef.current.translation()
    const pos = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)

    if (moving) {
      const velocity = moveDir.multiplyScalar(HUB.playerSpeed * delta)
      const newPos = new THREE.Vector3(pos.x + velocity.x, pos.y, pos.z + velocity.z)
      const clamped = clampToWorld(newPos, HUB.worldSize / 2 - 1)
      bodyRef.current.setNextKinematicTranslation({ x: clamped.x, y: clamped.y, z: clamped.z })

      // Model faces -Z at rotation.y=0, so negate to align facing with movement
      const targetAngle = Math.atan2(-moveDir.x, -moveDir.z)
      currentFacing.current = lerpAngle(currentFacing.current, targetAngle, 0.15)

      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y = currentFacing.current
      }

      pos.copy(clamped)
    }

    // Camera follow - snap on first frame, lerp after
    const camTarget = calculateCameraPosition(pos, HUB.cameraOffset)
    if (isFirstFrame.current) {
      camera.position.copy(camTarget)
      isFirstFrame.current = false
    } else {
      camera.position.lerp(camTarget, 0.05)
    }
    camera.lookAt(pos.x, pos.y + 1, pos.z)

    onPositionChange?.(pos)
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[0, 1, 0]}
      colliders={false}
    >
      <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />
      <group ref={avatarGroupRef}>
        <HytopiaAvatar isMoving={isMoving} />
      </group>
    </RigidBody>
  )
}
