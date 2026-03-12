import { describe, it, expect } from 'vitest'
import { getAvatarSkin } from '@/components/GameAvatar'
import { LEGACY_SKIN_MAP } from '@/core/constants'

describe('getAvatarSkin', () => {
  it('returns correct skin URL for legacy skinId 1', () => {
    expect(getAvatarSkin(1)).toBe('/skins/avatars/1.png')
  })

  it('maps legacy skinId 2 to edition 100', () => {
    expect(getAvatarSkin(2)).toBe('/skins/avatars/100.png')
  })

  it('maps legacy skinId 5 to edition 750', () => {
    expect(getAvatarSkin(5)).toBe('/skins/avatars/750.png')
  })

  it('maps legacy skinId 10 to edition 3000', () => {
    expect(getAvatarSkin(10)).toBe('/skins/avatars/3000.png')
  })

  it('returns first avatar when skinId is undefined (fallback)', () => {
    expect(getAvatarSkin(undefined)).toBe('/skins/avatars/1.png')
  })

  it('returns fallback for out-of-range skinId', () => {
    expect(getAvatarSkin(5000)).toBe('/skins/avatars/1.png')
    expect(getAvatarSkin(0)).toBe('/skins/avatars/1.png')
    expect(getAvatarSkin(-1)).toBe('/skins/avatars/1.png')
  })

  it('uses direct path for edition numbers > 10', () => {
    expect(getAvatarSkin(42)).toBe('/skins/avatars/42.png')
    expect(getAvatarSkin(1500)).toBe('/skins/avatars/1500.png')
    expect(getAvatarSkin(3000)).toBe('/skins/avatars/3000.png')
  })

  it('all legacy map entries produce valid paths', () => {
    for (const [key, edition] of Object.entries(LEGACY_SKIN_MAP)) {
      const result = getAvatarSkin(Number(key))
      expect(result).toBe(`/skins/avatars/${edition}.png`)
    }
  })
})
