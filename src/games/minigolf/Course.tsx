import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { Text } from '@react-three/drei'
import type { HoleConfig } from './config'
import type { Mesh } from 'three'

interface CourseProps {
  hole: HoleConfig
  onBallInHole: () => void
  onWaterHazard: () => void
}

function Windmill({ position }: { position: [number, number, number] }) {
  const bladeRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += delta * 1.5
    }
  })

  return (
    <group position={position}>
      {/* Base */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.15]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>

      {/* Rotating blades - kinematic for collision */}
      <RigidBody type="kinematicPosition" colliders="cuboid">
        <mesh ref={bladeRef} position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1, 0.08, 0.05]} />
          <meshStandardMaterial color="#E74C3C" />
        </mesh>
      </RigidBody>
    </group>
  )
}

function Bumper({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="ball" restitution={1.2} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#F7C948" emissive="#F7C948" emissiveIntensity={0.3} />
      </mesh>
    </RigidBody>
  )
}

function Ramp({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh rotation={[-0.15, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </RigidBody>
  )
}

function WaterHazard({ position, size, onEnter }: { position: [number, number, number]; size: [number, number, number]; onEnter: () => void }) {
  return (
    <group position={position}>
      {/* Visual water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[size[0], size[2]]} />
        <meshStandardMaterial color="#1E90FF" transparent opacity={0.6} />
      </mesh>
      {/* Sensor */}
      <RigidBody type="fixed" sensor onIntersectionEnter={onEnter}>
        <CuboidCollider args={[size[0] / 2, 0.05, size[2] / 2]} position={[0, 0.02, 0]} />
      </RigidBody>
    </group>
  )
}

export function Course({ hole, onBallInHole, onWaterHazard }: CourseProps) {
  const themeColor = hole.theme === 'safari' ? '#4CAF50'
    : hole.theme === 'space' ? '#2C2C54'
    : '#1E90FF'

  const groundColor = hole.theme === 'safari' ? '#2D8B2D'
    : hole.theme === 'space' ? '#1a1a3e'
    : '#1A6B5A'

  return (
    <group>
      {/* Ground / course surface */}
      <RigidBody type="fixed" colliders="cuboid" friction={0.8}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[hole.courseWidth, hole.courseLength, 0.1]} />
          <meshStandardMaterial color={groundColor} roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      {hole.walls.map((wall, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" restitution={0.6}>
          <mesh position={wall.position} rotation={wall.rotation ?? [0, 0, 0]} castShadow>
            <boxGeometry args={wall.size} />
            <meshStandardMaterial color={themeColor} roughness={0.7} />
          </mesh>
        </RigidBody>
      ))}

      {/* Hole cup */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[hole.holePosition[0], 0.001, hole.holePosition[2]]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Hole flag */}
      <mesh position={[hole.holePosition[0], 0.2, hole.holePosition[2]]}>
        <cylinderGeometry args={[0.005, 0.005, 0.4, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[hole.holePosition[0] + 0.06, 0.35, hole.holePosition[2]]}>
        <planeGeometry args={[0.12, 0.08]} />
        <meshStandardMaterial color="#E74C3C" side={2} />
      </mesh>

      {/* Hole sensor */}
      <RigidBody type="fixed" sensor onIntersectionEnter={onBallInHole}>
        <CuboidCollider
          args={[0.04, 0.03, 0.04]}
          position={[hole.holePosition[0], hole.holePosition[1], hole.holePosition[2]]}
        />
      </RigidBody>

      {/* Obstacles */}
      {hole.obstacles.map((obs, i) => {
        switch (obs.type) {
          case 'windmill':
            return <Windmill key={i} position={obs.position} />
          case 'bumper':
            return <Bumper key={i} position={obs.position} />
          case 'ramp':
            return <Ramp key={i} position={obs.position} size={obs.size ?? [1, 0.15, 1]} />
          case 'water':
            return <WaterHazard key={i} position={obs.position} size={obs.size ?? [1, 0.01, 1]} onEnter={onWaterHazard} />
          default:
            return null
        }
      })}

      {/* Fun fact sign */}
      <group position={[hole.courseWidth / 2 + 0.5, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.04}
          maxWidth={0.5}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          {hole.funFact}
        </Text>
      </group>

      {/* Hole name */}
      <Text
        position={[0, 0.5, hole.teePosition[2] + 0.5]}
        fontSize={0.15}
        fontWeight={700}
        color="#fff"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {`Hole ${hole.id}: ${hole.name}`}
      </Text>
    </group>
  )
}
