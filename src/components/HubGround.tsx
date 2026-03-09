import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { HUB } from '@/core/constants'

export function HubGround() {
  const size = HUB.worldSize
  const half = size / 2
  const wallHeight = 3
  const wallThick = 1

  return (
    <>
      {/* Ground plane */}
      <RigidBody type="fixed" position={[0, 0, 0]}>
        <CuboidCollider args={[half, 0.1, half]} position={[0, -0.1, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial color="#5a8f3c" />
        </mesh>
      </RigidBody>

      {/* Decorative grid lines on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#4a7f2c"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Invisible boundary walls */}
      {/* North wall */}
      <RigidBody type="fixed" position={[0, wallHeight / 2, -half - wallThick / 2]}>
        <CuboidCollider args={[half + wallThick, wallHeight / 2, wallThick / 2]} />
      </RigidBody>
      {/* South wall */}
      <RigidBody type="fixed" position={[0, wallHeight / 2, half + wallThick / 2]}>
        <CuboidCollider args={[half + wallThick, wallHeight / 2, wallThick / 2]} />
      </RigidBody>
      {/* West wall */}
      <RigidBody type="fixed" position={[-half - wallThick / 2, wallHeight / 2, 0]}>
        <CuboidCollider args={[wallThick / 2, wallHeight / 2, half + wallThick]} />
      </RigidBody>
      {/* East wall */}
      <RigidBody type="fixed" position={[half + wallThick / 2, wallHeight / 2, 0]}>
        <CuboidCollider args={[wallThick / 2, wallHeight / 2, half + wallThick]} />
      </RigidBody>
    </>
  )
}
