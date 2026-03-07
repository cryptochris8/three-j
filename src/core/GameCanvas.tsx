import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'
import { CAMERA } from './constants'

interface GameCanvasProps {
  children: ReactNode
}

export function GameCanvas({ children }: GameCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        fov: CAMERA.fov,
        near: CAMERA.near,
        far: CAMERA.far,
        position: CAMERA.defaultPosition,
      }}
      gl={{
        antialias: true,
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
