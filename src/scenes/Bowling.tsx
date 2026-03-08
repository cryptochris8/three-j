import { useEffect, useCallback, useRef } from 'react'
import { Text } from '@react-three/drei'
import { Skybox } from '@/components/Skybox'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Lane } from '@/games/bowling/Lane'
import { Pins, type PinsHandle } from '@/games/bowling/Pins'
import { BowlingBall } from '@/games/bowling/BowlingBall'
import { useBowling } from '@/games/bowling/useBowling'
import { BOWLING_CONFIG } from '@/games/bowling/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { useGameSession } from '@/hooks/useGameSession'
import { useGameKeyboard } from '@/hooks/useGameKeyboard'
import { useEducationStore } from '@/stores/useEducationStore'
import { audioManager } from '@/core/AudioManager'

function BowlingGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const addScore = useScoreStore((s) => s.addScore)
  const difficulty = useEducationStore((s) => s.difficulty)
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

  const { popups, showConfetti, addPopup, removePopup, triggerConfetti, triggerQuiz, initGame, endGame } = useGameSession()
  useGameKeyboard()
  const pinsRef = useRef<PinsHandle>(null)

  // Initialize
  useEffect(() => {
    initGame(resetGame)
  }, [])

  const handleBallStopped = useCallback(() => {
    if (!pinsRef.current) return

    // Wait a moment for pins to settle
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

      // After showing result, check for quiz or next frame
      setTimeout(() => {
        if (currentFrame % 2 === 0 && currentFrame < BOWLING_CONFIG.totalFrames) {
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
    useGameStore.getState().setGamePhase('playing')
  }, [nextFrame])

  useEffect(() => {
    if (bowlingPhase === 'done') {
      endGame()
    }
  }, [bowlingPhase, endGame])

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
        <Lane hasBumpers={difficulty === 'easy'} />
        <Pins ref={pinsRef} />
        <BowlingBall onBallStopped={handleBallStopped} />
      </PhysicsProvider>

      {/* Score popups */}
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

      {/* Frame indicator */}
      <Text
        position={[-1.5, 2, -7]}
        fontSize={0.3}
        color="#fff"
        anchorX="left"
      >
        {`Frame ${currentFrame} / ${BOWLING_CONFIG.totalFrames}`}
      </Text>

      {/* UI overlays now rendered outside Canvas via BowlingOverlay */}
    </>
  )
}

export function Bowling() {
  return <BowlingGame />
}
