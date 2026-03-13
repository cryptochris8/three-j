import { describe, it, expect } from 'vitest'
import {
  POSSESSION,
  createPossessionState,
  canPickup,
  getDribblePosition,
  findTackler,
  findPassTarget,
  getDirectionTo,
  getShootDirection,
  type PossessionState,
} from '@/systems/possession'

describe('createPossessionState', () => {
  it('returns null possessor', () => {
    const state = createPossessionState()
    expect(state.possessor).toBeNull()
  })

  it('returns zero cooldown', () => {
    const state = createPossessionState()
    expect(state.pickupCooldownUntil).toBe(0)
  })

  it('returns null lastPossessorType', () => {
    const state = createPossessionState()
    expect(state.lastPossessorType).toBeNull()
  })

  it('returns -1 lastPossessorIndex', () => {
    const state = createPossessionState()
    expect(state.lastPossessorIndex).toBe(-1)
  })
})

describe('canPickup', () => {
  it('returns true when no one has possession and no cooldown', () => {
    const state = createPossessionState()
    expect(canPickup(state, 'player', 0, 1000)).toBe(true)
  })

  it('returns false when someone already has possession', () => {
    const state: PossessionState = {
      possessor: { type: 'player', index: 0, facingAngle: 0 },
      pickupCooldownUntil: 0,
      lastPossessorType: null,
      lastPossessorIndex: -1,
    }
    expect(canPickup(state, 'home-ai', 0, 1000)).toBe(false)
  })

  it('blocks all entities during cooldown', () => {
    const state: PossessionState = {
      possessor: null,
      pickupCooldownUntil: 2000,
      lastPossessorType: 'player',
      lastPossessorIndex: 0,
    }
    expect(canPickup(state, 'player', 0, 1500)).toBe(false)
    expect(canPickup(state, 'home-ai', 2, 1500)).toBe(false)
    expect(canPickup(state, 'away-ai', 1, 1500)).toBe(false)
  })

  it('allows any entity after cooldown expires', () => {
    const state: PossessionState = {
      possessor: null,
      pickupCooldownUntil: 1000,
      lastPossessorType: 'player',
      lastPossessorIndex: 0,
    }
    expect(canPickup(state, 'player', 0, 1500)).toBe(true)
    expect(canPickup(state, 'home-ai', 2, 1500)).toBe(true)
  })
})

describe('getDribblePosition', () => {
  it('places ball at correct forward offset when facing north (angle=0)', () => {
    const pos = getDribblePosition(5, 10, 0, 0, false)
    expect(pos.x).toBeCloseTo(5, 1)
    expect(pos.z).toBeCloseTo(10 - POSSESSION.DRIBBLE_FORWARD, 1)
    expect(pos.y).toBeCloseTo(POSSESSION.DRIBBLE_HEIGHT, 2)
  })

  it('places ball at correct forward offset when facing east (angle=PI/2)', () => {
    const pos = getDribblePosition(5, 10, Math.PI / 2, 0, false)
    // Facing east: -sin(PI/2) = -1 on X, -cos(PI/2) ≈ 0 on Z
    expect(pos.x).toBeCloseTo(5 - POSSESSION.DRIBBLE_FORWARD, 1)
    expect(pos.z).toBeCloseTo(10, 1)
  })

  it('does not wobble when stationary', () => {
    const pos1 = getDribblePosition(0, 0, 0, 0, false)
    const pos2 = getDribblePosition(0, 0, 0, 0.5, false)
    expect(pos1.x).toBeCloseTo(pos2.x, 4)
    expect(pos1.z).toBeCloseTo(pos2.z, 4)
  })

  it('wobbles when moving', () => {
    // At t=0, sin(0)=0, but at t=0.25/freq, sin(π/2) = 1 (max wobble)
    const t = 1 / (POSSESSION.DRIBBLE_WOBBLE_FREQ * 4)
    const posNoWobble = getDribblePosition(0, 0, 0, 0, true)
    const posWobble = getDribblePosition(0, 0, 0, t, true)
    // At t=0, sin(0)=0, so no wobble. At t, there should be wobble.
    const diffX = Math.abs(posWobble.x - posNoWobble.x)
    const diffZ = Math.abs(posWobble.z - posNoWobble.z)
    expect(diffX + diffZ).toBeGreaterThan(0.01)
  })

  it('returns correct height (DRIBBLE_HEIGHT)', () => {
    const pos = getDribblePosition(0, 0, 0, 0, false)
    expect(pos.y).toBe(POSSESSION.DRIBBLE_HEIGHT)
  })
})

describe('findTackler', () => {
  it('returns -1 when no opponents are close', () => {
    const opponents = [
      { x: 100, z: 100 },
      { x: -50, z: -50 },
    ]
    expect(findTackler(0, 0, opponents, POSSESSION.TACKLE_RADIUS)).toBe(-1)
  })

  it('returns correct index when opponent is within tackle radius', () => {
    const opponents = [
      { x: 100, z: 100 },
      { x: 0.5, z: 0.5 },  // Close to ball at (0,0)
      { x: -50, z: -50 },
    ]
    expect(findTackler(0, 0, opponents, POSSESSION.TACKLE_RADIUS)).toBe(1)
  })

  it('returns first close opponent when multiple are in range', () => {
    const opponents = [
      { x: 0.3, z: 0.3 },
      { x: 0.5, z: 0.5 },
    ]
    expect(findTackler(0, 0, opponents, POSSESSION.TACKLE_RADIUS)).toBe(0)
  })

  it('returns -1 for empty opponents array', () => {
    expect(findTackler(0, 0, [], POSSESSION.TACKLE_RADIUS)).toBe(-1)
  })

  it('respects custom tackle radius', () => {
    const opponents = [{ x: 2, z: 0 }]
    expect(findTackler(0, 0, opponents, 1.5)).toBe(-1)
    expect(findTackler(0, 0, opponents, 2.5)).toBe(0)
  })
})

