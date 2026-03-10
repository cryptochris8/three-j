import { describe, it, expect } from 'vitest'
import { getAvatarSkin } from '@/components/GameAvatar'
import { AVATAR_OPTIONS } from '@/core/constants'

describe('getAvatarSkin', () => {
  it('returns correct skin URL for skinId 1', () => {
    expect(getAvatarSkin(1)).toBe(AVATAR_OPTIONS[0].path)
  })

  it('returns correct skin URL for skinId 2', () => {
    expect(getAvatarSkin(2)).toBe(AVATAR_OPTIONS[1].path)
  })

  it('returns first option when skinId is undefined (fallback)', () => {
    expect(getAvatarSkin(undefined)).toBe(AVATAR_OPTIONS[0].path)
  })

  it('returns first option when skinId does not exist', () => {
    expect(getAvatarSkin(999)).toBe(AVATAR_OPTIONS[0].path)
  })

  it('returns correct path strings', () => {
    expect(getAvatarSkin(1)).toBe('/skins/avatars/1.png')
    expect(getAvatarSkin(5)).toBe('/skins/avatars/750.png')
    expect(getAvatarSkin(10)).toBe('/skins/avatars/3000.png')
  })
})
