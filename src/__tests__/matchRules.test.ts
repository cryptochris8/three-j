import { describe, it, expect } from 'vitest'
import {
  MATCH_CONFIG,
  createInitialMatchState,
  startMatch,
  tickMatch,
  startSecondHalf,
  scoreGoal,
  recordPenaltyShot,
  getPenaltyWinner,
  getWinner,
  formatMatchTime,
  type MatchState,
  type PenaltyState,
} from '@/systems/matchRules'

describe('createInitialMatchState', () => {
  it('returns a valid initial state', () => {
    const state = createInitialMatchState()
    expect(state.status).toBe('waiting')
    expect(state.score).toEqual({ home: 0, away: 0 })
    expect(state.currentHalf).toBe(1)
    expect(state.halfTimeRemaining).toBe(MATCH_CONFIG.halfDurationSeconds)
    expect(state.totalTimeElapsed).toBe(0)
    expect(state.stoppageTimeAdded).toBe(0)
    expect(state.overtimeRemaining).toBe(0)
    expect(state.kickoffTeam).toBe('home')
    expect(state.momentum).toEqual({ team: null, streak: 0 })
    expect(state.penalties).toBeNull()
    expect(state.lastScorer).toBeNull()
  })
})

describe('startMatch', () => {
  it('transitions from waiting to first-half', () => {
    const state = createInitialMatchState()
    const started = startMatch(state)
    expect(started.status).toBe('first-half')
    expect(started.kickoffTeam).toBe('home')
  })

  it('does not mutate original state', () => {
    const state = createInitialMatchState()
    startMatch(state)
    expect(state.status).toBe('waiting')
  })
})

describe('tickMatch', () => {
  it('decrements halfTimeRemaining in first-half', () => {
    const state = startMatch(createInitialMatchState())
    const { state: next } = tickMatch(state)
    expect(next.halfTimeRemaining).toBe(MATCH_CONFIG.halfDurationSeconds - 1)
    expect(next.totalTimeElapsed).toBe(1)
  })

  it('decrements halfTimeRemaining in second-half', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, status: 'second-half', currentHalf: 2, halfTimeRemaining: 100 }
    const { state: next } = tickMatch(state)
    expect(next.halfTimeRemaining).toBe(99)
  })

  it('emits ticking event at 5 seconds remaining', () => {
    let state = startMatch(createInitialMatchState())
    // Timer decrements first, then checks — so start at 6 to hit 5
    state = { ...state, halfTimeRemaining: 6 }
    const { state: next, events } = tickMatch(state)
    expect(next.halfTimeRemaining).toBe(5)
    expect(events).toContain('ticking')
  })

  it('emits stoppage-time event at 60 seconds remaining', () => {
    let state = startMatch(createInitialMatchState())
    // Timer decrements first, then checks — so start at 61 to hit 60
    state = { ...state, halfTimeRemaining: 61, stoppageTimeAdded: 0 }
    const { state: next, events } = tickMatch(state)
    expect(next.halfTimeRemaining).toBe(60)
    const stoppageEvent = events.find((e) => e.startsWith('stoppage-time:'))
    expect(stoppageEvent).toBeDefined()
    expect(next.stoppageTimeAdded).toBeGreaterThan(0)
  })

  it('does not emit stoppage-time if already added', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, halfTimeRemaining: 60, stoppageTimeAdded: 120 }
    const { events } = tickMatch(state)
    const stoppageEvent = events.find((e) => e.startsWith('stoppage-time:'))
    expect(stoppageEvent).toBeUndefined()
  })

  it('transitions to halftime when first-half timer expires with stoppage', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, halfTimeRemaining: -120, stoppageTimeAdded: 120 }
    const { state: next, events } = tickMatch(state)
    expect(next.status).toBe('halftime')
    expect(events).toContain('halftime')
  })

  it('transitions to finished after second-half if scores differ', () => {
    let state = startMatch(createInitialMatchState())
    state = {
      ...state,
      status: 'second-half',
      halfTimeRemaining: -60,
      stoppageTimeAdded: 60,
      score: { home: 2, away: 1 },
    }
    const { state: next, events } = tickMatch(state)
    expect(next.status).toBe('finished')
    expect(events).toContain('match-end')
  })

  it('transitions to overtime after second-half if scores tied', () => {
    let state = startMatch(createInitialMatchState())
    state = {
      ...state,
      status: 'second-half',
      halfTimeRemaining: -60,
      stoppageTimeAdded: 60,
      score: { home: 1, away: 1 },
    }
    const { state: next, events } = tickMatch(state)
    expect(next.status).toBe('overtime')
    expect(next.overtimeRemaining).toBe(MATCH_CONFIG.overtimeDurationSeconds)
    expect(events).toContain('overtime-start')
  })

  it('decrements overtime timer', () => {
    let state = startMatch(createInitialMatchState())
    state = {
      ...state,
      status: 'overtime',
      overtimeRemaining: 100,
      halfTimeRemaining: 100,
    }
    const { state: next } = tickMatch(state)
    expect(next.overtimeRemaining).toBe(99)
    expect(next.halfTimeRemaining).toBe(99)
  })

  it('transitions to penalties after overtime if tied', () => {
    let state = startMatch(createInitialMatchState())
    state = {
      ...state,
      status: 'overtime',
      overtimeRemaining: 0,
      halfTimeRemaining: 0,
      score: { home: 2, away: 2 },
    }
    const { state: next, events } = tickMatch(state)
    expect(next.status).toBe('penalties')
    expect(next.penalties).not.toBeNull()
    expect(next.penalties!.round).toBe(1)
    expect(next.penalties!.currentShooter).toBe('home')
    expect(events).toContain('penalties-start')
  })

  it('transitions to finished after overtime if not tied', () => {
    let state = startMatch(createInitialMatchState())
    state = {
      ...state,
      status: 'overtime',
      overtimeRemaining: 0,
      halfTimeRemaining: 0,
      score: { home: 3, away: 2 },
    }
    const { state: next, events } = tickMatch(state)
    expect(next.status).toBe('finished')
    expect(events).toContain('match-end')
  })

  it('does nothing for waiting status', () => {
    const state = createInitialMatchState()
    const { state: next, events } = tickMatch(state)
    expect(next.halfTimeRemaining).toBe(state.halfTimeRemaining)
    expect(events).toHaveLength(0)
  })
})

