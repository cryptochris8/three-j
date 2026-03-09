import { describe, it, expect, beforeEach } from 'vitest'
import { isInRange } from '@/components/NPC'
import { useHubStore } from '@/stores/useHubStore'

describe('isInRange', () => {
  it('returns true when player is at NPC position', () => {
    expect(isInRange({ x: 10, z: 5 }, { x: 10, z: 5 }, 4)).toBe(true)
  })

  it('returns true when player is within distance', () => {
    expect(isInRange({ x: 12, z: 5 }, { x: 10, z: 5 }, 4)).toBe(true)
  })

  it('returns false when player is outside distance', () => {
    expect(isInRange({ x: 20, z: 5 }, { x: 10, z: 5 }, 4)).toBe(false)
  })

  it('returns true at exact boundary distance', () => {
    expect(isInRange({ x: 14, z: 5 }, { x: 10, z: 5 }, 4)).toBe(true)
  })

  it('returns false just outside boundary', () => {
    expect(isInRange({ x: 14.01, z: 5 }, { x: 10, z: 5 }, 4)).toBe(false)
  })

  it('handles diagonal distance correctly', () => {
    // Distance of 3 on X and 4 on Z = 5 (3-4-5 triangle)
    expect(isInRange({ x: 3, z: 4 }, { x: 0, z: 0 }, 5)).toBe(true)
    expect(isInRange({ x: 3, z: 4 }, { x: 0, z: 0 }, 4.9)).toBe(false)
  })

  it('handles negative coordinates', () => {
    expect(isInRange({ x: -15, z: -10 }, { x: -15, z: -10 }, 4)).toBe(true)
    expect(isInRange({ x: -13, z: -10 }, { x: -15, z: -10 }, 4)).toBe(true)
    expect(isInRange({ x: -5, z: -10 }, { x: -15, z: -10 }, 4)).toBe(false)
  })

  it('returns true with zero distance only at exact position', () => {
    expect(isInRange({ x: 10, z: 5 }, { x: 10, z: 5 }, 0)).toBe(true)
    expect(isInRange({ x: 10.001, z: 5 }, { x: 10, z: 5 }, 0)).toBe(false)
  })
})

describe('useHubStore', () => {
  beforeEach(() => {
    useHubStore.setState({ nearbyNPC: null })
  })

  it('starts with no nearby NPC', () => {
    expect(useHubStore.getState().nearbyNPC).toBeNull()
  })

  it('sets nearby NPC', () => {
    useHubStore.getState().setNearbyNPC({ game: 'basketball', label: 'Basketball' })
    expect(useHubStore.getState().nearbyNPC).toEqual({ game: 'basketball', label: 'Basketball' })
  })

  it('clears nearby NPC', () => {
    useHubStore.getState().setNearbyNPC({ game: 'soccer', label: 'Soccer' })
    useHubStore.getState().setNearbyNPC(null)
    expect(useHubStore.getState().nearbyNPC).toBeNull()
  })

  it('replaces nearby NPC when switching', () => {
    useHubStore.getState().setNearbyNPC({ game: 'basketball', label: 'Basketball' })
    useHubStore.getState().setNearbyNPC({ game: 'soccer', label: 'Soccer' })
    expect(useHubStore.getState().nearbyNPC?.game).toBe('soccer')
  })
})

describe('adjustColor', () => {
  // Import the utility function from MinecraftAvatar
  it('adjusts color brightness', async () => {
    const { adjustColor } = await import('@/components/MinecraftAvatar')
    expect(adjustColor('#ff8080', -30)).toBe('#e16262')
  })

  it('clamps to 0 for very dark adjustments', async () => {
    const { adjustColor } = await import('@/components/MinecraftAvatar')
    const result = adjustColor('#101010', -30)
    expect(result).toBe('#000000')
  })

  it('clamps to 255 for very bright adjustments', async () => {
    const { adjustColor } = await import('@/components/MinecraftAvatar')
    const result = adjustColor('#f0f0f0', 30)
    expect(result).toBe('#ffffff')
  })
})
