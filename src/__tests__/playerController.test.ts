import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import {
  calculateMoveDirection,
  isSprinting,
  clampToWorld,
  calculateCameraPosition,
  lerpAngle,
  rotateMovementByCamera,
  getCameraYawForward,
  isJumpPressed,
  applyGravity,
  computeJump,
} from '@/components/PlayerController'

describe('calculateMoveDirection', () => {
  it('returns zero vector when no keys pressed', () => {
    const dir = calculateMoveDirection(new Set())
    expect(dir.x).toBe(0)
    expect(dir.y).toBe(0)
    expect(dir.z).toBe(0)
  })

  it('moves forward (negative Z) when W is pressed', () => {
    const dir = calculateMoveDirection(new Set(['KeyW']))
    expect(dir.x).toBe(0)
    expect(dir.z).toBeLessThan(0)
    expect(dir.length()).toBeCloseTo(1)
  })

  it('moves backward (positive Z) when S is pressed', () => {
    const dir = calculateMoveDirection(new Set(['KeyS']))
    expect(dir.x).toBe(0)
    expect(dir.z).toBeGreaterThan(0)
    expect(dir.length()).toBeCloseTo(1)
  })

  it('moves left (negative X) when A is pressed', () => {
    const dir = calculateMoveDirection(new Set(['KeyA']))
    expect(dir.x).toBeLessThan(0)
    expect(dir.z).toBe(0)
    expect(dir.length()).toBeCloseTo(1)
  })

  it('moves right (positive X) when D is pressed', () => {
    const dir = calculateMoveDirection(new Set(['KeyD']))
    expect(dir.x).toBeGreaterThan(0)
    expect(dir.z).toBe(0)
    expect(dir.length()).toBeCloseTo(1)
  })

  it('normalizes diagonal movement (W+D)', () => {
    const dir = calculateMoveDirection(new Set(['KeyW', 'KeyD']))
    expect(dir.length()).toBeCloseTo(1)
    expect(dir.x).toBeGreaterThan(0)
    expect(dir.z).toBeLessThan(0)
  })

  it('cancels out opposing keys (W+S)', () => {
    const dir = calculateMoveDirection(new Set(['KeyW', 'KeyS']))
    expect(dir.z).toBe(0)
    expect(dir.length()).toBe(0)
  })

  it('supports arrow keys', () => {
    const dir = calculateMoveDirection(new Set(['ArrowUp']))
    expect(dir.z).toBeLessThan(0)
    expect(dir.length()).toBeCloseTo(1)
  })

  it('supports ArrowDown', () => {
    const dir = calculateMoveDirection(new Set(['ArrowDown']))
    expect(dir.z).toBeGreaterThan(0)
  })

  it('supports ArrowLeft', () => {
    const dir = calculateMoveDirection(new Set(['ArrowLeft']))
    expect(dir.x).toBeLessThan(0)
  })

  it('supports ArrowRight', () => {
    const dir = calculateMoveDirection(new Set(['ArrowRight']))
    expect(dir.x).toBeGreaterThan(0)
  })
})

describe('isSprinting', () => {
  it('returns false when no keys pressed', () => {
    expect(isSprinting(new Set())).toBe(false)
  })

  it('returns true when ShiftLeft is pressed', () => {
    expect(isSprinting(new Set(['ShiftLeft']))).toBe(true)
  })

  it('returns true when ShiftRight is pressed', () => {
    expect(isSprinting(new Set(['ShiftRight']))).toBe(true)
  })

  it('returns false when only movement keys are pressed', () => {
    expect(isSprinting(new Set(['KeyW', 'KeyA']))).toBe(false)
  })

  it('returns true when Shift is pressed alongside movement keys', () => {
    expect(isSprinting(new Set(['KeyW', 'ShiftLeft']))).toBe(true)
  })
})