describe('startSecondHalf', () => {
  it('sets status to second-half', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, status: 'halftime' }
    const next = startSecondHalf(state)
    expect(next.status).toBe('second-half')
    expect(next.currentHalf).toBe(2)
  })

  it('resets half timer to full duration', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, status: 'halftime', halfTimeRemaining: 0 }
    const next = startSecondHalf(state)
    expect(next.halfTimeRemaining).toBe(MATCH_CONFIG.halfDurationSeconds)
  })

  it('alternates kickoff team', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, status: 'halftime', kickoffTeam: 'home' }
    const next = startSecondHalf(state)
    expect(next.kickoffTeam).toBe('away')
  })

  it('resets stoppage time', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, status: 'halftime', stoppageTimeAdded: 120 }
    const next = startSecondHalf(state)
    expect(next.stoppageTimeAdded).toBe(0)
  })
})

describe('scoreGoal', () => {
  it('increments home score', () => {
    const state = startMatch(createInitialMatchState())
    const { state: next } = scoreGoal(state, 'home')
    expect(next.score.home).toBe(1)
    expect(next.score.away).toBe(0)
  })

  it('increments away score', () => {
    const state = startMatch(createInitialMatchState())
    const { state: next } = scoreGoal(state, 'away')
    expect(next.score.away).toBe(1)
    expect(next.score.home).toBe(0)
  })

  it('emits goal event', () => {
    const state = startMatch(createInitialMatchState())
    const { events } = scoreGoal(state, 'home')
    expect(events).toContain('goal:home')
  })

  it('sets kickoff to conceding team', () => {
    const state = startMatch(createInitialMatchState())
    const { state: next } = scoreGoal(state, 'home')
    expect(next.kickoffTeam).toBe('away')
  })

  it('tracks momentum streak', () => {
    let state = startMatch(createInitialMatchState())
    const r1 = scoreGoal(state, 'home')
    const r2 = scoreGoal(r1.state, 'home')
    const r3 = scoreGoal(r2.state, 'home')
    expect(r3.state.momentum.team).toBe('home')
    expect(r3.state.momentum.streak).toBe(3)
  })

  it('emits momentum event at threshold', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, momentum: { team: 'home', streak: 2 } }
    const { events } = scoreGoal(state, 'home')
    const momentumEvent = events.find((e) => e.startsWith('momentum:'))
    expect(momentumEvent).toBe('momentum:home:3')
  })

  it('resets momentum when different team scores', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, momentum: { team: 'home', streak: 2 } }
    const { state: next } = scoreGoal(state, 'away')
    expect(next.momentum.team).toBe('away')
    expect(next.momentum.streak).toBe(1)
  })

  it('ends match immediately in overtime (sudden death)', () => {
    let state = startMatch(createInitialMatchState())
    state = { ...state, status: 'overtime' }
    const { state: next, events } = scoreGoal(state, 'home')
    expect(next.status).toBe('finished')
    expect(events).toContain('match-end')
  })

  it('sets lastScorer', () => {
    const state = startMatch(createInitialMatchState())
    const { state: next } = scoreGoal(state, 'away')
    expect(next.lastScorer).toBe('away')
  })

  it('does not mutate original state score', () => {
    const state = startMatch(createInitialMatchState())
    scoreGoal(state, 'home')
    expect(state.score.home).toBe(0)
  })
})

