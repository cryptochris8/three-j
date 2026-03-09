import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useHubStore } from '@/stores/useHubStore'
import { AchievementsPanel } from '@/ui/AchievementsPanel'
import { ShopPanel } from '@/ui/ShopPanel'
import { StatsPanel } from '@/ui/StatsPanel'
import { DailyChallenges } from '@/ui/DailyChallenges'
import { NPCDialog } from '@/ui/NPCDialog'
import { GAME_MODES } from '@/systems/gameModes'
import type { Scene, Difficulty } from '@/types'

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: '#2ECC71' },
  { value: 'medium', label: 'Medium', color: '#F7C948' },
  { value: 'hard', label: 'Hard', color: '#E74C3C' },
]

export function HubOverlay() {
  const profile = usePlayerStore((s) => s.getActiveProfile())
  const totalStars = useProgressStore((s) => s.totalStars)
  const achievements = useProgressStore((s) => s.achievements)
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const setSelectedDifficulty = useGameStore((s) => s.setSelectedDifficulty)
  const gameMode = useGameStore((s) => s.gameMode)
  const setGameMode = useGameStore((s) => s.setGameMode)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const nearbyNPC = useHubStore((s) => s.nearbyNPC)

  const [showAchievements, setShowAchievements] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showDailyChallenges, setShowDailyChallenges] = useState(false)
  const [dialogNPC, setDialogNPC] = useState<{ game: Scene; label: string } | null>(null)

  const handleBackToMenu = () => {
    useGameStore.getState().setScene('menu')
    setGamePhase('menu')
  }

  // E key to open dialog when near NPC
  const handleInteract = useCallback(() => {
    if (nearbyNPC && !dialogNPC) {
      setDialogNPC(nearbyNPC)
    }
  }, [nearbyNPC, dialogNPC])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') handleInteract()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleInteract])

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
        {/* Player info */}
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

        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <HubButton label="TROPHIES" value={String(achievements.length)} valueColor="#F7C948" onClick={() => setShowAchievements(true)} />
          <HubButton label="SHOP" value="$" valueColor="#2ECC71" onClick={() => setShowShop(true)} />
          <HubButton label="STATS" value="#" valueColor="#4FC3F7" onClick={() => setShowStats(true)} />
          <HubButton label="DAILY" value="!" valueColor="#FF6B35" onClick={() => setShowDailyChallenges(true)} />
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
          <button
            onClick={handleBackToMenu}
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
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>MENU</div>
            <div style={{ fontSize: '1.1rem' }}>🏠</div>
          </button>
        </div>
      </div>

      {/* Mode + difficulty selectors */}
      <div style={{
        position: 'absolute',
        bottom: '5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', gap: '0.4rem', pointerEvents: 'auto' }}>
          {GAME_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setGameMode(m.id)}
              title={m.description}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '16px',
                background: gameMode === m.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
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
        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDifficulty(d.value)}
              style={{
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                background: selectedDifficulty === d.value ? d.color : 'rgba(255,255,255,0.1)',
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
      </div>

      {/* Bottom controls hint */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.4)',
        padding: '0.4rem 1rem',
        borderRadius: '8px',
        backdropFilter: 'blur(8px)',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)',
        whiteSpace: 'nowrap',
      }}>
        WASD to move · E to interact · ESC to pause
      </div>

      {/* Interaction prompt overlay */}
      {nearbyNPC && !dialogNPC && (
        <InteractionPrompt
          label={nearbyNPC.label}
          onInteract={handleInteract}
        />
      )}

      {/* NPC Dialog */}
      {dialogNPC && (
        <NPCDialog
          game={dialogNPC.game}
          label={dialogNPC.label}
          onClose={() => setDialogNPC(null)}
        />
      )}

      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
      {showShop && <ShopPanel onClose={() => setShowShop(false)} />}
      {showStats && <StatsPanel onClose={() => setShowStats(false)} />}
      {showDailyChallenges && <DailyChallenges onClose={() => setShowDailyChallenges(false)} />}
    </div>
  )
}

function HubButton({ label, value, valueColor, onClick }: {
  label: string
  value: string
  valueColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
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
      <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: valueColor }}>{value}</div>
    </button>
  )
}

function InteractionPrompt({ label, onInteract }: { label: string; onInteract: () => void }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '8rem',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      pointerEvents: 'auto',
    }}>
      <button
        onClick={onInteract}
        style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '0.8rem 1.5rem',
          borderRadius: '14px',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(255,255,255,0.3)',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        Press <kbd style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '2px 8px',
          borderRadius: '4px',
          margin: '0 4px',
        }}>E</kbd> to talk to {label}
      </button>
    </div>
  )
}
