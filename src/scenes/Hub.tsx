import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, ContactShadows, Html } from '@react-three/drei'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import type { Scene } from '@/types'
import type { Mesh } from 'three'

const PORTALS: { game: Scene; label: string; color: string; position: [number, number, number]; unlockLabel: string }[] = [
  { game: 'basketball', label: 'Basketball', color: '#FF6B35', position: [-6, 0, -6], unlockLabel: '' },
  { game: 'soccer', label: 'Soccer', color: '#4CAF50', position: [6, 0, -6], unlockLabel: '3 Stars' },
  { game: 'bowling', label: 'Bowling', color: '#2196F3', position: [-6, 0, 6], unlockLabel: '8 Stars' },
  { game: 'minigolf', label: 'Mini-Golf', color: '#9C27B0', position: [6, 0, 6], unlockLabel: '15 Stars' },
]

function Portal({ game, label, color, position, unlockLabel }: typeof PORTALS[number]) {
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const setScene = useGameStore((s) => s.setScene)
  const isUnlocked = useProgressStore((s) => s.isGameUnlocked(game))
  const { gl } = useThree()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      glowRef.current.scale.setScalar(scale)
    }
  })

  const handleClick = () => {
    if (isUnlocked) setScene(game)
  }

  const handlePointerOver = () => {
    if (isUnlocked) {
      setHovered(true)
      gl.domElement.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = () => {
    setHovered(false)
    gl.domElement.style.cursor = 'default'
  }

  const portalColor = isUnlocked ? color : '#555'
  const emissiveIntensity = isUnlocked ? (hovered ? 2 : 0.5) : 0

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2.2, 0.1, 32]} />
        <meshStandardMaterial color={portalColor} opacity={0.8} transparent />
      </mesh>

      <mesh ref={glowRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={portalColor}
          emissive={portalColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <mesh
        ref={meshRef}
        position={[0, 1.5, 0]}
        castShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={portalColor}
          emissive={portalColor}
          emissiveIntensity={hovered ? 1.5 : 0.3}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        fontWeight={700}
        color={isUnlocked ? '#fff' : '#888'}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        {label}
      </Text>

      {!isUnlocked && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#F7C948"
          anchorX="center"
          anchorY="bottom"
        >
          {unlockLabel} to Unlock
        </Text>
      )}
    </group>
  )
}

function HubGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#2D5A27" roughness={0.9} />
    </mesh>
  )
}

function AcademyTitle() {
  return (
    <group position={[0, 5, -12]}>
      <Text
        fontSize={1.5}
        fontWeight={700}
        color="#FF6B35"
        anchorX="center"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        Three-J Sports Academy
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.5}
        color="#87CEEB"
        anchorX="center"
      >
        Choose Your Game!
      </Text>
    </group>
  )
}

function HubUI() {
  const setScene = useGameStore((s) => s.setScene)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const profile = usePlayerStore((s) => s.getActiveProfile())
  const totalStars = useProgressStore((s) => s.totalStars)
  const isGameUnlocked = useProgressStore((s) => s.isGameUnlocked)

  const handleBackToMenu = () => {
    useGameStore.getState().setScene('menu')
    setGamePhase('menu')
  }

  return (
    <div style={{ pointerEvents: 'none' }}>
      {/* Top bar: player info */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>{profile?.avatar ?? '?'}</span>
          <div>
            <div style={{ fontWeight: 600 }}>{profile?.name ?? 'Player'}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Age {profile?.age ?? '?'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <div style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>STARS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F7C948' }}>{totalStars}</div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>COINS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F7C948' }}>{profile?.coins ?? 0}</div>
          </div>
        </div>
      </div>

      {/* Bottom: quick travel buttons */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.6rem',
        pointerEvents: 'auto',
      }}>
        {PORTALS.map((p) => {
          const unlocked = isGameUnlocked(p.game)
          return (
            <button
              key={p.game}
              onClick={() => unlocked && setScene(p.game)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: unlocked ? p.color : 'rgba(100,100,100,0.5)',
                color: unlocked ? '#fff' : '#888',
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.5,
                border: 'none',
              }}
            >
              {p.label}
            </button>
          )
        })}
        <button
          onClick={handleBackToMenu}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
          }}
        >
          Menu
        </button>
      </div>
    </div>
  )
}

export function Hub() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <Skybox scene="hub" />
      <fog attach="fog" args={['#87CEEB', 30, 60]} />

      <HubGround />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={50} blur={2} />
      <AcademyTitle />

      {PORTALS.map((portal) => (
        <Portal key={portal.game} {...portal} />
      ))}

      <Html fullscreen>
        <HubUI />
      </Html>
    </>
  )
}
