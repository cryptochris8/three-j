import { useRef, useImperativeHandle, forwardRef } from 'react'
import { RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { BOWLING_CONFIG, getPinPositions } from './config'

export interface PinsHandle {
  checkKnocked: () => boolean[]
  resetPins: () => void
  resetUnknocked: () => void
}

export const Pins = forwardRef<PinsHandle>(function Pins(_, ref) {
  const pinRefs = useRef<(RapierRigidBody | null)[]>([])
  const positions = useRef(getPinPositions())

  useImperativeHandle(ref, () => ({
    checkKnocked: () => {
      return pinRefs.current.map((pinRef) => {
        if (!pinRef) return true
        const rotation = pinRef.rotation()
        // A pin is "knocked" if tilted more than ~30 degrees
        const upDot = Math.abs(
          2 * (rotation.x * rotation.z + rotation.w * rotation.y)
        )
        return upDot > 0.5
      })
    },
    resetPins: () => {
      const pos = positions.current
      pinRefs.current.forEach((pinRef, i) => {
        if (!pinRef) return
        pinRef.setTranslation({ x: pos[i][0], y: pos[i][1], z: pos[i][2] }, true)
        pinRef.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
        pinRef.setLinvel({ x: 0, y: 0, z: 0 }, true)
        pinRef.setAngvel({ x: 0, y: 0, z: 0 }, true)
      })
    },
    resetUnknocked: () => {
      // Keep knocked pins away, reset standing pins
      const pos = positions.current
      pinRefs.current.forEach((pinRef, i) => {
        if (!pinRef) return
        const rotation = pinRef.rotation()
        const upDot = Math.abs(2 * (rotation.x * rotation.z + rotation.w * rotation.y))
        if (upDot <= 0.5) {
          // Still standing - reset to position
          pinRef.setTranslation({ x: pos[i][0], y: pos[i][1], z: pos[i][2] }, true)
          pinRef.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
          pinRef.setLinvel({ x: 0, y: 0, z: 0 }, true)
          pinRef.setAngvel({ x: 0, y: 0, z: 0 }, true)
        } else {
          // Knocked - move out of the way
          pinRef.setTranslation({ x: 5, y: -2, z: pos[i][2] }, true)
          pinRef.setLinvel({ x: 0, y: 0, z: 0 }, true)
          pinRef.setAngvel({ x: 0, y: 0, z: 0 }, true)
        }
      })
    },
  }))

  return (
    <group>
      {positions.current.map((pos, i) => (
        <RigidBody
          key={i}
          ref={(r) => { pinRefs.current[i] = r }}
          position={pos}
          mass={BOWLING_CONFIG.pinMass}
          restitution={BOWLING_CONFIG.pinRestitution}
          colliders="hull"
          linearDamping={0.5}
          angularDamping={0.5}
        >
          {/* Pin body */}
          <mesh castShadow>
            <cylinderGeometry args={[BOWLING_CONFIG.pinRadius, BOWLING_CONFIG.pinRadius * 0.8, BOWLING_CONFIG.pinHeight, 8]} />
            <meshStandardMaterial color="#F5F5F5" roughness={0.4} />
          </mesh>
          {/* Pin neck */}
          <mesh position={[0, BOWLING_CONFIG.pinHeight * 0.35, 0]} castShadow>
            <sphereGeometry args={[BOWLING_CONFIG.pinRadius * 0.6, 8, 8]} />
            <meshStandardMaterial color="#F5F5F5" roughness={0.4} />
          </mesh>
          {/* Red stripes */}
          <mesh position={[0, BOWLING_CONFIG.pinHeight * 0.15, 0]}>
            <cylinderGeometry args={[BOWLING_CONFIG.pinRadius * 1.01, BOWLING_CONFIG.pinRadius * 1.01, 0.02, 8]} />
            <meshStandardMaterial color="#CC0000" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
})
