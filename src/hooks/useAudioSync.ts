import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { audioManager } from '@/core/AudioManager'

/**
 * Syncs the settings store volume values to the AudioManager singleton
 * and loads all sound effects on first mount.
 * Call once at the app root level.
 */
export function useAudioSync() {
  const sfxVolume = useSettingsStore((s) => s.sfxVolume)
  const musicVolume = useSettingsStore((s) => s.musicVolume)
  const loaded = useRef(false)

  // Load all SFX once on mount
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    audioManager.loadSound('correct', '/audio/sfx/correct.wav')
    audioManager.loadSound('wrong', '/audio/sfx/wrong.wav')
  }, [])

  useEffect(() => {
    audioManager.setSfxVolume(sfxVolume)
  }, [sfxVolume])

  useEffect(() => {
    audioManager.setMusicVolume(musicVolume)
  }, [musicVolume])
}
