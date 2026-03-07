import { Suspense } from 'react'
import { GameCanvas } from '@/core/GameCanvas'
import { useGameStore } from '@/stores/useGameStore'
import { MainMenu } from '@/ui/MainMenu'
import { PauseMenu } from '@/ui/PauseMenu'
import { BasketballOverlay } from '@/ui/BasketballUI'
import { SoccerOverlay } from '@/ui/SoccerUI'
import { BowlingOverlay } from '@/ui/BowlingUI'
import { MinigolfOverlay } from '@/ui/MinigolfUI'
import { Hub } from '@/scenes/Hub'
import { Basketball } from '@/scenes/Basketball'
import { Soccer } from '@/scenes/Soccer'
import { Bowling } from '@/scenes/Bowling'
import { MiniGolf } from '@/scenes/MiniGolf'

function SceneContent() {
  const currentScene = useGameStore((s) => s.currentScene)

  switch (currentScene) {
    case 'hub':
      return <Hub />
    case 'basketball':
      return <Basketball />
    case 'soccer':
      return <Soccer />
    case 'bowling':
      return <Bowling />
    case 'minigolf':
      return <MiniGolf />
    default:
      return null
  }
}

function GameOverlay() {
  const currentScene = useGameStore((s) => s.currentScene)

  switch (currentScene) {
    case 'basketball':
      return <BasketballOverlay />
    case 'soccer':
      return <SoccerOverlay />
    case 'bowling':
      return <BowlingOverlay />
    case 'minigolf':
      return <MinigolfOverlay />
    default:
      return null
  }
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1A1A2E',
      zIndex: 200,
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#FF6B35' }}>
        Loading...
      </div>
    </div>
  )
}

export function App() {
  const currentScene = useGameStore((s) => s.currentScene)
  const gamePhase = useGameStore((s) => s.gamePhase)
  const isLoading = useGameStore((s) => s.isLoading)

  return (
    <>
      {currentScene === 'menu' ? (
        <MainMenu />
      ) : (
        <>
          <Suspense fallback={<LoadingScreen />}>
            <GameCanvas>
              <SceneContent />
            </GameCanvas>
          </Suspense>
          {/* DOM overlays rendered OUTSIDE Canvas for reliable display */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <GameOverlay />
          </div>
        </>
      )}

      {gamePhase === 'paused' && <PauseMenu />}
      {isLoading && <LoadingScreen />}
    </>
  )
}
