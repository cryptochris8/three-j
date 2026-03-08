import { describe, it, expect, beforeEach } from 'vitest'
import { useBowling } from '@/games/bowling/useBowling'
import { BOWLING_CONFIG } from '@/games/bowling/config'

describe('bowling scoring rules', () => {
  beforeEach(() => {
    useBowling.getState().resetGame()
  })

  describe('strike', () => {
    it('awards strike points (15) for all pins on first ball', () => {
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(true))
      useBowling.getState().endBall()

      expect(useBowling.getState().isStrike).toBe(true)
      expect(useBowling.getState().frameScores).toEqual([BOWLING_CONFIG.strikePoints])
    })
  })

  describe('spare', () => {
    it('awards spare points (10) for all pins on second ball', () => {
      // First ball: knock down 7 pins
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      const firstBall = [true, true, true, true, true, true, true, false, false, false]
      useBowling.getState().setPinsKnocked(firstBall)
      useBowling.getState().endBall()

      // Second ball: all pins down
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(true))
      useBowling.getState().endBall()

      expect(useBowling.getState().isSpare).toBe(true)
      expect(useBowling.getState().frameScores).toEqual([BOWLING_CONFIG.sparePoints])
    })
  })

  describe('open frame', () => {
    it('awards 1 point per pin knocked in open frame', () => {
      // First ball: 3 pins
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked([true, true, true, false, false, false, false, false, false, false])
      useBowling.getState().endBall()

      // Second ball: 5 pins total (still open)
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked([true, true, true, true, true, false, false, false, false, false])
      useBowling.getState().endBall()

      expect(useBowling.getState().isStrike).toBe(false)
      expect(useBowling.getState().isSpare).toBe(false)
      expect(useBowling.getState().frameScores).toEqual([5 * BOWLING_CONFIG.pinPoint])
    })
  })

  describe('gutter ball', () => {
    it('scores 0 for no pins knocked', () => {
      // First ball: 0
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(false))
      useBowling.getState().endBall()

      // Second ball: 0
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(false))
      useBowling.getState().endBall()

      expect(useBowling.getState().frameScores).toEqual([0])
    })
  })

  describe('frame accumulation', () => {
    it('accumulates scores across frames', () => {
      // Frame 1: Strike
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked(Array(10).fill(true))
      useBowling.getState().endBall()

      // Move to frame 2
      useBowling.getState().nextFrame()

      // Frame 2: Open with 4 pins
      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked([true, true, false, false, false, false, false, false, false, false])
      useBowling.getState().endBall()

      useBowling.getState().startCharging()
      useBowling.getState().startSpinning()
      useBowling.getState().release()
      useBowling.getState().setPinsKnocked([true, true, true, true, false, false, false, false, false, false])
      useBowling.getState().endBall()

      expect(useBowling.getState().frameScores).toEqual([BOWLING_CONFIG.strikePoints, 4])
    })
  })

  describe('10-frame game', () => {
    it('has 10 total frames', () => {
      expect(BOWLING_CONFIG.totalFrames).toBe(10)
    })

    it('game ends after last frame', () => {
      useBowling.setState({ currentFrame: BOWLING_CONFIG.totalFrames })
      useBowling.getState().nextFrame()
      expect(useBowling.getState().phase).toBe('done')
    })
  })

  describe('scoring constants', () => {
    it('strike = 15 points', () => {
      expect(BOWLING_CONFIG.strikePoints).toBe(15)
    })

    it('spare = 10 points', () => {
      expect(BOWLING_CONFIG.sparePoints).toBe(10)
    })

    it('pin = 1 point', () => {
      expect(BOWLING_CONFIG.pinPoint).toBe(1)
    })
  })
})
