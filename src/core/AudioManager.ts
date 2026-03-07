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

type MusicName = 'menu' | 'hub' | 'basketball' | 'soccer' | 'bowling' | 'minigolf'

class AudioManager {
  private sounds: Map<string, Howl> = new Map()
  private music: Map<string, Howl> = new Map()
  private currentMusic: string | null = null
  private _sfxVolume = 0.7
  private _musicVolume = 0.4

  get sfxVolume() {
    return this._sfxVolume
  }

  get musicVolume() {
    return this._musicVolume
  }

  setSfxVolume(vol: number) {
    this._sfxVolume = vol
    this.sounds.forEach((s) => s.volume(vol))
  }

  setMusicVolume(vol: number) {
    this._musicVolume = vol
    this.music.forEach((m) => m.volume(vol))
  }

  loadSound(name: SoundName, src: string) {
    const sound = new Howl({ src: [src], volume: this._sfxVolume })
    this.sounds.set(name, sound)
  }

  loadMusic(name: MusicName, src: string) {
    const m = new Howl({ src: [src], volume: this._musicVolume, loop: true })
    this.music.set(name, m)
  }

  play(name: SoundName) {
    this.sounds.get(name)?.play()
  }

  playMusic(name: MusicName) {
    if (this.currentMusic === name) return
    if (this.currentMusic) {
      this.music.get(this.currentMusic)?.fade(this._musicVolume, 0, 500)
      setTimeout(() => {
        this.music.get(this.currentMusic!)?.stop()
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
      this.music.get(this.currentMusic)?.fade(this._musicVolume, 0, 500)
      setTimeout(() => {
        this.music.get(this.currentMusic!)?.stop()
        this.currentMusic = null
      }, 500)
    }
  }

  stopAll() {
    this.sounds.forEach((s) => s.stop())
    this.stopMusic()
  }
}

export const audioManager = new AudioManager()
