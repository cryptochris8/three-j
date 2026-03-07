import { describe, it, expect, beforeEach } from 'vitest'
import { useBowling } from '@/games/bowling/useBowling'
import { BOWLING_CONFIG } from '@/games/bowling/config'

describe('useBowling', () => {
  beforeEach(() => {
    useBowling.getState().resetGame()
  })

  describe('initial state', () => {
    it('starts at frame 1', () => {
      expect(useBowling.getState().currentFrame).toBe(1)
    })

    it('starts in positioning phase', () => {
      expect(useBowling.getState().phase).toBe('positioning')
    })

    it('starts with no balls thrown', () => {
      expect(useBowling.getState().ballsThisFrame).toBe(0)
    })
  })

  describe('phase transitions', () => {
    it('transitions to charging', () => {
      useBowling.getState().startCharging()
      expect(useBowling.getState().phase).toBe('charging')
    })

    it('transitions to spinning', () => {
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      expect(useBowling.getState().phase).toBe('spinning')
    })

    it('transitions to rolling on release', () => {
      useBowling.getState().startCharging()
      useBowling.getState().setPower(5)
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      expect(useBowling.getState().phase).toBe('rolling')
    })

    it('release returns power, spin, and bowlerX', () => {
      useBowling.getState().setBowlerX(1.5)
      useBowling.getState().startCharging()
      useBowling.getState().setPower(7)
      useBowling.getState().startSpinning()
      useBowling.getState().setSpinAngle(2)
      const result = useBowling.getState().release()
      expect(result).toEqual({ power: 7, spin: 2, bowlerX: 1.5 })
    })
  })

  describe('scoring', () => {
    it('detects strike on first ball all pins', () => {
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(true))
      useBowling.getState().endBall()
      expect(useBowling.getState().isStrike).toBe(true)
      expect(useBowling.getState().phase).toBe('frameover')
    })

    it('detects spare on second ball all pins', () => {
      // First ball - not all pins
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      const partialPins = Array(10).fill(false)
      partialPins[0] = true
      partialPins[1] = true
      useBowling.getState().setPinsKnocked(partialPins)
      useBowling.getState().endBall()
      // Goes back to positioning for second ball
      expect(useBowling.getState().phase).toBe('positioning')

      // Second ball - all pins
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(true))
      useBowling.getState().endBall()
      expect(useBowling.getState().isSpare).toBe(true)
    })

    it('records open frame after 2 balls', () => {
      // First ball
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked([true, true, false, false, false, false, false, false, false, false])
      useBowling.getState().endBall()

      // Second ball
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked([true, true, true, false, false, false, false, false, false, false])
      useBowling.getState().endBall()

      expect(useBowling.getState().phase).toBe('frameover')
      expect(useBowling.getState().isStrike).toBe(false)
      expect(useBowling.getState().isSpare).toBe(false)
    })
  })

  describe('nextFrame', () => {
    it('advances to next frame', () => {
      useBowling.getState().nextFrame()
      expect(useBowling.getState().currentFrame).toBe(2)
    })

    it('sets done when last frame completed', () => {
      useBowling.setState({ currentFrame: BOWLING_CONFIG.totalFrames })
      useBowling.getState().nextFrame()
      expect(useBowling.getState().phase).toBe('done')
    })
  })

  describe('bowler position', () => {
    it('sets bowler X position', () => {
      useBowling.getState().setBowlerX(2.5)
      expect(useBowling.getState().bowlerX).toBe(2.5)
    })
  })
})
