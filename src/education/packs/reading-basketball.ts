import type { Question } from '@/types'

export const BASKETBALL_PASSAGE = `The Amazing Story of Basketball

Did you know that basketball was invented by accident? In 1891, a gym teacher named James Naismith had a problem. It was winter in Massachusetts, and his students were bored. They couldn't play outside because of the snow and cold weather.

Naismith needed an indoor game that was fun but safe. He nailed two peach baskets to the walls at each end of the gym. Then he gave his students a soccer ball and made up some simple rules. The goal was to throw the ball into the other team's basket to score points.

The first game had only 13 rules, and there were nine players on each team. Something funny happened during those early games. When someone scored, the game had to stop! A person climbed a ladder to get the ball out of the peach basket. It wasn't until later that someone had the smart idea to cut holes in the bottom of the baskets.

Today, basketball is one of the most popular sports in the world, and it all started with peach baskets!`

export const readingBasketballQuestions: Question[] = [
  // Q1 — Main idea
  {
    id: 'rb-1',
    category: 'reading',
    difficulty: 'easy',
    question: 'What is this passage mostly about?',
    options: [
      'How to play basketball',
      'Why winter is cold in Massachusetts',
      'How basketball was invented',
      'Famous basketball players',
    ],
    correctIndex: 2,
    explanation: 'The passage tells the story of how James Naismith invented basketball in 1891.',
    ageMin: 7,
    ageMax: 10,
    passage: BASKETBALL_PASSAGE,
  },

  // Q2 — Detail recall
  {
    id: 'rb-2',
    category: 'reading',
    difficulty: 'easy',
    question: 'What did James Naismith use as the first basketball hoops?',
    options: [
      'Metal hoops',
      'Peach baskets',
      'Wooden boxes',
      'Trash cans',
    ],
    correctIndex: 1,
    explanation: 'The passage says, "He nailed two peach baskets to the walls at each end of the gym."',
    ageMin: 7,
    ageMax: 10,
    passage: BASKETBALL_PASSAGE,
  },

  // Q3 — Vocabulary in context
  {
    id: 'rb-3',
    category: 'reading',
    difficulty: 'medium',
    question: 'In the passage, what does the word "invented" mean?',
    options: [
      'Borrowed from someone else',
      'Created something new',
      'Fixed something broken',
      'Played a game',
    ],
    correctIndex: 1,
    explanation: 'Naismith created basketball when it didn\'t exist before, making up new rules and using items in a new way.',
    ageMin: 7,
    ageMax: 10,
    passage: BASKETBALL_PASSAGE,
  },

  // Q4 — Cause and effect
  {
    id: 'rb-4',
    category: 'reading',
    difficulty: 'medium',
    question: 'Why did Naismith\'s students need an indoor game?',
    options: [
      'The gym was brand new',
      'They were tired of outdoor sports',
      'It was winter with snow and cold weather',
      'The principal told them to stay inside',
    ],
    correctIndex: 2,
    explanation: 'The passage says, "They couldn\'t play outside because of the snow and cold weather."',
    ageMin: 7,
    ageMax: 10,
    passage: BASKETBALL_PASSAGE,
  },

  // Q5 — Inference from text
  {
    id: 'rb-5',
    category: 'reading',
    difficulty: 'hard',
    question: 'Why did someone climb a ladder during early basketball games?',
    options: [
      'To fix the peach baskets',
      'To watch the game better',
      'To get the ball out of the basket',
      'To hang decorations',
    ],
    correctIndex: 2,
    explanation: 'The passage states, "A person climbed a ladder to get the ball out of the peach basket."',
    ageMin: 7,
    ageMax: 10,
    passage: BASKETBALL_PASSAGE,
  },
]
