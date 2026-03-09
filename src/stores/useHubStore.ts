import { create } from 'zustand'
import type { Scene } from '@/types'

interface NearbyNPC {
  game: Scene
  label: string
}

interface HubState {
  nearbyNPC: NearbyNPC | null
  setNearbyNPC: (npc: NearbyNPC | null) => void
}

export const useHubStore = create<HubState>((set) => ({
  nearbyNPC: null,
  setNearbyNPC: (npc) => set({ nearbyNPC: npc }),
}))
