import { usePlayerStore } from '@/stores/usePlayerStore'
import { useGameStore } from '@/stores/useGameStore'
import { audioManager } from '@/core/AudioManager'
import { COLORS } from '@/core/constants'

export function MainMenu() {
  const profiles = usePlayerStore((s) => s.profiles)
  const activeProfileId = usePlayerStore((s) => s.activeProfileId)
  const setActiveProfile = usePlayerStore((s) => s.setActiveProfile)
  const setScene = useGameStore((s) => s.setScene)

  const handleStart = () => {
    if (activeProfileId) {
      audioManager.play('click')
      audioManager.playVoice('welcome')
      setScene('hub')
    }
  }

  return (
    <div
      role="main"
      aria-label="Main Menu"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, #16213E 50%, #0F3460 100%)`,
        zIndex: 100,
      }}
    >
      <h1 style={{
        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
        fontWeight: 700,
        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        textShadow: 'none',
      }}>
        Three-J
      </h1>
      <p style={{
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        color: COLORS.sky,
        marginBottom: '3rem',
        fontWeight: 500,
      }}>
        Sports Academy
      </p>

      <div
        role="radiogroup"
        aria-label="Select player profile"
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '0 1rem',
        }}
      >
        {profiles.map((profile) => (
          <button
            key={profile.id}
            role="radio"
            aria-checked={activeProfileId === profile.id}
            aria-label={`Select ${profile.name}, age ${profile.age}`}
            onClick={() => setActiveProfile(profile.id)}
            style={{
              width: '140px',
              padding: '1.2rem 1rem',
              borderRadius: '16px',
              background: activeProfileId === profile.id
                ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`
                : 'rgba(255,255,255,0.08)',
              color: activeProfileId === profile.id ? COLORS.dark : COLORS.white,
              fontSize: '1rem',
              fontWeight: 600,
              border: activeProfileId === profile.id
                ? 'none'
                : '2px solid rgba(255,255,255,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '2rem' }}>{profile.avatar}</span>
            <span>{profile.name}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Age {profile.age}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!activeProfileId}
        aria-label="Start game"
        style={{
          padding: '1rem 3rem',
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          fontWeight: 700,
          borderRadius: '50px',
          background: activeProfileId
            ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`
            : 'rgba(255,255,255,0.1)',
          color: activeProfileId ? COLORS.dark : '#666',
          cursor: activeProfileId ? 'pointer' : 'default',
          boxShadow: activeProfileId
            ? `0 8px 32px rgba(255,107,53,0.4)`
            : 'none',
        }}
      >
        PLAY!
      </button>
    </div>
  )
}
