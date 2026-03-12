import { describe, it, expect, beforeEach } from 'vitest'
import { useSoccer } from '@/games/soccer/useSoccer'
import { SOCCER_CONFIG } from '@/games/soccer/config'

describe('useSoccer', () => {
  beforeEach(() => {
    useSoccer.getState().resetGame()
  })

  describe('initial state', () => {
    it('starts at kick 1', () => {
      expect(useSoccer.getState().currentKick).toBe(1)
    })

    it('starts in aiming phase', () => {
      expect(useSoccer.getState().phase).toBe('aiming')
    })

    it('starts with 0-0 score', () => {
      expect(useSoccer.getState().playerGoals).toBe(0)
      expect(useSoccer.getState().opponentGoals).toBe(0)
    })

    it('starts without keeper slowed', () => {
      expect(useSoccer.getState().keeperSlowed).toBe(false)
    })
  })

  describe('phase transitions', () => {
    it('transitions to charging on startCharging', () => {
      useSoccer.getState().startCharging()
      expect(useSoccer.getState().phase).toBe('charging')
    })

    it('transitions to flying on kick', () => {
      useSoccer.getState().startCharging()
      useSoccer.getState().setPower(10)
      useSoccer.getState().kick()
      expect(useSoccer.getState().phase).toBe('flying')
    })

    it('kick returns power and aim', () => {
      useSoccer.getState().setAim(1.5, 2.0)
      useSoccer.getState().startCharging()
      useSoccer.getState().setPower(12)
      const result = useSoccer.getState().kick()
      expect(result).toEqual({ power: 12, aimX: 1.5, aimY: 2.0 })
    })
  })

  describe('results', () => {
    it('registers goal and increments player score', () => {
      useSoccer.getState().startCharging()
      useSoccer.getState().kick()
      useSoccer.getState().registerGoal()
      expect(useSoccer.getState().playerGoals).toBe(1)
      expect(useSoccer.getState().phase).toBe('result')
      expect(useSoccer.getState().lastResult).toBe('goal')
    })

    it('registers saved and increments opponent (GK) goals', () => {
      useSoccer.getState().startCharging()
      useSoccer.getState().kick()
      useSoccer.getState().registerSaved()
      expect(useSoccer.getState().phase).toBe('result')
      expect(useSoccer.getState().lastResult).toBe('saved')
      expect(useSoccer.getState().playerGoals).toBe(0)
      expect(useSoccer.getState().opponentGoals).toBe(1)
    })

    it('registers miss', () => {
      useSoccer.getState().startCharging()
      useSoccer.getState().kick()
      useSoccer.getState().registerMiss()
      expect(useSoccer.getState().phase).toBe('result')
      expect(useSoccer.getState().lastResult).toBe('miss')
    })

    it('ignores registerGoal when not in flying phase', () => {
      useSoccer.getState().registerGoal()
      expect(useSoccer.getState().playerGoals).toBe(0)
      expect(useSoccer.getState().phase).toBe('aiming')
    })

    it('ignores duplicate registerGoal calls', () => {
      useSoccer.getState().startCharging()
      useSoccer.getState().kick()
      useSoccer.getState().registerGoal()
      useSoccer.getState().registerGoal()
      expect(useSoccer.getState().playerGoals).toBe(1)
    })

    it('miss does not increment opponent goals', () => {
      useSoccer.getState().startCharging()
      useSoccer.getState().kick()
      useSoccer.getState().registerMiss()
      expect(useSoccer.getState().opponentGoals).toBe(0)
    })
  })

  describe('nextKick', () => {
    it('advances to next kick', () => {
      useSoccer.getState().nextKick()
      expect(useSoccer.getState().currentKick).toBe(2)
      expect(useSoccer.getState().phase).toBe('aiming')
    })

    it('resets keeper slowed on next kick', () => {
      useSoccer.getState().setKeeperSlowed(true)
      useSoccer.getState().nextKick()
      expect(useSoccer.getState().keeperSlowed).toBe(false)
    })

    it('sets done when all kicks used', () => {
      useSoccer.setState({ currentKick: SOCCER_CONFIG.totalKicks })
      useSoccer.getState().nextKick()
      expect(useSoccer.getState().phase).toBe('done')
    })
  })

  describe('aim', () => {
    it('sets aim position', () => {
      useSoccer.getState().setAim(2.0, 1.5)
      expect(useSoccer.getState().aimX).toBe(2.0)
      expect(useSoccer.getState().aimY).toBe(1.5)
    })
  })

  describe('keeper slowed', () => {
    it('sets keeper slowed flag', () => {
      useSoccer.getState().setKeeperSlowed(true)
      expect(useSoccer.getState().keeperSlowed).toBe(true)
    })
  })
})
