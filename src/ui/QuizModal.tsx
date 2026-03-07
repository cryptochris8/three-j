import { useState, useEffect, useCallback } from 'react'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { TIMING } from '@/core/constants'
import type { Question } from '@/types'

interface QuizModalProps {
  question: Question
  onComplete: (correct: boolean) => void
}

export function QuizModal({ question, onComplete }: QuizModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(TIMING.quizTimeSeconds)
  const answerCorrect = useEducationStore((s) => s.answerCorrect)
  const answerWrong = useEducationStore((s) => s.answerWrong)
  const addCoins = usePlayerStore((s) => s.addCoins)

  const handleAnswer = useCallback((index: number) => {
    if (showResult) return
    setSelectedIndex(index)
    setShowResult(true)

    const correct = index === question.correctIndex
    if (correct) {
      answerCorrect(question.id)
      addCoins(correct ? 5 : 0)
    } else {
      answerWrong(question.id)
    }

    setTimeout(() => onComplete(correct), 2000)
  }, [showResult, question, answerCorrect, answerWrong, addCoins, onComplete])

  useEffect(() => {
    if (showResult) return
    if (timeLeft <= 0) {
      handleAnswer(-1) // Time's up = wrong
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, showResult, handleAnswer])

  const isCorrect = selectedIndex === question.correctIndex

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 95,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Timer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>
            {question.category}
          </span>
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: timeLeft <= 5 ? '#E74C3C' : '#F7C948',
          }}>
            {timeLeft}s
          </span>
        </div>

        {/* Question */}
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          lineHeight: 1.4,
          textAlign: 'center',
        }}>
          {question.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, i) => {
            let bg = 'rgba(255,255,255,0.08)'
            let border = '2px solid rgba(255,255,255,0.12)'
            if (showResult) {
              if (i === question.correctIndex) {
                bg = 'rgba(46,204,113,0.3)'
                border = '2px solid #2ECC71'
              } else if (i === selectedIndex && !isCorrect) {
                bg = 'rgba(231,76,60,0.3)'
                border = '2px solid #E74C3C'
              }
            } else if (i === selectedIndex) {
              bg = 'rgba(255,107,53,0.3)'
              border = '2px solid #FF6B35'
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                style={{
                  padding: '1rem 1.2rem',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  background: bg,
                  color: '#fff',
                  border,
                  textAlign: 'left',
                  cursor: showResult ? 'default' : 'pointer',
                }}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div style={{
            marginTop: '1.2rem',
            padding: '0.8rem',
            borderRadius: '12px',
            background: isCorrect ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: isCorrect ? '#2ECC71' : '#E74C3C',
              marginBottom: '0.3rem',
            }}>
              {isCorrect ? 'Correct! +5 Coins' : 'Not quite!'}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {question.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