describe('recordPenaltyShot', () => {
  function penaltyState(): MatchState {
    let state = startMatch(createInitialMatchState())
    return {
      ...state,
      status: 'penalties',
      penalties: {
        round: 1,
        currentShooter: 'home',
        results: { home: [], away: [] },
      },
    }
  }

  it('records a goal for current shooter', () => {
    const state = penaltyState()
    const { state: next } = recordPenaltyShot(state, 'goal')
    expect(next.penalties!.results.home).toEqual(['goal'])
  })

  it('records a miss for current shooter', () => {
    const state = penaltyState()
    const { state: next } = recordPenaltyShot(state, 'miss')
    expect(next.penalties!.results.home).toEqual(['miss'])
  })

  it('emits penalty-goal event', () => {
    const state = penaltyState()
    const { events } = recordPenaltyShot(state, 'goal')
    expect(events).toContain('penalty-goal:home')
  })

  it('emits penalty-miss event', () => {
    const state = penaltyState()
    const { events } = recordPenaltyShot(state, 'miss')
    expect(events).toContain('penalty-miss:home')
  })

  it('alternates shooter from home to away', () => {
    const state = penaltyState()
    const { state: next } = recordPenaltyShot(state, 'goal')
    expect(next.penalties!.currentShooter).toBe('away')
  })

  it('increments round after both teams shoot', () => {
    let state = penaltyState()
    const r1 = recordPenaltyShot(state, 'goal')   // home shoots
    const r2 = recordPenaltyShot(r1.state, 'goal') // away shoots
    expect(r2.state.penalties!.round).toBe(2)
    expect(r2.state.penalties!.currentShooter).toBe('home')
  })

  it('returns unchanged state if no penalties active', () => {
    const state = startMatch(createInitialMatchState())
    const { state: next, events } = recordPenaltyShot(state, 'goal')
    expect(next).toBe(state)
    expect(events).toHaveLength(0)
  })

  it('finishes match when winner determined', () => {
    // Home scores 3, away misses 3 — home wins after 3 rounds
    let state = penaltyState()

    // Round 1: home goal, away miss
    let r = recordPenaltyShot(state, 'goal')
    r = recordPenaltyShot(r.state, 'miss')
    // Round 2: home goal, away miss
    r = recordPenaltyShot(r.state, 'goal')
    r = recordPenaltyShot(r.state, 'miss')
    // Round 3: home goal, away miss
    r = recordPenaltyShot(r.state, 'goal')
    r = recordPenaltyShot(r.state, 'miss')

    // After 3-0 with 2 rounds left for away, away can't catch up
    // home has 3, away has 0, away has 2 remaining — 0+2=2 < 3
    expect(r.state.status).toBe('finished')
    expect(r.events).toContain('penalty-winner:home')
    expect(r.events).toContain('match-end')
  })
})

