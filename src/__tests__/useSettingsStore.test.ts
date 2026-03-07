import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '@/stores/useSettingsStore'

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      sfxVolume: 0.7,
      musicVolume: 0.4,
      graphicsQuality: 'high',
      showTutorials: true,
    })
  })

  describe('volume', () => {
    it('sets SFX volume', () => {
      useSettingsStore.getState().setSfxVolume(0.5)
      expect(useSettingsStore.getState().sfxVolume).toBe(0.5)
    })

    it('sets music volume', () => {
      useSettingsStore.getState().setMusicVolume(0.8)
      expect(useSettingsStore.getState().musicVolume).toBe(0.8)
    })
  })

  describe('graphics quality', () => {
    it('sets graphics quality', () => {
      useSettingsStore.getState().setGraphicsQuality('low')
      expect(useSettingsStore.getState().graphicsQuality).toBe('low')
    })
  })

  describe('tutorials', () => {
    it('toggles show tutorials', () => {
      useSettingsStore.getState().setShowTutorials(false)
      expect(useSettingsStore.getState().showTutorials).toBe(false)
    })
  })
})
