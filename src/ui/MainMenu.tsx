import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useGameStore } from '@/stores/useGameStore'
import { audioManager } from '@/core/AudioManager'
import { switchPlayerStores, migrateUnscopedData } from '@/core/playerScoping'
import { AvatarPicker } from './AvatarPicker'

const PROFILE_COLORS = [
  { bg: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', shadow: 'rgba(255,107,83,0.5)' },
  { bg: 'linear-gradient(135deg, #4ECDC4, #44CF6C)', shadow: 'rgba(78,205,196,0.5)' },
  { bg: 'linear-gradient(135deg, #A18CD1, #FBC2EB)', shadow: 'rgba(161,140,209,0.5)' },
]

export function MainMenu() {
  const profiles = usePlayerStore((s) => s.profiles)
  const activeProfileId = usePlayerStore((s) => s.activeProfileId)
  const setActiveProfile = usePlayerStore((s) => s.setActiveProfile)
  const setScene = useGameStore((s) => s.setScene)
  const [pickerProfileId, setPickerProfileId] = useState<number | null>(null)

  useEffect(() => {
    migrateUnscopedData()
    audioManager.playMusic('menu')
  }, [])

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #f5576c 100%)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Decorative floating circles */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-8%', left: '-5%', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-8%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '5%', width: '150px', height: '150px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '8%', width: '200px', height: '200px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
        }} />
      </div>

      <h1 style={{
        fontSize: 'clamp(2.8rem, 9vw, 5rem)',
        fontWeight: 700,
        background: 'linear-gradient(90deg, #FFD700, #FF6B6B, #FF8E53, #4ECDC4, #A18CD1, #FFD700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '0.3rem',
        letterSpacing: '-1px',
        position: 'relative',
        filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))',
      }}>
        Athlete Domains
      </h1>

      <p style={{
        fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
        color: 'rgba(255,255,255,0.85)',
        marginBottom: '3rem',
        fontWeight: 500,
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}>
        Choose Your Player
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
          position: 'relative',
        }}
      >
        {profiles.map((profile, i) => {
          const isActive = activeProfileId === profile.id
          const colors = PROFILE_COLORS[i % PROFILE_COLORS.length]
          return (
            <button
              key={profile.id}
              role="radio"
              aria-checked={isActive}
              aria-label={`Select ${profile.name}, age ${profile.age}`}
              onClick={() => {
                setActiveProfile(profile.id)
                switchPlayerStores(profile.id)
              }}
              style={{
                width: '150px',
                padding: '1.5rem 1rem',
                borderRadius: '20px',
                background: isActive
                  ? colors.bg
                  : 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                border: isActive
                  ? '3px solid rgba(255,255,255,0.6)'
                  : '3px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)',
                boxShadow: isActive
                  ? `0 8px 32px ${colors.shadow}, 0 0 0 2px rgba(255,255,255,0.3)`
                  : '0 4px 16px rgba(0,0,0,0.15)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
              }}
            >
              <span style={{ fontSize: '2.5rem', filter: isActive ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none' }}>{profile.avatar}</span>
              <span style={{ fontWeight: 700 }}>{profile.name}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Age {profile.age}</span>
              <button
                aria-label={`Choose avatar for ${profile.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setPickerProfileId(profile.id)
                }}
                style={{
                  marginTop: '0.4rem',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '2px solid rgba(255,215,0,0.6)',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.3))',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  boxShadow: '0 2px 8px rgba(255,215,0,0.2)',
                }}
              >
                Choose Avatar
              </button>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={!activeProfileId}
        aria-label="Start game"
        style={{
          padding: '1.1rem 3.5rem',
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          fontWeight: 700,
          borderRadius: '50px',
          background: activeProfileId
            ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B35)'
            : 'rgba(255,255,255,0.15)',
          color: activeProfileId ? '#1A1A2E' : 'rgba(255,255,255,0.4)',
          cursor: activeProfileId ? 'pointer' : 'default',
          boxShadow: activeProfileId
            ? '0 8px 32px rgba(255,165,0,0.5), 0 0 60px rgba(255,215,0,0.2)'
            : 'none',
          letterSpacing: '2px',
          position: 'relative',
          border: 'none',
        }}
      >
        PLAY!
      </button>

      {pickerProfileId !== null && (
        <AvatarPicker
          profileId={pickerProfileId}
          onClose={() => setPickerProfileId(null)}
        />
      )}
    </div>
  )
}
