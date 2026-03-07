import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { BASKETBALL_CONFIG } from './config'

interface HoopProps {
  onScoreSensor: () => void
  onBackboardHit: () => void
  onRimHit: () => void
}

export function Hoop({ onScoreSensor, onBackboardHit, onRimHit }: HoopProps) {
  const {
    hoopPosition,
    hoopRadius,
    backboardPosition,
    backboardWidth,
    backboardHeight,
  } = BASKETBALL_CONFIG

  return (
    <group>
      {/* Pole */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1.5, -5.5]} castShadow>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Backboard */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        onCollisionEnter={onBackboardHit}
      >
        <mesh position={backboardPosition} castShadow>
          <boxGeometry args={[backboardWidth, backboardHeight, 0.05]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.7} roughness={0.2} />
        </mesh>
      </RigidBody>

      {/* Backboard frame */}
      <mesh position={[backboardPosition[0], backboardPosition[1], backboardPosition[2] - 0.03]}>
        <boxGeometry args={[backboardWidth + 0.05, backboardHeight + 0.05, 0.02]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rim - front segment */}
      <RigidBody type="fixed" colliders="cuboid" onCollisionEnter={onRimHit}>
        <mesh position={[0, hoopPosition[1], hoopPosition[2] + hoopRadius]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial color="#FF4500" metalness={0.7} roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Rim - left segment */}
      <RigidBody type="fixed" colliders="cuboid" onCollisionEnter={onRimHit}>
        <mesh position={[-hoopRadius, hoopPosition[1], hoopPosition[2]]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial color="#FF4500" metalness={0.7} roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Rim - right segment */}
      <RigidBody type="fixed" colliders="cuboid" onCollisionEnter={onRimHit}>
        <mesh position={[hoopRadius, hoopPosition[1], hoopPosition[2]]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial color="#FF4500" metalness={0.7} roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Rim - back segment (close to backboard) */}
      <RigidBody type="fixed" colliders="cuboid" onCollisionEnter={onRimHit}>
        <mesh position={[0, hoopPosition[1], hoopPosition[2] - hoopRadius]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial color="#FF4500" metalness={0.7} roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* Visual rim ring (torus - no collision, just visual) */}
      <mesh position={hoopPosition} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[hoopRadius, 0.015, 8, 32]} />
        <meshStandardMaterial color="#FF4500" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Net (visual only) */}
      <mesh position={[hoopPosition[0], hoopPosition[1] - 0.25, hoopPosition[2]]}>
        <cylinderGeometry args={[hoopRadius * 0.9, hoopRadius * 0.5, 0.5, 12, 1, true]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.4} wireframe side={2} />
      </mesh>

      {/* Score sensor (invisible, detects ball passing through hoop) */}
      <RigidBody type="fixed" sensor onIntersectionEnter={onScoreSensor}>
        <CuboidCollider args={[hoopRadius * 0.7, 0.05, hoopRadius * 0.7]} position={[hoopPosition[0], hoopPosition[1] - 0.15, hoopPosition[2]]} />
      </RigidBody>
    </group>
  )
}