describe('findPassTarget', () => {
  it('picks nearest forward teammate', () => {
    const teammates = [
      { x: 0, z: -10 },  // Forward (facing north = angle 0 → dirZ = -1)
      { x: 0, z: -20 },  // Farther forward
    ]
    expect(findPassTarget(0, 0, 0, teammates)).toBe(0)
  })

  it('returns -1 when all teammates are behind', () => {
    const teammates = [
      { x: 0, z: 10 },   // Behind (facing north)
      { x: 5, z: 15 },   // Behind
    ]
    expect(findPassTarget(0, 0, 0, teammates)).toBe(-1)
  })

  it('returns -1 for empty teammates array', () => {
    expect(findPassTarget(0, 0, 0, [])).toBe(-1)
  })

  it('picks nearest when multiple are forward', () => {
    // Facing south (angle = PI): faceDirZ = -cos(PI) = 1
    const teammates = [
      { x: 0, z: 30 },   // 30 units forward
      { x: 0, z: 10 },   // 10 units forward (closer)
    ]
    expect(findPassTarget(0, 0, Math.PI, teammates)).toBe(1)
  })

  it('ignores teammates directly to the side', () => {
    // Facing north (angle = 0): faceDirX = 0, faceDirZ = -1
    // Teammate at (10, 0): dot = 0*10 + (-1)*0 = 0 → not forward (dot > 0 fails)
    const teammates = [{ x: 10, z: 0 }]
    expect(findPassTarget(0, 0, 0, teammates)).toBe(-1)
  })
})

describe('getDirectionTo', () => {
  it('returns normalized vector for cardinal direction', () => {
    const dir = getDirectionTo(0, 0, 0, 10)
    expect(dir.x).toBeCloseTo(0, 4)
    expect(dir.z).toBeCloseTo(1, 4)
  })

  it('returns normalized vector for diagonal direction', () => {
    const dir = getDirectionTo(0, 0, 10, 10)
    const len = Math.sqrt(dir.x * dir.x + dir.z * dir.z)
    expect(len).toBeCloseTo(1, 4)
  })

  it('returns zero vector when from equals to', () => {
    const dir = getDirectionTo(5, 5, 5, 5)
    expect(dir.x).toBe(0)
    expect(dir.z).toBe(0)
  })

  it('handles negative directions', () => {
    const dir = getDirectionTo(10, 10, 0, 0)
    expect(dir.x).toBeLessThan(0)
    expect(dir.z).toBeLessThan(0)
  })
})

describe('getShootDirection', () => {
  it('aims generally toward the goal Z coordinate', () => {
    // Shoot from (0, 0) toward goal at z = -45
    const dir = getShootDirection(0, 0, -45, 7.32)
    expect(dir.z).toBeLessThan(0) // Should point toward negative Z
  })

  it('returns a normalized vector', () => {
    const dir = getShootDirection(5, 10, -45, 7.32)
    const len = Math.sqrt(dir.x * dir.x + dir.z * dir.z)
    expect(len).toBeCloseTo(1, 2)
  })

  it('aims toward positive Z when goal is at positive Z', () => {
    const dir = getShootDirection(0, 0, 45, 7.32)
    expect(dir.z).toBeGreaterThan(0)
  })
})

describe('POSSESSION constants', () => {
  it('has valid pickup radius', () => {
    expect(POSSESSION.PICKUP_RADIUS).toBe(1.0)
  })

  it('tackle radius is larger than pickup radius', () => {
    expect(POSSESSION.TACKLE_RADIUS).toBeGreaterThan(POSSESSION.PICKUP_RADIUS)
  })

  it('MIN_SHOOT_FORCE is less than MAX_SHOOT_FORCE', () => {
    expect(POSSESSION.MIN_SHOOT_FORCE).toBeLessThan(POSSESSION.MAX_SHOOT_FORCE)
  })

  it('MAX_SHOOT_FORCE is greater than PASS_FORCE', () => {
    expect(POSSESSION.MAX_SHOOT_FORCE).toBeGreaterThan(POSSESSION.PASS_FORCE)
  })

  it('CHARGE_SPEED is positive', () => {
    expect(POSSESSION.CHARGE_SPEED).toBeGreaterThan(0)
  })

  it('AI shoot force is greater than AI pass force', () => {
    expect(POSSESSION.AI_SHOOT_FORCE).toBeGreaterThan(POSSESSION.AI_PASS_FORCE)
  })

  it('dribble height equals ball radius', () => {
    expect(POSSESSION.DRIBBLE_HEIGHT).toBe(0.22)
  })

  it('AI min dribble frames is positive', () => {
    expect(POSSESSION.AI_MIN_DRIBBLE).toBeGreaterThan(0)
  })
})
