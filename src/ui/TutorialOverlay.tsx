import { useState, useEffect, useRef } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { COLORS } from '@/core/constants'
import type { Scene } from '@/types'

const TUTORIALS: Record<string, { title: string; controls: string[] }> = {
  basketball: {
    title: 'Basketball',
    controls: [
      'Move mouse or Arrow keys to aim',
      'Hold click or Space to charge power',
      'Release to shoot!',
      'Swish = 5pts, Backboard = 3pts, Rim = 2pts',
    ],
  },
  soccer: {
    title: 'Soccer',
    controls: [
      'Move mouse or Arrow keys to aim at the goal',
      'Hold click or Space to charge power',
      'Release to kick!',
      'Try to get past the goalkeeper',
    ],
  },
  bowling: {
    title: 'Bowling',
    controls: [
      'Move mouse or Arrow keys to position',
      'Click or Space to start power meter',
      'Click or Space again to set spin',
      'Click or Space once more to release!',
    ],
  },
  minigolf: {
    title: 'Mini Golf',
    controls: [
      'Click and drag backwards to aim (slingshot)',
      'Or use Arrow keys + Space for quick putt',
      'Release to putt the ball',
      'Lower strokes = better score!',
    ],
  },
}

// Track which games the player has seen tutorials for
const seenKey = 'three-j-tutorials-seen'
function getSeenTutorials(): Set<string> {
  try {
    const data = localStorage.getItem(seenKey)
    return data ? new Set(JSON.parse(data)) : new Set()
  } catch {
    return new Set()
  }
}
function markSeen(game: string) {
  const seen = getSeenTutorials()
  seen.add(game)
  localStorage.setItem(seenKey, JSON.stringify([...seen]))
}

interface TutorialOverlayProps {
  game: Scene
}

export function TutorialOverlay({ game }: TutorialOverlayProps) {
  const showTutorials = useSettingsStore((s) => s.showTutorials)
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!showTutorials) return
    const seen = getSeenTutorials()
    if (!seen.has(game) && TUTORIALS[game]) {
      setVisible(true)
    }
  }, [game, showTutorials])

  useEffect(() => {
    if (visible) buttonRef.current?.focus()
  }, [visible])

  if (!visible) return null

  const tutorial = TUTORIALS[game]
  if (!tutorial) return null

  const handleDismiss = () => {
    markSeen(game)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label={`Tutorial: How to play ${tutorial.title}`}
      aria-modal="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 80,
        pointerEvents: 'auto',
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          background: 'rgba(26,26,46,0.95)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          border: '2px solid rgba(255,107,53,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          How to Play {tutorial.title}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
          {tutorial.controls.map((ctrl, i) => (
            <li key={i} style={{
              padding: '0.5rem 0',
              borderBottom: i < tutorial.controls.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              fontSize: '0.95rem',
              opacity: 0.9,
            }}>
              {ctrl}
            </li>
          ))}
        </ul>
        <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem' }}>
          Press Escape to pause anytime
        </div>
        <button
          ref={buttonRef}
          onClick={handleDismiss}
          aria-label="Dismiss tutorial"
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            color: COLORS.dark,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  )
}
