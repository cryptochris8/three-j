import { Suspense, useEffect } from 'react'
import { GameCanvas } from '@/core/GameCanvas'
import { useGameStore } from '@/stores/useGameStore'
import { useAudioSync } from '@/hooks/useAudioSync'
import { audioManager } from '@/core/AudioManager'
import type { MusicName } from '@/core/AudioManager'
import { MainMenu } from '@/ui/MainMenu'
import { PauseMenu } from '@/ui/PauseMenu'
import { TutorialOverlay } from '@/ui/TutorialOverlay'
import { HomeButton } from '@/ui/HomeButton'
import { AchievementToast } from '@/ui/AchievementToast'
import { GAME_REGISTRY } from '@/core/gameRegistry'

function SceneContent() {
  const currentScene = useGameStore((s) => s.currentScene)
  const entry = GAME_REGISTRY[currentScene]
  if (!entry) return null
  const SceneComponent = entry.scene
  return <SceneComponent />
}

function GameOverlay() {
  const currentScene = useGameStore((s) => s.currentScene)
  const entry = GAME_REGISTRY[currentScene]
  if (!entry?.overlay) return null
  const OverlayComponent = entry.overlay
  return <OverlayComponent />
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

const SCENE_MUSIC: Record<string, MusicName> = {
  menu: 'menu',
  hub: 'hub',
  basketball: 'basketball',
  soccer: 'soccer',
  bowling: 'bowling',
  minigolf: 'minigolf',
  archery: 'archery',
  football: 'football',
  'soccer-match': 'soccer',
}

export function App() {
  useAudioSync()
  const currentScene = useGameStore((s) => s.currentScene)
  const gamePhase = useGameStore((s) => s.gamePhase)
  const isLoading = useGameStore((s) => s.isLoading)

  // Play background music for each scene
  useEffect(() => {
    const musicName = SCENE_MUSIC[currentScene]
    if (musicName) {
      audioManager.playMusic(musicName)
    }
  }, [currentScene])

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
          {/* Home button always visible when not on menu */}
          <HomeButton />
        </>
      )}

      {gamePhase === 'playing' && currentScene !== 'hub' && currentScene !== 'menu' && (
        <TutorialOverlay game={currentScene} />
      )}
      {gamePhase === 'paused' && <PauseMenu />}
      {isLoading && <LoadingScreen />}
      <AchievementToast />
    </>
  )
}
