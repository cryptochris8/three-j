import { useRef, useCallback, useEffect, useState, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RigidBody, CapsuleCollider, CuboidCollider, type RapierRigidBody, type IntersectionEnterPayload } from '@react-three/rapier'
import { Skybox } from '@/components/Skybox'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { getAvatarSkin } from '@/components/GameAvatar'
import { HytopiaAvatar, type AnimationState } from '@/components/HytopiaAvatar'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useMouseLook } from '@/hooks/useMouseLook'
import {
  calculateMoveDirection,
  isSprinting,
  rotateMovementByCamera,
  lerpAngle,
} from '@/components/PlayerController'
import { HUB } from '@/core/constants'
import { audioManager } from '@/core/AudioManager'
import {
  createInitialMatchState,
  startMatch,
  tickMatch,
  startSecondHalf,
  scoreGoal,
  type MatchState,
} from '@/systems/matchRules'
import {
  DEFAULT_FORMATION,
  getRoleHomePosition,
  getTargetPosition,
  getRepulsionOffset,
  type Vec3,
} from '@/systems/soccerAI'
import {
  createPossessionState,
  canPickup,
  getDribblePosition,
  findTackler,
  findPassTarget,
  getDirectionTo,
  getShootDirection,
  POSSESSION,
  type PossessionState,
  type PossessorType,
} from '@/systems/possession'
import { SOCCER_CONFIG } from '@/games/soccer/config'
import { create } from 'zustand'

// ─── Match Store ─────────────────────────────────────────────────
interface SoccerMatchStore {
  matchState: MatchState
  events: string[]
  shootPower: number
  isCharging: boolean
  setMatchState: (s: MatchState) => void
  pushEvents: (e: string[]) => void
  clearEvents: () => void
  setShootPower: (n: number) => void
  setIsCharging: (b: boolean) => void
}

export const useSoccerMatchStore = create<SoccerMatchStore>((set) => ({
  matchState: createInitialMatchState(),
  events: [],
  shootPower: 0,
  isCharging: false,
  setMatchState: (matchState) => set({ matchState }),
  pushEvents: (e) => set((s) => ({ events: [...s.events, ...e] })),
  clearEvents: () => set({ events: [] }),
  setShootPower: (shootPower) => set({ shootPower }),
  setIsCharging: (isCharging) => set({ isCharging }),
}))

// ─── Field Constants ─────────────────────────────────────────────
const MATCH_FIELD = {
  width: 60,   // X axis (sideline to sideline)
  length: 90,  // Z axis (goal to goal)
  halfWidth: 30,
  halfLength: 45,
  goalWidth: SOCCER_CONFIG.goalWidth,
  goalHeight: SOCCER_CONFIG.goalHeight,
  goalDepth: SOCCER_CONFIG.goalDepth,
} as const

const PLAYER_SPEED = 8
const BALL_RADIUS = 0.22
const AI_SPEED = 6

