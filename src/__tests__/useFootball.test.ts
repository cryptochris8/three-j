import { describe, it, expect, beforeEach } from 'vitest'
import { useFootball } from '@/games/football/useFootball'
import { FOOTBALL_CONFIG } from '@/games/football/config'

describe('useFootball', () => {
  beforeEach(() => {
    useFootball.getState().resetGame()
  })

  describe('initial state', () => {
    it('starts with correct time', () => {
      expect(useFootball.getState().timeRemaining).toBe(FOOTBALL_CONFIG.roundTimeSeconds)
    })

    it('starts with zero shots fired', () => {
      expect(useFootball.getState().shotsFired).toBe(0)
    })

    it('starts with zero targets hit', () => {
      expect(useFootball.getState().targetsHit).toBe(0)
    })

    it('starts with null shot result', () => {
      expect(useFootball.getState().shotResult).toBeNull()
    })

    it('starts with power at 0', () => {
      expect(useFootball.getState().power).toBe(0)
    })

    it('starts with isPowerCharging false', () => {
      expect(useFootball.getState().isPowerCharging).toBe(false)
    })
  })

  describe('shoot', () => {
    it('increments shotsFired', () => {
      useFootball.getState().shoot()
      expect(useFootball.getState().shotsFired).toBe(1)
    })

    it('clears shotResult on new shot', () => {
      useFootball.setState({ shotResult: 'hit' })
      useFootball.getState().shoot()
      expect(useFootball.getState().shotResult).toBeNull()
    })

    it('does not shoot when time is 0', () => {
      useFootball.setState({ timeRemaining: 0 })
      useFootball.getState().shoot()
      expect(useFootball.getState().shotsFired).toBe(0)
    })
  })

  describe('registerHit', () => {
    it('increments targetsHit', () => {
      useFootball.getState().registerHit(5)
      expect(useFootball.getState().targetsHit).toBe(1)
    })

    it('sets shotResult to hit', () => {
      useFootball.getState().registerHit(3)
      expect(useFootball.getState().shotResult).toBe('hit')
    })
  })

  describe('registerMiss', () => {
    it('sets shotResult to miss', () => {
      useFootball.getState().registerMiss()
      expect(useFootball.getState().shotResult).toBe('miss')
    })
  })

  describe('startCharging', () => {
    it('sets isPowerCharging to true', () => {
      useFootball.getState().startCharging()
      expect(useFootball.getState().isPowerCharging).toBe(true)
    })

    it('resets power to 0 when starting', () => {
      useFootball.setState({ power: 5 })
      useFootball.getState().startCharging()
      expect(useFootball.getState().power).toBe(0)
    })

    it('does not start charging when already charging', () => {
      useFootball.setState({ isPowerCharging: true, power: 7 })
      useFootball.getState().startCharging()
      expect(useFootball.getState().power).toBe(7)
    })

    it('does not start charging when time is 0', () => {
      useFootball.setState({ timeRemaining: 0 })
      useFootball.getState().startCharging()
      expect(useFootball.getState().isPowerCharging).toBe(false)
    })
  })

  describe('setPower', () => {
    it('updates power value', () => {
      useFootball.getState().setPower(5.5)
      expect(useFootball.getState().power).toBe(5.5)
    })
  })

  describe('releaseShot', () => {
    it('returns current power', () => {
      useFootball.setState({ isPowerCharging: true, power: 8 })
      const result = useFootball.getState().releaseShot()
      expect(result.power).toBe(8)
    })

    it('sets isPowerCharging to false', () => {
      useFootball.setState({ isPowerCharging: true, power: 6 })
      useFootball.getState().releaseShot()
      expect(useFootball.getState().isPowerCharging).toBe(false)
    })
  })

  describe('timer', () => {
    it('decrements time', () => {
      const initial = useFootball.getState().timeRemaining
      useFootball.getState().decrementTime()
      expect(useFootball.getState().timeRemaining).toBe(initial - 1)
    })

    it('returns true when time expires', () => {
      useFootball.setState({ timeRemaining: 1 })
      const expired = useFootball.getState().decrementTime()
      expect(expired).toBe(true)
    })

    it('returns false when time remains', () => {
      const expired = useFootball.getState().decrementTime()
      expect(expired).toBe(false)
    })
  })

  describe('resetGame', () => {
    it('resets all state to defaults', () => {
      useFootball.setState({
        timeRemaining: 10,
        shotsFired: 15,
        targetsHit: 8,
        shotResult: 'hit',
        power: 7,
        isPowerCharging: true,
      })
      useFootball.getState().resetGame()
      const s = useFootball.getState()
      expect(s.timeRemaining).toBe(FOOTBALL_CONFIG.roundTimeSeconds)
      expect(s.shotsFired).toBe(0)
      expect(s.targetsHit).toBe(0)
      expect(s.shotResult).toBeNull()
      expect(s.power).toBe(0)
      expect(s.isPowerCharging).toBe(false)
    })

    it('accepts custom time override', () => {
      useFootball.getState().resetGame(120)
      expect(useFootball.getState().timeRemaining).toBe(120)
    })
  })
})
