import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { Group } from 'three'

interface ScorePopupProps {
  text: string
  position: [number, number, number]
  color?: string
  onComplete?: () => void
}

export function ScorePopup({ text, position, color = '#F7C948', onComplete }: ScorePopupProps) {
  const groupRef = useRef<Group>(null)
  const [opacity, setOpacity] = useState(1)
  const startClock = useRef(-1)

  useFrame((state) => {
    if (!groupRef.current) return
    if (startClock.current < 0) startClock.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startClock.current
    groupRef.current.position.y = position[1] + elapsed * 1.5
    const newOpacity = Math.max(0, 1 - elapsed / 1.5)
    setOpacity(newOpacity)
    if (newOpacity <= 0 && onComplete) {
      onComplete()
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Text
        fontSize={0.5}
        fontWeight={700}
        color={color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={opacity}
        outlineWidth={0.02}
        outlineColor="#000"
        outlineOpacity={opacity}
      >
        {text}
      </Text>
    </group>
  )
}
