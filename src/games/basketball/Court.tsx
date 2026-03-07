import { RigidBody } from '@react-three/rapier'
import { BASKETBALL_CONFIG } from './config'

export function Court() {
  const { courtWidth, courtLength } = BASKETBALL_CONFIG

  return (
    <group>
      {/* Court floor */}
      <RigidBody type="fixed" colliders="cuboid" restitution={0.5}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[courtWidth, courtLength, 0.1]} />
          <meshStandardMaterial color="#C68642" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Court lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[courtWidth - 0.5, courtLength - 0.5]} />
        <meshStandardMaterial color="#B5763A" roughness={0.9} />
      </mesh>

      {/* Free throw line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -1]} receiveShadow>
        <planeGeometry args={[3.6, 0.05]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Three point arc - simplified as a box */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <ringGeometry args={[5.8, 5.85, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Side walls (invisible physics barriers) */}
      <RigidBody type="fixed" colliders="cuboid" position={[-courtWidth / 2, 2, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[0.2, 4, courtLength]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[courtWidth / 2, 2, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[0.2, 4, courtLength]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[0, 2, -courtLength / 2]}>
        <mesh visible={false}>
          <boxGeometry args={[courtWidth, 4, 0.2]} />
        </mesh>
      </RigidBody>
    </group>
  )
}
