import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { audioManager } from '@/core/AudioManager'
import { getItemById, type ShopItemCategory } from '@/systems/shopCatalog'

interface ShopState {
  ownedItems: string[]
  equippedBall: string | null
  equippedCelebration: string | null
  equippedTheme: string | null
  owns: (itemId: string) => boolean
  buyItem: (itemId: string, price: number) => boolean
  equipItem: (itemId: string, category: ShopItemCategory) => void
  getEquippedBallColor: () => string | null
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      ownedItems: [],
      equippedBall: null,
      equippedCelebration: null,
      equippedTheme: null,

      owns: (itemId) => get().ownedItems.includes(itemId),

      buyItem: (itemId, price) => {
        if (get().ownedItems.includes(itemId)) return false
        const success = usePlayerStore.getState().spendCoins(price)
        if (!success) return false
        audioManager.play('unlock')
        set((s) => ({ ownedItems: [...s.ownedItems, itemId] }))
        return true
      },

      equipItem: (itemId, category) => {
        audioManager.play('click')
        switch (category) {
          case 'ball':
            set({ equippedBall: get().equippedBall === itemId ? null : itemId })
            break
          case 'celebration':
            set({ equippedCelebration: get().equippedCelebration === itemId ? null : itemId })
            break
          case 'theme':
            set({ equippedTheme: get().equippedTheme === itemId ? null : itemId })
            break
        }
      },

      getEquippedBallColor: () => {
        const { equippedBall } = get()
        if (!equippedBall) return null
        const item = getItemById(equippedBall)
        return item?.color ?? null
      },
    }),
    { name: 'three-j-shop' }
  )
)
