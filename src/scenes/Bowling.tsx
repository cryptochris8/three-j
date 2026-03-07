import { useEffect, useCallback, useState, useRef } from 'react'
import { Environment, Text } from '@react-three/drei'
import { useGameStore } from '@/stores/useGameStore'
import { useScoreStore } from '@/stores/useScoreStore'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { PhysicsProvider } from '@/core/PhysicsProvider'
import { Lane } from '@/games/bowling/Lane'
import { Pins, type PinsHandle } from '@/games/bowling/Pins'
import { BowlingBall } from '@/games/bowling/BowlingBall'
import { useBowling } from '@/games/bowling/useBowling'
import { BOWLING_CONFIG } from '@/games/bowling/config'
import { ScorePopup } from '@/components/ScorePopup'
import { Confetti } from '@/components/Confetti'
import { getQuestionEngine } from '@/education/QuestionEngine'

function BowlingGame() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const setGamePhase = useGameStore((s) => s.setGamePhase)
  const addScore = useScoreStore((s) => s.addScore)
  const resetCurrentScore = useScoreStore((s) => s.resetCurrentScore)
  const difficulty = useEducationStore((s) => s.difficulty)
  const answeredIds = useEducationStore((s) => s.answeredIds)
  const activeProfile = usePlayerStore((s) => s.getActiveProfile())
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

  const pinsRef = useRef<PinsHandle>(null)
  const [popups, setPopups] = useState<{ id: number; text: string; position: [number, number, number]; color: string }[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const popupId = useRef(0)

  // Initialize
  useEffect(() => {
    resetCurrentScore()
    resetGame()
    setGamePhase('playing')
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
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else if (isSpare) {
        text = 'SPARE!'
        color = '#4FC3F7'
      } else {
        text = `+${lastScore}`
      }

      addScore(lastScore)

      const id = ++popupId.current
      setPopups((prev) => [...prev, { id, text, position: [0, 2, -5], color }])

      // After showing result, check for quiz or next frame
      setTimeout(() => {
        // Trigger quiz every other frame
        if (currentFrame % 2 === 0 && currentFrame < BOWLING_CONFIG.totalFrames) {
          const engine = getQuestionEngine(answeredIds)
          const question = engine.getQuestion(difficulty, 'spelling', activeProfile?.age ?? 8)
          useEducationStore.getState().setCurrentQuestion(question)
          setGamePhase('quiz')
        } else {
          handleNextFrame()
        }
      }, 2000)
    }
  }, [bowlingPhase, isStrike, isSpare, frameScores, addScore, currentFrame])

  const handleNextFrame = useCallback(() => {
    if (pinsRef.current) {
      pinsRef.current.resetPins()
    }
    nextFrame()
    setGamePhase('playing')
  }, [nextFrame, setGamePhase])

  useEffect(() => {
    if (bowlingPhase === 'done') {
      setGamePhase('gameover')
    }
  }, [bowlingPhase, setGamePhase])

  const removePopup = useCallback((id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id))
  }, [])

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
      <Environment preset="warehouse" />
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
