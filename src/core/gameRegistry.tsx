import { lazy, type ComponentType } from 'react'
import type { Scene } from '@/types'
import { ErrorBoundary } from '@/components/ErrorBoundary'

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

// Wrap a scene component with an ErrorBoundary
function withErrorBoundary(Component: ComponentType, gameName: string): ComponentType {
  const Wrapped = () => (
    <ErrorBoundary gameName={gameName}>
      <Component />
    </ErrorBoundary>
  )
  Wrapped.displayName = `ErrorBoundary(${gameName})`
  return Wrapped
}

export const GAME_REGISTRY: Partial<Record<Scene, GameEntry>> = {
  hub: { scene: withErrorBoundary(Hub, 'Hub') },
  basketball: { scene: withErrorBoundary(Basketball, 'Basketball'), overlay: BasketballOverlay },
  soccer: { scene: withErrorBoundary(Soccer, 'Soccer'), overlay: SoccerOverlay },
  bowling: { scene: withErrorBoundary(Bowling, 'Bowling'), overlay: BowlingOverlay },
  minigolf: { scene: withErrorBoundary(MiniGolf, 'Minigolf'), overlay: MinigolfOverlay },
}
