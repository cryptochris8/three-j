import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { audioManager } from '@/core/AudioManager'

/**
 * Syncs the settings store volume values to the AudioManager singleton
 * and loads all sound effects + voice lines on first mount.
 * Call once at the app root level.
 */
export function useAudioSync() {
  const sfxVolume = useSettingsStore((s) => s.sfxVolume)
  const musicVolume = useSettingsStore((s) => s.musicVolume)
  const voiceVolume = useSettingsStore((s) => s.voiceVolume)
  const loaded = useRef(false)

  // Load all audio once on mount
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    // SFX
    audioManager.loadSound('bounce', '/audio/sfx/bounce.mp3')
    audioManager.loadSound('swish', '/audio/sfx/swish.mp3')
    audioManager.loadSound('rimClang', '/audio/sfx/rimClang.mp3')
    audioManager.loadSound('crowd', '/audio/sfx/crowd.mp3')
    audioManager.loadSound('kick', '/audio/sfx/kick.mp3')
    audioManager.loadSound('goalCheer', '/audio/sfx/goalCheer.mp3')
    audioManager.loadSound('whistle', '/audio/sfx/whistle.mp3')
    audioManager.loadSound('bowlRoll', '/audio/sfx/bowlRoll.mp3')
    audioManager.loadSound('pinCrash', '/audio/sfx/pinCrash.mp3')
    audioManager.loadSound('putt', '/audio/sfx/putt.mp3')
    audioManager.loadSound('holeIn', '/audio/sfx/holeIn.mp3')
    audioManager.loadSound('splash', '/audio/sfx/splash.mp3')
    audioManager.loadSound('correct', '/audio/sfx/correct.wav')
    audioManager.loadSound('wrong', '/audio/sfx/wrong.wav')
    audioManager.loadSound('click', '/audio/sfx/click.mp3')
    audioManager.loadSound('star', '/audio/sfx/star.mp3')
    audioManager.loadSound('unlock', '/audio/sfx/unlock.mp3')
    audioManager.loadSound('confetti', '/audio/sfx/confetti.mp3')

    // Voice lines
    audioManager.loadVoice('welcome', '/audio/voice/welcome.mp3')
    audioManager.loadVoice('swish', '/audio/voice/swish.mp3')
    audioManager.loadVoice('goal', '/audio/voice/goal.mp3')
    audioManager.loadVoice('strike', '/audio/voice/strike.mp3')
    audioManager.loadVoice('spare', '/audio/voice/spare.mp3')
    audioManager.loadVoice('greatPutt', '/audio/voice/great-putt.mp3')
    audioManager.loadVoice('greatSave', '/audio/voice/great-save.mp3')
    audioManager.loadVoice('gameOver', '/audio/voice/game-over.mp3')
    audioManager.loadVoice('quizTime', '/audio/voice/quiz-time.mp3')
    audioManager.loadVoice('quizCorrect', '/audio/voice/quiz-correct.mp3')
    audioManager.loadVoice('quizWrong', '/audio/voice/quiz-wrong.mp3')
    audioManager.loadVoice('streak', '/audio/voice/streak.mp3')
  }, [])

  useEffect(() => {
    audioManager.setSfxVolume(sfxVolume)
  }, [sfxVolume])

  useEffect(() => {
    audioManager.setMusicVolume(musicVolume)
  }, [musicVolume])

  useEffect(() => {
    audioManager.setVoiceVolume(voiceVolume)
  }, [voiceVolume])
}
