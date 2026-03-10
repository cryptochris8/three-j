import { useGameStore } from '@/stores/useGameStore'
import type { Scene } from '@/types'

const GAME_INFO: Record<string, { description: string; controls: string; emoji: string }> = {
  basketball: {
    description: 'Shoot hoops and score points! Time your shots and aim for the perfect swish.',
    controls: 'Click & hold to charge, release to shoot',
    emoji: '🏀',
  },
  soccer: {
    description: 'Take penalty kicks past the goalkeeper! Aim carefully and pick your power.',
    controls: 'Click & hold to charge, release to kick',
    emoji: '⚽',
  },
  bowling: {
    description: 'Roll strikes and spares across 10 frames! Aim down the lane and knock all the pins.',
    controls: 'Aim with mouse, click & hold to charge, release to bowl',
    emoji: '🎳',
  },
  minigolf: {
    description: 'Putt your way through 9 creative holes! Read the terrain and plan your shots.',
    controls: 'Click & hold to charge, release to putt',
    emoji: '⛳',
  },
  archery: {
    description: 'Aim your crosshair and shoot moving targets! Hit high-value targets for big points in 90 seconds.',
    controls: 'Move mouse to aim, click to shoot',
    emoji: '🏹',
  },
}

interface NPCDialogProps {
  game: Scene
  label: string
  onClose: () => void
}

export function NPCDialog({ game, label, onClose }: NPCDialogProps) {
  const setScene = useGameStore((s) => s.setScene)
  const info = GAME_INFO[game] ?? { description: 'A fun game!', controls: 'Click to play', emoji: '🎮' }

  const handlePlay = () => {
    onClose()
    setScene(game)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      zIndex: 100,
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'rgba(20,20,40,0.95)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{info.emoji}</div>
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '0.8rem',
          background: 'linear-gradient(90deg, #FFD700, #FF6B6B)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {label}
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.8)',
          lineHeight: 1.5,
          marginBottom: '1rem',
        }}>
          {info.description}
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '0.6rem 1rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '1.5rem',
        }}>
          {info.controls}
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.7rem 1.5rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePlay}
            style={{
              padding: '0.7rem 2rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
              color: '#1A1A2E',
              fontSize: '1rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,107,53,0.4)',
            }}
          >
            Play!
          </button>
        </div>
      </div>
    </div>
  )
}
