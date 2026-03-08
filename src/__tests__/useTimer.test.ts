import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '@/hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with given seconds', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 30 }))
    expect(result.current.seconds).toBe(30)
    expect(result.current.isRunning).toBe(false)
  })

  it('auto-starts when autoStart is true', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 10, autoStart: true }))
    expect(result.current.isRunning).toBe(true)
  })

  it('counts down when started', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 5 }))

    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(true)

    act(() => { vi.advanceTimersByTime(1100) })
    expect(result.current.seconds).toBeLessThanOrEqual(4)
  })

  it('stops when reaching 0', () => {
    const { result } = renderHook(() =>
      useTimer({ initialSeconds: 2, autoStart: true })
    )

    // Advance enough to fully expire
    for (let i = 0; i < 5; i++) {
      act(() => { vi.advanceTimersByTime(1100) })
    }
    act(() => { vi.runAllTicks() })

    expect(result.current.seconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('pauses timer', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 10, autoStart: true }))

    act(() => { vi.advanceTimersByTime(1100) })
    const afterTick = result.current.seconds

    act(() => { result.current.pause() })
    expect(result.current.isRunning).toBe(false)

    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.seconds).toBe(afterTick)
  })

  it('resets to initial seconds', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 10, autoStart: true }))

    act(() => { vi.advanceTimersByTime(1100) })
    expect(result.current.seconds).toBeLessThan(10)

    act(() => { result.current.reset() })
    expect(result.current.seconds).toBe(10)
    expect(result.current.isRunning).toBe(false)
  })

  it('does not go below 0', () => {
    const { result } = renderHook(() => useTimer({ initialSeconds: 1, autoStart: true }))

    for (let i = 0; i < 5; i++) {
      act(() => { vi.advanceTimersByTime(1100) })
    }
    expect(result.current.seconds).toBe(0)
  })
})
