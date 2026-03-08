import { useScoreStore } from '@/stores/useScoreStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useEducationStore } from '@/stores/useEducationStore'

const STORE_KEYS = ['scores', 'progress', 'education'] as const

function storageKey(store: string, profileId: number): string {
  return `three-j-${store}-${profileId}`
}

/** Save current store states under the given profileId */
function saveStores(profileId: number) {
  const scores = useScoreStore.getState()
  const progress = useProgressStore.getState()
  const education = useEducationStore.getState()

  localStorage.setItem(storageKey('scores', profileId), JSON.stringify({
    state: {
      currentScore: scores.currentScore,
      currentStreak: scores.currentStreak,
      highScores: scores.highScores,
      history: scores.history,
    },
  }))

  localStorage.setItem(storageKey('progress', profileId), JSON.stringify({
    state: {
      unlockedGames: progress.unlockedGames,
      totalStars: progress.totalStars,
      achievements: progress.achievements,
    },
  }))

  localStorage.setItem(storageKey('education', profileId), JSON.stringify({
    state: {
      difficulty: education.difficulty,
      totalCorrect: education.totalCorrect,
      totalAnswered: education.totalAnswered,
      answeredIds: education.answeredIds,
    },
  }))
}

/** Load store states for the given profileId (or use defaults) */
function loadStores(profileId: number) {
  // Scores
  const scoresRaw = localStorage.getItem(storageKey('scores', profileId))
  if (scoresRaw) {
    try {
      const { state } = JSON.parse(scoresRaw)
      useScoreStore.setState({
        currentScore: 0,
        currentStreak: 0,
        highScores: state.highScores ?? {},
        history: state.history ?? [],
      })
    } catch { /* use defaults */ }
  } else {
    useScoreStore.setState({ currentScore: 0, currentStreak: 0, highScores: {}, history: [] })
  }

  // Progress
  const progressRaw = localStorage.getItem(storageKey('progress', profileId))
  if (progressRaw) {
    try {
      const { state } = JSON.parse(progressRaw)
      useProgressStore.setState({
        unlockedGames: state.unlockedGames ?? ['basketball'],
        totalStars: state.totalStars ?? 0,
        achievements: state.achievements ?? [],
      })
    } catch { /* use defaults */ }
  } else {
    useProgressStore.setState({
      unlockedGames: ['basketball', 'soccer', 'bowling', 'minigolf'],
      totalStars: 0,
      achievements: [],
    })
  }

  // Education
  const educationRaw = localStorage.getItem(storageKey('education', profileId))
  if (educationRaw) {
    try {
      const { state } = JSON.parse(educationRaw)
      useEducationStore.setState({
        difficulty: state.difficulty ?? 'easy',
        totalCorrect: state.totalCorrect ?? 0,
        totalAnswered: state.totalAnswered ?? 0,
        answeredIds: state.answeredIds ?? [],
        currentQuestion: null,
        streak: 0,
      })
    } catch { /* use defaults */ }
  } else {
    useEducationStore.setState({
      difficulty: 'easy',
      totalCorrect: 0,
      totalAnswered: 0,
      answeredIds: [],
      currentQuestion: null,
      streak: 0,
    })
  }
}

/** Migrate legacy unscoped keys to profile 1 */
export function migrateUnscopedData() {
  for (const key of STORE_KEYS) {
    const legacyKey = `three-j-${key}`
    const legacyData = localStorage.getItem(legacyKey)
    if (legacyData && !localStorage.getItem(storageKey(key, 1))) {
      localStorage.setItem(storageKey(key, 1), legacyData)
      localStorage.removeItem(legacyKey)
    }
  }
}

let currentProfileId: number | null = null

/**
 * Switch all player-scoped stores to a different profile.
 * Saves the current profile's data first, then loads the new profile.
 */
export function switchPlayerStores(newProfileId: number) {
  if (currentProfileId === newProfileId) return

  // Save current profile data
  if (currentProfileId !== null) {
    saveStores(currentProfileId)
  }

  // Load new profile data
  loadStores(newProfileId)
  currentProfileId = newProfileId
}

/**
 * Save the current player's store data (call before app unload or on game over).
 */
export function saveCurrentPlayer() {
  if (currentProfileId !== null) {
    saveStores(currentProfileId)
  }
}
