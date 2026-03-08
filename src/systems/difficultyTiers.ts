import type { Difficulty } from '@/types'

export interface DifficultyOverrides {
  basketball: {
    totalShots: number
    roundTimeSeconds: number
    hoopRadiusScale: number
  }
  soccer: {
    totalKicks: number
    keeperSpeedScale: number
  }
  bowling: {
    totalFrames: number
    hasBumpers: boolean
    laneWidthScale: number
  }
  minigolf: {
    maxStrokes: number
    parScale: number
  }
}

export const DIFFICULTY_TIERS: Record<Difficulty, DifficultyOverrides> = {
  easy: {
    basketball: { totalShots: 20, roundTimeSeconds: 120, hoopRadiusScale: 1.2 },
    soccer: { totalKicks: 7, keeperSpeedScale: 0.7 },
    bowling: { totalFrames: 6, hasBumpers: true, laneWidthScale: 1.2 },
    minigolf: { maxStrokes: 10, parScale: 1.3 },
  },
  medium: {
    basketball: { totalShots: 15, roundTimeSeconds: 90, hoopRadiusScale: 1.0 },
    soccer: { totalKicks: 5, keeperSpeedScale: 1.0 },
    bowling: { totalFrames: 10, hasBumpers: false, laneWidthScale: 1.0 },
    minigolf: { maxStrokes: 8, parScale: 1.0 },
  },
  hard: {
    basketball: { totalShots: 10, roundTimeSeconds: 60, hoopRadiusScale: 0.85 },
    soccer: { totalKicks: 4, keeperSpeedScale: 1.4 },
    bowling: { totalFrames: 10, hasBumpers: false, laneWidthScale: 0.85 },
    minigolf: { maxStrokes: 6, parScale: 0.8 },
  },
}

export function getDifficultyOverrides(difficulty: Difficulty): DifficultyOverrides {
  return DIFFICULTY_TIERS[difficulty]
}
