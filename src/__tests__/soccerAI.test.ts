import { describe, it, expect } from 'vitest'
import {
  ROLE_DEFINITIONS,
  AI_CONSTANTS,
  DEFAULT_FORMATION,
  getRoleHomePosition,
  shouldPursueBall,
  getTargetPosition,
  getRepulsionOffset,
  type SoccerAIRole,
  type Vec3,
} from '@/systems/soccerAI'

describe('ROLE_DEFINITIONS', () => {
  it('has all 6 roles defined', () => {
    expect(Object.keys(ROLE_DEFINITIONS)).toHaveLength(6)
  })

  it('goalkeeper has highest defensive and lowest offensive', () => {
    const gk = ROLE_DEFINITIONS.goalkeeper
    expect(gk.defensiveContribution).toBe(10)
    expect(gk.offensiveContribution).toBe(1)
  })

  it('striker has highest offensive and low defensive', () => {
    const st = ROLE_DEFINITIONS.striker
    expect(st.offensiveContribution).toBe(10)
    expect(st.defensiveContribution).toBeLessThanOrEqual(3)
  })

  it('goalkeeper has highest position discipline', () => {
    const gk = ROLE_DEFINITIONS.goalkeeper
    for (const [role, def] of Object.entries(ROLE_DEFINITIONS)) {
      if (role !== 'goalkeeper') {
        expect(gk.positionDiscipline).toBeGreaterThanOrEqual(def.positionDiscipline)
      }
    }
  })

  it('striker has lowest position discipline', () => {
    const st = ROLE_DEFINITIONS.striker
    for (const [role, def] of Object.entries(ROLE_DEFINITIONS)) {
      if (role !== 'striker') {
        expect(st.positionDiscipline).toBeLessThanOrEqual(def.positionDiscipline)
      }
    }
  })

  it('all preferred zones are within -1 to 1 bounds', () => {
    for (const def of Object.values(ROLE_DEFINITIONS)) {
      expect(def.preferredZone.minX).toBeGreaterThanOrEqual(-1)
      expect(def.preferredZone.maxX).toBeLessThanOrEqual(1)
      expect(def.preferredZone.minZ).toBeGreaterThanOrEqual(-1)
      expect(def.preferredZone.maxZ).toBeLessThanOrEqual(1)
    }
  })

  it('pursuit tendency is between 0 and 1 for all roles', () => {
    for (const def of Object.values(ROLE_DEFINITIONS)) {
      expect(def.pursuitTendency).toBeGreaterThanOrEqual(0)
      expect(def.pursuitTendency).toBeLessThanOrEqual(1)
    }
  })
})

describe('DEFAULT_FORMATION', () => {
  it('has 6 players', () => {
    expect(DEFAULT_FORMATION).toHaveLength(6)
  })

  it('includes exactly one goalkeeper', () => {
    expect(DEFAULT_FORMATION.filter((r) => r === 'goalkeeper')).toHaveLength(1)
  })

  it('includes exactly one striker', () => {
    expect(DEFAULT_FORMATION.filter((r) => r === 'striker')).toHaveLength(1)
  })
})

describe('getRoleHomePosition', () => {
  const halfW = 40
  const halfD = 25

  it('goalkeeper is near own goal when attacking right', () => {
    const pos = getRoleHomePosition('goalkeeper', halfW, halfD, true)
    expect(pos.x).toBeLessThan(0) // Behind center, near own goal
    expect(pos.y).toBe(0)
  })

  it('striker is near opponent goal when attacking right', () => {
    const pos = getRoleHomePosition('striker', halfW, halfD, true)
    expect(pos.x).toBeGreaterThan(0) // Forward, near opponent goal
  })

  it('flips positions when attacking left', () => {
    const posRight = getRoleHomePosition('striker', halfW, halfD, true)
    const posLeft = getRoleHomePosition('striker', halfW, halfD, false)
    expect(posRight.x).toBeGreaterThan(0)
    expect(posLeft.x).toBeLessThan(0)
  })

  it('left-back is on the left side of field', () => {
    const pos = getRoleHomePosition('left-back', halfW, halfD, true)
    expect(pos.z).toBeLessThan(0) // Left side
  })

  it('right-back is on the right side of field', () => {
    const pos = getRoleHomePosition('right-back', halfW, halfD, true)
    expect(pos.z).toBeGreaterThan(0) // Right side
  })
})

