import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { audioManager } from '@/core/AudioManager'
import { AchievementsPanel } from '@/ui/AchievementsPanel'
import { ShopPanel } from '@/ui/ShopPanel'
import { StatsPanel } from '@/ui/StatsPanel'
import { DailyChallenges } from '@/ui/DailyChallenges'
import { GAME_MODES } from '@/systems/gameModes'
import type { Scene, Difficulty } from '@/types'
import type { Mesh, Group } from 'three'

const GAMES: { game: Scene; label: string; emoji: string; color: string; unlockStars: number }[] = [
  { game: 'basketball', label: 'Basketball', emoji: '🏀', color: '#FF6B35', unlockStars: 0 },
  { game: 'soccer', label: 'Soccer', emoji: '⚽', color: '#4CAF50', unlockStars: 3 },
  { game: 'bowling', label: 'Bowling', emoji: '🎳', color: '#2196F3', unlockStars: 8 },
  { game: 'minigolf', label: 'Mini-Golf', emoji: '⛳', color: '#9C27B0', unlockStars: 15 },
]

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: '#2ECC71' },
  { value: 'medium', label: 'Medium', color: '#F7C948' },
  { value: 'hard', label: 'Hard', color: '#E74C3C' },
]

function FloatingOrbs() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {GAMES.map((g, i) => {
        const angle = (i / GAMES.length) * Math.PI * 2 - Math.PI / 4
        const x = Math.cos(angle) * 8
        const z = Math.sin(angle) * 8
        return <FloatingOrb key={g.game} color={g.color} position={[x, 2 + Math.sin(i) * 0.5, z]} />
      })}
    </group>
  )
}

function FloatingOrb({ color, position }: { color: string; position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.3}
      />
    </mesh>
  )
}

function HubUI() {
  const setScene = useGameStore((s) => s.setScene)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const setSelectedDifficulty = useGameStore((s) => s.setSelectedDifficulty)
  const gameMode = useGameStore((s) => s.gameMode)
  const setGameMode = useGameStore((s) => s.setGameMode)
  const profile = usePlayerStore((s) => s.getActiveProfile())
  const totalStars = useProgressStore((s) => s.totalStars)
  const achievements = useProgressStore((s) => s.achievements)
  const isGameUnlocked = useProgressStore((s) => s.isGameUnlocked)

  const [showAchievements, setShowAchievements] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showDailyChallenges, setShowDailyChallenges] = useState(false)

  const handleBackToMenu = () => {
    useGameStore.getState().setScene('menu')
    setGamePhase('menu')
  }

  return (
    <div style={{ pointerEvents: 'none' }}>
      {/* Top bar */}
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
          background: 'rgba(0,0,0,0.5)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          pointerEvents: 'auto',
        }}>
          <span style={{ fontSize: '1.5rem' }}>{profile?.avatar ?? '?'}</span>
          <div>
            <div style={{ fontWeight: 600 }}>{profile?.name ?? 'Player'}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Age {profile?.age ?? '?'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowAchievements(true)}
            style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '0.5rem 0.8rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              pointerEvents: 'auto',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>TROPHIES</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F7C948' }}>{achievements.length}</div>
          </button>
          <button
            onClick={() => setShowShop(true)}
            style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '0.5rem 0.8rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              pointerEvents: 'auto',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>SHOP</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2ECC71' }}>$</div>
          </button>
          <button
            onClick={() => setShowStats(true)}
            style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '0.5rem 0.8rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              pointerEvents: 'auto',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STATS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4FC3F7' }}>#</div>
          </button>
          <button
            onClick={() => setShowDailyChallenges(true)}
            style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '0.5rem 0.8rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              pointerEvents: 'auto',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>DAILY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF6B35' }}>!</div>
          </button>
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '0.5rem 0.8rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STARS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F7C948' }}>{totalStars}</div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '0.5rem 0.8rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>COINS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F7C948' }}>{profile?.coins ?? 0}</div>
          </div>
        </div>
      </div>

      {/* Center title */}
      <div style={{
        position: 'absolute',
        top: '5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #FFD700, #FF6B6B, #FF8E53, #4ECDC4, #A18CD1, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.2rem',
          filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))',
        }}>
          Athlete Domains
        </h1>
        <p style={{
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          color: 'rgba(255,255,255,0.8)',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Choose Your Game
        </p>
      </div>

      {/* Mode selector */}
      <div style={{
        position: 'absolute',
        bottom: '10rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.4rem',
        pointerEvents: 'auto',
      }}>
        {GAME_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setGameMode(m.id)}
            title={m.description}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '16px',
              background: gameMode === m.id
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0.05)',
              color: gameMode === m.id ? '#fff' : '#888',
              fontWeight: gameMode === m.id ? 700 : 400,
              fontSize: '0.75rem',
              border: gameMode === m.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Difficulty selector */}
      <div style={{
        position: 'absolute',
        bottom: '7.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        pointerEvents: 'auto',
      }}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            onClick={() => setSelectedDifficulty(d.value)}
            style={{
              padding: '0.4rem 1.2rem',
              borderRadius: '20px',
              background: selectedDifficulty === d.value
                ? d.color
                : 'rgba(255,255,255,0.1)',
              color: selectedDifficulty === d.value ? '#1A1A2E' : '#aaa',
              fontWeight: selectedDifficulty === d.value ? 700 : 500,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Game selection cards */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '1rem',
        pointerEvents: 'auto',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '0 1rem',
      }}>
        {GAMES.map((g) => {
          const unlocked = isGameUnlocked(g.game)
          return (
            <button
              key={g.game}
              onClick={() => unlocked && setScene(g.game)}
              aria-label={unlocked ? `Play ${g.label}` : `${g.label} - locked, need ${g.unlockStars} stars`}
              style={{
                width: '140px',
                padding: '1.2rem 0.8rem',
                borderRadius: '18px',
                background: unlocked
                  ? `linear-gradient(160deg, ${g.color}DD, ${g.color}88)`
                  : 'rgba(80,80,80,0.5)',
                backdropFilter: 'blur(12px)',
                border: unlocked
                  ? `2px solid ${g.color}`
                  : '2px solid rgba(255,255,255,0.1)',
                color: unlocked ? '#fff' : '#888',
                cursor: unlocked ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: unlocked
                  ? `0 6px 24px ${g.color}55`
                  : 'none',
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              <span style={{ fontSize: '2.2rem', filter: unlocked ? 'none' : 'grayscale(1)' }}>
                {g.emoji}
              </span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{g.label}</span>
              {!unlocked && (
                <span style={{ fontSize: '0.7rem', color: '#F7C948' }}>
                  {g.unlockStars} Stars
                </span>
              )}
            </button>
          )
        })}
        <button
          onClick={handleBackToMenu}
          style={{
            width: '140px',
            padding: '1.2rem 0.8rem',
            borderRadius: '18px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          <span style={{ fontSize: '2.2rem' }}>🏠</span>
          Menu
        </button>
      </div>

      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
      {showShop && <ShopPanel onClose={() => setShowShop(false)} />}
      {showStats && <StatsPanel onClose={() => setShowStats(false)} />}
      {showDailyChallenges && <DailyChallenges onClose={() => setShowDailyChallenges(false)} />}
    </div>
  )
}

export function Hub() {
  useEffect(() => {
    audioManager.playMusic('hub')
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <Skybox scene="hub" />

      <FloatingOrbs />

      <Html fullscreen>
        <HubUI />
      </Html>
    </>
  )
}
