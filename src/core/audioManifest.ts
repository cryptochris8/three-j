import type { SoundName, VoiceName, MusicName } from '@/core/AudioManager'

interface AudioManifestEntry {
  sounds: { name: SoundName; src: string }[]
  voices: { name: VoiceName; src: string }[]
  music: { name: MusicName; src: string }[]
}

/** Sounds loaded on app init — shared across all scenes */
export const COMMON_AUDIO: AudioManifestEntry = {
  sounds: [
    { name: 'correct', src: '/audio/sfx/correct.wav' },
    { name: 'wrong', src: '/audio/sfx/wrong.wav' },
    { name: 'click', src: '/audio/sfx/click.mp3' },
    { name: 'star', src: '/audio/sfx/star.mp3' },
    { name: 'unlock', src: '/audio/sfx/unlock.mp3' },
    { name: 'confetti', src: '/audio/sfx/confetti.mp3' },
  ],
  voices: [
    { name: 'welcome', src: '/audio/voice/welcome.mp3' },
    { name: 'gameOver', src: '/audio/voice/game-over.mp3' },
    { name: 'quizTime', src: '/audio/voice/quiz-time.mp3' },
    { name: 'quizCorrect', src: '/audio/voice/quiz-correct.mp3' },
    { name: 'quizWrong', src: '/audio/voice/quiz-wrong.mp3' },
    { name: 'streak', src: '/audio/voice/streak.mp3' },
  ],
  music: [
    { name: 'menu', src: '/audio/music/menu.wav' },
    { name: 'hub', src: '/audio/music/hub.wav' },
  ],
}

/** Per-scene audio — loaded when the scene is entered */
export const SCENE_AUDIO: Partial<Record<string, AudioManifestEntry>> = {
  basketball: {
    sounds: [
      { name: 'bounce', src: '/audio/sfx/bounce.mp3' },
      { name: 'swish', src: '/audio/sfx/swish.mp3' },
      { name: 'rimClang', src: '/audio/sfx/rimClang.mp3' },
      { name: 'crowd', src: '/audio/sfx/crowd.mp3' },
    ],
    voices: [
      { name: 'swish', src: '/audio/voice/swish.mp3' },
    ],
    music: [
      { name: 'basketball', src: '/audio/music/basketball.wav' },
    ],
  },
  soccer: {
    sounds: [
      { name: 'kick', src: '/audio/sfx/kick.mp3' },
      { name: 'goalCheer', src: '/audio/sfx/goalCheer.mp3' },
      { name: 'whistle', src: '/audio/sfx/whistle.mp3' },
    ],
    voices: [
      { name: 'goal', src: '/audio/voice/goal.mp3' },
      { name: 'greatSave', src: '/audio/voice/great-save.mp3' },
    ],
    music: [
      { name: 'soccer', src: '/audio/music/soccer.wav' },
    ],
  },
  bowling: {
    sounds: [
      { name: 'bowlRoll', src: '/audio/sfx/bowlRoll.mp3' },
      { name: 'pinCrash', src: '/audio/sfx/pinCrash.mp3' },
    ],
    voices: [
      { name: 'strike', src: '/audio/voice/strike.mp3' },
      { name: 'spare', src: '/audio/voice/spare.mp3' },
    ],
    music: [
      { name: 'bowling', src: '/audio/music/bowling.wav' },
    ],
  },
  minigolf: {
    sounds: [
      { name: 'putt', src: '/audio/sfx/putt.mp3' },
      { name: 'holeIn', src: '/audio/sfx/holeIn.mp3' },
      { name: 'splash', src: '/audio/sfx/splash.mp3' },
    ],
    voices: [
      { name: 'greatPutt', src: '/audio/voice/great-putt.mp3' },
    ],
    music: [
      { name: 'minigolf', src: '/audio/music/minigolf.wav' },
    ],
  },
}
