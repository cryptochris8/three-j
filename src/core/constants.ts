// Colors
export const COLORS = {
  primary: '#FF6B35',
  secondary: '#004E89',
  accent: '#F7C948',
  success: '#2ECC71',
  danger: '#E74C3C',
  white: '#FFFFFF',
  dark: '#1A1A2E',
  court: '#C68642',
  grass: '#4CAF50',
  lane: '#DEB887',
  sky: '#87CEEB',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
} as const

// Physics
export const PHYSICS = {
  gravity: [0, -9.81, 0] as [number, number, number],
  basketball: {
    mass: 0.62,
    restitution: 0.75,
    linearDamping: 0.3,
    radius: 0.12,
  },
  soccer: {
    mass: 0.45,
    restitution: 0.6,
    linearDamping: 0.4,
    radius: 0.11,
  },
  bowling: {
    ballMass: 6.0,
    ballRestitution: 0.3,
    ballRadius: 0.109,
    pinMass: 1.5,
    pinRestitution: 0.4,
  },
  golf: {
    mass: 0.046,
    restitution: 0.5,
    linearDamping: 2.0,
    radius: 0.021,
  },
} as const

// Timing
export const TIMING = {
  basketballRoundSeconds: 90,
  basketballShots: 15,
  soccerKicks: 5,
  bowlingFrames: 10,
  golfHoles: 9,
  quizTimeSeconds: 15,
  powerMeterSpeed: 2.0,
} as const

// Scoring thresholds for star ratings
export const STAR_THRESHOLDS = {
  basketball: { one: 15, two: 30, three: 50 } as const,
  soccer: { one: 1, two: 3, three: 5 } as const,
  bowling: { one: 30, two: 70, three: 120 } as const,
  minigolf: { one: 45, two: 36, three: 27 } as const, // Lower is better
} as const

// Camera defaults
export const CAMERA = {
  fov: 60,
  near: 0.1,
  far: 200,
  defaultPosition: [0, 5, 10] as [number, number, number],
} as const
