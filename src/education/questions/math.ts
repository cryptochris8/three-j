import type { Question, Difficulty } from '@/types'

let mathIdCounter = 0

function generateAddition(difficulty: Difficulty): Question {
  const id = `math-add-${++mathIdCounter}`
  let a: number, b: number
  if (difficulty === 'easy') {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 10) + 1
  } else if (difficulty === 'medium') {
    a = Math.floor(Math.random() * 50) + 10
    b = Math.floor(Math.random() * 50) + 10
  } else {
    a = Math.floor(Math.random() * 100) + 50
    b = Math.floor(Math.random() * 100) + 50
  }
  const answer = a + b
  const options = generateOptions(answer, difficulty)
  return {
    id,
    category: 'math',
    difficulty,
    question: `What is ${a} + ${b}?`,
    options: options.map(String),
    correctIndex: options.indexOf(answer),
    explanation: `${a} + ${b} = ${answer}`,
    ageMin: difficulty === 'easy' ? 5 : 7,
    ageMax: 10,
  }
}

function generateSubtraction(difficulty: Difficulty): Question {
  const id = `math-sub-${++mathIdCounter}`
  let a: number, b: number
  if (difficulty === 'easy') {
    a = Math.floor(Math.random() * 15) + 5
    b = Math.floor(Math.random() * a) + 1
  } else if (difficulty === 'medium') {
    a = Math.floor(Math.random() * 50) + 20
    b = Math.floor(Math.random() * 20) + 1
  } else {
    a = Math.floor(Math.random() * 200) + 50
    b = Math.floor(Math.random() * 50) + 10
  }
  const answer = a - b
  const options = generateOptions(answer, difficulty)
  return {
    id,
    category: 'math',
    difficulty,
    question: `What is ${a} - ${b}?`,
    options: options.map(String),
    correctIndex: options.indexOf(answer),
    explanation: `${a} - ${b} = ${answer}`,
    ageMin: difficulty === 'easy' ? 5 : 7,
    ageMax: 10,
  }
}

function generateMultiplication(difficulty: Difficulty): Question {
  const id = `math-mul-${++mathIdCounter}`
  let a: number, b: number
  if (difficulty === 'easy') {
    a = Math.floor(Math.random() * 5) + 2
    b = Math.floor(Math.random() * 5) + 2
  } else if (difficulty === 'medium') {
    a = Math.floor(Math.random() * 8) + 3
    b = Math.floor(Math.random() * 8) + 3
  } else {
    a = Math.floor(Math.random() * 12) + 4
    b = Math.floor(Math.random() * 12) + 4
  }
  const answer = a * b
  const options = generateOptions(answer, difficulty)
  return {
    id,
    category: 'math',
    difficulty,
    question: `What is ${a} × ${b}?`,
    options: options.map(String),
    correctIndex: options.indexOf(answer),
    explanation: `${a} × ${b} = ${answer}`,
    ageMin: 7,
    ageMax: 10,
  }
}

function generateDivision(difficulty: Difficulty): Question {
  const id = `math-div-${++mathIdCounter}`
  let b: number, answer: number
  if (difficulty === 'easy') {
    b = Math.floor(Math.random() * 4) + 2
    answer = Math.floor(Math.random() * 5) + 2
  } else if (difficulty === 'medium') {
    b = Math.floor(Math.random() * 6) + 3
    answer = Math.floor(Math.random() * 8) + 2
  } else {
    b = Math.floor(Math.random() * 10) + 3
    answer = Math.floor(Math.random() * 12) + 2
  }
  const a = b * answer
  const options = generateOptions(answer, difficulty)
  return {
    id,
    category: 'math',
    difficulty,
    question: `What is ${a} ÷ ${b}?`,
    options: options.map(String),
    correctIndex: options.indexOf(answer),
    explanation: `${a} ÷ ${b} = ${answer}`,
    ageMin: 7,
    ageMax: 10,
  }
}

function generateOptions(correct: number, difficulty: Difficulty): number[] {
  const range = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20
  const options = new Set<number>([correct])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * range) + 1
    const sign = Math.random() > 0.5 ? 1 : -1
    const wrong = correct + sign * offset
    if (wrong > 0 && wrong !== correct) {
      options.add(wrong)
    }
  }
  const arr = Array.from(options)
  // Shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generateMathQuestion(difficulty: Difficulty): Question {
  const generators = difficulty === 'easy'
    ? [generateAddition, generateSubtraction]
    : [generateAddition, generateSubtraction, generateMultiplication, generateDivision]

  const generator = generators[Math.floor(Math.random() * generators.length)]
  return generator(difficulty)
}
