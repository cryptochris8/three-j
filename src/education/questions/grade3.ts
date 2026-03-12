import type { Question } from '@/types'

/**
 * Grade 3 (Age 8-9) Question Bank
 * Aligned with Common Core State Standards
 *
 * Distribution:
 * - Math: 20 questions (3.OA, 3.NF, 3.MD, 3.G)
 * - Reading: 15 questions (3 passages, 5 questions each)
 * - Spelling: 10 questions (prefixes, suffixes, homophones)
 * - Science: 5 questions (forces, motion, weather, ecosystems)
 *
 * Total: 50 questions
 */

export const grade3Questions: Question[] = [
  // ============================================
  // MATH QUESTIONS (20 total)
  // ============================================

  // 3.OA - Multiplication and Division (8 questions)
  {
    id: 'g3-math-1',
    category: 'math',
    difficulty: 'easy',
    question: 'There are 6 boxes with 4 apples in each box. How many apples are there in total?',
    options: ['20', '24', '28', '10'],
    correctIndex: 1,
    explanation: '6 boxes × 4 apples = 24 apples. When you multiply 6 × 4, you get 24.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-2',
    category: 'math',
    difficulty: 'easy',
    question: 'What is 7 × 8?',
    options: ['54', '56', '64', '48'],
    correctIndex: 1,
    explanation: '7 × 8 = 56. This is a basic multiplication fact.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-3',
    category: 'math',
    difficulty: 'medium',
    question: 'Sarah has 36 cookies. She wants to share them equally among 9 friends. How many cookies will each friend get?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation: '36 ÷ 9 = 4. When you divide 36 cookies among 9 friends, each friend gets 4 cookies.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-4',
    category: 'math',
    difficulty: 'medium',
    question: 'What is 48 ÷ 6?',
    options: ['6', '7', '8', '9'],
    correctIndex: 2,
    explanation: '48 ÷ 6 = 8. You can check: 6 × 8 = 48.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-5',
    category: 'math',
    difficulty: 'hard',
    question: 'A farmer plants 9 rows of corn with 12 plants in each row. How many corn plants did the farmer plant?',
    options: ['96', '108', '100', '112'],
    correctIndex: 1,
    explanation: '9 rows × 12 plants = 108 plants. This uses multiplication of larger numbers.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-6',
    category: 'math',
    difficulty: 'hard',
    question: 'What is 84 ÷ 7?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
    explanation: '84 ÷ 7 = 12. You can verify: 7 × 12 = 84.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-7',
    category: 'math',
    difficulty: 'medium',
    question: 'Find the missing number: 5 × __ = 45',
    options: ['7', '8', '9', '10'],
    correctIndex: 2,
    explanation: '5 × 9 = 45. Division can help: 45 ÷ 5 = 9.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-8',
    category: 'math',
    difficulty: 'hard',
    question: 'What pattern rule describes this sequence: 3, 6, 9, 12, 15?',
    options: ['Add 2', 'Add 3', 'Multiply by 2', 'Add 4'],
    correctIndex: 1,
    explanation: 'Each number increases by 3. This is the pattern of counting by threes.',
    ageMin: 8,
    ageMax: 9,
  },

  // 3.NF - Fractions (7 questions with diagrams)
  {
    id: 'g3-math-9',
    category: 'equivalent-fractions',
    difficulty: 'easy',
    question: 'Which fraction is equivalent to 1/2?',
    options: ['2/4', '1/3', '3/5', '1/4'],
    correctIndex: 0,
    explanation: '1/2 = 2/4. Both fractions represent the same amount - one half.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '1/2', totalParts: 2, shadedParts: 1, color: '#3b82f6' },
        { label: '2/4', totalParts: 4, shadedParts: 2, color: '#10b981' }
      ]
    }
  },
  {
    id: 'g3-math-10',
    category: 'equivalent-fractions',
    difficulty: 'easy',
    question: 'Look at the diagram. Which fractions shown are equivalent?',
    options: ['1/3 and 2/6', '1/3 and 1/2', '2/6 and 1/2', 'None are equivalent'],
    correctIndex: 0,
    explanation: '1/3 = 2/6. When you divide a whole into 6 parts and shade 2, it equals dividing into 3 parts and shading 1.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '1/3', totalParts: 3, shadedParts: 1, color: '#f59e0b' },
        { label: '2/6', totalParts: 6, shadedParts: 2, color: '#8b5cf6' }
      ]
    }
  },
  {
    id: 'g3-math-11',
    category: 'equivalent-fractions',
    difficulty: 'medium',
    question: 'Which fraction is greater: 2/3 or 1/2?',
    options: ['2/3', '1/2', 'They are equal', 'Cannot determine'],
    correctIndex: 0,
    explanation: '2/3 is greater than 1/2. Looking at the bars, 2/3 has more shaded area.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '2/3', totalParts: 3, shadedParts: 2, color: '#ef4444' },
        { label: '1/2', totalParts: 2, shadedParts: 1, color: '#3b82f6' }
      ]
    }
  },
  {
    id: 'g3-math-12',
    category: 'equivalent-fractions',
    difficulty: 'medium',
    question: 'Which fraction equals 3/4?',
    options: ['4/6', '6/8', '2/3', '5/6'],
    correctIndex: 1,
    explanation: '3/4 = 6/8. Both represent three-fourths of a whole.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '3/4', totalParts: 4, shadedParts: 3, color: '#10b981' },
        { label: '6/8', totalParts: 8, shadedParts: 6, color: '#8b5cf6' }
      ]
    }
  },
  {
    id: 'g3-math-13',
    category: 'equivalent-fractions',
    difficulty: 'hard',
    question: 'Compare the fractions. Which is true?',
    options: ['3/4 > 5/6', '3/4 < 5/6', '3/4 = 5/6', '3/4 = 1/2'],
    correctIndex: 1,
    explanation: '3/4 < 5/6. The bar for 5/6 shows more shaded area than 3/4.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '3/4', totalParts: 4, shadedParts: 3, color: '#f59e0b' },
        { label: '5/6', totalParts: 6, shadedParts: 5, color: '#ef4444' }
      ]
    }
  },
  {
    id: 'g3-math-14',
    category: 'equivalent-fractions',
    difficulty: 'hard',
    question: 'Which fraction is equivalent to 2/3?',
    options: ['3/4', '4/6', '5/8', '3/6'],
    correctIndex: 1,
    explanation: '2/3 = 4/6. You can multiply both the numerator and denominator by 2.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '2/3', totalParts: 3, shadedParts: 2, color: '#3b82f6' },
        { label: '4/6', totalParts: 6, shadedParts: 4, color: '#10b981' }
      ]
    }
  },
  {
    id: 'g3-math-15',
    category: 'equivalent-fractions',
    difficulty: 'medium',
    question: 'On a number line from 0 to 1, where would 1/4 be located?',
    options: ['Halfway between 0 and 1', 'One-quarter of the way from 0 to 1', 'Three-quarters of the way from 0 to 1', 'At 1'],
    correctIndex: 1,
    explanation: '1/4 means one out of four equal parts, so it is one-quarter of the way from 0 to 1.',
    ageMin: 8,
    ageMax: 9,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '1/4', totalParts: 4, shadedParts: 1, color: '#8b5cf6' }
      ]
    }
  },

  // 3.MD - Measurement and Data (3 questions)
  {
    id: 'g3-math-16',
    category: 'math',
    difficulty: 'easy',
    question: 'A rectangle is 6 cm long and 4 cm wide. What is its perimeter?',
    options: ['10 cm', '20 cm', '24 cm', '16 cm'],
    correctIndex: 1,
    explanation: 'Perimeter = 6 + 4 + 6 + 4 = 20 cm. Add all four sides.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-17',
    category: 'math',
    difficulty: 'medium',
    question: 'A rectangle has a length of 8 feet and a width of 5 feet. What is its area?',
    options: ['13 square feet', '26 square feet', '40 square feet', '35 square feet'],
    correctIndex: 2,
    explanation: 'Area = length × width = 8 × 5 = 40 square feet.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-18',
    category: 'math',
    difficulty: 'medium',
    question: 'The soccer practice started at 3:15 PM and lasted 45 minutes. What time did it end?',
    options: ['3:45 PM', '4:00 PM', '4:15 PM', '3:60 PM'],
    correctIndex: 1,
    explanation: '3:15 PM + 45 minutes = 4:00 PM. Add 45 minutes to the start time.',
    ageMin: 8,
    ageMax: 9,
  },

  // 3.G - Geometry (2 questions)
  {
    id: 'g3-math-19',
    category: 'math',
    difficulty: 'easy',
    question: 'Which shape is a quadrilateral?',
    options: ['Triangle', 'Square', 'Circle', 'Pentagon'],
    correctIndex: 1,
    explanation: 'A square is a quadrilateral because it has 4 sides. "Quad" means four.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-math-20',
    category: 'math',
    difficulty: 'medium',
    question: 'A circle is divided into 8 equal parts. What fraction is each part?',
    options: ['1/4', '1/6', '1/8', '1/2'],
    correctIndex: 2,
    explanation: 'Each part is 1/8 of the whole circle because there are 8 equal parts.',
    ageMin: 8,
    ageMax: 9,
  },

  // ============================================
  // READING COMPREHENSION (15 questions = 3 passages × 5 questions)
  // ============================================

  // PASSAGE 1: Sports Hero - Jackie Robinson (5 questions)
  {
    id: 'g3-read-1',
    category: 'reading',
    difficulty: 'easy',
    question: 'What is the main idea of this passage?',
    options: [
      'Baseball is a fun sport',
      'Jackie Robinson was a brave athlete who broke barriers',
      'The 1940s were an important time',
      'Many people play baseball'
    ],
    correctIndex: 1,
    explanation: 'The passage focuses on Jackie Robinson breaking the color barrier and being a courageous pioneer in baseball.',
    ageMin: 8,
    ageMax: 9,
    passage: `Jackie Robinson was one of the greatest athletes in American history. In 1947, he became the first African American player in Major League Baseball in modern times. Before Jackie, Black players were not allowed to play on the same teams as white players. This was unfair and wrong.

Jackie faced many challenges. Some fans yelled mean things at him. Some players on other teams tried to hurt him. But Jackie stayed calm and strong. He let his amazing baseball skills do the talking. He could hit, run, and steal bases better than almost anyone.

Jackie helped his team, the Brooklyn Dodgers, win many games. More importantly, he showed everyone that people should be judged by their talents and character, not by the color of their skin. His courage opened doors for other Black athletes. Today, every baseball team honors Jackie Robinson on April 15th by wearing his number 42. He is remembered as a true American hero who changed sports and society forever.`
  },
  {
    id: 'g3-read-2',
    category: 'reading',
    difficulty: 'easy',
    question: 'What year did Jackie Robinson join Major League Baseball?',
    options: ['1945', '1947', '1950', '1942'],
    correctIndex: 1,
    explanation: 'The passage states that Jackie Robinson became the first African American player in Major League Baseball in 1947.',
    ageMin: 8,
    ageMax: 9,
    passage: `Jackie Robinson was one of the greatest athletes in American history. In 1947, he became the first African American player in Major League Baseball in modern times. Before Jackie, Black players were not allowed to play on the same teams as white players. This was unfair and wrong.

Jackie faced many challenges. Some fans yelled mean things at him. Some players on other teams tried to hurt him. But Jackie stayed calm and strong. He let his amazing baseball skills do the talking. He could hit, run, and steal bases better than almost anyone.

Jackie helped his team, the Brooklyn Dodgers, win many games. More importantly, he showed everyone that people should be judged by their talents and character, not by the color of their skin. His courage opened doors for other Black athletes. Today, every baseball team honors Jackie Robinson on April 15th by wearing his number 42. He is remembered as a true American hero who changed sports and society forever.`
  },
  {
    id: 'g3-read-3',
    category: 'reading',
    difficulty: 'medium',
    question: 'What does "barriers" mean in the context of this passage?',
    options: [
      'Walls or fences',
      'Obstacles that prevent progress or equality',
      'Baseball equipment',
      'Rules of the game'
    ],
    correctIndex: 1,
    explanation: 'In this context, "barriers" refers to the unfair rules and attitudes that prevented African American players from playing in Major League Baseball.',
    ageMin: 8,
    ageMax: 9,
    passage: `Jackie Robinson was one of the greatest athletes in American history. In 1947, he became the first African American player in Major League Baseball in modern times. Before Jackie, Black players were not allowed to play on the same teams as white players. This was unfair and wrong.

Jackie faced many challenges. Some fans yelled mean things at him. Some players on other teams tried to hurt him. But Jackie stayed calm and strong. He let his amazing baseball skills do the talking. He could hit, run, and steal bases better than almost anyone.

Jackie helped his team, the Brooklyn Dodgers, win many games. More importantly, he showed everyone that people should be judged by their talents and character, not by the color of their skin. His courage opened doors for other Black athletes. Today, every baseball team honors Jackie Robinson on April 15th by wearing his number 42. He is remembered as a true American hero who changed sports and society forever.`
  },
  {
    id: 'g3-read-4',
    category: 'reading',
    difficulty: 'medium',
    question: 'Why did Jackie Robinson stay calm when people were mean to him?',
    options: [
      'He did not care about baseball',
      'He wanted to show his talents and character through his actions',
      'He was afraid of getting in trouble',
      'His coach told him to'
    ],
    correctIndex: 1,
    explanation: 'The passage explains that Jackie "let his amazing baseball skills do the talking" and showed that people should be judged by their talents and character.',
    ageMin: 8,
    ageMax: 9,
    passage: `Jackie Robinson was one of the greatest athletes in American history. In 1947, he became the first African American player in Major League Baseball in modern times. Before Jackie, Black players were not allowed to play on the same teams as white players. This was unfair and wrong.

Jackie faced many challenges. Some fans yelled mean things at him. Some players on other teams tried to hurt him. But Jackie stayed calm and strong. He let his amazing baseball skills do the talking. He could hit, run, and steal bases better than almost anyone.

Jackie helped his team, the Brooklyn Dodgers, win many games. More importantly, he showed everyone that people should be judged by their talents and character, not by the color of their skin. His courage opened doors for other Black athletes. Today, every baseball team honors Jackie Robinson on April 15th by wearing his number 42. He is remembered as a true American hero who changed sports and society forever.`
  },
  {
    id: 'g3-read-5',
    category: 'reading',
    difficulty: 'hard',
    question: 'Based on the passage, what can you infer about Jackie Robinson\'s impact?',
    options: [
      'He only helped his own team win games',
      'He made it possible for other Black athletes to have opportunities',
      'He became the best player in baseball history',
      'He stopped racism completely'
    ],
    correctIndex: 1,
    explanation: 'The passage states "His courage opened doors for other Black athletes," showing his lasting impact beyond just playing baseball.',
    ageMin: 8,
    ageMax: 9,
    passage: `Jackie Robinson was one of the greatest athletes in American history. In 1947, he became the first African American player in Major League Baseball in modern times. Before Jackie, Black players were not allowed to play on the same teams as white players. This was unfair and wrong.

Jackie faced many challenges. Some fans yelled mean things at him. Some players on other teams tried to hurt him. But Jackie stayed calm and strong. He let his amazing baseball skills do the talking. He could hit, run, and steal bases better than almost anyone.

Jackie helped his team, the Brooklyn Dodgers, win many games. More importantly, he showed everyone that people should be judged by their talents and character, not by the color of their skin. His courage opened doors for other Black athletes. Today, every baseball team honors Jackie Robinson on April 15th by wearing his number 42. He is remembered as a true American hero who changed sports and society forever.`
  },

  // PASSAGE 2: Animal Habitat - Emperor Penguins (5 questions)
  {
    id: 'g3-read-6',
    category: 'reading',
    difficulty: 'easy',
    question: 'Where do emperor penguins live?',
    options: ['The jungle', 'Antarctica', 'The desert', 'The forest'],
    correctIndex: 1,
    explanation: 'The passage clearly states that emperor penguins live in Antarctica, the coldest place on Earth.',
    ageMin: 8,
    ageMax: 9,
    passage: `Emperor penguins are amazing birds that live in Antarctica, the coldest place on Earth. These penguins are the largest of all penguin species, standing about four feet tall. Unlike most birds, emperor penguins cannot fly. Instead, they are excellent swimmers and can dive deep into the ocean to catch fish and squid.

Emperor penguins have special features that help them survive in freezing temperatures. They have thick layers of feathers that trap warm air close to their bodies. They also have a layer of fat under their skin that keeps them warm. When it gets extremely cold, penguins huddle together in large groups. They take turns standing on the outside of the group and moving to the warmer middle.

These penguins are also caring parents. The female lays one egg, and then the male keeps it warm on his feet under a fold of skin for about two months. During this time, the male does not eat anything. Meanwhile, the female goes to the ocean to find food. When she returns, both parents take turns caring for the baby chick. Emperor penguins show us that teamwork and dedication help animals survive in even the harshest environments.`
  },
  {
    id: 'g3-read-7',
    category: 'reading',
    difficulty: 'easy',
    question: 'How tall are emperor penguins?',
    options: ['Two feet', 'Three feet', 'Four feet', 'Five feet'],
    correctIndex: 2,
    explanation: 'The passage states that emperor penguins stand about four feet tall.',
    ageMin: 8,
    ageMax: 9,
    passage: `Emperor penguins are amazing birds that live in Antarctica, the coldest place on Earth. These penguins are the largest of all penguin species, standing about four feet tall. Unlike most birds, emperor penguins cannot fly. Instead, they are excellent swimmers and can dive deep into the ocean to catch fish and squid.

Emperor penguins have special features that help them survive in freezing temperatures. They have thick layers of feathers that trap warm air close to their bodies. They also have a layer of fat under their skin that keeps them warm. When it gets extremely cold, penguins huddle together in large groups. They take turns standing on the outside of the group and moving to the warmer middle.

These penguins are also caring parents. The female lays one egg, and then the male keeps it warm on his feet under a fold of skin for about two months. During this time, the male does not eat anything. Meanwhile, the female goes to the ocean to find food. When she returns, both parents take turns caring for the baby chick. Emperor penguins show us that teamwork and dedication help animals survive in even the harshest environments.`
  },
  {
    id: 'g3-read-8',
    category: 'reading',
    difficulty: 'medium',
    question: 'What does "huddle" mean in this passage?',
    options: [
      'To spread out across the ice',
      'To gather closely together',
      'To swim in the ocean',
      'To hunt for food'
    ],
    correctIndex: 1,
    explanation: 'The passage describes penguins huddling together in large groups to stay warm, meaning they gather closely together.',
    ageMin: 8,
    ageMax: 9,
    passage: `Emperor penguins are amazing birds that live in Antarctica, the coldest place on Earth. These penguins are the largest of all penguin species, standing about four feet tall. Unlike most birds, emperor penguins cannot fly. Instead, they are excellent swimmers and can dive deep into the ocean to catch fish and squid.

Emperor penguins have special features that help them survive in freezing temperatures. They have thick layers of feathers that trap warm air close to their bodies. They also have a layer of fat under their skin that keeps them warm. When it gets extremely cold, penguins huddle together in large groups. They take turns standing on the outside of the group and moving to the warmer middle.

These penguins are also caring parents. The female lays one egg, and then the male keeps it warm on his feet under a fold of skin for about two months. During this time, the male does not eat anything. Meanwhile, the female goes to the ocean to find food. When she returns, both parents take turns caring for the baby chick. Emperor penguins show us that teamwork and dedication help animals survive in even the harshest environments.`
  },
  {
    id: 'g3-read-9',
    category: 'reading',
    difficulty: 'medium',
    question: 'What happens after the female penguin lays an egg?',
    options: [
      'She keeps it warm while the male hunts',
      'The male keeps it warm while she goes to find food',
      'Both parents leave the egg alone',
      'They build a nest for it'
    ],
    correctIndex: 1,
    explanation: 'The passage explains that after the female lays the egg, the male keeps it warm on his feet while the female goes to the ocean to find food.',
    ageMin: 8,
    ageMax: 9,
    passage: `Emperor penguins are amazing birds that live in Antarctica, the coldest place on Earth. These penguins are the largest of all penguin species, standing about four feet tall. Unlike most birds, emperor penguins cannot fly. Instead, they are excellent swimmers and can dive deep into the ocean to catch fish and squid.

Emperor penguins have special features that help them survive in freezing temperatures. They have thick layers of feathers that trap warm air close to their bodies. They also have a layer of fat under their skin that keeps them warm. When it gets extremely cold, penguins huddle together in large groups. They take turns standing on the outside of the group and moving to the warmer middle.

These penguins are also caring parents. The female lays one egg, and then the male keeps it warm on his feet under a fold of skin for about two months. During this time, the male does not eat anything. Meanwhile, the female goes to the ocean to find food. When she returns, both parents take turns caring for the baby chick. Emperor penguins show us that teamwork and dedication help animals survive in even the harshest environments.`
  },
  {
    id: 'g3-read-10',
    category: 'reading',
    difficulty: 'hard',
    question: 'What is the author\'s purpose in writing this passage?',
    options: [
      'To persuade readers to visit Antarctica',
      'To inform readers about emperor penguins and their survival',
      'To entertain readers with funny penguin stories',
      'To compare penguins to other birds'
    ],
    correctIndex: 1,
    explanation: 'The passage provides factual information about emperor penguins, their habitat, and how they survive, making it informative.',
    ageMin: 8,
    ageMax: 9,
    passage: `Emperor penguins are amazing birds that live in Antarctica, the coldest place on Earth. These penguins are the largest of all penguin species, standing about four feet tall. Unlike most birds, emperor penguins cannot fly. Instead, they are excellent swimmers and can dive deep into the ocean to catch fish and squid.

Emperor penguins have special features that help them survive in freezing temperatures. They have thick layers of feathers that trap warm air close to their bodies. They also have a layer of fat under their skin that keeps them warm. When it gets extremely cold, penguins huddle together in large groups. They take turns standing on the outside of the group and moving to the warmer middle.

These penguins are also caring parents. The female lays one egg, and then the male keeps it warm on his feet under a fold of skin for about two months. During this time, the male does not eat anything. Meanwhile, the female goes to the ocean to find food. When she returns, both parents take turns caring for the baby chick. Emperor penguins show us that teamwork and dedication help animals survive in even the harshest environments.`
  },

  // PASSAGE 3: Science Discovery - How Volcanoes Form (5 questions)
  {
    id: 'g3-read-11',
    category: 'reading',
    difficulty: 'easy',
    question: 'What is the main idea of this passage?',
    options: [
      'Volcanoes are dangerous',
      'How volcanoes form and erupt',
      'Where to find volcanoes',
      'Famous volcanoes in history'
    ],
    correctIndex: 1,
    explanation: 'The passage focuses on explaining the process of how volcanoes form and why they erupt.',
    ageMin: 8,
    ageMax: 9,
    passage: `Have you ever wondered how volcanoes form? Deep beneath Earth\'s surface, there is hot, melted rock called magma. The Earth\'s outer layer, called the crust, is broken into huge pieces called tectonic plates. These plates are constantly moving, though very slowly. When two plates push together or pull apart, magma from deep underground can find a way to escape.

When magma rises toward the surface, it collects in a chamber underground. As more magma builds up, pressure increases. Eventually, the pressure becomes so strong that the magma breaks through the surface. When this happens, we call it a volcanic eruption. Once magma reaches the surface, we call it lava. Lava can flow down the sides of the volcano like a river of fire.

Not all volcanic eruptions are the same. Some eruptions are explosive, sending ash and rocks high into the sky. Others are gentler, with lava slowly oozing out. Scientists called volcanologists study volcanoes to predict when they might erupt. This helps keep people who live near volcanoes safe. While volcanoes can be dangerous, they also create new land and provide rich soil that is perfect for growing crops. Volcanoes remind us of the powerful forces at work beneath our feet.`
  },
  {
    id: 'g3-read-12',
    category: 'reading',
    difficulty: 'easy',
    question: 'What is magma?',
    options: [
      'Cold rock',
      'Hot, melted rock beneath Earth\'s surface',
      'A type of volcano',
      'Ash from an eruption'
    ],
    correctIndex: 1,
    explanation: 'The passage defines magma as hot, melted rock that is deep beneath Earth\'s surface.',
    ageMin: 8,
    ageMax: 9,
    passage: `Have you ever wondered how volcanoes form? Deep beneath Earth\'s surface, there is hot, melted rock called magma. The Earth\'s outer layer, called the crust, is broken into huge pieces called tectonic plates. These plates are constantly moving, though very slowly. When two plates push together or pull apart, magma from deep underground can find a way to escape.

When magma rises toward the surface, it collects in a chamber underground. As more magma builds up, pressure increases. Eventually, the pressure becomes so strong that the magma breaks through the surface. When this happens, we call it a volcanic eruption. Once magma reaches the surface, we call it lava. Lava can flow down the sides of the volcano like a river of fire.

Not all volcanic eruptions are the same. Some eruptions are explosive, sending ash and rocks high into the sky. Others are gentler, with lava slowly oozing out. Scientists called volcanologists study volcanoes to predict when they might erupt. This helps keep people who live near volcanoes safe. While volcanoes can be dangerous, they also create new land and provide rich soil that is perfect for growing crops. Volcanoes remind us of the powerful forces at work beneath our feet.`
  },
  {
    id: 'g3-read-13',
    category: 'reading',
    difficulty: 'medium',
    question: 'What is the difference between magma and lava?',
    options: [
      'Magma is colder than lava',
      'Magma is underground, lava is on the surface',
      'Lava is underground, magma is on the surface',
      'There is no difference'
    ],
    correctIndex: 1,
    explanation: 'The passage explains that magma is the hot melted rock underground, and once it reaches the surface, it is called lava.',
    ageMin: 8,
    ageMax: 9,
    passage: `Have you ever wondered how volcanoes form? Deep beneath Earth\'s surface, there is hot, melted rock called magma. The Earth\'s outer layer, called the crust, is broken into huge pieces called tectonic plates. These plates are constantly moving, though very slowly. When two plates push together or pull apart, magma from deep underground can find a way to escape.

When magma rises toward the surface, it collects in a chamber underground. As more magma builds up, pressure increases. Eventually, the pressure becomes so strong that the magma breaks through the surface. When this happens, we call it a volcanic eruption. Once magma reaches the surface, we call it lava. Lava can flow down the sides of the volcano like a river of fire.

Not all volcanic eruptions are the same. Some eruptions are explosive, sending ash and rocks high into the sky. Others are gentler, with lava slowly oozing out. Scientists called volcanologists study volcanoes to predict when they might erupt. This helps keep people who live near volcanoes safe. While volcanoes can be dangerous, they also create new land and provide rich soil that is perfect for growing crops. Volcanoes remind us of the powerful forces at work beneath our feet.`
  },
  {
    id: 'g3-read-14',
    category: 'reading',
    difficulty: 'medium',
    question: 'Why do volcanic eruptions happen?',
    options: [
      'Because it rains too much',
      'Because pressure from magma builds up and breaks through the surface',
      'Because the Earth is spinning',
      'Because of earthquakes'
    ],
    correctIndex: 1,
    explanation: 'The passage explains that eruptions happen when pressure from magma building up becomes strong enough to break through the surface.',
    ageMin: 8,
    ageMax: 9,
    passage: `Have you ever wondered how volcanoes form? Deep beneath Earth\'s surface, there is hot, melted rock called magma. The Earth\'s outer layer, called the crust, is broken into huge pieces called tectonic plates. These plates are constantly moving, though very slowly. When two plates push together or pull apart, magma from deep underground can find a way to escape.

When magma rises toward the surface, it collects in a chamber underground. As more magma builds up, pressure increases. Eventually, the pressure becomes so strong that the magma breaks through the surface. When this happens, we call it a volcanic eruption. Once magma reaches the surface, we call it lava. Lava can flow down the sides of the volcano like a river of fire.

Not all volcanic eruptions are the same. Some eruptions are explosive, sending ash and rocks high into the sky. Others are gentler, with lava slowly oozing out. Scientists called volcanologists study volcanoes to predict when they might erupt. This helps keep people who live near volcanoes safe. While volcanoes can be dangerous, they also create new land and provide rich soil that is perfect for growing crops. Volcanoes remind us of the powerful forces at work beneath our feet.`
  },
  {
    id: 'g3-read-15',
    category: 'reading',
    difficulty: 'hard',
    question: 'Based on the passage, what positive effect can volcanoes have?',
    options: [
      'They make the weather warmer',
      'They create new land and rich soil for farming',
      'They prevent earthquakes',
      'They clean the air'
    ],
    correctIndex: 1,
    explanation: 'The passage mentions that volcanoes create new land and provide rich soil that is perfect for growing crops.',
    ageMin: 8,
    ageMax: 9,
    passage: `Have you ever wondered how volcanoes form? Deep beneath Earth\'s surface, there is hot, melted rock called magma. The Earth\'s outer layer, called the crust, is broken into huge pieces called tectonic plates. These plates are constantly moving, though very slowly. When two plates push together or pull apart, magma from deep underground can find a way to escape.

When magma rises toward the surface, it collects in a chamber underground. As more magma builds up, pressure increases. Eventually, the pressure becomes so strong that the magma breaks through the surface. When this happens, we call it a volcanic eruption. Once magma reaches the surface, we call it lava. Lava can flow down the sides of the volcano like a river of fire.

Not all volcanic eruptions are the same. Some eruptions are explosive, sending ash and rocks high into the sky. Others are gentler, with lava slowly oozing out. Scientists called volcanologists study volcanoes to predict when they might erupt. This helps keep people who live near volcanoes safe. While volcanoes can be dangerous, they also create new land and provide rich soil that is perfect for growing crops. Volcanoes remind us of the powerful forces at work beneath our feet.`
  },

  // ============================================
  // SPELLING (10 questions)
  // ============================================

  // Prefixes (3 questions)
  {
    id: 'g3-spell-1',
    category: 'spelling',
    difficulty: 'easy',
    question: 'Which word means "not happy"?',
    options: ['rehappy', 'unhappy', 'prehappy', 'dishappy'],
    correctIndex: 1,
    explanation: 'The prefix "un-" means "not," so "unhappy" means not happy.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-2',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which word is spelled correctly and means "to write again"?',
    options: ['rerite', 'rewrit', 'rewrite', 'rewright'],
    correctIndex: 2,
    explanation: '"Rewrite" is the correct spelling. The prefix "re-" means "again."',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-3',
    category: 'spelling',
    difficulty: 'medium',
    question: 'What does the prefix "pre-" mean in the word "preview"?',
    options: ['After', 'Before', 'Again', 'Not'],
    correctIndex: 1,
    explanation: 'The prefix "pre-" means "before." A preview is viewing something before the main event.',
    ageMin: 8,
    ageMax: 9,
  },

  // Suffixes (3 questions)
  {
    id: 'g3-spell-4',
    category: 'spelling',
    difficulty: 'easy',
    question: 'Which word is spelled correctly and means "full of care"?',
    options: ['carefull', 'carful', 'careful', 'carefule'],
    correctIndex: 2,
    explanation: '"Careful" is the correct spelling. The suffix "-ful" means "full of."',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-5',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Choose the word that is spelled correctly: She walked _____ to the park.',
    options: ['slowley', 'slowly', 'slowlie', 'slowely'],
    correctIndex: 1,
    explanation: '"Slowly" is correct. The suffix "-ly" turns an adjective into an adverb.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-6',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word means "without hope"?',
    options: ['hopefull', 'hopless', 'hopeless', 'hopeles'],
    correctIndex: 2,
    explanation: '"Hopeless" is correct. The suffix "-less" means "without."',
    ageMin: 8,
    ageMax: 9,
  },

  // Homophones (4 questions)
  {
    id: 'g3-spell-7',
    category: 'spelling',
    difficulty: 'easy',
    question: 'Choose the correct word: _____ going to the store.',
    options: ['Their', 'There', "They're", 'Thare'],
    correctIndex: 2,
    explanation: '"They\'re" is a contraction of "they are," which fits the sentence.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-8',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Choose the correct word: I have _____ apples.',
    options: ['to', 'two', 'too', 'tue'],
    correctIndex: 1,
    explanation: '"Two" is the number 2, which is what the sentence needs.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-9',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Choose the correct word: Put the book over _____.',
    options: ['their', 'there', "they're", 'thare'],
    correctIndex: 1,
    explanation: '"There" refers to a place or location.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-spell-10',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Choose the correct word: That bag belongs to them. It is _____ bag.',
    options: ['their', 'there', "they're", 'thair'],
    correctIndex: 0,
    explanation: '"Their" shows possession - the bag belongs to them.',
    ageMin: 8,
    ageMax: 9,
  },

  // ============================================
  // SCIENCE (5 questions)
  // ============================================

  {
    id: 'g3-science-1',
    category: 'science',
    difficulty: 'easy',
    question: 'What happens when you push a toy car?',
    options: [
      'It stays still',
      'It moves in the direction you pushed',
      'It flies into the air',
      'It breaks apart'
    ],
    correctIndex: 1,
    explanation: 'A push is a force that causes an object to move in the direction of the push.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-science-2',
    category: 'science',
    difficulty: 'medium',
    question: 'Which force pulls objects toward the ground?',
    options: ['Magnetism', 'Friction', 'Gravity', 'Wind'],
    correctIndex: 2,
    explanation: 'Gravity is the force that pulls all objects toward Earth\'s center.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-science-3',
    category: 'science',
    difficulty: 'medium',
    question: 'What type of weather would you expect in summer?',
    options: [
      'Cold temperatures and snow',
      'Warm temperatures and more sunshine',
      'Freezing rain',
      'Heavy fog every day'
    ],
    correctIndex: 1,
    explanation: 'Summer typically has warm temperatures and more sunshine due to the Earth\'s tilt toward the sun.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-science-4',
    category: 'science',
    difficulty: 'hard',
    question: 'In an ecosystem, what role do plants play?',
    options: [
      'They only provide shade',
      'They produce oxygen and food for animals',
      'They have no important role',
      'They only make the area look nice'
    ],
    correctIndex: 1,
    explanation: 'Plants are producers in an ecosystem. They make oxygen through photosynthesis and provide food for many animals.',
    ageMin: 8,
    ageMax: 9,
  },
  {
    id: 'g3-science-5',
    category: 'science',
    difficulty: 'hard',
    question: 'Baby animals often look like their parents. What is this called?',
    options: ['Evolution', 'Inheritance', 'Migration', 'Hibernation'],
    correctIndex: 1,
    explanation: 'Inheritance is when traits are passed from parents to offspring. Baby animals inherit features from their parents.',
    ageMin: 8,
    ageMax: 9,
  },
]
