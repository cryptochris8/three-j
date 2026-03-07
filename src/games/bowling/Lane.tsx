import { RigidBody } from '@react-three/rapier'
import { BOWLING_CONFIG } from './config'

interface LaneProps {
  hasBumpers?: boolean
}

export function Lane({ hasBumpers = false }: LaneProps) {
  const { laneLength, laneWidth, gutterWidth } = BOWLING_CONFIG

  return (
    <group>
      {/* Lane surface */}
      <RigidBody type="fixed" colliders="cuboid" friction={0.15} restitution={0.1}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[laneWidth, laneLength, 0.1]} />
          <meshStandardMaterial color="#DEB887" roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Lane arrows / markers */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.001, 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}

      {/* Gutters or bumpers */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {hasBumpers ? (
            // Bumper rail
            <RigidBody type="fixed" colliders="cuboid" restitution={0.6}>
              <mesh position={[side * (laneWidth / 2 + 0.05), 0.08, 0]} castShadow>
                <boxGeometry args={[0.1, 0.16, laneLength]} />
                <meshStandardMaterial color="#FF4444" roughness={0.5} />
              </mesh>
            </RigidBody>
          ) : (
            // Gutter (lower surface)
            <RigidBody type="fixed" colliders="cuboid" friction={0.8}>
              <mesh
                position={[side * (laneWidth / 2 + gutterWidth / 2), -0.08, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
              >
                <boxGeometry args={[gutterWidth, laneLength, 0.1]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            </RigidBody>
          )}
        </group>
      ))}

      {/* Back wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.5, -laneLength / 2 - 0.2]} visible={false}>
          <boxGeometry args={[3, 1, 0.4]} />
        </mesh>
      </RigidBody>

      {/* Pin deck (darker area at end) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -7]} receiveShadow>
        <planeGeometry args={[laneWidth + 0.5, 3]} />
        <meshStandardMaterial color="#C4A882" roughness={0.4} />
      </mesh>
    </group>
  )
}
