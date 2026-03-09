import { useEffect, useCallback, useRef } from 'react'
import * as THREE from 'three'
import { Skybox } from '@/components/Skybox'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { PlayerController } from '@/components/PlayerController'
import { NPC } from '@/components/NPC'
import { HubGround } from '@/components/HubGround'
import { HubDecorations } from '@/components/HubDecorations'
import { useHubStore } from '@/stores/useHubStore'
import { isInRange } from '@/components/NPC'
import { useGameKeyboard } from '@/hooks/useGameKeyboard'
import { audioManager } from '@/core/AudioManager'
import { HUB } from '@/core/constants'

export function Hub() {
  useGameKeyboard()
  const setNearbyNPC = useHubStore((s) => s.setNearbyNPC)
  const playerPosRef = useRef(new THREE.Vector3())
  const nearbyRef = useRef<string | null>(null)

  useEffect(() => {
    audioManager.playMusic('hub')
    // Clear nearby NPC on unmount
    return () => {
      useHubStore.getState().setNearbyNPC(null)
    }
  }, [])

  const handlePositionChange = useCallback((pos: THREE.Vector3) => {
    playerPosRef.current.copy(pos)

    // Check NPC proximity
    let closest: (typeof HUB.npcs)[number] | null = null
    for (const npc of HUB.npcs) {
      if (isInRange(
        { x: pos.x, z: pos.z },
        { x: npc.position[0], z: npc.position[2] },
        HUB.npcInteractDistance,
      )) {
        closest = npc
        break
      }
    }

    const closestGame = closest?.game ?? null
    if (closestGame !== nearbyRef.current) {
      nearbyRef.current = closestGame
      if (closest) {
        setNearbyNPC({ game: closest.game, label: closest.label })
      } else {
        setNearbyNPC(null)
      }
    }
  }, [setNearbyNPC])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 30, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight args={['#87CEEB', '#5a8f3c', 0.4]} />
      <Skybox scene="hub" />

      <PhysicsProvider>
        <HubGround />
        <PlayerController onPositionChange={handlePositionChange} />
        {HUB.npcs.map((npc) => (
          <NPCWithProximity key={npc.game} npc={npc} />
        ))}
        <HubDecorations />
      </PhysicsProvider>
    </>
  )
}

/** Wrapper that checks proximity for NPC highlighting */
function NPCWithProximity({ npc }: {
  npc: (typeof HUB.npcs)[number]
}) {
  const nearbyNPC = useHubStore((s) => s.nearbyNPC)
  const isNearby = nearbyNPC?.game === npc.game

  return (
    <NPC
      game={npc.game}
      label={npc.label}
      position={npc.position as [number, number, number]}
      color={npc.color}
      skinUrl={npc.skinUrl}
      isNearby={isNearby}
    />
  )
}
