import type { Difficulty } from '@/types'
import { DIFFICULTY_TIERS } from '@/systems/difficultyTiers'

export const SOCCER_CONFIG = {
  // Field
  fieldWidth: 16,
  fieldLength: 20,

  // Goal
  goalWidth: 7.32,
  goalHeight: 2.44,
  goalDepth: 2,
  goalPosition: [0, 0, -8] as [number, number, number],

  // Ball
  ballRadius: 0.11,
  ballMass: 0.45,
  ballRestitution: 0.6,
  ballStartPosition: [0, 0.11, 2] as [number, number, number],

  // Kick
  minKickPower: 8,
  maxKickPower: 20,
  maxAimAngleX: 3.5, // meters from center
  maxAimAngleY: 2.2, // meters height

  // Goalkeeper
  keeperWidth: 0.5,
  keeperHeight: 1.85,
  keeperDepth: 0.3,
  keeperStartPosition: [0, 0.925, -7.5] as [number, number, number],

  // Session
  totalKicks: 5,

  // Camera
  behindBallCam: [0, 2, 6] as [number, number, number],
} as const

export interface KeeperDifficulty {
  reactionDelayMs: number
  diveSpeed: number
  accuracy: number
}

export const KEEPER_DIFFICULTY: Record<Difficulty, KeeperDifficulty> = {
  easy: { reactionDelayMs: 400, diveSpeed: 3, accuracy: 0.33 },
  medium: { reactionDelayMs: 250, diveSpeed: 5, accuracy: 0.5 },
  hard: { reactionDelayMs: 100, diveSpeed: 7, accuracy: 0.7 },
}

export function getSoccerConfig(difficulty: Difficulty) {
  const tier = DIFFICULTY_TIERS[difficulty].soccer
  return {
    ...SOCCER_CONFIG,
    totalKicks: tier.totalKicks,
    keeperSpeedScale: tier.keeperSpeedScale,
  }
}
