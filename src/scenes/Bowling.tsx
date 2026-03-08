import { useEffect, useCallback, useRef, useMemo } from 'react'
import { Text } from '@react-three/drei'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Lane } from '@/games/bowling/Lane'
import { Pins, type PinsHandle } from '@/games/bowling/Pins'
import { BowlingBall } from '@/games/bowling/BowlingBall'
import { useBowling } from '@/games/bowling/useBowling'
import { getBowlingConfig } from '@/games/bowling/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { useGameScene } from '@/hooks/useGameScene'
import { audioManager } from '@/core/AudioManager'

function BowlingGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const selectedDifficulty = useGameStore((s) => s.selectedDifficulty)
  const bowlingConfig = useMemo(() => getBowlingConfig(selectedDifficulty), [selectedDifficulty])
  const addScore = useScoreStore((s) => s.addScore)
  const {
    phase: bowlingPhase,
    currentFrame,
    isStrike,
    isSpare,
    frameScores,
    setPinsKnocked,
    endBall,
    nextFrame,
    resetGame,
  } = useBowling()

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, endGame } = useGameScene('bowling', () => resetGame(bowlingConfig.totalFrames))
  const pinsRef = useRef<PinsHandle>(null)

  const handleBallStopped = useCallback(() => {
    if (!pinsRef.current) return
    setTimeout(() => {
      if (!pinsRef.current) return
      const knocked = pinsRef.current.checkKnocked()
      setPinsKnocked(knocked)
      endBall()
    }, 1500)
  }, [setPinsKnocked, endBall])

  // Handle frame over
  useEffect(() => {
    if (bowlingPhase === 'frameover') {
      let text = ''
      let color = '#F7C948'
      const lastScore = frameScores[frameScores.length - 1] ?? 0

      if (isStrike) {
        text = 'STRIKE!'
        color = '#2ECC71'
        audioManager.play('pinCrash')
        audioManager.playVoice('strike')
        triggerConfetti()
      } else if (isSpare) {
        text = 'SPARE!'
        color = '#4FC3F7'
        audioManager.play('pinCrash')
        audioManager.playVoice('spare')
      } else {
        text = `+${lastScore}`
        audioManager.play('pinCrash')
      }

      addScore(lastScore)
      addPopup(text, [0, 2, -5], color)

      setTimeout(() => {
        if (currentFrame % 2 === 0 && currentFrame < bowlingConfig.totalFrames) {
          triggerQuiz('spelling')
        } else {
          handleNextFrame()
        }
      }, 2000)
    }
  }, [bowlingPhase, isStrike, isSpare, frameScores, addScore, currentFrame, triggerConfetti, addPopup, triggerQuiz])

  const handleNextFrame = useCallback(() => {
    if (pinsRef.current) {
      pinsRef.current.resetPins()
    }
    nextFrame()
    // Check synchronously after nextFrame — avoids stale-state bug
    // where a reactive effect fires 'done' on remount from previous game
    if (useBowling.getState().phase === 'done') {
      endGame()
    } else {
      useGameStore.getState().setGamePhase('playing')
    }
  }, [nextFrame, endGame])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Skybox scene="bowling" />
      <color attach="background" args={['#1a1a2e']} />

      <PhysicsProvider paused={gamePhase !== 'playing'}>
        <Lane hasBumpers={bowlingConfig.hasBumpers} />
        <Pins ref={pinsRef} />
        <BowlingBall onBallStopped={handleBallStopped} />
      </PhysicsProvider>

      {popups.map((popup) => (
        <ScorePopup
          key={popup.id}
          text={popup.text}
          position={popup.position}
          color={popup.color}
          onComplete={() => removePopup(popup.id)}
        />
      ))}

      {showConfetti && <Confetti position={[0, 1, -7]} />}

      <Text
        position={[-1.5, 2, -7]}
        fontSize={0.3}
        color="#fff"
        anchorX="left"
      >
        {`Frame ${currentFrame} / ${bowlingConfig.totalFrames}`}
      </Text>
    </>
  )
}

export function Bowling() {
  return <BowlingGame />
}
