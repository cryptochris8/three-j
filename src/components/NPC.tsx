import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { HytopiaAvatar } from './HytopiaAvatar'
import type { Scene } from '@/types'

/** Pure function: check if player is in interaction range of NPC */
export function isInRange(
  playerPos: { x: number; z: number },
  npcPos: { x: number; z: number },
  distance: number,
): boolean {
  const dx = playerPos.x - npcPos.x
  const dz = playerPos.z - npcPos.z
  return dx * dx + dz * dz <= distance * distance
}

interface NPCProps {
  game: Scene
  label: string
  position: [number, number, number]
  color: string
  skinUrl?: string
  isNearby: boolean
}

export function NPC({ label, position, color, skinUrl, isNearby }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Idle bobbing animation
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.08
  })

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <group ref={groupRef}>
        <HytopiaAvatar skinUrl={skinUrl} scale={1.2} animation={isNearby ? 'interact' : 'idle'} />

        {/* Floating label - uses drei Text (native R3F, no DOM) */}
        <Billboard position={[0, 2.6, 0]}>
          <Text
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </Billboard>

        {/* Glowing base ring to mark NPC */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.8, 1.1, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isNearby ? 0.8 : 0.3}
            transparent
            opacity={isNearby ? 0.9 : 0.5}
          />
        </mesh>
      </group>
    </RigidBody>
  )
}
