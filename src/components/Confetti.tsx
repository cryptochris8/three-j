import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ConfettiProps {
  position: [number, number, number]
  count?: number
}

export function Confetti({ position, count = 50 }: ConfettiProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const startTime = useRef(Date.now())

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        position[0] + (Math.random() - 0.5) * 2,
        position[1] + Math.random() * 0.5,
        position[2] + (Math.random() - 0.5) * 2,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 4,
      ),
      color: new THREE.Color().setHSL(Math.random(), 0.9, 0.6),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 10,
    }))
  }, [position, count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    if (!meshRef.current) return
    const elapsed = (Date.now() - startTime.current) / 1000
    if (elapsed > 3) return

    particles.forEach((p, i) => {
      const t = elapsed
      dummy.position.set(
        p.position.x + p.velocity.x * t,
        p.position.y + p.velocity.y * t - 4.9 * t * t,
        p.position.z + p.velocity.z * t,
      )
      dummy.rotation.set(p.rotation + p.rotSpeed * t, p.rotation * 0.5, 0)
      dummy.scale.setScalar(Math.max(0, 1 - elapsed / 3))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, p.color)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.05, 0.05, 0.01]} />
      <meshStandardMaterial />
    </instancedMesh>
  )
}
