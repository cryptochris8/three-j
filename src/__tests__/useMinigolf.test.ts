import { describe, it, expect, beforeEach } from 'vitest'
import { useMinigolf } from '@/games/minigolf/useMinigolf'
import { MINIGOLF_CONFIG, COURSES, isBallOutOfBounds } from '@/games/minigolf/config'

describe('useMinigolf', () => {
  beforeEach(() => {
    useMinigolf.getState().resetGame()
  })

  describe('initial state', () => {
    it('starts at hole 0', () => {
      expect(useMinigolf.getState().currentHole).toBe(0)
    })

    it('starts in aiming phase', () => {
      expect(useMinigolf.getState().phase).toBe('aiming')
    })

    it('starts with 0 strokes', () => {
      expect(useMinigolf.getState().strokes).toBe(0)
      expect(useMinigolf.getState().totalStrokes).toBe(0)
    })

    it('starts at first tee position', () => {
      expect(useMinigolf.getState().lastBallPosition).toEqual(COURSES[0].teePosition)
    })
  })

  describe('putt mechanics', () => {
    it('starts drag', () => {
      useMinigolf.getState().startDrag(100, 200)
      expect(useMinigolf.getState().isDragging).toBe(true)
      expect(useMinigolf.getState().dragStartX).toBe(100)
      expect(useMinigolf.getState().dragStartY).toBe(200)
    })

    it('updates drag position', () => {
      useMinigolf.getState().startDrag(100, 200)
      useMinigolf.getState().updateDrag(150, 250)
      expect(useMinigolf.getState().dragEndX).toBe(150)
      expect(useMinigolf.getState().dragEndY).toBe(250)
    })

    it('releases putt with power based on drag distance', () => {
      useMinigolf.getState().startDrag(100, 200)
      useMinigolf.getState().updateDrag(200, 300) // distance ~141
      const result = useMinigolf.getState().releasePutt()
      expect(result.power).toBeGreaterThan(0)
      expect(useMinigolf.getState().phase).toBe('rolling')
      expect(useMinigolf.getState().strokes).toBe(1)
    })

    it('ignores putt below minimum power', () => {
      useMinigolf.getState().startDrag(100, 200)
      useMinigolf.getState().updateDrag(101, 200) // tiny drag
      const result = useMinigolf.getState().releasePutt()
      expect(result.power).toBe(0)
      expect(useMinigolf.getState().phase).toBe('aiming')
    })

    it('caps putt power at max', () => {
      useMinigolf.getState().startDrag(0, 0)
      useMinigolf.getState().updateDrag(5000, 5000) // huge drag
      const result = useMinigolf.getState().releasePutt()
      expect(result.power).toBeLessThanOrEqual(MINIGOLF_CONFIG.maxPuttPower)
    })
  })

  describe('ball stopped', () => {
    it('returns to aiming when ball stops below max strokes', () => {
      useMinigolf.getState().startDrag(100, 200)
      useMinigolf.getState().updateDrag(300, 400)
      useMinigolf.getState().releasePutt()
      useMinigolf.getState().ballStopped()
      expect(useMinigolf.getState().phase).toBe('aiming')
    })

    it('auto-advances when max strokes reached', () => {
      useMinigolf.setState({ phase: 'rolling', strokes: MINIGOLF_CONFIG.maxStrokes })
      useMinigolf.getState().ballStopped()
      expect(useMinigolf.getState().phase).toBe('holed')
      expect(useMinigolf.getState().totalStrokes).toBe(MINIGOLF_CONFIG.maxStrokes)
    })
  })

  describe('ball holed', () => {
    it('records strokes and transitions to holed', () => {
      useMinigolf.setState({ phase: 'rolling', strokes: 3 })
      useMinigolf.getState().ballHoled()
      expect(useMinigolf.getState().phase).toBe('holed')
      expect(useMinigolf.getState().strokesPerHole).toEqual([3])
      expect(useMinigolf.getState().totalStrokes).toBe(3)
    })

    it('accumulates total strokes across holes', () => {
      useMinigolf.setState({ phase: 'rolling', strokes: 2, totalStrokes: 5, strokesPerHole: [3, 2] })
      useMinigolf.getState().ballHoled()
      expect(useMinigolf.getState().totalStrokes).toBe(7)
      expect(useMinigolf.getState().strokesPerHole).toEqual([3, 2, 2])
    })
  })

  describe('water hazard', () => {
    it('adds penalty stroke and returns to aiming', () => {
      useMinigolf.setState({ phase: 'rolling', strokes: 2 })
      useMinigolf.getState().waterHazard()
      expect(useMinigolf.getState().strokes).toBe(3)
      expect(useMinigolf.getState().phase).toBe('aiming')
    })

    it('increments reset counter for ball position reset', () => {
      const before = useMinigolf.getState().resetCounter
      useMinigolf.setState({ phase: 'rolling' })
      useMinigolf.getState().waterHazard()
      expect(useMinigolf.getState().resetCounter).toBe(before + 1)
    })

    it('ignores water hazard when not rolling', () => {
      useMinigolf.setState({ phase: 'aiming', strokes: 2 })
      useMinigolf.getState().waterHazard()
      expect(useMinigolf.getState().strokes).toBe(2)
    })
  })

  describe('out of bounds', () => {
    it('returns to aiming without penalty', () => {
      useMinigolf.setState({ phase: 'rolling', strokes: 2 })
      useMinigolf.getState().outOfBounds()
      expect(useMinigolf.getState().strokes).toBe(2)
      expect(useMinigolf.getState().phase).toBe('aiming')
    })

    it('ignores when not rolling', () => {
      const counter = useMinigolf.getState().resetCounter
      useMinigolf.setState({ phase: 'aiming' })
      useMinigolf.getState().outOfBounds()
      expect(useMinigolf.getState().resetCounter).toBe(counter)
    })
  })

  describe('hole progression', () => {
    it('advances to next hole', () => {
      useMinigolf.getState().nextHole()
      expect(useMinigolf.getState().currentHole).toBe(1)
      expect(useMinigolf.getState().phase).toBe('aiming')
      expect(useMinigolf.getState().strokes).toBe(0)
    })

    it('sets ball position to next tee', () => {
      useMinigolf.getState().nextHole()
      expect(useMinigolf.getState().lastBallPosition).toEqual(COURSES[1].teePosition)
    })

    it('sets done at last hole', () => {
      useMinigolf.setState({ currentHole: COURSES.length - 1 })
      useMinigolf.getState().nextHole()
      expect(useMinigolf.getState().phase).toBe('done')
    })
  })

  describe('save ball position', () => {
    it('saves position for hazard recovery', () => {
      useMinigolf.getState().saveBallPosition([1, 0.5, -2])
      expect(useMinigolf.getState().lastBallPosition).toEqual([1, 0.5, -2])
    })
  })
})

