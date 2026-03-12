import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useMouseLook } from '@/hooks/useMouseLook'
import { HytopiaAvatar, type AnimationState } from './HytopiaAvatar'
import { HUB } from '@/core/constants'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { getAvatarSkin } from './GameAvatar'

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

/** Pure function: check if sprint key is held */
export function isSprinting(keys: Set<string>): boolean {
  return keys.has('ShiftLeft') || keys.has('ShiftRight')
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

/** Pure function: rotate movement vector by camera yaw so WASD is camera-relative */
export function rotateMovementByCamera(moveDir: THREE.Vector3, cameraYaw: number): THREE.Vector3 {
  if (moveDir.lengthSq() === 0) return moveDir.clone()
  const cos = Math.cos(cameraYaw)
  const sin = Math.sin(cameraYaw)
  return new THREE.Vector3(
    moveDir.x * cos - moveDir.z * sin,
    0,
    moveDir.x * sin + moveDir.z * cos,
  )
}

/** Pure function: check if jump key is pressed */
export function isJumpPressed(keys: Set<string>): boolean {
  return keys.has('Space')
}

/** Pure function: compute new vertical velocity after applying gravity for one frame */
export function applyGravity(verticalVelocity: number, gravity: number, delta: number): number {
  return verticalVelocity - gravity * delta
}

/** Pure function: compute jump result — new Y position, velocity, and grounded state */
export function computeJump(
  currentY: number,
  verticalVelocity: number,
  gravity: number,
  groundY: number,
  delta: number,
): { y: number; velocity: number; grounded: boolean } {
  const newVelocity = applyGravity(verticalVelocity, gravity, delta)
  const newY = currentY + newVelocity * delta

  if (newY <= groundY) {
    return { y: groundY, velocity: 0, grounded: true }
  }
  return { y: newY, velocity: newVelocity, grounded: false }
}

/** Pure function: get the forward direction the camera is facing (yaw only, XZ plane) */
export function getCameraYawForward(cameraYaw: number): number {
  // Camera looks from orbit position toward player center.
  // The "forward" direction for movement is the opposite of the camera's orbit angle.
  // When yaw=0, camera is behind player (+Z), forward is -Z → angle 0
  return Math.atan2(Math.sin(cameraYaw), Math.cos(cameraYaw)) + Math.PI
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
  const [movementState, setMovementState] = useState<AnimationState>('idle')
  const animation: AnimationState = movementState
  const isFirstFrame = useRef(true)
  const verticalVelocity = useRef(0)
  const isGrounded = useRef(true)
  const { yaw, pitch } = useMouseLook()
  const skinId = usePlayerStore((s) => {
    const profile = s.profiles.find((p) => p.id === s.activeProfileId)
    return profile?.skinId
  })
  const skinUrl = getAvatarSkin(skinId)

  useFrame((_, delta) => {
    if (!bodyRef.current) return

    const rawDir = calculateMoveDirection(keys)
    // Negate yaw so W always moves AWAY from camera (camera-to-player direction)
    const moveDir = rotateMovementByCamera(rawDir, -yaw.current)
    const moving = moveDir.lengthSq() > 0
    const sprinting = moving && isSprinting(keys)

    // Jump: trigger on Space when grounded
    if (isJumpPressed(keys) && isGrounded.current) {
      verticalVelocity.current = HUB.jumpVelocity
      isGrounded.current = false
    }

    // Apply jump/gravity physics
    const currentPos = bodyRef.current.translation()
    const jumpResult = computeJump(
      currentPos.y, verticalVelocity.current, HUB.gravity, HUB.groundY, delta,
    )
    verticalVelocity.current = jumpResult.velocity
    isGrounded.current = jumpResult.grounded

    // Determine animation state: jump overrides walk/run
    const newState: AnimationState = !isGrounded.current
      ? 'jump'
      : moving ? (sprinting ? 'run' : 'walk') : 'idle'
    if (newState !== movementState) setMovementState(newState)

    const pos = new THREE.Vector3(currentPos.x, jumpResult.y, currentPos.z)

    if (moving) {
      const speed = sprinting ? HUB.playerSpeed * HUB.sprintMultiplier : HUB.playerSpeed
      const velocity = moveDir.clone().multiplyScalar(speed * delta)
      const newPos = new THREE.Vector3(pos.x + velocity.x, pos.y, pos.z + velocity.z)
      const clamped = clampToWorld(newPos, HUB.worldSize / 2 - 1)
      bodyRef.current.setNextKinematicTranslation({ x: clamped.x, y: clamped.y, z: clamped.z })

      // Minecraft-style: face movement direction instantly.
      // Mouse steers via yaw → movement direction changes → model snaps to match.
      const targetAngle = Math.atan2(-moveDir.x, -moveDir.z)
      currentFacing.current = targetAngle

      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y = currentFacing.current
      }

      pos.copy(clamped)
    } else {
      // Still update position for jump/gravity when not moving horizontally
      bodyRef.current.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z })

      // When idle, slowly align character to face camera forward direction
      // This ensures pressing W immediately moves where camera points
      const cameraForwardAngle = yaw.current
      currentFacing.current = lerpAngle(currentFacing.current, cameraForwardAngle, HUB.idleFacingLerpSpeed)

      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y = currentFacing.current
      }
    }

    // Camera follows behind player — locked to yaw angle
    const d = HUB.cameraDistance
    const p = pitch.current
    const y = yaw.current
    const camX = pos.x + d * Math.sin(y) * Math.cos(p)
    const camY = pos.y + d * Math.sin(p)
    const camZ = pos.z + d * Math.cos(y) * Math.cos(p)
    const camTarget = new THREE.Vector3(camX, camY, camZ)

    // Tighter camera follow when moving for responsive steering
    const camLerp = moving ? HUB.movingCameraLerpSpeed : HUB.cameraLerpSpeed

    if (isFirstFrame.current) {
      camera.position.copy(camTarget)
      isFirstFrame.current = false
    } else {
      camera.position.lerp(camTarget, camLerp)
    }
    camera.lookAt(pos.x, pos.y + HUB.cameraHeightOffset, pos.z)

    onPositionChange?.(pos)
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[0, 0, 0]}
      colliders={false}
    >
      <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />
      <group ref={avatarGroupRef}>
        <HytopiaAvatar key={skinUrl} skinUrl={skinUrl} animation={animation} />
      </group>
    </RigidBody>
  )
}
