import { describe, it, expect, beforeEach } from 'vitest'
import { useArchery } from '@/games/archery/useArchery'
import { ARCHERY_CONFIG } from '@/games/archery/config'

describe('useArchery', () => {
  beforeEach(() => {
    useArchery.getState().resetGame()
  })

  describe('initial state', () => {
    it('starts with correct time', () => {
      expect(useArchery.getState().timeRemaining).toBe(ARCHERY_CONFIG.roundTimeSeconds)
    })

    it('starts with zero shots fired', () => {
      expect(useArchery.getState().shotsFired).toBe(0)
    })

    it('starts with zero targets hit', () => {
      expect(useArchery.getState().targetsHit).toBe(0)
    })

    it('starts with null shot result', () => {
      expect(useArchery.getState().shotResult).toBeNull()
    })

    it('starts with power at 0', () => {
      expect(useArchery.getState().power).toBe(0)
    })

    it('starts with isPowerCharging false', () => {
      expect(useArchery.getState().isPowerCharging).toBe(false)
    })
  })

  describe('shoot', () => {
    it('increments shotsFired', () => {
      useArchery.getState().shoot()
      expect(useArchery.getState().shotsFired).toBe(1)
    })

    it('clears shotResult on new shot', () => {
      useArchery.setState({ shotResult: 'hit' })
      useArchery.getState().shoot()
      expect(useArchery.getState().shotResult).toBeNull()
    })

    it('does not shoot when time is 0', () => {
      useArchery.setState({ timeRemaining: 0 })
      useArchery.getState().shoot()
      expect(useArchery.getState().shotsFired).toBe(0)
    })
  })

  describe('registerHit', () => {
    it('increments targetsHit', () => {
      useArchery.getState().registerHit(5)
      expect(useArchery.getState().targetsHit).toBe(1)
    })

    it('sets shotResult to hit', () => {
      useArchery.getState().registerHit(3)
      expect(useArchery.getState().shotResult).toBe('hit')
    })
  })

  describe('registerMiss', () => {
    it('sets shotResult to miss', () => {
      useArchery.getState().registerMiss()
      expect(useArchery.getState().shotResult).toBe('miss')
    })
  })

  describe('startCharging', () => {
    it('sets isPowerCharging to true', () => {
      useArchery.getState().startCharging()
      expect(useArchery.getState().isPowerCharging).toBe(true)
    })

    it('resets power to 0 when starting', () => {
      useArchery.setState({ power: 5 })
      useArchery.getState().startCharging()
      expect(useArchery.getState().power).toBe(0)
    })

    it('does not start charging when already charging', () => {
      useArchery.setState({ isPowerCharging: true, power: 7 })
      useArchery.getState().startCharging()
      // power should not be reset since startCharging was guarded
      expect(useArchery.getState().power).toBe(7)
    })

    it('does not start charging when time is 0', () => {
      useArchery.setState({ timeRemaining: 0 })
      useArchery.getState().startCharging()
      expect(useArchery.getState().isPowerCharging).toBe(false)
    })
  })

  describe('setPower', () => {
    it('updates power value', () => {
      useArchery.getState().setPower(5.5)
      expect(useArchery.getState().power).toBe(5.5)
    })
  })

  describe('releaseShot', () => {
    it('returns current power', () => {
      useArchery.setState({ isPowerCharging: true, power: 8 })
      const result = useArchery.getState().releaseShot()
      expect(result.power).toBe(8)
    })

    it('sets isPowerCharging to false', () => {
      useArchery.setState({ isPowerCharging: true, power: 6 })
      useArchery.getState().releaseShot()
      expect(useArchery.getState().isPowerCharging).toBe(false)
    })
  })

  describe('timer', () => {
    it('decrements time', () => {
      const initial = useArchery.getState().timeRemaining
      useArchery.getState().decrementTime()
      expect(useArchery.getState().timeRemaining).toBe(initial - 1)
    })

    it('returns true when time expires', () => {
      useArchery.setState({ timeRemaining: 1 })
      const expired = useArchery.getState().decrementTime()
      expect(expired).toBe(true)
    })

    it('returns false when time remains', () => {
      const expired = useArchery.getState().decrementTime()
      expect(expired).toBe(false)
    })
  })

  describe('resetGame', () => {
    it('resets all state to defaults', () => {
      useArchery.setState({
        timeRemaining: 10,
        shotsFired: 15,
        targetsHit: 8,
        shotResult: 'hit',
        power: 7,
        isPowerCharging: true,
      })
      useArchery.getState().resetGame()
      const s = useArchery.getState()
      expect(s.timeRemaining).toBe(ARCHERY_CONFIG.roundTimeSeconds)
      expect(s.shotsFired).toBe(0)
      expect(s.targetsHit).toBe(0)
      expect(s.shotResult).toBeNull()
      expect(s.power).toBe(0)
      expect(s.isPowerCharging).toBe(false)
    })

    it('accepts custom time override', () => {
      useArchery.getState().resetGame(120)
      expect(useArchery.getState().timeRemaining).toBe(120)
    })
  })
})