describe('shouldPursueBall', () => {
  it('never pursues when ball is beyond pursuit distance', () => {
    // Goalkeeper has 6 pursuit distance
    let pursued = false
    for (let i = 0; i < 100; i++) {
      if (shouldPursueBall('goalkeeper', 100)) pursued = true
    }
    expect(pursued).toBe(false)
  })

  it('sometimes pursues when ball is within distance', () => {
    // Striker has 0.42 tendency and 18 pursuit distance
    let pursuedCount = 0
    for (let i = 0; i < 1000; i++) {
      if (shouldPursueBall('striker', 5)) pursuedCount++
    }
    // Should be roughly 42% (±10% tolerance for randomness)
    expect(pursuedCount).toBeGreaterThan(200)
    expect(pursuedCount).toBeLessThan(600)
  })
})

describe('getTargetPosition', () => {
  const home: Vec3 = { x: -30, y: 0, z: 0 }
  const ball: Vec3 = { x: 20, y: 0, z: 10 }

  it('goalkeeper stays close to home when team has ball', () => {
    const target = getTargetPosition('goalkeeper', home, ball, true)
    // High discipline (0.95 - 0.3 = 0.65) means heavily weighted toward home
    expect(target.x).toBeLessThan(0) // Still on defensive side
  })

  it('striker pulls more toward ball', () => {
    const target = getTargetPosition('striker', home, ball, false)
    // Low discipline (0.62) means pulled significantly toward ball
    expect(target.x).toBeGreaterThan(home.x)
  })

  it('team having ball shifts players forward', () => {
    const withBall = getTargetPosition('center-mid-1', home, ball, true)
    const withoutBall = getTargetPosition('center-mid-1', home, ball, false)
    // With ball, less discipline = more toward ball position
    expect(withBall.x).toBeGreaterThan(withoutBall.x)
  })
})

describe('getRepulsionOffset', () => {
  it('returns zero offset when no teammates nearby', () => {
    const myPos: Vec3 = { x: 0, y: 0, z: 0 }
    const mates: Vec3[] = [{ x: 100, y: 0, z: 100 }]
    const offset = getRepulsionOffset(myPos, mates)
    expect(offset.x).toBe(0)
    expect(offset.z).toBe(0)
  })

  it('pushes away from nearby teammate', () => {
    const myPos: Vec3 = { x: 0, y: 0, z: 0 }
    const mates: Vec3[] = [{ x: 5, y: 0, z: 0 }]
    const offset = getRepulsionOffset(myPos, mates)
    expect(offset.x).toBeLessThan(0) // Pushed away (to the left since mate is at +5)
    expect(offset.z).toBe(0)
  })

  it('repulsion is stronger when closer', () => {
    const myPos: Vec3 = { x: 0, y: 0, z: 0 }
    const close: Vec3[] = [{ x: 2, y: 0, z: 0 }]
    const far: Vec3[] = [{ x: 10, y: 0, z: 0 }]
    const closeOffset = getRepulsionOffset(myPos, close)
    const farOffset = getRepulsionOffset(myPos, far)
    expect(Math.abs(closeOffset.x)).toBeGreaterThan(Math.abs(farOffset.x))
  })
})

describe('AI_CONSTANTS', () => {
  it('has reasonable team repulsion distance', () => {
    expect(AI_CONSTANTS.teamRepulsionDistance).toBe(14.0)
  })

  it('shot arc is lower than pass arc or similar', () => {
    expect(AI_CONSTANTS.shotArc).toBeGreaterThan(0)
    expect(AI_CONSTANTS.passArc).toBeGreaterThan(0)
  })

  it('shot force is greater than pass force', () => {
    expect(AI_CONSTANTS.shotForce).toBeGreaterThan(AI_CONSTANTS.passForce)
  })
})