describe('clampToWorld', () => {
  it('does not change position within bounds', () => {
    const pos = new THREE.Vector3(5, 1, 5)
    const clamped = clampToWorld(pos, 40)
    expect(clamped.x).toBe(5)
    expect(clamped.y).toBe(1)
    expect(clamped.z).toBe(5)
  })

  it('clamps X to positive boundary', () => {
    const pos = new THREE.Vector3(50, 1, 0)
    const clamped = clampToWorld(pos, 40)
    expect(clamped.x).toBe(40)
    expect(clamped.y).toBe(1)
  })

  it('clamps X to negative boundary', () => {
    const pos = new THREE.Vector3(-50, 1, 0)
    const clamped = clampToWorld(pos, 40)
    expect(clamped.x).toBe(-40)
  })

  it('clamps Z to positive boundary', () => {
    const pos = new THREE.Vector3(0, 1, 50)
    const clamped = clampToWorld(pos, 40)
    expect(clamped.z).toBe(40)
  })

  it('clamps Z to negative boundary', () => {
    const pos = new THREE.Vector3(0, 1, -50)
    const clamped = clampToWorld(pos, 40)
    expect(clamped.z).toBe(-40)
  })

  it('preserves Y position', () => {
    const pos = new THREE.Vector3(100, 5, 100)
    const clamped = clampToWorld(pos, 40)
    expect(clamped.y).toBe(5)
  })

  it('clamps both X and Z simultaneously', () => {
    const pos = new THREE.Vector3(100, 0, -100)
    const clamped = clampToWorld(pos, 30)
    expect(clamped.x).toBe(30)
    expect(clamped.z).toBe(-30)
  })
})

describe('calculateCameraPosition', () => {
  it('adds offset to player position', () => {
    const playerPos = new THREE.Vector3(10, 0, 5)
    const offset: [number, number, number] = [0, 8, 12]
    const camPos = calculateCameraPosition(playerPos, offset)
    expect(camPos.x).toBe(10)
    expect(camPos.y).toBe(8)
    expect(camPos.z).toBe(17)
  })

  it('works at origin', () => {
    const playerPos = new THREE.Vector3(0, 0, 0)
    const offset: [number, number, number] = [0, 8, 12]
    const camPos = calculateCameraPosition(playerPos, offset)
    expect(camPos.x).toBe(0)
    expect(camPos.y).toBe(8)
    expect(camPos.z).toBe(12)
  })

  it('handles negative player position', () => {
    const playerPos = new THREE.Vector3(-20, 1, -15)
    const offset: [number, number, number] = [0, 8, 12]
    const camPos = calculateCameraPosition(playerPos, offset)
    expect(camPos.x).toBe(-20)
    expect(camPos.y).toBe(9)
    expect(camPos.z).toBe(-3)
  })
})

describe('lerpAngle', () => {
  it('returns a when t is 0', () => {
    expect(lerpAngle(0, Math.PI, 0)).toBeCloseTo(0)
  })

  it('interpolates between angles', () => {
    const result = lerpAngle(0, Math.PI / 2, 0.5)
    expect(result).toBeCloseTo(Math.PI / 4)
  })

  it('handles wrapping around PI boundary', () => {
    // From just below PI to just above PI should go through PI, not around
    const result = lerpAngle(Math.PI * 0.9, -Math.PI * 0.9, 0.5)
    expect(Math.abs(result)).toBeGreaterThan(Math.PI * 0.8)
  })

  it('handles wrapping around -PI boundary', () => {
    const result = lerpAngle(-Math.PI * 0.9, Math.PI * 0.9, 0.5)
    expect(Math.abs(result)).toBeGreaterThan(Math.PI * 0.8)
  })
})

