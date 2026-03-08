import { useCallback } from 'react'
import { useScoreStore } from '@/stores/useScoreStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { checkAchievements, type AchievementContext } from '@/systems/achievements'
import { audioManager } from '@/core/AudioManager'

/**
 * Returns a function that evaluates achievement conditions
 * after a game ends. Call it in `endGame()` or GameOverScreen.
 */
export function useAchievementCheck() {
  const highScores = useScoreStore((s) => s.highScores)
  const history = useScoreStore((s) => s.history)
  const totalStars = useProgressStore((s) => s.totalStars)
  const unlockedGames = useProgressStore((s) => s.unlockedGames)
  const achievements = useProgressStore((s) => s.achievements)
  const unlockAchievement = useProgressStore((s) => s.unlockAchievement)
  const totalCorrect = useEducationStore((s) => s.totalCorrect)
  const totalAnswered = useEducationStore((s) => s.totalAnswered)
  const streak = useEducationStore((s) => s.streak)

  const checkAndUnlock = useCallback(() => {
    const ctx: AchievementContext = {
      totalStars,
      unlockedGames,
      highScores,
      history: history.map((h) => ({ game: h.game, score: h.score, stars: h.stars })),
      totalCorrect,
      totalAnswered,
      educationStreak: streak,
      achievements,
    }

    const newlyUnlocked = checkAchievements(ctx)
    for (const achievement of newlyUnlocked) {
      unlockAchievement(achievement)
      audioManager.play('unlock')
    }

    return newlyUnlocked
  }, [totalStars, unlockedGames, highScores, history, totalCorrect, totalAnswered, streak, achievements, unlockAchievement])

  return checkAndUnlock
}
