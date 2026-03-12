import type { Question } from '@/types'

export const equivalentFractionsQuestions: Question[] = [
  // Q1 — 1/2 = 2/4 (fraction bars)
  {
    id: 'ef-1',
    category: 'equivalent-fractions',
    difficulty: 'easy',
    question: 'Look at the shaded bars. Which fraction is equal to 1/2?',
    options: ['1/4', '2/4', '3/4', '4/4'],
    correctIndex: 1,
    explanation: 'Both bars show the same amount shaded. 1 out of 2 parts is the same as 2 out of 4 parts.',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '1/2', totalParts: 2, shadedParts: 1, color: '#3498DB' },
        { label: '?', totalParts: 4, shadedParts: 2, color: '#2ECC71' },
      ],
    },
  },

  // Q2 — 2/3 = 4/6 (fraction bars)
  {
    id: 'ef-2',
    category: 'equivalent-fractions',
    difficulty: 'easy',
    question: 'Look at the shaded bars. Which fraction equals 2/3?',
    options: ['2/6', '3/6', '4/6', '5/6'],
    correctIndex: 2,
    explanation: '2 out of 3 parts covers the same amount as 4 out of 6 parts.',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '2/3', totalParts: 3, shadedParts: 2, color: '#E74C3C' },
        { label: '?', totalParts: 6, shadedParts: 4, color: '#F39C12' },
      ],
    },
  },

  // Q3 — 2/4 = 1/2 (number line style, shown as bars)
  {
    id: 'ef-3',
    category: 'equivalent-fractions',
    difficulty: 'easy',
    question: 'The top bar shows 2/4 shaded. Which fraction is at the same spot?',
    options: ['1/4', '1/2', '3/4', '1/3'],
    correctIndex: 1,
    explanation: '2/4 and 1/2 are the same amount. If you shade 2 out of 4, it is the same as 1 out of 2.',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '2/4', totalParts: 4, shadedParts: 2, color: '#9B59B6' },
        { label: '?', totalParts: 2, shadedParts: 1, color: '#1ABC9C' },
      ],
    },
  },

  // Q4 — 3/4 = 6/8 (fraction bars)
  {
    id: 'ef-4',
    category: 'equivalent-fractions',
    difficulty: 'medium',
    question: 'Look at the bars. Which fraction is equal to 3/4?',
    options: ['3/8', '4/8', '6/8', '8/8'],
    correctIndex: 2,
    explanation: '3 out of 4 parts covers the same length as 6 out of 8 parts.',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '3/4', totalParts: 4, shadedParts: 3, color: '#E67E22' },
        { label: '?', totalParts: 8, shadedParts: 6, color: '#3498DB' },
      ],
    },
  },

  // Q5 — 1/2 = 3/6 (fraction bars)
  {
    id: 'ef-5',
    category: 'equivalent-fractions',
    difficulty: 'medium',
    question: 'Which fraction equals 1/2? Look at how much is shaded.',
    options: ['1/6', '2/6', '3/6', '4/6'],
    correctIndex: 2,
    explanation: '1 out of 2 is the same amount as 3 out of 6. Both fill exactly half the bar.',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '1/2', totalParts: 2, shadedParts: 1, color: '#2ECC71' },
        { label: '?', totalParts: 6, shadedParts: 3, color: '#E74C3C' },
      ],
    },
  },

  // Q6 — 1/3 = 2/6 (fraction bars)
  {
    id: 'ef-6',
    category: 'equivalent-fractions',
    difficulty: 'medium',
    question: 'The top bar shows 1/3 shaded. Which fraction below is the same amount?',
    options: ['1/6', '2/6', '3/6', '4/6'],
    correctIndex: 1,
    explanation: '1 out of 3 parts is the same as 2 out of 6 parts. Both cover the same length.',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '1/3', totalParts: 3, shadedParts: 1, color: '#F1C40F' },
        { label: '?', totalParts: 6, shadedParts: 2, color: '#9B59B6' },
      ],
    },
  },

  // Q7 — 2/4 = 4/8 (fraction bars)
  {
    id: 'ef-7',
    category: 'equivalent-fractions',
    difficulty: 'hard',
    question: 'Which fraction equals 2/4? Compare the shaded parts.',
    options: ['2/8', '3/8', '4/8', '5/8'],
    correctIndex: 2,
    explanation: '2 out of 4 parts is the same as 4 out of 8 parts. Both fill exactly half!',
    ageMin: 7,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '2/4', totalParts: 4, shadedParts: 2, color: '#1ABC9C' },
        { label: '?', totalParts: 8, shadedParts: 4, color: '#E67E22' },
      ],
    },
  },
]
