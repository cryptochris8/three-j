import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/useGameStore'

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScene: 'menu',
      gamePhase: 'menu',
      isLoading: false,
    })
  })

  describe('setScene', () => {
    it('sets current scene', () => {
      useGameStore.getState().setScene('basketball')
      expect(useGameStore.getState().currentScene).toBe('basketball')
    })

    it('sets game phase to playing for non-menu scenes', () => {
      useGameStore.getState().setScene('basketball')
      expect(useGameStore.getState().gamePhase).toBe('playing')
    })

    it('sets game phase to menu for menu scene', () => {
      useGameStore.getState().setScene('basketball')
      useGameStore.getState().setScene('menu')
      expect(useGameStore.getState().gamePhase).toBe('menu')
    })
  })

  describe('setGamePhase', () => {
    it('sets game phase', () => {
      useGameStore.getState().setGamePhase('paused')
      expect(useGameStore.getState().gamePhase).toBe('paused')
    })
  })

  describe('setLoading', () => {
    it('sets loading state', () => {
      useGameStore.getState().setLoading(true)
      expect(useGameStore.getState().isLoading).toBe(true)
    })
  })

  describe('returnToHub', () => {
    it('returns to hub scene with menu phase', () => {
      useGameStore.getState().setScene('basketball')
      useGameStore.getState().returnToHub()
      expect(useGameStore.getState().currentScene).toBe('hub')
      expect(useGameStore.getState().gamePhase).toBe('menu')
    })
  })

  describe('returnToMenu', () => {
    it('returns to menu scene with menu phase', () => {
      useGameStore.getState().setScene('basketball')
      useGameStore.getState().returnToMenu()
      expect(useGameStore.getState().currentScene).toBe('menu')
      expect(useGameStore.getState().gamePhase).toBe('menu')
    })
  })
})