describe('rotateMovementByCamera', () => {
  it('yaw=0 leaves movement unchanged (W still goes -Z)', () => {
    const moveDir = new THREE.Vector3(0, 0, -1)
    const rotated = rotateMovementByCamera(moveDir, 0)
    expect(rotated.x).toBeCloseTo(0)
    expect(rotated.z).toBeCloseTo(-1)
  })

  it('yaw=PI/2 rotates W to move +X instead of -Z', () => {
    const moveDir = new THREE.Vector3(0, 0, -1)
    const rotated = rotateMovementByCamera(moveDir, Math.PI / 2)
    expect(rotated.x).toBeCloseTo(1)
    expect(rotated.z).toBeCloseTo(0)
  })

  it('yaw=PI rotates W to move +Z (camera behind)', () => {
    const moveDir = new THREE.Vector3(0, 0, -1)
    const rotated = rotateMovementByCamera(moveDir, Math.PI)
    expect(rotated.x).toBeCloseTo(0)
    expect(rotated.z).toBeCloseTo(1)
  })

  it('zero movement vector stays zero regardless of yaw', () => {
    const moveDir = new THREE.Vector3(0, 0, 0)
    const rotated = rotateMovementByCamera(moveDir, Math.PI / 4)
    expect(rotated.x).toBe(0)
    expect(rotated.y).toBe(0)
    expect(rotated.z).toBe(0)
  })

  it('preserves movement magnitude', () => {
    const moveDir = new THREE.Vector3(0.707, 0, -0.707) // diagonal
    const rotated = rotateMovementByCamera(moveDir, Math.PI / 3)
    expect(rotated.length()).toBeCloseTo(moveDir.length())
  })
})

describe('getCameraYawForward', () => {
  it('yaw=0 returns PI (forward is opposite of camera behind player)', () => {
    // When yaw=0, camera is behind player at +Z
    // Forward direction should be -Z, which is angle PI
    const result = getCameraYawForward(0)
    expect(result).toBeCloseTo(Math.PI)
  })

  it('yaw=PI/2 returns 3*PI/2 (forward angle rotated 90 degrees)', () => {
    // Camera at +X side (yaw=PI/2), forward should be 3*PI/2 (270 degrees)
    const result = getCameraYawForward(Math.PI / 2)
    expect(result).toBeCloseTo((3 * Math.PI) / 2)
  })

  it('yaw=PI returns 2*PI (camera in front, forward points away)', () => {
    // Camera at -Z (in front at yaw=PI), forward is 0/2*PI direction
    const result = getCameraYawForward(Math.PI)
    // atan2(0, -1) + PI = PI + PI = 2*PI
    expect(result).toBeCloseTo(2 * Math.PI)
  })

  it('yaw=-PI/2 returns PI/2 (forward angle for camera on left)', () => {
    // Camera at -X side (yaw=-PI/2), forward should be PI/2 (90 degrees)
    const result = getCameraYawForward(-Math.PI / 2)
    expect(result).toBeCloseTo(Math.PI / 2)
  })

  it('yaw=PI/4 returns 5*PI/4 (consistent forward angle)', () => {
    // Camera at 45 degrees, forward should be 225 degrees (5*PI/4)
    const result = getCameraYawForward(Math.PI / 4)
    expect(result).toBeCloseTo((5 * Math.PI) / 4)
  })

  it('yaw=-PI/4 returns 3*PI/4 (negative yaw values work correctly)', () => {
    // Camera at -45 degrees, forward is at 135 degrees (3*PI/4)
    const result = getCameraYawForward(-Math.PI / 4)
    expect(result).toBeCloseTo((3 * Math.PI) / 4)
  })

  it('result is always a valid angle in [0, 2*PI] range', () => {
    // Test various angles to ensure output is in valid range
    const testAngles = [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, (2 * Math.PI) / 3, Math.PI, -Math.PI / 2, -Math.PI / 3]

    testAngles.forEach((yaw) => {
      const result = getCameraYawForward(yaw)
      // Result should be between 0 and 2*PI (function outputs in this range)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(2 * Math.PI + 0.0001)
    })
  })

  it('rotating yaw by 180 degrees changes forward by 180 degrees', () => {
    const yaw1 = Math.PI / 4
    const yaw2 = yaw1 + Math.PI
    const forward1 = getCameraYawForward(yaw1)
    const forward2 = getCameraYawForward(yaw2)

    // Forward directions should differ by PI (180 degrees)
    const diff = Math.abs(forward1 - forward2)
    expect(diff).toBeCloseTo(Math.PI)
  })

  it('function output is consistent with trigonometric identity', () => {
    // atan2(sin(x), cos(x)) should equal x (modulo 2*PI)
    // So getCameraYawForward(yaw) should equal yaw + PI (modulo 2*PI)
    const testYaw = Math.PI / 3
    const result = getCameraYawForward(testYaw)
    const expected = testYaw + Math.PI
    expect(result).toBeCloseTo(expected)
  })
})

