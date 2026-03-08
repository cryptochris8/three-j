import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BallTrailProps {
  /** Target object to follow */
  targetRef: React.RefObject<THREE.Object3D | { translation(): { x: number; y: number; z: number } } | null>
  /** Trail color */
  color?: string
  /** Max number of trail points */
  maxPoints?: number
  /** Whether the trail is actively recording */
  active?: boolean
}

/**
 * Renders a fading trail behind a moving ball.
 * Works with both Three.js objects (using position) and Rapier rigid bodies (using translation()).
 */
export function BallTrail({ targetRef, color = '#F7C948', maxPoints = 20, active = true }: BallTrailProps) {
  const positions = useRef<number[]>([])
  const geometry = useMemo(() => new THREE.BufferGeometry(), [])
  const material = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 }), [color])
  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material])

  useFrame(() => {
    if (!targetRef.current || !active) {
      positions.current = []
      return
    }

    let x: number, y: number, z: number
    const target = targetRef.current
    if ('translation' in target && typeof target.translation === 'function') {
      const pos = target.translation()
      x = pos.x; y = pos.y; z = pos.z
    } else if ('position' in target) {
      const obj = target as THREE.Object3D
      x = obj.position.x; y = obj.position.y; z = obj.position.z
    } else {
      return
    }

    positions.current.push(x, y, z)
    if (positions.current.length > maxPoints * 3) {
      positions.current = positions.current.slice(-maxPoints * 3)
    }

    if (positions.current.length >= 6) {
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions.current, 3),
      )
      geometry.attributes.position.needsUpdate = true
    }
  })

  return <primitive object={lineObj} />
}
