import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'

const MODEL_PATH = '/models/player.gltf'
const DEFAULT_SKIN = '/skins/player-default.png'

interface HytopiaAvatarProps {
  skinUrl?: string
  isMoving?: boolean
  scale?: number
}

/** Configure a texture for pixel-art character rendering */
export function configureAvatarTexture(texture: THREE.Texture): void {
  texture.flipY = false
  texture.colorSpace = THREE.SRGBColorSpace
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true
}

/** Apply a texture to all meshes in a model scene graph */
export function applyTextureToModel(model: THREE.Object3D, texture: THREE.Texture): void {
  model.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (mat.isMeshStandardMaterial) {
        mat.map = texture
        mat.needsUpdate = true
      }
    }
  })
}

/**
 * Hytopia-style avatar loaded from player.gltf.
 *
 * Features:
 * - 74 pre-made animations (idle, walk, run, jump, combat, emotes)
 * - Skin texture swapping via skinUrl prop (256x256 Hytopia format)
 * - Proper articulated skeleton with named bones
 */
export function HytopiaAvatar({
  skinUrl = DEFAULT_SKIN,
  isMoving = false,
  scale = 1,
}: HytopiaAvatarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_PATH)
  const prevMovingRef = useRef(isMoving)

  // Clone scene per instance so each avatar can have its own skin texture
  const clone = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene)
    // Enable shadows on all meshes
    cloned.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        (node as THREE.Mesh).castShadow = true
        ;(node as THREE.Mesh).receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  // Load and apply skin texture
  const skinTexture = useTexture(skinUrl)

  useEffect(() => {
    configureAvatarTexture(skinTexture)
    applyTextureToModel(clone, skinTexture)
  }, [clone, skinTexture])

  // Set up animation mixer
  const { actions } = useAnimations(animations, groupRef)

  // Start idle animation on mount
  useEffect(() => {
    actions['idle-upper']?.reset().play()
    actions['idle-lower']?.reset().play()
  }, [actions])

  // Transition between idle and walk animations
  useEffect(() => {
    if (isMoving === prevMovingRef.current) return
    prevMovingRef.current = isMoving

    const fadeDuration = 0.2

    if (isMoving) {
      actions['idle-upper']?.fadeOut(fadeDuration)
      actions['idle-lower']?.fadeOut(fadeDuration)
      actions['walk-upper']?.reset().fadeIn(fadeDuration).play()
      actions['walk-lower']?.reset().fadeIn(fadeDuration).play()
    } else {
      actions['walk-upper']?.fadeOut(fadeDuration)
      actions['walk-lower']?.fadeOut(fadeDuration)
      actions['idle-upper']?.reset().fadeIn(fadeDuration).play()
      actions['idle-lower']?.reset().fadeIn(fadeDuration).play()
    }
  }, [isMoving, actions])

  return (
    <group ref={groupRef} scale={scale} dispose={null}>
      <primitive object={clone} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
