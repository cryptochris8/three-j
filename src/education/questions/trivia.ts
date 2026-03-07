import type { Question, Difficulty } from '@/types'

const TRIVIA_QUESTIONS: Question[] = [
  // Easy
  {
    id: 'trivia-1', category: 'trivia', difficulty: 'easy',
    question: 'How many players are on a basketball team on the court?',
    options: ['3', '5', '7', '11'], correctIndex: 1,
    explanation: 'A basketball team has 5 players on the court at a time.',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-2', category: 'trivia', difficulty: 'easy',
    question: 'What shape is a soccer ball?',
    options: ['Square', 'Sphere', 'Triangle', 'Cube'], correctIndex: 1,
    explanation: 'A soccer ball is a sphere (round ball).',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-3', category: 'trivia', difficulty: 'easy',
    question: 'What color is the sky on a sunny day?',
    options: ['Green', 'Red', 'Blue', 'Purple'], correctIndex: 2,
    explanation: 'The sky appears blue because of how sunlight interacts with our atmosphere.',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-4', category: 'trivia', difficulty: 'easy',
    question: 'How many bowling pins are there in a standard game?',
    options: ['5', '8', '10', '12'], correctIndex: 2,
    explanation: 'There are 10 bowling pins arranged in a triangle.',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-5', category: 'trivia', difficulty: 'easy',
    question: 'What sport uses a club and a small ball on grass?',
    options: ['Basketball', 'Soccer', 'Golf', 'Bowling'], correctIndex: 2,
    explanation: 'Golf uses clubs to hit a small ball on grass courses.',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-6', category: 'trivia', difficulty: 'easy',
    question: 'Which animal is the fastest on land?',
    options: ['Lion', 'Cheetah', 'Horse', 'Dog'], correctIndex: 1,
    explanation: 'The cheetah can run up to 70 mph, making it the fastest land animal.',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-7', category: 'trivia', difficulty: 'easy',
    question: 'How many sides does a triangle have?',
    options: ['2', '3', '4', '5'], correctIndex: 1,
    explanation: 'A triangle has 3 sides.',
    ageMin: 5, ageMax: 10,
  },
  {
    id: 'trivia-8', category: 'trivia', difficulty: 'easy',
    question: 'What do you call a baby dog?',
    options: ['Kitten', 'Puppy', 'Cub', 'Foal'], correctIndex: 1,
    explanation: 'A baby dog is called a puppy.',
    ageMin: 5, ageMax: 10,
  },

  // Medium
  {
    id: 'trivia-9', category: 'trivia', difficulty: 'medium',
    question: 'In which country was soccer (football) invented?',
    options: ['USA', 'Brazil', 'England', 'Germany'], correctIndex: 2,
    explanation: 'Modern soccer was codified in England in 1863.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-10', category: 'trivia', difficulty: 'medium',
    question: 'What is the highest score possible in a single bowling frame?',
    options: ['10', '20', '30', '50'], correctIndex: 2,
    explanation: 'A strike followed by two more strikes gives 30 points for that frame.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-11', category: 'trivia', difficulty: 'medium',
    question: 'How many holes are on a standard golf course?',
    options: ['9', '12', '15', '18'], correctIndex: 3,
    explanation: 'A standard golf course has 18 holes.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-12', category: 'trivia', difficulty: 'medium',
    question: 'What planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1,
    explanation: 'Mars is called the Red Planet because of its reddish appearance.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-13', category: 'trivia', difficulty: 'medium',
    question: 'Which ocean is the largest?',
    options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctIndex: 2,
    explanation: 'The Pacific Ocean is the largest, covering about 63 million square miles.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-14', category: 'trivia', difficulty: 'medium',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Rome'], correctIndex: 2,
    explanation: 'Paris is the capital of France.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-15', category: 'trivia', difficulty: 'medium',
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'], correctIndex: 2,
    explanation: 'There are 7 continents on Earth.',
    ageMin: 7, ageMax: 10,
  },
  {
    id: 'trivia-16', category: 'trivia', difficulty: 'medium',
    question: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Marble'], correctIndex: 2,
    explanation: 'Diamond is the hardest natural substance on Earth.',
    ageMin: 7, ageMax: 10,
  },

  // Hard
  {
    id: 'trivia-17', category: 'trivia', difficulty: 'hard',
    question: 'In what year were the first modern Olympic Games held?',
    options: ['1876', '1896', '1900', '1912'], correctIndex: 1,
    explanation: 'The first modern Olympic Games were held in Athens, Greece in 1896.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-18', category: 'trivia', difficulty: 'hard',
    question: 'What is the longest river in the world?',
    options: ['Amazon', 'Mississippi', 'Nile', 'Yangtze'], correctIndex: 2,
    explanation: 'The Nile River in Africa is the longest river at about 4,130 miles.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-19', category: 'trivia', difficulty: 'hard',
    question: 'How many bones are in the adult human body?',
    options: ['106', '156', '206', '256'], correctIndex: 2,
    explanation: 'An adult human body has 206 bones.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-20', category: 'trivia', difficulty: 'hard',
    question: 'What gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2,
    explanation: 'Plants absorb carbon dioxide (CO2) and release oxygen.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-21', category: 'trivia', difficulty: 'hard',
    question: 'Which basketball player is known as "His Airness"?',
    options: ['LeBron James', 'Michael Jordan', 'Kobe Bryant', 'Shaquille O\'Neal'], correctIndex: 1,
    explanation: 'Michael Jordan is nicknamed "His Airness" for his incredible jumping ability.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-22', category: 'trivia', difficulty: 'hard',
    question: 'What country has won the most FIFA World Cups?',
    options: ['Germany', 'Italy', 'Argentina', 'Brazil'], correctIndex: 3,
    explanation: 'Brazil has won the FIFA World Cup 5 times.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-23', category: 'trivia', difficulty: 'hard',
    question: 'What is the speed of light in miles per second (approximately)?',
    options: ['86,000', '186,000', '286,000', '386,000'], correctIndex: 1,
    explanation: 'Light travels at approximately 186,000 miles per second.',
    ageMin: 8, ageMax: 10,
  },
  {
    id: 'trivia-24', category: 'trivia', difficulty: 'hard',
    question: 'Which planet has the most moons?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correctIndex: 1,
    explanation: 'Saturn has the most confirmed moons of any planet.',
    ageMin: 8, ageMax: 10,
  },
]

export function getTriviaQuestion(difficulty: Difficulty): Question {
  const pool = TRIVIA_QUESTIONS.filter((q) => q.difficulty === difficulty)
  return pool[Math.floor(Math.random() * pool.length)]
}