describe('getPenaltyWinner', () => {
  it('returns null when both teams have shots remaining', () => {
    const pen: PenaltyState = {
      round: 1,
      currentShooter: 'home',
      results: { home: ['goal'], away: ['goal'] },
    }
    expect(getPenaltyWinner(pen)).toBeNull()
  })

  it('returns home when home leads after 5 rounds', () => {
    const pen: PenaltyState = {
      round: 5,
      currentShooter: 'home',
      results: {
        home: ['goal', 'goal', 'goal', 'miss', 'goal'],
        away: ['goal', 'miss', 'goal', 'miss', 'miss'],
      },
    }
    expect(getPenaltyWinner(pen)).toBe('home')
  })

  it('returns away when away leads after 5 rounds', () => {
    const pen: PenaltyState = {
      round: 5,
      currentShooter: 'home',
      results: {
        home: ['miss', 'miss', 'goal', 'miss', 'miss'],
        away: ['goal', 'goal', 'goal', 'goal', 'miss'],
      },
    }
    expect(getPenaltyWinner(pen)).toBe('away')
  })

  it('returns null when tied after 5 rounds (sudden death)', () => {
    const pen: PenaltyState = {
      round: 6,
      currentShooter: 'home',
      results: {
        home: ['goal', 'goal', 'goal', 'miss', 'miss'],
        away: ['goal', 'goal', 'miss', 'goal', 'miss'],
      },
    }
    // 3-3 after 5 rounds — needs sudden death
    expect(getPenaltyWinner(pen)).toBeNull()
  })

  it('detects winner in sudden death round', () => {
    const pen: PenaltyState = {
      round: 6,
      currentShooter: 'home',
      results: {
        home: ['goal', 'goal', 'goal', 'miss', 'miss', 'goal'],
        away: ['goal', 'goal', 'miss', 'goal', 'miss', 'miss'],
      },
    }
    // 4-3 after 6 rounds each
    expect(getPenaltyWinner(pen)).toBe('home')
  })

  it('returns null in sudden death when shots not equal', () => {
    const pen: PenaltyState = {
      round: 6,
      currentShooter: 'away',
      results: {
        home: ['goal', 'goal', 'goal', 'miss', 'miss', 'goal'],
        away: ['goal', 'goal', 'miss', 'goal', 'miss'],
      },
    }
    // Home has shot round 6, away hasn't yet
    expect(getPenaltyWinner(pen)).toBeNull()
  })

  it('detects early winner when trailing team cannot catch up', () => {
    const pen: PenaltyState = {
      round: 4,
      currentShooter: 'away',
      results: {
        home: ['goal', 'goal', 'goal', 'goal'],
        away: ['miss', 'miss', 'miss'],
      },
    }
    // Home has 4 goals from 4 shots, away has 0 from 3 shots
    // Away has 2 remaining (rounds 4 and 5) — 0+2=2 < 4
    expect(getPenaltyWinner(pen)).toBe('home')
  })
})

describe('getWinner', () => {
  it('returns home when home leads', () => {
    const state = { ...createInitialMatchState(), score: { home: 3, away: 1 } }
    expect(getWinner(state)).toBe('home')
  })

  it('returns away when away leads', () => {
    const state = { ...createInitialMatchState(), score: { home: 1, away: 4 } }
    expect(getWinner(state)).toBe('away')
  })

  it('returns null when tied', () => {
    const state = { ...createInitialMatchState(), score: { home: 2, away: 2 } }
    expect(getWinner(state)).toBeNull()
  })
})

describe('formatMatchTime', () => {
  it('formats positive time correctly', () => {
    expect(formatMatchTime(90)).toBe('1:30')
    expect(formatMatchTime(180)).toBe('3:00')
    expect(formatMatchTime(5)).toBe('0:05')
    expect(formatMatchTime(0)).toBe('0:00')
  })

  it('formats negative time with + prefix (stoppage)', () => {
    expect(formatMatchTime(-30)).toBe('+0:30')
    expect(formatMatchTime(-90)).toBe('+1:30')
  })
})

describe('MATCH_CONFIG', () => {
  it('has valid half duration', () => {
    expect(MATCH_CONFIG.halfDurationSeconds).toBe(180)
  })

  it('has valid overtime duration', () => {
    expect(MATCH_CONFIG.overtimeDurationSeconds).toBe(300)
  })

  it('has 5 standard penalty rounds', () => {
    expect(MATCH_CONFIG.penaltyRounds).toBe(5)
  })

  it('stoppage time range is valid', () => {
    expect(MATCH_CONFIG.stoppageTimeMinSeconds).toBe(60)
    expect(MATCH_CONFIG.stoppageTimeMaxSeconds).toBe(180)
    expect(MATCH_CONFIG.stoppageTimeMaxSeconds).toBeGreaterThan(MATCH_CONFIG.stoppageTimeMinSeconds)
  })

  it('momentum threshold is positive', () => {
    expect(MATCH_CONFIG.momentumThreshold).toBeGreaterThan(0)
  })
})
