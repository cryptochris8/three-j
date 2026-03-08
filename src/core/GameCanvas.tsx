import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'
import { CAMERA } from './constants'
import { useSettingsStore } from '@/stores/useSettingsStore'

const QUALITY_SETTINGS = {
  low:    { dpr: [1, 1]   as [number, number], shadows: false, antialias: false },
  medium: { dpr: [1, 1.5] as [number, number], shadows: true,  antialias: false },
  high:   { dpr: [1, 2]   as [number, number], shadows: true,  antialias: true  },
} as const

interface GameCanvasProps {
  children: ReactNode
}

export function GameCanvas({ children }: GameCanvasProps) {
  const graphicsQuality = useSettingsStore((s) => s.graphicsQuality)
  const quality = QUALITY_SETTINGS[graphicsQuality]

  return (
    <Canvas
      shadows={quality.shadows}
      dpr={quality.dpr}
      camera={{
        fov: CAMERA.fov,
        near: CAMERA.near,
        far: CAMERA.far,
        position: CAMERA.defaultPosition,
      }}
      gl={{
        antialias: quality.antialias,
        powerPreference: 'high-performance',
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
