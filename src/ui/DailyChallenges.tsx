import { useEffect } from 'react'
import { useDailyChallengeStore } from '@/stores/useDailyChallengeStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { audioManager } from '@/core/AudioManager'

interface DailyChallengesProps {
  onClose: () => void
}

export function DailyChallenges({ onClose }: DailyChallengesProps) {
  const refreshIfNeeded = useDailyChallengeStore((s) => s.refreshIfNeeded)
  const challenges = useDailyChallengeStore((s) => s.challenges)
  const completedIds = useDailyChallengeStore((s) => s.completedIds)
  const completeChallenge = useDailyChallengeStore((s) => s.completeChallenge)
  const addCoins = usePlayerStore((s) => s.addCoins)

  useEffect(() => {
    refreshIfNeeded()
  }, [refreshIfNeeded])

  const handleClaim = (id: string, reward: number) => {
    completeChallenge(id)
    addCoins(reward)
    audioManager.play('star')
  }

  const completedCount = challenges.filter((c) => completedIds.includes(c.id)).length

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      zIndex: 100, pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        borderRadius: '24px', padding: '2rem', maxWidth: '500px', width: '90%',
        border: '2px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF6B35' }}>
            Daily Challenges
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              {completedCount}/{challenges.length}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
                padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.9rem',
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {challenges.map((challenge) => {
            const completed = completedIds.includes(challenge.id)
            return (
              <div
                key={challenge.id}
                style={{
                  background: completed ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)',
                  border: completed ? '2px solid rgba(46,204,113,0.3)' : '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                    {challenge.description}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#F7C948' }}>
                    {challenge.reward} coins
                  </div>
                </div>
                {completed ? (
                  <span style={{ fontSize: '1.2rem', color: '#2ECC71', fontWeight: 700 }}>
                    Done
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(challenge.id, challenge.reward)}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #FF6B35, #F7C948)',
                      color: '#1A1A2E',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Claim
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
