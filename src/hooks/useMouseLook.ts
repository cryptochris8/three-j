import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { HUB } from '@/core/constants'

export function useMouseLook() {
  const yaw = useRef<number>(0)
  const pitch = useRef<number>(HUB.cameraPitchDefault)
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      yaw.current -= e.movementX * HUB.mouseSensitivity
      pitch.current = Math.max(
        HUB.cameraPitchMin,
        Math.min(HUB.cameraPitchMax, pitch.current - e.movementY * HUB.mouseSensitivity),
      )
    }

    const onClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
      }
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl.domElement])

  return { yaw, pitch }
}
