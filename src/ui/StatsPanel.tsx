import { useScoreStore } from '@/stores/useScoreStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { COLORS } from '@/core/constants'

interface StatsPanelProps {
  onClose: () => void
}

const GAME_INFO = [
  { key: 'basketball', label: 'Basketball', emoji: '🏀', lowerBetter: false },
  { key: 'soccer', label: 'Soccer', emoji: '⚽', lowerBetter: false },
  { key: 'bowling', label: 'Bowling', emoji: '🎳', lowerBetter: false },
  { key: 'minigolf', label: 'Mini-Golf', emoji: '⛳', lowerBetter: true },
  { key: 'archery', label: 'Archery', emoji: '🏹', lowerBetter: false },
  { key: 'football', label: 'Football', emoji: '🏈', lowerBetter: false },
]

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '0.8rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: color ?? '#fff', marginTop: '0.2rem' }}>
        {value}
      </div>
    </div>
  )
}

export function StatsPanel({ onClose }: StatsPanelProps) {
  const highScores = useScoreStore((s) => s.highScores)
  const history = useScoreStore((s) => s.history)
  const getGamesPlayed = useScoreStore((s) => s.getGamesPlayed)
  const getAverageScore = useScoreStore((s) => s.getAverageScore)
  const getBestStars = useScoreStore((s) => s.getBestStars)
  const totalStars = useProgressStore((s) => s.totalStars)
  const achievements = useProgressStore((s) => s.achievements)
  const totalCorrect = useEducationStore((s) => s.totalCorrect)
  const totalAnswered = useEducationStore((s) => s.totalAnswered)
  const getAccuracy = useEducationStore((s) => s.getAccuracy)
  const profile = usePlayerStore((s) => s.getActiveProfile())

  const totalGames = history.length
  const accuracy = totalAnswered > 0 ? Math.round(getAccuracy() * 100) : 0

  return (
    <div
      role="dialog"
      aria-label="Statistics"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        background: COLORS.dark,
        borderRadius: '20px',
        padding: '1.5rem',
        overflow: 'auto',
        border: `2px solid ${COLORS.secondary}44`,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Statistics
          </h2>
          <button
            onClick={onClose}
            aria-label="Close stats"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '0.3rem 0.8rem',
            }}
          >
            X
          </button>
        </div>

        {/* Overall stats */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Overall
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <StatBox label="Games" value={totalGames} />
            <StatBox label="Stars" value={totalStars} color={COLORS.accent} />
            <StatBox label="Trophies" value={achievements.length} color={COLORS.gold} />
            <StatBox label="Coins" value={profile?.coins ?? 0} color={COLORS.accent} />
          </div>
        </div>

        {/* Per-game stats */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Per Game
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {GAME_INFO.map((g) => {
              const played = getGamesPlayed(g.key)
              const best = highScores[g.key] ?? 0
              const avg = getAverageScore(g.key)
              const stars = getBestStars(g.key)
              return (
                <div
                  key={g.key}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '0.8rem 1rem',
                    display: 'grid',
                    gridTemplateColumns: '2.5rem 1fr repeat(3, 4rem)',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.label}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{played} games</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', opacity: 0.4 }}>BEST</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{best || '-'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', opacity: 0.4 }}>AVG</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{avg || '-'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', opacity: 0.4 }}>STARS</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: COLORS.accent }}>
                      {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Education stats */}
        <div>
          <h3 style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Education
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <StatBox label="Answered" value={totalAnswered} />
            <StatBox label="Correct" value={totalCorrect} color={COLORS.success} />
            <StatBox label="Accuracy" value={`${accuracy}%`} color={accuracy >= 80 ? COLORS.success : accuracy >= 50 ? COLORS.accent : COLORS.danger} />
          </div>
        </div>
      </div>
    </div>
  )
}
