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

    const requestLock = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock().catch(() => {
          // Pointer lock request failed (e.g., not from user gesture) — ignore
        })
      }
    }

    // Auto-request pointer lock after a brief delay (needs user gesture context)
    // Browsers require the page to have received a user gesture first, so we
    // also listen for click as a fallback.
    const autoLockTimer = setTimeout(() => {
      requestLock()
    }, 100)

    // Re-lock on click if pointer lock was lost
    const onClick = () => requestLock()

    canvas.addEventListener('click', onClick)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      clearTimeout(autoLockTimer)
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl.domElement])

  return { yaw, pitch }
}
