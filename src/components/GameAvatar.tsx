import { Suspense } from 'react'
import { HytopiaAvatar } from '@/components/HytopiaAvatar'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { AVATAR_OPTIONS, DEFAULT_SKIN_ID } from '@/core/constants'

/** Get avatar skin URL for a given skinId, with fallback to first option */
export function getAvatarSkin(skinId?: number): string {
  const option = AVATAR_OPTIONS.find((o) => o.id === (skinId ?? DEFAULT_SKIN_ID))
  return option?.path ?? AVATAR_OPTIONS[0].path
}

interface GameAvatarProps {
  position: [number, number, number]
  rotationY: number
  scale?: number
}

/**
 * In-game avatar that renders a HytopiaAvatar with the active player's skin.
 * Pure visual — no physics body or collider.
 */
export function GameAvatar({ position, rotationY, scale = 1 }: GameAvatarProps) {
  const skinId = usePlayerStore((s) => {
    const profile = s.profiles.find((p) => p.id === s.activeProfileId)
    return profile?.skinId
  })

  const skinUrl = getAvatarSkin(skinId)

  return (
    <Suspense fallback={null}>
      <group position={position} rotation={[0, rotationY, 0]}>
        <HytopiaAvatar skinUrl={skinUrl} scale={scale} />
      </group>
    </Suspense>
  )
}
