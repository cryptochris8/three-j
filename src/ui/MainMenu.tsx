import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useGameStore } from '@/stores/useGameStore'
import { audioManager } from '@/core/AudioManager'
import { switchPlayerStores, migrateUnscopedData } from '@/core/playerScoping'
import { AvatarPicker } from './AvatarPicker'
import type { GradeLevel, PlayMode } from '@/types'

type MenuStep = 'mode' | 'grade' | 'avatar'

const GRADE_INFO: { grade: GradeLevel; label: string; ages: string }[] = [
  { grade: 1, label: 'Grade 1', ages: 'Ages 6-7' },
  { grade: 2, label: 'Grade 2', ages: 'Ages 7-8' },
  { grade: 3, label: 'Grade 3', ages: 'Ages 8-9' },
  { grade: 4, label: 'Grade 4', ages: 'Ages 9-10' },
  { grade: 5, label: 'Grade 5', ages: 'Ages 10-11' },
  { grade: 6, label: 'Grade 6', ages: 'Ages 11-12' },
]

const GRADE_COLORS = [
  '#FF6B6B', '#FF8E53', '#F7C948', '#4ECDC4', '#2196F3', '#A18CD1',
]

export function MainMenu() {
  const profiles = usePlayerStore((s) => s.profiles)
  const setActiveProfile = usePlayerStore((s) => s.setActiveProfile)
  const setScene = useGameStore((s) => s.setScene)
  const setPlayMode = useGameStore((s) => s.setPlayMode)
  const setSelectedGrade = useGameStore((s) => s.setSelectedGrade)
  const [step, setStep] = useState<MenuStep>('mode')
  const [chosenMode, setChosenMode] = useState<PlayMode | null>(null)
  const [chosenGrade, setChosenGrade] = useState<GradeLevel | null>(null)
  const [pickerProfileId, setPickerProfileId] = useState<number | null>(null)

  useEffect(() => {
    migrateUnscopedData()
    audioManager.playMusic('menu')
  }, [])

  const handleModeSelect = (mode: PlayMode) => {
    audioManager.play('click')
    setChosenMode(mode)
    if (mode === 'education') {
      setStep('grade')
    } else {
      setStep('avatar')
    }
  }

  const handleGradeSelect = (grade: GradeLevel) => {
    audioManager.play('click')
    setChosenGrade(grade)
    setStep('avatar')
  }

  const handleBack = () => {
    audioManager.play('click')
    if (step === 'grade') {
      setStep('mode')
      setChosenMode(null)
    } else if (step === 'avatar') {
      if (chosenMode === 'education') {
        setStep('grade')
        setChosenGrade(null)
      } else {
        setStep('mode')
        setChosenMode(null)
      }
    }
  }

  const handleStart = () => {
    audioManager.play('click')
    audioManager.playVoice('welcome')

    // Auto-select profile 1 for tracking
    const profile = profiles[0]
    if (profile) {
      setActiveProfile(profile.id)
      switchPlayerStores(profile.id)
    }

    setPlayMode(chosenMode!)
    setSelectedGrade(chosenMode === 'education' ? chosenGrade : null)
    setScene('hub')
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
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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

      {/* Step: Mode Selection */}
      {step === 'mode' && (
        <>
          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '2.5rem',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Choose Your Mode
          </p>

          <div
            role="group"
            aria-label="Select play mode"
            style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: '0 1rem',
              position: 'relative',
            }}
          >
            {/* Open World Card */}
            <button
              aria-label="Open World mode"
              onClick={() => handleModeSelect('openWorld')}
              style={{
                width: '240px',
                padding: '2rem 1.5rem',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(78,205,196,0.3), rgba(68,207,108,0.3))',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                border: '3px solid rgba(78,205,196,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.8rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(78,205,196,0.2)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(78,205,196,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(78,205,196,0.2)'
              }}
            >
              <span style={{ fontSize: '3rem' }}>🎮</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>Open World</span>
              <span style={{
                fontSize: '0.85rem',
                opacity: 0.8,
                lineHeight: 1.4,
                textAlign: 'center',
              }}>
                Explore &amp; play sports games
              </span>
            </button>

            {/* Education Card */}
            <button
              aria-label="Education mode"
              onClick={() => handleModeSelect('education')}
              style={{
                width: '240px',
                padding: '2rem 1.5rem',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(161,140,209,0.3), rgba(251,194,235,0.3))',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                border: '3px solid rgba(161,140,209,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.8rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(161,140,209,0.2)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(161,140,209,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(161,140,209,0.2)'
              }}
            >
              <span style={{ fontSize: '3rem' }}>📚</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>Education</span>
              <span style={{
                fontSize: '0.85rem',
                opacity: 0.8,
                lineHeight: 1.4,
                textAlign: 'center',
              }}>
                Learn while you play — choose your grade level
              </span>
            </button>
          </div>
        </>
      )}

      {/* Step: Grade Selection */}
      {step === 'grade' && (
        <>
          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '2rem',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Select Your Grade
          </p>

          <div
            role="group"
            aria-label="Select grade level"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '0 1rem',
              maxWidth: '500px',
            }}
          >
            {GRADE_INFO.map((info, i) => {
              const color = GRADE_COLORS[i]
              return (
                <button
                  key={info.grade}
                  aria-label={`${info.label}, ${info.ages}`}
                  onClick={() => handleGradeSelect(info.grade)}
                  style={{
                    padding: '1.2rem 1rem',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${color}44, ${color}22)`,
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    border: `3px solid ${color}88`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 4px 16px ${color}33`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)'
                    e.currentTarget.style.boxShadow = `0 8px 24px ${color}55`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = `0 4px 16px ${color}33`
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{info.label}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{info.ages}</span>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleBack}
            aria-label="Back to mode selection"
            style={{
              padding: '0.7rem 2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)',
            }}
          >
            ← Back
          </button>
        </>
      )}

      {/* Step: Avatar Selection + Play */}
      {step === 'avatar' && (
        <>
          <p style={{
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '0.5rem',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            {chosenMode === 'openWorld'
              ? '🎮 Open World'
              : `📚 Education — Grade ${chosenGrade}`}
          </p>

          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '2rem',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Choose Your Avatar
          </p>

          <button
            onClick={() => setPickerProfileId(profiles[0]?.id ?? 1)}
            aria-label="Choose avatar"
            style={{
              marginBottom: '2rem',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '16px',
              border: '2px solid rgba(255,215,0,0.6)',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.3))',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255,215,0,0.2)',
              backdropFilter: 'blur(5px)',
              letterSpacing: '1px',
            }}
          >
            Choose Avatar
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleBack}
              aria-label="Back"
              style={{
                padding: '1rem 2.5rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                fontWeight: 600,
                borderRadius: '50px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)',
              }}
            >
              ← Back
            </button>

            <button
              onClick={handleStart}
              aria-label="Start game"
              style={{
                padding: '1.1rem 3.5rem',
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 700,
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B35)',
                color: '#1A1A2E',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(255,165,0,0.5), 0 0 60px rgba(255,215,0,0.2)',
                letterSpacing: '2px',
                border: 'none',
              }}
            >
              PLAY!
            </button>
          </div>
        </>
      )}

      {pickerProfileId !== null && (
        <AvatarPicker
          profileId={pickerProfileId}
          onClose={() => setPickerProfileId(null)}
        />
      )}
    </div>
  )
}
