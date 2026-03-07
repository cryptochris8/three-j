import { useState, useEffect, useCallback, useRef } from 'react'
import { useEducationStore } from '@/stores/useEducationStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { audioManager } from '@/core/AudioManager'
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
  const modalRef = useRef<HTMLDivElement>(null)
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
      addCoins(5)
      audioManager.play('correct')
    } else {
      answerWrong(question.id)
      audioManager.play('wrong')
    }

    // Trigger CSS animation on the modal
    const el = modalRef.current
    if (el) {
      el.classList.remove('quiz-modal-correct', 'quiz-modal-wrong')
      // Force reflow so re-adding the class restarts the animation
      void el.offsetWidth
      el.classList.add(correct ? 'quiz-modal-correct' : 'quiz-modal-wrong')
    }

    setTimeout(() => onComplete(correct), 3000)
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
      pointerEvents: 'auto',
    }}>
      <div
        ref={modalRef}
        style={{
        background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        border: showResult
          ? `3px solid ${isCorrect ? '#2ECC71' : '#E74C3C'}`
          : '2px solid rgba(255,255,255,0.1)',
        boxShadow: showResult
          ? `0 20px 60px ${isCorrect ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`
          : '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Result banner — shown prominently at top when answered */}
        {showResult && (
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.8rem',
            borderRadius: '16px',
            background: isCorrect
              ? 'rgba(46,204,113,0.2)'
              : 'rgba(231,76,60,0.2)',
          }}>
            <div style={{
              fontSize: '2.5rem',
              lineHeight: 1,
              marginBottom: '0.3rem',
            }}>
              {isCorrect ? '\u2714' : '\u2718'}
            </div>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: isCorrect ? '#2ECC71' : '#E74C3C',
            }}>
              {isCorrect ? (
                <span>Correct! <span className="coin-bounce" style={{ display: 'inline-block' }}>+5 Coins</span></span>
              ) : 'Incorrect'}
            </div>
          </div>
        )}

        {/* Timer */}
        {!showResult && (
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
        )}

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
            let label = ''
            if (showResult) {
              if (i === question.correctIndex) {
                bg = 'rgba(46,204,113,0.3)'
                border = '3px solid #2ECC71'
                label = ' \u2714'
              } else if (i === selectedIndex && !isCorrect) {
                bg = 'rgba(231,76,60,0.3)'
                border = '3px solid #E74C3C'
                label = ' \u2718'
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
                  fontWeight: showResult && i === question.correctIndex ? 700 : 500,
                  borderRadius: '12px',
                  background: bg,
                  color: '#fff',
                  border,
                  textAlign: 'left',
                  cursor: showResult ? 'default' : 'pointer',
                }}
              >
                {option}{label}
              </button>
            )
          })}
        </div>

        {/* Explanation for wrong answers */}
        {showResult && !isCorrect && question.explanation && (
          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            textAlign: 'center',
            fontSize: '0.9rem',
            opacity: 0.85,
            lineHeight: 1.5,
          }}>
            {question.explanation}
          </div>
        )}
      </div>
    </div>
  )
}
