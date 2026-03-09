import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import {
  configureAvatarTexture,
  applyTextureToModel,
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