describe('isBallOutOfBounds', () => {
  // Test with generic course dimensions (width=1.5, length=9)
  const w = 1.5
  const l = 9

  it('returns false when ball is centered on course', () => {
    expect(isBallOutOfBounds(0, 0.05, 0, w, l)).toBe(false)
  })

  it('returns false near edge but within margin', () => {
    // halfW + margin = 0.75 + 1.0 = 1.75
    expect(isBallOutOfBounds(1.5, 0.05, 0, w, l)).toBe(false)
  })

  it('returns true when ball exceeds X boundary with margin', () => {
    // halfW + margin = 0.75 + 1.0 = 1.75
    expect(isBallOutOfBounds(2.0, 0.05, 0, w, l)).toBe(true)
  })

  it('returns true when ball exceeds negative X boundary', () => {
    expect(isBallOutOfBounds(-2.0, 0.05, 0, w, l)).toBe(true)
  })

  it('returns true when ball exceeds Z boundary', () => {
    // halfL + margin = 4.5 + 1.0 = 5.5
    expect(isBallOutOfBounds(0, 0.05, 6, w, l)).toBe(true)
  })

  it('returns true when ball exceeds negative Z boundary', () => {
    expect(isBallOutOfBounds(0, 0.05, -6, w, l)).toBe(true)
  })

  it('returns true when ball falls below Y threshold', () => {
    expect(isBallOutOfBounds(0, -3, 0, w, l)).toBe(true)
  })

  it('returns false when ball is just above Y threshold', () => {
    expect(isBallOutOfBounds(0, -1.5, 0, w, l)).toBe(false)
  })

  it('returns true when both X and Z are out', () => {
    expect(isBallOutOfBounds(5, 0, 10, w, l)).toBe(true)
  })

  it('works with different course dimensions', () => {
    // Wider course (2.5 width, 11 length) — hole 9
    expect(isBallOutOfBounds(2.0, 0.05, 0, 2.5, 11)).toBe(false) // within margin
    expect(isBallOutOfBounds(2.5, 0.05, 0, 2.5, 11)).toBe(true)  // beyond margin
  })
})
