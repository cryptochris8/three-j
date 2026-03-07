import { usePlayerStore } from '@/stores/usePlayerStore'
import { useGameStore } from '@/stores/useGameStore'

export function MainMenu() {
  const profiles = usePlayerStore((s) => s.profiles)
  const activeProfileId = usePlayerStore((s) => s.activeProfileId)
  const setActiveProfile = usePlayerStore((s) => s.setActiveProfile)
  const setScene = useGameStore((s) => s.setScene)

  const handleStart = () => {
    if (activeProfileId) {
      setScene('hub')
    }
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
      zIndex: 100,
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        textShadow: 'none',
      }}>
        Three-J
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#87CEEB',
        marginBottom: '3rem',
        fontWeight: 500,
      }}>
        Sports Academy
      </p>

      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => setActiveProfile(profile.id)}
            style={{
              width: '140px',
              padding: '1.2rem 1rem',
              borderRadius: '16px',
              background: activeProfileId === profile.id
                ? 'linear-gradient(135deg, #FF6B35, #F7C948)'
                : 'rgba(255,255,255,0.08)',
              color: activeProfileId === profile.id ? '#1A1A2E' : '#fff',
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
        style={{
          padding: '1rem 3rem',
          fontSize: '1.4rem',
          fontWeight: 700,
          borderRadius: '50px',
          background: activeProfileId
            ? 'linear-gradient(135deg, #FF6B35, #F7C948)'
            : 'rgba(255,255,255,0.1)',
          color: activeProfileId ? '#1A1A2E' : '#666',
          cursor: activeProfileId ? 'pointer' : 'default',
          boxShadow: activeProfileId
            ? '0 8px 32px rgba(255,107,53,0.4)'
            : 'none',
        }}
      >
        PLAY!
      </button>
    </div>
  )
}
