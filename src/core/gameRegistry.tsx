import { lazy, type ComponentType } from 'react'
import type { Scene } from '@/types'

interface GameEntry {
  scene: ComponentType
  overlay?: ComponentType
}

const Hub = lazy(() => import('@/scenes/Hub').then((m) => ({ default: m.Hub })))
const Basketball = lazy(() => import('@/scenes/Basketball').then((m) => ({ default: m.Basketball })))
const Soccer = lazy(() => import('@/scenes/Soccer').then((m) => ({ default: m.Soccer })))
const Bowling = lazy(() => import('@/scenes/Bowling').then((m) => ({ default: m.Bowling })))
const MiniGolf = lazy(() => import('@/scenes/MiniGolf').then((m) => ({ default: m.MiniGolf })))

// Overlay imports are small DOM components - no need to lazy-load
import { BasketballOverlay } from '@/ui/BasketballUI'
import { SoccerOverlay } from '@/ui/SoccerUI'
import { BowlingOverlay } from '@/ui/BowlingUI'
import { MinigolfOverlay } from '@/ui/MinigolfUI'

export const GAME_REGISTRY: Partial<Record<Scene, GameEntry>> = {
  hub: { scene: Hub },
  basketball: { scene: Basketball, overlay: BasketballOverlay },
  soccer: { scene: Soccer, overlay: SoccerOverlay },
  bowling: { scene: Bowling, overlay: BowlingOverlay },
  minigolf: { scene: MiniGolf, overlay: MinigolfOverlay },
}
