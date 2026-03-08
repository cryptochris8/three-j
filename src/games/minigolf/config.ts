export interface HoleConfig {
  id: number
  name: string
  par: number
  teePosition: [number, number, number]
  holePosition: [number, number, number]
  courseWidth: number
  courseLength: number
  walls: { position: [number, number, number]; size: [number, number, number]; rotation?: [number, number, number] }[]
  obstacles: { type: 'windmill' | 'bumper' | 'ramp' | 'water'; position: [number, number, number]; size?: [number, number, number] }[]
  theme: 'safari' | 'space' | 'underwater'
  funFact: string
}

export const MINIGOLF_CONFIG = {
  ballRadius: 0.025,
  ballMass: 0.046,
  ballRestitution: 0.5,
  ballLinearDamping: 1.2,
  maxPuttPower: 18,
  minPuttPower: 0.3,
  holeSinkMaxSpeed: 2.0,
  holeRadius: 0.05,
  maxStrokes: 8,
  outOfBoundsY: -2,
} as const

export const COURSES: HoleConfig[] = [
  // Course 1: Animal Safari (holes 1-3)
  {
    id: 1, name: 'Straight Shot', par: 2, theme: 'safari',
    teePosition: [0, 0.03, 3], holePosition: [0, -0.01, -3],
    courseWidth: 1.5, courseLength: 7,
    walls: [
      { position: [-0.8, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [0.8, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [0, 0.1, -3.55], size: [1.7, 0.2, 0.1] },
    ],
    obstacles: [],
    funFact: 'A cheetah can sprint at 70 mph!',
  },
  {
    id: 2, name: 'Ramp Jump', par: 3, theme: 'safari',
    teePosition: [0, 0.03, 4], holePosition: [0, -0.01, -4],
    courseWidth: 1.5, courseLength: 9,
    walls: [
      { position: [-0.8, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [0.8, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [0, 0.1, -4.55], size: [1.7, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'ramp', position: [0, 0, 0], size: [1.2, 0.2, 1.5] },
    ],
    funFact: 'Elephants are the only animals that can\'t jump!',
  },
  {
    id: 3, name: 'Tunnel Run', par: 3, theme: 'safari',
    teePosition: [0, 0.03, 4], holePosition: [2, -0.01, -3],
    courseWidth: 2, courseLength: 9,
    walls: [
      { position: [-1.1, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [1.1, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [0, 0.1, -4.55], size: [2.3, 0.2, 0.1] },
      // L-bend wall
      { position: [0, 0.1, -1], size: [0.8, 0.2, 0.1] },
    ],
    obstacles: [],
    funFact: 'A group of flamingos is called a "flamboyance"!',
  },

  // Course 2: Space Adventure (holes 4-6)
  {
    id: 4, name: 'Asteroid Field', par: 3, theme: 'space',
    teePosition: [0, 0.03, 3], holePosition: [0, -0.01, -3],
    courseWidth: 2, courseLength: 7,
    walls: [
      { position: [-1.1, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [1.1, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [0, 0.1, -3.55], size: [2.3, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'bumper', position: [-0.4, 0.08, 0] },
      { type: 'bumper', position: [0.4, 0.08, -1] },
      { type: 'bumper', position: [0, 0.08, -2] },
    ],
    funFact: 'There are more stars in the universe than grains of sand on Earth!',
  },
  {
    id: 5, name: 'Spinning Satellite', par: 4, theme: 'space',
    teePosition: [0, 0.03, 4], holePosition: [0, -0.01, -4],
    courseWidth: 2, courseLength: 9,
    walls: [
      { position: [-1.1, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [1.1, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [0, 0.1, -4.55], size: [2.3, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'windmill', position: [0, 0, -1] },
    ],
    funFact: 'A day on Venus is longer than a year on Venus!',
  },
  {
    id: 6, name: 'Black Hole', par: 3, theme: 'space',
    teePosition: [0, 0.03, 3], holePosition: [0, -0.01, -3],
    courseWidth: 2, courseLength: 7,
    walls: [
      { position: [-1.1, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [1.1, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [0, 0.1, -3.55], size: [2.3, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'water', position: [-0.5, 0, 0], size: [0.8, 0.01, 1.2] },
    ],
    funFact: 'Light from the Sun takes 8 minutes to reach Earth!',
  },

  // Course 3: Underwater World (holes 7-9)
  {
    id: 7, name: 'Coral Reef', par: 3, theme: 'underwater',
    teePosition: [0, 0.03, 3], holePosition: [0, -0.01, -3],
    courseWidth: 2, courseLength: 7,
    walls: [
      { position: [-1.1, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [1.1, 0.1, 0], size: [0.1, 0.2, 7] },
      { position: [0, 0.1, -3.55], size: [2.3, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'bumper', position: [-0.5, 0.08, -0.5] },
      { type: 'bumper', position: [0.3, 0.08, -1.5] },
    ],
    funFact: 'The ocean covers more than 70% of Earth\'s surface!',
  },
  {
    id: 8, name: 'Whirlpool', par: 4, theme: 'underwater',
    teePosition: [0, 0.03, 4], holePosition: [0, -0.01, -4],
    courseWidth: 2.5, courseLength: 9,
    walls: [
      { position: [-1.35, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [1.35, 0.1, 0], size: [0.1, 0.2, 9] },
      { position: [0, 0.1, -4.55], size: [2.8, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'windmill', position: [0, 0, -1] },
      { type: 'water', position: [0.6, 0, -2.5], size: [0.6, 0.01, 0.6] },
    ],
    funFact: 'Octopuses have three hearts and blue blood!',
  },
  {
    id: 9, name: 'Deep Dive', par: 5, theme: 'underwater',
    teePosition: [0, 0.03, 5], holePosition: [0, -0.01, -5],
    courseWidth: 2.5, courseLength: 11,
    walls: [
      { position: [-1.35, 0.1, 0], size: [0.1, 0.2, 11] },
      { position: [1.35, 0.1, 0], size: [0.1, 0.2, 11] },
      { position: [0, 0.1, -5.55], size: [2.8, 0.2, 0.1] },
      // Zigzag walls
      { position: [-0.5, 0.1, -1], size: [0.8, 0.2, 0.1] },
      { position: [0.5, 0.1, -3], size: [0.8, 0.2, 0.1] },
    ],
    obstacles: [
      { type: 'bumper', position: [0, 0.08, -2] },
      { type: 'ramp', position: [0, 0, -4], size: [1.5, 0.15, 1] },
    ],
    funFact: 'The deepest point in the ocean is the Mariana Trench at 36,000 feet!',
  },
]
