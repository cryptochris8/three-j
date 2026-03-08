import { Howl } from 'howler'

type SoundName =
  | 'bounce'
  | 'swish'
  | 'rimClang'
  | 'crowd'
  | 'kick'
  | 'goalCheer'
  | 'whistle'
  | 'bowlRoll'
  | 'pinCrash'
  | 'strike'
  | 'putt'
  | 'holeIn'
  | 'splash'
  | 'correct'
  | 'wrong'
  | 'click'
  | 'star'
  | 'unlock'
  | 'confetti'

type VoiceName =
  | 'welcome'
  | 'swish'
  | 'goal'
  | 'strike'
  | 'spare'
  | 'greatPutt'
  | 'greatSave'
  | 'gameOver'
  | 'quizTime'
  | 'quizCorrect'
  | 'quizWrong'
  | 'streak'

type MusicName = 'menu' | 'hub' | 'basketball' | 'soccer' | 'bowling' | 'minigolf'

class AudioManager {
  private sounds: Map<string, Howl> = new Map()
  private music: Map<string, Howl> = new Map()
  private voices: Map<string, Howl> = new Map()
  private currentMusic: string | null = null
  private currentVoice: Howl | null = null
  private _sfxVolume = 0.7
  private _musicVolume = 0.4
  private _voiceVolume = 0.85

  get sfxVolume() {
    return this._sfxVolume
  }

  get musicVolume() {
    return this._musicVolume
  }

  get voiceVolume() {
    return this._voiceVolume
  }

  setSfxVolume(vol: number) {
    this._sfxVolume = vol
    this.sounds.forEach((s) => s.volume(vol))
  }

  setMusicVolume(vol: number) {
    this._musicVolume = vol
    this.music.forEach((m) => m.volume(vol))
  }

  setVoiceVolume(vol: number) {
    this._voiceVolume = vol
    this.voices.forEach((v) => v.volume(vol))
  }

  loadSound(name: SoundName, src: string) {
    const sound = new Howl({ src: [src], volume: this._sfxVolume })
    this.sounds.set(name, sound)
  }

  loadMusic(name: MusicName, src: string) {
    const m = new Howl({ src: [src], volume: this._musicVolume, loop: true })
    this.music.set(name, m)
  }

  loadVoice(name: VoiceName, src: string) {
    const v = new Howl({ src: [src], volume: this._voiceVolume })
    this.voices.set(name, v)
  }

  unloadSound(name: SoundName) {
    const s = this.sounds.get(name)
    if (s) {
      s.unload()
      this.sounds.delete(name)
    }
  }

  unloadVoice(name: VoiceName) {
    const v = this.voices.get(name)
    if (v) {
      v.unload()
      this.voices.delete(name)
    }
  }

  unloadMusic(name: MusicName) {
    const m = this.music.get(name)
    if (m) {
      if (this.currentMusic === name) {
        m.stop()
        this.currentMusic = null
      }
      m.unload()
      this.music.delete(name)
    }
  }

  isSoundLoaded(name: string): boolean {
    return this.sounds.has(name) || this.voices.has(name) || this.music.has(name)
  }

  play(name: SoundName) {
    this.sounds.get(name)?.play()
  }

  playWithPitch(name: SoundName, pitchMultiplier: number) {
    const sound = this.sounds.get(name)
    if (sound) {
      sound.rate(pitchMultiplier)
      sound.play()
    }
  }

  playVoice(name: VoiceName) {
    // Stop any currently playing voice to avoid overlap
    if (this.currentVoice && this.currentVoice.playing()) {
      this.currentVoice.stop()
    }
    const v = this.voices.get(name)
    if (v) {
      v.play()
      this.currentVoice = v
    }
  }

  playMusic(name: MusicName) {
    if (this.currentMusic === name) return
    if (this.currentMusic) {
      const prev = this.currentMusic
      this.music.get(prev)?.fade(this._musicVolume, 0, 500)
      setTimeout(() => {
        this.music.get(prev)?.stop()
      }, 500)
    }
    const m = this.music.get(name)
    if (m) {
      m.volume(0)
      m.play()
      m.fade(0, this._musicVolume, 500)
      this.currentMusic = name
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      const prev = this.currentMusic
      this.music.get(prev)?.fade(this._musicVolume, 0, 500)
      setTimeout(() => {
        this.music.get(prev)?.stop()
      }, 500)
      this.currentMusic = null
    }
  }

  stopAll() {
    this.sounds.forEach((s) => s.stop())
    this.voices.forEach((v) => v.stop())
    this.currentVoice = null
    this.stopMusic()
  }
}

export type { SoundName, VoiceName, MusicName }
export const audioManager = new AudioManager()
