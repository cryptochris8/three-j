import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { COLORS } from '@/core/constants'

export function PauseMenu() {
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const returnToHub = useGameStore((s) => s.returnToHub)
  const returnToMenu = useGameStore((s) => s.returnToMenu)
  const resumeRef = useRef<HTMLButtonElement>(null)

  // Focus trap: auto-focus resume button when pause menu opens
  useEffect(() => {
    resumeRef.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-label="Pause menu"
      aria-modal="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 90,
      }}
    >
      <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem' }}>
        Paused
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '220px' }}>
        <button
          ref={resumeRef}
          onClick={() => setGamePhase('playing')}
          aria-label="Resume game"
          style={{
            padding: '0.8rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            color: COLORS.dark,
          }}
        >
          Resume
        </button>
        <button
          onClick={returnToHub}
          aria-label="Quit to hub"
          style={{
            padding: '0.8rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            color: COLORS.white,
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          Quit to Hub
        </button>
        <button
          onClick={returnToMenu}
          aria-label="Return to main menu"
          style={{
            padding: '0.8rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            color: COLORS.white,
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          Main Menu
        </button>
      </div>
    </div>
  )
}
