import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import {
  configureAvatarTexture,
  applyTextureToModel,
  ANIMATION_MAP,
  getAnimationConfig,
  type AnimationState,
} from '@/components/HytopiaAvatar'

describe('configureAvatarTexture', () => {
  let texture: THREE.Texture

  beforeEach(() => {
    texture = new THREE.Texture()
  })

  it('sets flipY to false for GLTF compatibility', () => {
    configureAvatarTexture(texture)
    expect(texture.flipY).toBe(false)
  })

  it('sets colorSpace to SRGB', () => {
    configureAvatarTexture(texture)
    expect(texture.colorSpace).toBe(THREE.SRGBColorSpace)
  })

  it('sets magFilter to NearestFilter for pixel art look', () => {
    configureAvatarTexture(texture)
    expect(texture.magFilter).toBe(THREE.NearestFilter)
  })

  it('sets minFilter to NearestFilter for pixel art look', () => {
    configureAvatarTexture(texture)
    expect(texture.minFilter).toBe(THREE.NearestFilter)
  })

  it('disables mipmap generation', () => {
    configureAvatarTexture(texture)
    expect(texture.generateMipmaps).toBe(false)
  })

  it('marks texture as needing update', () => {
    // Reset the version counter
    const versionBefore = texture.version
    configureAvatarTexture(texture)
    // needsUpdate increments the version
    expect(texture.version).toBeGreaterThan(versionBefore)
  })
})

describe('applyTextureToModel', () => {
  it('applies texture to mesh with MeshStandardMaterial', () => {
    const texture = new THREE.Texture()
    const material = new THREE.MeshStandardMaterial()
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material)
    const group = new THREE.Group()
    group.add(mesh)

    applyTextureToModel(group, texture)

    expect(material.map).toBe(texture)
  })

  it('applies texture to nested meshes', () => {
    const texture = new THREE.Texture()
    const mat1 = new THREE.MeshStandardMaterial()
    const mat2 = new THREE.MeshStandardMaterial()
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), mat1)
    const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(), mat2)
    const parent = new THREE.Group()
    const child = new THREE.Group()
    child.add(mesh2)
    parent.add(mesh1)
    parent.add(child)

    applyTextureToModel(parent, texture)

    expect(mat1.map).toBe(texture)
    expect(mat2.map).toBe(texture)
  })

  it('skips non-mesh nodes', () => {
    const texture = new THREE.Texture()
    const group = new THREE.Group()
    const light = new THREE.PointLight()
    group.add(light)

    // Should not throw
    applyTextureToModel(group, texture)
  })

  it('skips non-MeshStandardMaterial materials', () => {
    const texture = new THREE.Texture()
    const basicMat = new THREE.MeshBasicMaterial()
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), basicMat)
    const group = new THREE.Group()
    group.add(mesh)

    applyTextureToModel(group, texture)

    // MeshBasicMaterial does not have isMeshStandardMaterial
    expect(basicMat.map).toBeNull()
  })

  it('marks material as needing update', () => {
    const texture = new THREE.Texture()
    const material = new THREE.MeshStandardMaterial()
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material)
    const group = new THREE.Group()
    group.add(mesh)

    const versionBefore = material.version
    applyTextureToModel(group, texture)

    expect(material.version).toBeGreaterThan(versionBefore)
  })

  it('handles empty scene graph', () => {
    const texture = new THREE.Texture()
    const group = new THREE.Group()

    // Should not throw on empty group
    applyTextureToModel(group, texture)
  })
})

describe('ANIMATION_MAP', () => {
  const allStates: AnimationState[] = [
    'idle', 'walk', 'run', 'charge', 'throw',
    'kick', 'swing', 'celebrate', 'disappointed',
    'jump', 'sit', 'interact',
  ]

  it('has entries for all 12 animation states', () => {
    expect(Object.keys(ANIMATION_MAP)).toHaveLength(12)
    for (const state of allStates) {
      expect(ANIMATION_MAP[state]).toBeDefined()
    }
  })

  it('each entry has upper, lower, loop, and fullBody fields', () => {
    for (const state of allStates) {
      const config = ANIMATION_MAP[state]
      expect(typeof config.upper).toBe('string')
      expect(typeof config.lower).toBe('string')
      expect(typeof config.loop).toBe('boolean')
      expect(typeof config.fullBody).toBe('boolean')
    }
  })

  it('idle uses split-body animations (not fullBody)', () => {
    expect(ANIMATION_MAP.idle.fullBody).toBe(false)
    expect(ANIMATION_MAP.idle.upper).toBe('idle-upper')
    expect(ANIMATION_MAP.idle.lower).toBe('idle-lower')
    expect(ANIMATION_MAP.idle.loop).toBe(true)
  })

  it('walk uses split-body animations (not fullBody)', () => {
    expect(ANIMATION_MAP.walk.fullBody).toBe(false)
    expect(ANIMATION_MAP.walk.upper).toBe('walk-upper')
    expect(ANIMATION_MAP.walk.lower).toBe('walk-lower')
    expect(ANIMATION_MAP.walk.loop).toBe(true)
  })

  it('run uses split-body animations (not fullBody)', () => {
    expect(ANIMATION_MAP.run.fullBody).toBe(false)
    expect(ANIMATION_MAP.run.loop).toBe(true)
  })

  it('charge loops and is fullBody', () => {
    expect(ANIMATION_MAP.charge.loop).toBe(true)
    expect(ANIMATION_MAP.charge.fullBody).toBe(true)
  })

  it('throw does not loop', () => {
    expect(ANIMATION_MAP.throw.loop).toBe(false)
    expect(ANIMATION_MAP.throw.fullBody).toBe(true)
  })

  it('kick does not loop', () => {
    expect(ANIMATION_MAP.kick.loop).toBe(false)
    expect(ANIMATION_MAP.kick.fullBody).toBe(true)
  })

  it('swing does not loop', () => {
    expect(ANIMATION_MAP.swing.loop).toBe(false)
    expect(ANIMATION_MAP.swing.fullBody).toBe(true)
  })

  it('celebrate does not loop', () => {
    expect(ANIMATION_MAP.celebrate.loop).toBe(false)
    expect(ANIMATION_MAP.celebrate.fullBody).toBe(true)
  })

  it('disappointed does not loop', () => {
    expect(ANIMATION_MAP.disappointed.loop).toBe(false)
    expect(ANIMATION_MAP.disappointed.fullBody).toBe(true)
  })

  it('sit loops', () => {
    expect(ANIMATION_MAP.sit.loop).toBe(true)
    expect(ANIMATION_MAP.sit.fullBody).toBe(true)
  })
})

describe('getAnimationConfig', () => {
  it('returns correct config for idle', () => {
    const config = getAnimationConfig('idle')
    expect(config).toBe(ANIMATION_MAP.idle)
  })

  it('returns correct config for each animation state', () => {
    const states: AnimationState[] = [
      'idle', 'walk', 'run', 'charge', 'throw',
      'kick', 'swing', 'celebrate', 'disappointed',
      'jump', 'sit', 'interact',
    ]
    for (const state of states) {
      expect(getAnimationConfig(state)).toBe(ANIMATION_MAP[state])
    }
  })
})
