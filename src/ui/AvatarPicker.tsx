import { useState, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AVATAR_OPTIONS } from '@/core/constants'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { HytopiaAvatar } from '@/components/HytopiaAvatar'

interface AvatarPickerProps {
  profileId: number
  onClose: () => void
}

const TILE_COLORS = [
  '#FF6B6B', '#FF8E53', '#F7C948', '#4ECDC4', '#44CF6C',
  '#2196F3', '#A18CD1', '#FBC2EB', '#FF6B35', '#9C27B0',
]

/** Slowly rotating avatar for the preview */
function RotatingAvatar({ skinUrl }: { skinUrl: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.9, 0]}>
      <HytopiaAvatar skinUrl={skinUrl} scale={1} />
    </group>
  )
}

export function AvatarPicker({ profileId, onClose }: AvatarPickerProps) {
  const updateProfile = usePlayerStore((s) => s.updateProfile)
  const currentSkinId = usePlayerStore((s) => {
    const profile = s.profiles.find((p) => p.id === profileId)
    return profile?.skinId ?? 1
  })
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const previewId = hoveredId ?? currentSkinId
  const previewOption = AVATAR_OPTIONS.find((o) => o.id === previewId) ?? AVATAR_OPTIONS[0]

  return (
    <div
      onClick={onClose}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '560px',
          width: '90vw',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{
          color: '#FFFFFF',
          fontSize: '1.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '1rem',
        }}>
          Choose Your Avatar
        </h2>

        {/* 3D preview */}
        <div style={{
          width: '180px',
          height: '200px',
          margin: '0 auto 1rem',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          border: '2px solid rgba(255,255,255,0.1)',
        }}>
          <Canvas
            camera={{ position: [0, 0.2, 2.2], fov: 40 }}
            gl={{ alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 3, 2]} intensity={1.5} />
            <Suspense fallback={null}>
              <RotatingAvatar skinUrl={previewOption.path} />
            </Suspense>
          </Canvas>
        </div>

        {/* Selection grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.6rem',
          marginBottom: '1.5rem',
        }}>
          {AVATAR_OPTIONS.map((option, i) => {
            const isSelected = option.id === currentSkinId
            const isHovered = option.id === hoveredId
            const color = TILE_COLORS[i % TILE_COLORS.length]
            return (
              <button
                key={option.id}
                aria-label={option.name}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  updateProfile(profileId, { skinId: option.id })
                  onClose()
                }}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  border: isSelected
                    ? '3px solid #FFD700'
                    : isHovered
                      ? `3px solid ${color}`
                      : '3px solid rgba(255,255,255,0.15)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${color}44, ${color}22)`
                    : isHovered
                      ? `${color}22`
                      : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                  transform: isSelected || isHovered ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isSelected
                    ? '0 4px 16px rgba(255,215,0,0.3)'
                    : isHovered
                      ? `0 4px 12px ${color}44`
                      : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: isSelected || isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                }}
              >
                {option.id}
              </button>
            )
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '0.6rem 2rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
