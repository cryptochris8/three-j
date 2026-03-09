import { useRef, useMemo, Suspense, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

// GLTF model-based decorations loaded from non-optimized (standard PNG) models

function GLTFTree({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/oak-tree.gltf')
  const clone = useMemo(() => {
    const c = scene.clone()
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) (node as THREE.Mesh).castShadow = true
    })
    return c
  }, [scene])

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.5, 2.5, 0.5]} position={[0, 2.5, 0]} />
      <primitive object={clone} scale={2} />
    </RigidBody>
  )
}

function GLTFPalmTree({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/palm-tree.gltf')
  const clone = useMemo(() => {
    const c = scene.clone()
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) (node as THREE.Mesh).castShadow = true
    })
    return c
  }, [scene])

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.3, 4, 0.3]} position={[0, 4, 0]} />
      <primitive object={clone} scale={0.6} position={[0, -4.7, 0]} />
    </RigidBody>
  )
}

function GLTFBench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const { scene } = useGLTF('/models/park-bench.gltf')
  const clone = useMemo(() => {
    const c = scene.clone()
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) (node as THREE.Mesh).castShadow = true
    })
    return c
  }, [scene])

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.8, 0.5, 0.4]} position={[0, 0.5, 0]} />
      <group rotation={[0, rotation, 0]}>
        <primitive object={clone} scale={2} />
      </group>
    </RigidBody>
  )
}

function GLTFLampPost({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/lamp-post.gltf')
  const clone = useMemo(() => {
    const c = scene.clone()
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) (node as THREE.Mesh).castShadow = true
    })
    return c
  }, [scene])

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.2, 2.5, 0.2]} position={[0, 2.5, 0]} />
      <primitive object={clone} scale={2.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} distance={8} color="#FFF5E0" />
    </RigidBody>
  )
}

function GLTFChicken({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/chicken.gltf')
  const clone = useMemo(() => {
    const c = scene.clone()
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) (node as THREE.Mesh).castShadow = true
    })
    return c
  }, [scene])

  const { actions, names } = useAnimations(animations, groupRef)

  // Play the first available animation (idle/pecking)
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]!.reset().play()
    }
  }, [actions, names])

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <primitive object={clone} scale={1.5} />
    </group>
  )
}

// Flower cluster - keep procedural (no GLTF model available)
function FlowerPatch({ position }: { position: [number, number, number] }) {
  const colors = ['#FF69B4', '#FF6347', '#FFD700', '#9370DB', '#FF69B4']
  return (
    <group position={position}>
      {colors.map((c, i) => {
        const angle = (i / colors.length) * Math.PI * 2
        const x = Math.cos(angle) * 0.3
        const z = Math.sin(angle) * 0.3
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.03, 0.3, 0.03]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshStandardMaterial color={c} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

const TREE_POSITIONS: [number, number, number][] = [
  [-25, 0, -25], [-30, 0, -5], [-20, 0, 25],
  [25, 0, -25], [30, 0, 5], [20, 0, 25],
  [-10, 0, -30], [10, 0, 30],
  [-35, 0, 15], [35, 0, -15],
]

const PALM_POSITIONS: [number, number, number][] = [
  [-28, 0, 10], [28, 0, -10],
  [-5, 0, -35], [5, 0, 35],
]

const BENCH_POSITIONS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [-8, 0, -5], rot: Math.PI / 4 },
  { pos: [8, 0, 5], rot: -Math.PI / 4 },
  { pos: [0, 0, -20], rot: 0 },
  { pos: [0, 0, 20], rot: Math.PI },
]

const LAMP_POSITIONS: [number, number, number][] = [
  [-10, 0, 0], [10, 0, 0],
  [0, 0, -15], [0, 0, 15],
  [-20, 0, -20], [20, 0, 20],
]

const FLOWER_POSITIONS: [number, number, number][] = [
  [-5, 0, -15], [12, 0, -8], [-18, 0, 8],
  [22, 0, 15], [-12, 0, 22], [8, 0, -22],
  [-30, 0, -18], [28, 0, 22],
]

export function HubDecorations() {
  return (
    <>
      <Suspense fallback={null}>
        {TREE_POSITIONS.map((pos, i) => (
          <GLTFTree key={`tree-${i}`} position={pos} />
        ))}

        {PALM_POSITIONS.map((pos, i) => (
          <GLTFPalmTree key={`palm-${i}`} position={pos} />
        ))}

        {BENCH_POSITIONS.map((b, i) => (
          <GLTFBench key={`bench-${i}`} position={b.pos} rotation={b.rot} />
        ))}

        {LAMP_POSITIONS.map((pos, i) => (
          <GLTFLampPost key={`lamp-${i}`} position={pos} />
        ))}

        {/* Animated chickens */}
        <GLTFChicken position={[-5, 0, -8]} />
        <GLTFChicken position={[7, 0, 12]} rotation={2} />
        <GLTFChicken position={[-18, 0, 15]} rotation={1.2} />
      </Suspense>

      {/* Flowers stay procedural */}
      {FLOWER_POSITIONS.map((pos, i) => (
        <FlowerPatch key={`flower-${i}`} position={pos} />
      ))}
    </>
  )
}

// Preload all GLTF models
useGLTF.preload('/models/oak-tree.gltf')
useGLTF.preload('/models/palm-tree.gltf')
useGLTF.preload('/models/park-bench.gltf')
useGLTF.preload('/models/lamp-post.gltf')
useGLTF.preload('/models/chicken.gltf')
