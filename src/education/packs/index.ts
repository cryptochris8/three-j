import type { Question, GradeLevel } from '@/types'
import { grade1Questions } from './grade1'
import { grade2ComprehensiveQuestions } from './grade2-comprehensive'
import { grade3Questions } from '@/education/questions/grade3'
import { grade4Questions } from './grade4'
import { grade5Questions } from './grade5'
import { grade6Questions } from './grade6'

const gradeQuestionMap: Record<GradeLevel, Question[]> = {
  1: grade1Questions,
  2: grade2ComprehensiveQuestions,
  3: grade3Questions,
  4: grade4Questions,
  5: grade5Questions,
  6: grade6Questions,
}

export function getGradeQuestions(grade: GradeLevel): Question[] {
  return gradeQuestionMap[grade] ?? []
}

export function getAllGradeQuestions(): Question[] {
  return Object.values(gradeQuestionMap).flat()
}

export { grade1Questions } from './grade1'
export { grade2ComprehensiveQuestions } from './grade2-comprehensive'
export { grade3Questions } from '@/education/questions/grade3'
export { grade4Questions } from './grade4'
export { grade5Questions } from './grade5'
export { grade6Questions } from './grade6'
