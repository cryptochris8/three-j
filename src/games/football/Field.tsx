import { FOOTBALL_CONFIG } from './config'

export function Field() {
  const { fieldWidth, fieldDepth } = FOOTBALL_CONFIG

  return (
    <group>
      {/* Green field ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -fieldDepth / 2 + 5]} receiveShadow>
        <planeGeometry args={[fieldWidth, fieldDepth]} />
        <meshStandardMaterial color="#3d8b37" roughness={0.9} />
      </mesh>

      {/* Yard lines every 5 units */}
      {[5, 10, 15, 20, 25, 30].map((dist) => (
        <mesh key={dist} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -dist + 5]}>
          <planeGeometry args={[fieldWidth - 2, 0.06]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
      ))}

      {/* Sideline markers */}
      {[-fieldWidth / 2 + 0.3, fieldWidth / 2 - 0.3].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -fieldDepth / 2 + 5]}>
          <planeGeometry args={[0.08, fieldDepth]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* End zone area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -fieldDepth + 10]}>
        <planeGeometry args={[fieldWidth - 2, 8]} />
        <meshStandardMaterial color="#2d6b2f" roughness={0.9} />
      </mesh>

      {/* Simple goal posts at far end */}
      <GoalPosts position={[0, 0, -fieldDepth + 8]} />
    </group>
  )
}

function GoalPosts({ position }: { position: [number, number, number] }) {
  const postColor = '#FFD700'
  const postRadius = 0.06
  return (
    <group position={position}>
      {/* Left upright */}
      <mesh position={[-2.5, 4, 0]} castShadow>
        <cylinderGeometry args={[postRadius, postRadius, 8, 8]} />
        <meshStandardMaterial color={postColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Right upright */}
      <mesh position={[2.5, 4, 0]} castShadow>
        <cylinderGeometry args={[postRadius, postRadius, 8, 8]} />
        <meshStandardMaterial color={postColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[postRadius, postRadius, 5, 8]} />
        <meshStandardMaterial color={postColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Center support post */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[postRadius * 1.5, postRadius * 1.5, 3, 8]} />
        <meshStandardMaterial color={postColor} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
