import { describe, it, expect, beforeEach } from 'vitest'
import { useBasketball } from '@/games/basketball/useBasketball'
import { BASKETBALL_CONFIG } from '@/games/basketball/config'

describe('useBasketball', () => {
  beforeEach(() => {
    useBasketball.getState().resetGame()
  })

  describe('initial state', () => {
    it('starts with correct shots remaining', () => {
      expect(useBasketball.getState().shotsRemaining).toBe(BASKETBALL_CONFIG.totalShots)
    })

    it('starts with correct time', () => {
      expect(useBasketball.getState().timeRemaining).toBe(BASKETBALL_CONFIG.roundTimeSeconds)
    })

    it('starts not charging or flying', () => {
      expect(useBasketball.getState().isPowerCharging).toBe(false)
      expect(useBasketball.getState().isBallFlying).toBe(false)
    })
  })

  describe('aim', () => {
    it('sets aim angle', () => {
      useBasketball.getState().setAimAngle(15)
      expect(useBasketball.getState().aimAngle).toBe(15)
    })
  })

  describe('charging and shooting', () => {
    it('starts charging', () => {
      useBasketball.getState().startCharging()
      expect(useBasketball.getState().isPowerCharging).toBe(true)
    })

    it('does not charge when ball is flying', () => {
      useBasketball.setState({ isBallFlying: true })
      useBasketball.getState().startCharging()
      expect(useBasketball.getState().isPowerCharging).toBe(false)
    })

    it('does not charge when no shots remaining', () => {
      useBasketball.setState({ shotsRemaining: 0 })
      useBasketball.getState().startCharging()
      expect(useBasketball.getState().isPowerCharging).toBe(false)
    })

    it('sets power', () => {
      useBasketball.getState().setPower(8)
      expect(useBasketball.getState().power).toBe(8)
    })

    it('shoot returns power and angle, decrements shots', () => {
      useBasketball.getState().setPower(7)
      useBasketball.getState().setAimAngle(10)
      const result = useBasketball.getState().shoot()
      expect(result).toEqual({ power: 7, aimAngle: 10 })
      expect(useBasketball.getState().shotsRemaining).toBe(BASKETBALL_CONFIG.totalShots - 1)
      expect(useBasketball.getState().isBallFlying).toBe(true)
      expect(useBasketball.getState().isPowerCharging).toBe(false)
    })
  })

  describe('scoring', () => {
    it('registers swish (no backboard or rim hit)', () => {
      useBasketball.setState({ isBallFlying: true })
      const result = useBasketball.getState().registerScore()
      expect(result).toBe('swish')
      expect(useBasketball.getState().isBallFlying).toBe(false)
    })

    it('registers backboard hit', () => {
      useBasketball.setState({ isBallFlying: true })
      useBasketball.getState().registerBackboardHit()
      const result = useBasketball.getState().registerScore()
      expect(result).toBe('backboard')
    })

    it('registers rim hit', () => {
      useBasketball.setState({ isBallFlying: true })
      useBasketball.getState().registerRimHit()
      const result = useBasketball.getState().registerScore()
      expect(result).toBe('rim')
    })

    it('registers miss', () => {
      useBasketball.setState({ isBallFlying: true })
      useBasketball.getState().registerMiss()
      expect(useBasketball.getState().shotResult).toBe('miss')
      expect(useBasketball.getState().isBallFlying).toBe(false)
    })
  })

  describe('resetBall', () => {
    it('resets ball state', () => {
      useBasketball.setState({ isBallFlying: true, shotResult: 'swish', hitBackboard: true, hitRim: true, power: 8 })
      useBasketball.getState().resetBall()
      const s = useBasketball.getState()
      expect(s.isBallFlying).toBe(false)
      expect(s.shotResult).toBeNull()
      expect(s.hitBackboard).toBe(false)
      expect(s.hitRim).toBe(false)
      expect(s.power).toBe(0)
    })
  })

  describe('timer', () => {
    it('decrements time', () => {
      const initial = useBasketball.getState().timeRemaining
      useBasketball.getState().decrementTime()
      expect(useBasketball.getState().timeRemaining).toBe(initial - 1)
    })

    it('returns true when time expires', () => {
      useBasketball.setState({ timeRemaining: 1 })
      const expired = useBasketball.getState().decrementTime()
      expect(expired).toBe(true)
    })

    it('returns false when time remains', () => {
      const expired = useBasketball.getState().decrementTime()
      expect(expired).toBe(false)
    })
  })
})
