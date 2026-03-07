import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GraphicsQuality = 'low' | 'medium' | 'high'

interface SettingsState {
  sfxVolume: number
  musicVolume: number
  graphicsQuality: GraphicsQuality
  showTutorials: boolean
  setSfxVolume: (vol: number) => void
  setMusicVolume: (vol: number) => void
  setGraphicsQuality: (q: GraphicsQuality) => void
  setShowTutorials: (show: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sfxVolume: 0.7,
      musicVolume: 0.4,
      graphicsQuality: 'high',
      showTutorials: true,

      setSfxVolume: (vol) => set({ sfxVolume: vol }),
      setMusicVolume: (vol) => set({ musicVolume: vol }),
      setGraphicsQuality: (q) => set({ graphicsQuality: q }),
      setShowTutorials: (show) => set({ showTutorials: show }),
    }),
    { name: 'three-j-settings' }
  )
)
