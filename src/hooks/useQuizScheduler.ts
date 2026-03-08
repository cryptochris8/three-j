import { useRef, useEffect } from 'react'
import type { QuestionCategory } from '@/types'

interface QuizSchedulerOptions {
  roundCount: number
  interval: number
  isActive: boolean
  category?: QuestionCategory
  triggerQuiz: (category?: QuestionCategory) => void
  onSkip?: () => void
}

/**
 * Centralized quiz trigger logic. Fires quiz every `interval` rounds,
 * prevents double-triggers via a ref tracking the last triggered round.
 */
export function useQuizScheduler({
  roundCount,
  interval,
  isActive,
  category,
  triggerQuiz,
  onSkip,
}: QuizSchedulerOptions) {
  const lastTriggered = useRef(0)

  useEffect(() => {
    if (!isActive || roundCount <= 0) return
    if (roundCount % interval !== 0) {
      onSkip?.()
      return
    }
    if (roundCount === lastTriggered.current) return

    lastTriggered.current = roundCount
    triggerQuiz(category)
  }, [roundCount, interval, isActive, category, triggerQuiz, onSkip])

  const reset = () => {
    lastTriggered.current = 0
  }

  return { reset }
}