// ─── Match Field ─────────────────────────────────────────────────
function MatchField() {
  const { width, length } = MATCH_FIELD
  return (
    <group>
      {/* Grass */}
      <RigidBody type="fixed" colliders="cuboid" friction={0.6} restitution={0.3}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[width + 10, length + 10, 0.1]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Field lines */}
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[width, 0.1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[9, 9.1, 48]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Sidelines */}
      {[-MATCH_FIELD.halfWidth, MATCH_FIELD.halfWidth].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[0.1, length]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}
      {/* Goal lines */}
      {[-MATCH_FIELD.halfLength, MATCH_FIELD.halfLength].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
          <planeGeometry args={[width, 0.1]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}
      {/* Penalty areas */}
      {[-1, 1].map((sign) => {
        const z = sign * MATCH_FIELD.halfLength
        const penW = 16.5 * 2
        const penD = 16.5
        return (
          <group key={sign}>
            {/* Front line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z - sign * penD]}>
              <planeGeometry args={[penW, 0.1]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
            {/* Side lines */}
            {[-penW / 2, penW / 2].map((x) => (
              <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z - sign * (penD / 2)]}>
                <planeGeometry args={[0.1, penD]} />
                <meshStandardMaterial color="#fff" />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Invisible walls at field boundaries */}
      {/* Left wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-MATCH_FIELD.halfWidth - 5, 1, 0]} visible={false}>
          <boxGeometry args={[0.5, 3, length + 10]} />
        </mesh>
      </RigidBody>
      {/* Right wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[MATCH_FIELD.halfWidth + 5, 1, 0]} visible={false}>
          <boxGeometry args={[0.5, 3, length + 10]} />
        </mesh>
      </RigidBody>
      {/* Back walls behind goals */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1, -MATCH_FIELD.halfLength - 5]} visible={false}>
          <boxGeometry args={[width + 10, 3, 0.5]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1, MATCH_FIELD.halfLength + 5]} visible={false}>
          <boxGeometry args={[width + 10, 3, 0.5]} />
        </mesh>
      </RigidBody>
    </group>
  )
}

// ─── Goal Posts ──────────────────────────────────────────────────
function MatchGoal({ position, onGoalScored }: {
  position: [number, number, number]
  onGoalScored: () => void
}) {
  const { goalWidth, goalHeight, goalDepth } = MATCH_FIELD
  const postRadius = 0.06

  const handleIntersection = useCallback((payload: IntersectionEnterPayload) => {
    const otherName = payload.other.rigidBodyObject?.name
    if (otherName === 'match-ball') {
      onGoalScored()
    }
  }, [onGoalScored])

  return (
    <group position={position}>
      {/* Left post */}
      <RigidBody type="fixed" colliders="cuboid" restitution={0.8}>
        <mesh position={[-goalWidth / 2, goalHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[postRadius, postRadius, goalHeight, 8]} />
          <meshStandardMaterial color="#fff" metalness={0.6} roughness={0.3} />
        </mesh>
      </RigidBody>
      {/* Right post */}
      <RigidBody type="fixed" colliders="cuboid" restitution={0.8}>
        <mesh position={[goalWidth / 2, goalHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[postRadius, postRadius, goalHeight, 8]} />
          <meshStandardMaterial color="#fff" metalness={0.6} roughness={0.3} />
        </mesh>
      </RigidBody>
      {/* Crossbar */}
      <RigidBody type="fixed" colliders="cuboid" restitution={0.8}>
        <mesh position={[0, goalHeight, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[postRadius, postRadius, goalWidth, 8]} />
          <meshStandardMaterial color="#fff" metalness={0.6} roughness={0.3} />
        </mesh>
      </RigidBody>
      {/* Net (visual) */}
      <mesh position={[0, goalHeight / 2, -goalDepth / 2]}>
        <planeGeometry args={[goalWidth, goalHeight]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.2} wireframe side={2} />
      </mesh>
      {/* Goal sensor */}
      <RigidBody type="fixed" sensor onIntersectionEnter={handleIntersection}>
        <CuboidCollider
          args={[goalWidth / 2 - 0.1, goalHeight / 2 - 0.1, 0.1]}
          position={[0, goalHeight / 2, -0.5]}
        />
      </RigidBody>
      {/* Back wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, goalHeight / 2, -goalDepth]} visible={false}>
          <boxGeometry args={[goalWidth + 1, goalHeight + 1, 0.2]} />
        </mesh>
      </RigidBody>
    </group>
  )
}

// ─── AI Player Visual ────────────────────────────────────────────
function AIPlayer({ position, color, label }: {
  position: [number, number, number]
  color: string
  label: string
}) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FFD4A0" />
      </mesh>
    </group>
  )
}

// ─── Match Ball ──────────────────────────────────────────────────
const MatchBall = ({ ballRef }: { ballRef: React.RefObject<RapierRigidBody | null> }) => {
  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      mass={0.45}
      restitution={0.6}
      linearDamping={0.4}
      angularDamping={2.5}
      friction={0.35}
      position={[0, BALL_RADIUS, 0]}
      name="match-ball"
    >
      <mesh castShadow>
        <icosahedronGeometry args={[BALL_RADIUS, 1]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
    </RigidBody>
  )
}

// ─── Main Match Game ─────────────────────────────────────────────
function SoccerMatchGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)

  const ballRef = useRef<RapierRigidBody>(null)
  const bodyRef = useRef<RapierRigidBody>(null)
  const avatarGroupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Hub-style input
  const keys = useKeyboard()
  const { yaw, pitch } = useMouseLook()
  const currentFacing = useRef(0)
  const isFirstFrame = useRef(true)
  const [movementState, setMovementState] = useState<AnimationState>('idle')

  // Player skin
  const skinId = usePlayerStore((s) => {
    const profile = s.profiles.find((p) => p.id === s.activeProfileId)
    return profile?.skinId
  })
  const skinUrl = getAvatarSkin(skinId)

  // AI state
  const [homePositions, setHomePositions] = useState<[number, number, number][]>([])
  const [awayPositions, setAwayPositions] = useState<[number, number, number][]>([])
  const aiTargets = useRef<{ home: Vec3[]; away: Vec3[] }>({ home: [], away: [] })

  // Match state
  const matchRef = useRef<MatchState>(createInitialMatchState())
  const tickAccum = useRef(0)
  const halftimeTimer = useRef(0)
  const goalCooldown = useRef(false)

  // Possession state
  const possession = useRef<PossessionState>(createPossessionState())
  const aiDribbleFrames = useRef(0)
  const elapsedTime = useRef(0)

  // Charge state
  const chargingRef = useRef(false)
  const chargeStartTime = useRef(0)
  const shootPowerRef = useRef(0)

  // Input button refs — event handlers only toggle these, useFrame reads them
  const shootBtnRef = useRef(false)
  const passBtnRef = useRef(false)

  const setMatchState = useSoccerMatchStore((s) => s.setMatchState)
  const pushEvents = useSoccerMatchStore((s) => s.pushEvents)
  const setShootPower = useSoccerMatchStore((s) => s.setShootPower)
  const setIsCharging = useSoccerMatchStore((s) => s.setIsCharging)

  // Initialize match
  useEffect(() => {
    const state = startMatch(createInitialMatchState())
    matchRef.current = state
    setMatchState(state)
    audioManager.play('whistle')

    // Initialize AI positions
    const homePosArr: Vec3[] = []
    const awayPosArr: Vec3[] = []
    for (const role of DEFAULT_FORMATION) {
      homePosArr.push(getRoleHomePosition(role, MATCH_FIELD.halfWidth, MATCH_FIELD.halfLength, false))
      awayPosArr.push(getRoleHomePosition(role, MATCH_FIELD.halfWidth, MATCH_FIELD.halfLength, true))
    }
    aiTargets.current = { home: homePosArr, away: awayPosArr }
    setHomePositions(homePosArr.map((p) => [p.x, 0, p.z]))
    setAwayPositions(awayPosArr.map((p) => [p.x, 0, p.z]))
  }, [setMatchState])

  // Release ball helper — switches back to dynamic and sets velocity directly
  const releaseBall = useCallback((dirX: number, dirZ: number, force: number, lift: number) => {
    if (!ballRef.current) return
    const now = performance.now()
    const ps = possession.current
    possession.current = {
      ...ps,
      possessor: null,
      pickupCooldownUntil: now + POSSESSION.PICKUP_COOLDOWN_MS,
      lastPossessorType: ps.possessor?.type ?? null,
      lastPossessorIndex: ps.possessor?.index ?? -1,
    }
    aiDribbleFrames.current = 0
    // Switch ball back to Dynamic (type 0) and set velocity directly
    // (setLinvel is more reliable than applyImpulse after a body type transition)
    ballRef.current.setBodyType(0, true)
    ballRef.current.setLinvel({ x: dirX * force, y: lift, z: dirZ * force }, true)
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }, [])

  // Input event handlers — ONLY toggle refs, no game logic
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'Space') shootBtnRef.current = true
      else if (e.code === 'KeyE') passBtnRef.current = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') shootBtnRef.current = false
    }
    const onMouseDown = (e: MouseEvent) => {
      if (!document.pointerLockElement) return
      if (e.button === 0) shootBtnRef.current = true
      else if (e.button === 2) passBtnRef.current = true
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) shootBtnRef.current = false
    }
    const onContextMenu = (e: MouseEvent) => {
      if (document.pointerLockElement) e.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('contextmenu', onContextMenu)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('contextmenu', onContextMenu)
    }
  }, [])

  // Reset possession + ball to center after goal
  const resetPossessionAndBall = useCallback(() => {
    possession.current = createPossessionState()
    aiDribbleFrames.current = 0
    setTimeout(() => {
      if (ballRef.current) {
        ballRef.current.setBodyType(0, true) // Ensure Dynamic
        ballRef.current.setTranslation({ x: 0, y: BALL_RADIUS, z: 0 }, true)
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
    }, 2000)
  }, [])

  // Goal handlers
  const handleHomeGoal = useCallback(() => {
    if (goalCooldown.current) return
    goalCooldown.current = true
    setTimeout(() => { goalCooldown.current = false }, 3000)

    const result = scoreGoal(matchRef.current, 'away')
    matchRef.current = result.state
    setMatchState(result.state)
    pushEvents(result.events)
    audioManager.play('goalCheer')
    audioManager.play('whistle')
    resetPossessionAndBall()
  }, [setMatchState, pushEvents, resetPossessionAndBall])

  const handleAwayGoal = useCallback(() => {
    if (goalCooldown.current) return
    goalCooldown.current = true
    setTimeout(() => { goalCooldown.current = false }, 3000)

    const result = scoreGoal(matchRef.current, 'home')
    matchRef.current = result.state
    setMatchState(result.state)
    pushEvents(result.events)
    audioManager.play('goalCheer')
    audioManager.play('whistle')
    resetPossessionAndBall()
  }, [setMatchState, pushEvents, resetPossessionAndBall])

  // Main game loop
  useFrame((_, delta) => {
    if (!bodyRef.current) return

    // ─── Match logic (runs even during pauses for timer) ────
    if (gamePhase === 'playing') {
      const ms = matchRef.current.status

      // Halftime pause
      if (ms === 'halftime') {
        halftimeTimer.current += delta
        if (halftimeTimer.current > 5) {
          halftimeTimer.current = 0
          const next = startSecondHalf(matchRef.current)
          matchRef.current = next
          setMatchState(next)
          pushEvents(['second-half-start'])
          audioManager.play('whistle')
        }
      }

      // Match timer
      if (ms === 'first-half' || ms === 'second-half' || ms === 'overtime') {
        tickAccum.current += delta
        if (tickAccum.current >= 1) {
          tickAccum.current -= 1
          const result = tickMatch(matchRef.current)
          matchRef.current = result.state
          setMatchState(result.state)
          if (result.events.length > 0) {
            pushEvents(result.events)
            for (const evt of result.events) {
              if (evt === 'halftime') audioManager.play('whistle')
              if (evt === 'match-end') audioManager.play('whistle')
              if (evt.startsWith('ticking')) audioManager.play('countdown')
            }
          }
        }
      }
    }

    // ─── Player movement (hub-style camera-relative) ────────
    const rawDir = calculateMoveDirection(keys)
    const moveDir = rotateMovementByCamera(rawDir, -yaw.current)
    const moving = moveDir.lengthSq() > 0
    const sprinting = moving && isSprinting(keys)

    const newState: AnimationState = moving ? (sprinting ? 'run' : 'walk') : 'idle'
    if (newState !== movementState) setMovementState(newState)

    const currentPos = bodyRef.current.translation()
    const pos = new THREE.Vector3(currentPos.x, 0, currentPos.z)

    if (moving) {
      const speed = sprinting ? PLAYER_SPEED * HUB.sprintMultiplier : PLAYER_SPEED
      const velocity = moveDir.clone().multiplyScalar(speed * delta)
      const newX = Math.max(-MATCH_FIELD.halfWidth, Math.min(MATCH_FIELD.halfWidth, pos.x + velocity.x))
      const newZ = Math.max(-MATCH_FIELD.halfLength, Math.min(MATCH_FIELD.halfLength, pos.z + velocity.z))
      bodyRef.current.setNextKinematicTranslation({ x: newX, y: 0, z: newZ })

      // Face movement direction
      const targetAngle = Math.atan2(-moveDir.x, -moveDir.z)
      currentFacing.current = targetAngle
      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y = currentFacing.current
      }

      pos.set(newX, 0, newZ)
    } else {
      // Idle: slowly align to camera forward
      const cameraForwardAngle = yaw.current
      currentFacing.current = lerpAngle(currentFacing.current, cameraForwardAngle, HUB.idleFacingLerpSpeed)
      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y = currentFacing.current
      }
    }

    // ─── Third-person orbital camera (same as hub) ──────────
    const d = HUB.cameraDistance
    const p = pitch.current
    const y = yaw.current
    const camX = pos.x + d * Math.sin(y) * Math.cos(p)
    const camY = pos.y + d * Math.sin(p)
    const camZ = pos.z + d * Math.cos(y) * Math.cos(p)
    const camTarget = new THREE.Vector3(camX, camY, camZ)

    const camLerp = moving ? HUB.movingCameraLerpSpeed : HUB.cameraLerpSpeed
    if (isFirstFrame.current) {
      camera.position.copy(camTarget)
      isFirstFrame.current = false
    } else {
      camera.position.lerp(camTarget, camLerp)
    }
    camera.lookAt(pos.x, pos.y + HUB.cameraHeightOffset, pos.z)

    // ─── Possession & AI movement ──────────────────────────
    if (gamePhase !== 'playing') return
    const mStatus = matchRef.current.status
    if (mStatus === 'waiting' || mStatus === 'finished' || mStatus === 'penalties' || mStatus === 'halftime') return
    if (!ballRef.current) return

    elapsedTime.current += delta
    const now = performance.now()

    // ── Shoot / Pass input processing (reads button refs) ─
    const playerHasBall = possession.current.possessor?.type === 'player'

    // Start charging on button press
    if (shootBtnRef.current && !chargingRef.current && playerHasBall) {
      chargingRef.current = true
      chargeStartTime.current = now / 1000
      shootPowerRef.current = POSSESSION.MIN_SHOOT_FORCE
      setIsCharging(true)
      setShootPower(POSSESSION.MIN_SHOOT_FORCE)
    }

    // Oscillate power while holding
    if (chargingRef.current && shootBtnRef.current && playerHasBall) {
      const t = now / 1000 - chargeStartTime.current
      const norm = (Math.sin(t * POSSESSION.CHARGE_SPEED) + 1) / 2
      const power = POSSESSION.MIN_SHOOT_FORCE + norm * (POSSESSION.MAX_SHOOT_FORCE - POSSESSION.MIN_SHOOT_FORCE)
      shootPowerRef.current = power
      setShootPower(power)
    }

    // Release shot when button released (was charging)
    if (chargingRef.current && !shootBtnRef.current && playerHasBall) {
      if (ballRef.current && bodyRef.current) {
        audioManager.play('kick')
        const bT = ballRef.current.translation()
        const dir = getShootDirection(bT.x, bT.z, -MATCH_FIELD.halfLength, MATCH_FIELD.goalWidth)
        const power = shootPowerRef.current || POSSESSION.MIN_SHOOT_FORCE
        releaseBall(dir.x, dir.z, power, POSSESSION.SHOOT_LIFT)
      }
      chargingRef.current = false
      chargeStartTime.current = 0
      shootPowerRef.current = 0
      setShootPower(0)
      setIsCharging(false)
      return // Let physics move ball before pickup checks
    }

    // Cancel charge on possession loss
    if (chargingRef.current && !playerHasBall) {
      chargingRef.current = false
      chargeStartTime.current = 0
      shootPowerRef.current = 0
      setShootPower(0)
      setIsCharging(false)
    }

    // Instant pass on button press
    if (passBtnRef.current && playerHasBall) {
      passBtnRef.current = false
      if (ballRef.current && bodyRef.current) {
        const playerT = bodyRef.current.translation()
        const homeTeam = aiTargets.current.home.map((p) => ({ x: p.x, z: p.z }))
        const targetIdx = findPassTarget(playerT.x, playerT.z, currentFacing.current, homeTeam)
        if (targetIdx >= 0) {
          audioManager.play('kick')
          const tm = homeTeam[targetIdx]
          const dir = getDirectionTo(playerT.x, playerT.z, tm.x, tm.z)
          releaseBall(dir.x, dir.z, POSSESSION.PASS_FORCE, POSSESSION.PASS_LIFT)
          return // Let physics move ball before pickup checks
        }
      }
    } else {
      passBtnRef.current = false // Clear if no possession
    }

    const ps = possession.current
    const ballBody = ballRef.current
    const ballT = ballBody.translation()

    // Build position arrays for proximity checks
    const homePosFlat = aiTargets.current.home.map((p) => ({ x: p.x, z: p.z }))
    const awayPosFlat = aiTargets.current.away.map((p) => ({ x: p.x, z: p.z }))

    // ── Someone has the ball ─────────────────────────────
    if (ps.possessor) {
      // Switch ball to kinematic (type 2)
      ballBody.setBodyType(2, true)
      ballBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballBody.setAngvel({ x: 0, y: 0, z: 0 }, true)

      let ownerX = 0
      let ownerZ = 0
      let ownerFacing = 0
      let ownerMoving = false

      if (ps.possessor.type === 'player') {
        ownerX = pos.x
        ownerZ = pos.z
        ownerFacing = currentFacing.current
        ownerMoving = moving
      } else {
        const team = ps.possessor.type === 'home-ai' ? 'home' : 'away'
        const aiPos = aiTargets.current[team][ps.possessor.index]
        if (aiPos) {
          ownerX = aiPos.x
          ownerZ = aiPos.z
          ownerFacing = ps.possessor.facingAngle
          ownerMoving = true // AI is always moving when dribbling
        }
      }

      // Teleport ball to dribble position
      const dribblePos = getDribblePosition(ownerX, ownerZ, ownerFacing, elapsedTime.current, ownerMoving)
      ballBody.setTranslation(dribblePos, true)

      // ── Tackle check (opponents try to steal) ────────
      if (ps.possessor.type === 'player' || ps.possessor.type === 'home-ai') {
        // Away team tries to tackle
        const tacklerIdx = findTackler(dribblePos.x, dribblePos.z, awayPosFlat, POSSESSION.TACKLE_RADIUS)
        if (tacklerIdx >= 0 && Math.random() < POSSESSION.TACKLE_PROB) {
          audioManager.play('tackle')
          // Tackle: away-ai gains possession
          possession.current = {
            possessor: { type: 'away-ai', index: tacklerIdx, facingAngle: 0 },
            pickupCooldownUntil: now + POSSESSION.TACKLE_COOLDOWN_MS,
            lastPossessorType: ps.possessor.type,
            lastPossessorIndex: ps.possessor.index,
          }
          aiDribbleFrames.current = 0
        }
      } else {
        // Home team or player tries to tackle away-ai possessor
        // Player tackle
        const playerDist = Math.sqrt((dribblePos.x - pos.x) ** 2 + (dribblePos.z - pos.z) ** 2)
        if (playerDist < POSSESSION.TACKLE_RADIUS && Math.random() < POSSESSION.TACKLE_PROB) {
          audioManager.play('tackle')
          possession.current = {
            possessor: { type: 'player', index: 0, facingAngle: currentFacing.current },
            pickupCooldownUntil: now + POSSESSION.TACKLE_COOLDOWN_MS,
            lastPossessorType: 'away-ai',
            lastPossessorIndex: ps.possessor.index,
          }
          aiDribbleFrames.current = 0
        } else {
          // Home AI tackle
          const homeTacklerIdx = findTackler(dribblePos.x, dribblePos.z, homePosFlat, POSSESSION.TACKLE_RADIUS)
          if (homeTacklerIdx >= 0 && Math.random() < POSSESSION.TACKLE_PROB) {
            audioManager.play('tackle')
            possession.current = {
              possessor: { type: 'home-ai', index: homeTacklerIdx, facingAngle: 0 },
              pickupCooldownUntil: now + POSSESSION.TACKLE_COOLDOWN_MS,
              lastPossessorType: 'away-ai',
              lastPossessorIndex: ps.possessor.index,
            }
            aiDribbleFrames.current = 0
          }
        }
      }

      // ── AI possession behavior (shoot/pass after min dribble) ─
      if (ps.possessor && ps.possessor.type !== 'player') {
        aiDribbleFrames.current++
        if (aiDribbleFrames.current > POSSESSION.AI_MIN_DRIBBLE) {
          const team = ps.possessor.type === 'home-ai' ? 'home' : 'away'
          const goalZ = team === 'home' ? -MATCH_FIELD.halfLength : MATCH_FIELD.halfLength
          const distToGoal = Math.abs(ballT.z - goalZ)

          if (distToGoal < POSSESSION.AI_SHOOT_DIST && Math.random() < POSSESSION.AI_SHOOT_PROB) {
            // AI shoots
            audioManager.play('kick')
            const dir = getShootDirection(ballT.x, ballT.z, goalZ, MATCH_FIELD.goalWidth)
            releaseBall(dir.x, dir.z, POSSESSION.AI_SHOOT_FORCE, POSSESSION.SHOOT_LIFT)
          } else if (Math.random() < POSSESSION.AI_PASS_PROB) {
            // AI passes
            const teammates = team === 'home' ? homePosFlat : awayPosFlat
            const aiPos = aiTargets.current[team][ps.possessor.index]
            if (aiPos) {
              const passIdx = findPassTarget(aiPos.x, aiPos.z, ps.possessor.facingAngle, teammates)
              if (passIdx >= 0) {
                audioManager.play('kick')
                const dir = getDirectionTo(aiPos.x, aiPos.z, teammates[passIdx].x, teammates[passIdx].z)
                releaseBall(dir.x, dir.z, POSSESSION.AI_PASS_FORCE, POSSESSION.PASS_LIFT)
              }
            }
          }
        }
      }
    } else {
      // ── No one has the ball — ensure dynamic ───────────
      // Only switch body type if not already dynamic; calling setBodyType(0)
      // every frame can reset velocity and kill the ball's momentum after a kick.
      if (ballBody.bodyType() !== 0) {
        ballBody.setBodyType(0, true)
      }

      // Player pickup check
      const playerDist = Math.sqrt((ballT.x - pos.x) ** 2 + (ballT.z - pos.z) ** 2)
      if (playerDist < POSSESSION.PICKUP_RADIUS && canPickup(ps, 'player', 0, now)) {
        possession.current = {
          ...ps,
          possessor: { type: 'player', index: 0, facingAngle: currentFacing.current },
        }
        aiDribbleFrames.current = 0
      }

      // Home AI pickup check
      if (!possession.current.possessor) {
        for (let i = 0; i < homePosFlat.length; i++) {
          const dist = Math.sqrt((ballT.x - homePosFlat[i].x) ** 2 + (ballT.z - homePosFlat[i].z) ** 2)
          if (dist < POSSESSION.PICKUP_RADIUS && canPickup(ps, 'home-ai', i, now)) {
            possession.current = {
              ...ps,
              possessor: { type: 'home-ai', index: i, facingAngle: 0 },
            }
            aiDribbleFrames.current = 0
            break
          }
        }
      }

      // Away AI pickup check
      if (!possession.current.possessor) {
        for (let i = 0; i < awayPosFlat.length; i++) {
          const dist = Math.sqrt((ballT.x - awayPosFlat[i].x) ** 2 + (ballT.z - awayPosFlat[i].z) ** 2)
          if (dist < POSSESSION.PICKUP_RADIUS && canPickup(ps, 'away-ai', i, now)) {
            possession.current = {
              ...ps,
              possessor: { type: 'away-ai', index: i, facingAngle: 0 },
            }
            aiDribbleFrames.current = 0
            break
          }
        }
      }
    }

    // ─── AI movement (formation + dribble override) ──────
    const ballPos: Vec3 = { x: ballT.x, y: 0, z: ballT.z }

    const newHome: [number, number, number][] = []
    const newAway: [number, number, number][] = []

    // Home team AI (attacking toward -Z, player's team)
    for (let i = 0; i < DEFAULT_FORMATION.length; i++) {
      const role = DEFAULT_FORMATION[i]
      const homePos = getRoleHomePosition(role, MATCH_FIELD.halfWidth, MATCH_FIELD.halfLength, false)
      let target = getTargetPosition(role, homePos, ballPos, true)
      const teammates = aiTargets.current.home.filter((_, j) => j !== i)
      const repulsion = getRepulsionOffset(aiTargets.current.home[i] || homePos, teammates)

      // Dribble override: if this AI has the ball, move toward opponent goal
      const hasBall = possession.current.possessor?.type === 'home-ai' && possession.current.possessor.index === i
      if (hasBall) {
        target = { x: 0, y: 0, z: -MATCH_FIELD.halfLength }
      }

      const finalTarget = {
        x: target.x + repulsion.x,
        y: 0,
        z: target.z + repulsion.z,
      }

      const curr = aiTargets.current.home[i] || homePos
      const dx = finalTarget.x - curr.x
      const dz = finalTarget.z - curr.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      const step = AI_SPEED * delta

      if (dist > 0.5) {
        const nx = curr.x + (dx / dist) * Math.min(step, dist)
        const nz = curr.z + (dz / dist) * Math.min(step, dist)
        aiTargets.current.home[i] = { x: nx, y: 0, z: nz }
        // Update facing angle for dribbling AI
        if (hasBall) {
          possession.current.possessor!.facingAngle = Math.atan2(-(dx / dist), -(dz / dist))
        }
      }

      newHome.push([aiTargets.current.home[i].x, 0, aiTargets.current.home[i].z])
    }

    // Away team AI (attacking toward +Z)
    for (let i = 0; i < DEFAULT_FORMATION.length; i++) {
      const role = DEFAULT_FORMATION[i]
      const homePos = getRoleHomePosition(role, MATCH_FIELD.halfWidth, MATCH_FIELD.halfLength, true)
      let target = getTargetPosition(role, homePos, ballPos, false)
      const teammates = aiTargets.current.away.filter((_, j) => j !== i)
      const repulsion = getRepulsionOffset(aiTargets.current.away[i] || homePos, teammates)

      // Dribble override: if this AI has the ball, move toward opponent goal
      const hasBall = possession.current.possessor?.type === 'away-ai' && possession.current.possessor.index === i
      if (hasBall) {
        target = { x: 0, y: 0, z: MATCH_FIELD.halfLength }
      }

      const finalTarget = {
        x: target.x + repulsion.x,
        y: 0,
        z: target.z + repulsion.z,
      }

      const curr = aiTargets.current.away[i] || homePos
      const dx = finalTarget.x - curr.x
      const dz = finalTarget.z - curr.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      const step = AI_SPEED * delta

      if (dist > 0.5) {
        const nx = curr.x + (dx / dist) * Math.min(step, dist)
        const nz = curr.z + (dz / dist) * Math.min(step, dist)
        aiTargets.current.away[i] = { x: nx, y: 0, z: nz }
        // Update facing angle for dribbling AI
        if (hasBall) {
          possession.current.possessor!.facingAngle = Math.atan2(-(dx / dist), -(dz / dist))
        }
      }

      newAway.push([aiTargets.current.away[i].x, 0, aiTargets.current.away[i].z])
    }

    setHomePositions(newHome)
    setAwayPositions(newAway)
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <Skybox scene="soccer" />
      <fog attach="fog" args={['#87CEEB', 80, 150]} />

      <PhysicsProvider paused={gamePhase !== 'playing'}>
        <MatchField />

        {/* Goals */}
        <MatchGoal position={[0, 0, -MATCH_FIELD.halfLength]} onGoalScored={handleHomeGoal} />
        <MatchGoal position={[0, 0, MATCH_FIELD.halfLength]} onGoalScored={handleAwayGoal} />

        {/* Ball */}
        <MatchBall ballRef={ballRef} />

        {/* Player avatar (hub-style kinematic body) */}
        <RigidBody
          ref={bodyRef}
          type="kinematicPosition"
          position={[0, 0, 10]}
          colliders={false}
        >
          <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />
          <group ref={avatarGroupRef}>
            <Suspense fallback={null}>
              <HytopiaAvatar key={skinUrl} skinUrl={skinUrl} animation={movementState} />
            </Suspense>
          </group>
        </RigidBody>

        {/* Home team AI (blue) */}
        {homePositions.map((pos, i) => (
          <AIPlayer key={`home-${i}`} position={pos} color="#2196F3" label={DEFAULT_FORMATION[i]} />
        ))}

        {/* Away team AI (red) */}
        {awayPositions.map((pos, i) => (
          <AIPlayer key={`away-${i}`} position={pos} color="#E74C3C" label={DEFAULT_FORMATION[i]} />
        ))}
      </PhysicsProvider>
    </>
  )
}

export function SoccerMatch() {
  return <SoccerMatchGame />
}