describe('isJumpPressed', () => {
  it('returns false when no keys pressed', () => {
    expect(isJumpPressed(new Set())).toBe(false)
  })

  it('returns true when Space is pressed', () => {
    expect(isJumpPressed(new Set(['Space']))).toBe(true)
  })

  it('returns false when only movement keys are pressed', () => {
    expect(isJumpPressed(new Set(['KeyW', 'ShiftLeft']))).toBe(false)
  })

  it('returns true when Space is pressed alongside other keys', () => {
    expect(isJumpPressed(new Set(['KeyW', 'Space', 'ShiftLeft']))).toBe(true)
  })
})

describe('applyGravity', () => {
  it('reduces velocity by gravity * delta', () => {
    const result = applyGravity(8, 20, 1 / 60)
    expect(result).toBeCloseTo(8 - 20 / 60)
  })

  it('makes velocity negative when falling', () => {
    const result = applyGravity(0, 20, 0.5)
    expect(result).toBe(-10)
  })

  it('increases downward speed when already falling', () => {
    const result = applyGravity(-5, 20, 0.1)
    expect(result).toBeCloseTo(-7)
  })

  it('returns same velocity when gravity is zero', () => {
    expect(applyGravity(5, 0, 1)).toBe(5)
  })
})

describe('computeJump', () => {
  it('rises when vertical velocity is positive', () => {
    const result = computeJump(0, 8, 20, 0, 1 / 60)
    expect(result.y).toBeGreaterThan(0)
    expect(result.grounded).toBe(false)
  })

  it('lands and resets when falling below ground', () => {
    const result = computeJump(0.05, -10, 20, 0, 1 / 60)
    // With velocity -10 and delta 1/60, new Y = 0.05 + (-10 - 20/60) * (1/60)
    // That's well below 0
    expect(result.y).toBe(0)
    expect(result.velocity).toBe(0)
    expect(result.grounded).toBe(true)
  })

  it('stays airborne above ground', () => {
    const result = computeJump(5, -2, 20, 0, 1 / 60)
    expect(result.y).toBeGreaterThan(0)
    expect(result.grounded).toBe(false)
  })

  it('gravity decelerates upward motion', () => {
    const result = computeJump(2, 8, 20, 0, 1 / 60)
    expect(result.velocity).toBeLessThan(8)
  })

  it('returns grounded at exactly ground level', () => {
    // Start at ground with no velocity
    const result = computeJump(0, 0, 20, 0, 1 / 60)
    // velocity becomes -20/60, y becomes 0 + (-20/60)*(1/60) < 0 → clamped to ground
    expect(result.y).toBe(0)
    expect(result.grounded).toBe(true)
    expect(result.velocity).toBe(0)
  })

  it('respects custom ground Y', () => {
    const result = computeJump(5.05, -10, 20, 5, 1 / 60)
    expect(result.y).toBe(5)
    expect(result.grounded).toBe(true)
  })

  it('full jump arc returns to ground', () => {
    // Simulate a full jump over many frames
    let y = 0
    let vel = 8
    const gravity = 20
    const groundY = 0
    const dt = 1 / 60
    let maxHeight = 0
    let frames = 0

    // Launch
    for (let i = 0; i < 300; i++) {
      const result = computeJump(y, vel, gravity, groundY, dt)
      y = result.y
      vel = result.velocity
      if (y > maxHeight) maxHeight = y
      frames++
      if (result.grounded && i > 0) break
    }

    expect(maxHeight).toBeGreaterThan(0.5)
    expect(y).toBe(0)
    expect(frames).toBeLessThan(300) // should land before timeout
  })

  it('cannot double jump (grounded is false while airborne)', () => {
    const launch = computeJump(0, 8, 20, 0, 1 / 60)
    expect(launch.grounded).toBe(false)
    // A second jump attempt while airborne would check isGrounded first
    // The function itself just computes physics; grounded=false prevents re-jump at call site
  })
})
