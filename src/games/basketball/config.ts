export const BASKETBALL_CONFIG = {
  // Court
  courtWidth: 15,
  courtLength: 14,

  // Hoop
  hoopPosition: [0, 3.05, -5] as [number, number, number],
  hoopRadius: 0.23,
  rimThickness: 0.02,
  backboardWidth: 1.8,
  backboardHeight: 1.05,
  backboardPosition: [0, 3.4, -5.3] as [number, number, number],

  // Ball
  ballRadius: 0.12,
  ballMass: 0.62,
  ballRestitution: 0.75,
  ballStartPosition: [0, 1.2, 3] as [number, number, number],

  // Shooting
  minPower: 4,
  maxPower: 14,
  launchAngle: 55, // degrees from horizontal
  maxAimAngle: 30, // degrees left/right

  // Camera
  shooterCamPosition: [0, 3, 7] as [number, number, number],
  shooterCamLookAt: [0, 3, -5] as [number, number, number],

  // Scoring
  swishPoints: 5,
  backboardPoints: 3,
  rimPoints: 2,
  streakBonusThreshold: 3,
  streakBonusMultiplier: 2,

  // Session
  totalShots: 15,
  roundTimeSeconds: 90,
} as const
