import type { Question, Difficulty } from '@/types'

interface SpellingWord {
  word: string
  difficulty: Difficulty
  ageMin: number
}

const SPELLING_WORDS: SpellingWord[] = [
  // Easy (age 6+)
  { word: 'cat', difficulty: 'easy', ageMin: 5 },
  { word: 'dog', difficulty: 'easy', ageMin: 5 },
  { word: 'ball', difficulty: 'easy', ageMin: 5 },
  { word: 'play', difficulty: 'easy', ageMin: 5 },
  { word: 'jump', difficulty: 'easy', ageMin: 5 },
  { word: 'kick', difficulty: 'easy', ageMin: 5 },
  { word: 'goal', difficulty: 'easy', ageMin: 5 },
  { word: 'team', difficulty: 'easy', ageMin: 5 },
  { word: 'game', difficulty: 'easy', ageMin: 5 },
  { word: 'fast', difficulty: 'easy', ageMin: 5 },
  { word: 'swim', difficulty: 'easy', ageMin: 5 },
  { word: 'run', difficulty: 'easy', ageMin: 5 },
  { word: 'win', difficulty: 'easy', ageMin: 5 },
  { word: 'fun', difficulty: 'easy', ageMin: 5 },
  { word: 'bat', difficulty: 'easy', ageMin: 5 },
  // Medium (age 7+)
  { word: 'basket', difficulty: 'medium', ageMin: 7 },
  { word: 'soccer', difficulty: 'medium', ageMin: 7 },
  { word: 'bowling', difficulty: 'medium', ageMin: 7 },
  { word: 'trophy', difficulty: 'medium', ageMin: 7 },
  { word: 'athlete', difficulty: 'medium', ageMin: 7 },
  { word: 'score', difficulty: 'medium', ageMin: 7 },
  { word: 'champion', difficulty: 'medium', ageMin: 7 },
  { word: 'stadium', difficulty: 'medium', ageMin: 7 },
  { word: 'practice', difficulty: 'medium', ageMin: 7 },
  { word: 'whistle', difficulty: 'medium', ageMin: 7 },
  { word: 'referee', difficulty: 'medium', ageMin: 7 },
  { word: 'penalty', difficulty: 'medium', ageMin: 7 },
  { word: 'bounce', difficulty: 'medium', ageMin: 7 },
  { word: 'dribble', difficulty: 'medium', ageMin: 7 },
  { word: 'tackle', difficulty: 'medium', ageMin: 7 },
  // Hard (age 8+)
  { word: 'tournament', difficulty: 'hard', ageMin: 8 },
  { word: 'gymnasium', difficulty: 'hard', ageMin: 8 },
  { word: 'competitive', difficulty: 'hard', ageMin: 8 },
  { word: 'perseverance', difficulty: 'hard', ageMin: 8 },
  { word: 'excellence', difficulty: 'hard', ageMin: 8 },
  { word: 'professional', difficulty: 'hard', ageMin: 8 },
  { word: 'sportsmanship', difficulty: 'hard', ageMin: 8 },
  { word: 'accomplishment', difficulty: 'hard', ageMin: 8 },
  { word: 'determination', difficulty: 'hard', ageMin: 8 },
  { word: 'extraordinary', difficulty: 'hard', ageMin: 8 },
]

function scrambleWord(word: string): string {
  const chars = word.split('')
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]]
  }
  const scrambled = chars.join('')
  return scrambled === word ? scrambleWord(word) : scrambled
}

function generateMisspelling(word: string): string {
  const i = Math.floor(Math.random() * word.length)
  const chars = word.split('')
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  let replacement = chars[i]
  while (replacement === chars[i]) {
    replacement = alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  chars[i] = replacement
  return chars.join('')
}

export function generateSpellingQuestion(difficulty: Difficulty): Question {
  const pool = SPELLING_WORDS.filter((w) => w.difficulty === difficulty)
  const wordObj = pool[Math.floor(Math.random() * pool.length)]
  const { word } = wordObj

  // 50% chance of "which is spelled correctly" vs "unscramble"
  if (Math.random() > 0.5) {
    // Which is spelled correctly?
    const wrong1 = generateMisspelling(word)
    const wrong2 = generateMisspelling(word)
    const wrong3 = generateMisspelling(word)
    const options = [word, wrong1, wrong2, wrong3]
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]
    }
    return {
      id: `spell-${word}-${Date.now()}`,
      category: 'spelling',
      difficulty,
      question: `Which word is spelled correctly?`,
      options,
      correctIndex: options.indexOf(word),
      explanation: `The correct spelling is "${word}"`,
      ageMin: wordObj.ageMin,
      ageMax: 10,
    }
  } else {
    // Unscramble
    const scrambled = scrambleWord(word)
    const wrong1 = SPELLING_WORDS.filter((w) => w.word !== word)[Math.floor(Math.random() * (SPELLING_WORDS.length - 1))].word
    const wrong2 = SPELLING_WORDS.filter((w) => w.word !== word && w.word !== wrong1)[Math.floor(Math.random() * (SPELLING_WORDS.length - 2))].word
    const options = [word, wrong1, wrong2]
    // Add a 4th option
    const wrong3 = SPELLING_WORDS.filter((w) => w.word !== word && w.word !== wrong1 && w.word !== wrong2)[Math.floor(Math.random() * (SPELLING_WORDS.length - 3))].word
    options.push(wrong3)
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]
    }
    return {
      id: `spell-unscramble-${word}-${Date.now()}`,
      category: 'spelling',
      difficulty,
      question: `Unscramble: "${scrambled.toUpperCase()}"`,
      options,
      correctIndex: options.indexOf(word),
      explanation: `The word is "${word}"`,
      ageMin: wordObj.ageMin,
      ageMax: 10,
    }
  }
}
