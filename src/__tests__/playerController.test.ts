import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import {
  calculateMoveDirection,
  clampToWorld,
  calculateCameraPosition,
  lerpAngle,
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
