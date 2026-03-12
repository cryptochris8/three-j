/**
 * Grade 4 Question Bank
 *
 * Educational content aligned with Common Core State Standards for Grade 4 (ages 9-10)
 *
 * Standards covered:
 * - Math: Factors and multiples, fraction operations and equivalence, multi-digit arithmetic,
 *   area and perimeter, measurement conversion, angle types, prime numbers, patterns
 * - Reading: Main idea identification, vocabulary in context, inference, author's purpose,
 *   theme analysis, cause and effect, character analysis
 * - Science: Energy transformation, sound and light waves, weathering and erosion,
 *   animal adaptations
 * - Social Studies: U.S. government structure, natural resources, economics (scarcity),
 *   U.S. regions
 * - Spelling: Common Core vocabulary, compound words, Greek and Latin roots,
 *   commonly misspelled words
 */

import type { Question } from '@/types'

export const grade4Questions: Question[] = [
  {
    id: 'g4-math-1',
    category: 'math',
    difficulty: 'medium',
    question: 'Sarah has 24 stickers. She wants to arrange them in equal rows. Which of the following is NOT a way she can arrange them?',
    options: [
      '3 rows of 8 stickers',
      '4 rows of 6 stickers',
      '5 rows of 5 stickers',
      '6 rows of 4 stickers'
    ],
    correctIndex: 2,
    explanation: '24 cannot be divided evenly by 5. The factors of 24 are 1, 2, 3, 4, 6, 8, 12, and 24. Since 5 is not a factor of 24, you cannot make 5 equal rows.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-2',
    category: 'math',
    difficulty: 'medium',
    question: 'Which fraction is equivalent to 3/4?',
    options: [
      '6/9',
      '9/12',
      '4/6',
      '5/8'
    ],
    correctIndex: 1,
    explanation: 'To find equivalent fractions, multiply both the numerator and denominator by the same number. 3/4 = (3×3)/(4×3) = 9/12. You can verify by simplifying: 9÷3 = 3 and 12÷3 = 4.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-3',
    category: 'math',
    difficulty: 'hard',
    question: 'Compare the fractions: 5/6 ___ 7/8',
    options: [
      '5/6 > 7/8',
      '5/6 < 7/8',
      '5/6 = 7/8',
      'Cannot be determined'
    ],
    correctIndex: 1,
    explanation: 'To compare fractions with different denominators, find a common denominator. The LCD of 6 and 8 is 24. Convert: 5/6 = 20/24 and 7/8 = 21/24. Since 20/24 < 21/24, then 5/6 < 7/8.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-4',
    category: 'math',
    difficulty: 'medium',
    question: 'What is 2/5 + 1/5?',
    options: [
      '3/10',
      '3/5',
      '1/5',
      '2/10'
    ],
    correctIndex: 1,
    explanation: 'When adding fractions with the same denominator, add the numerators and keep the denominator the same: 2/5 + 1/5 = (2+1)/5 = 3/5.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-5',
    category: 'math',
    difficulty: 'hard',
    question: 'A recipe calls for 3/4 cup of sugar. If you want to make half the recipe, how much sugar do you need?',
    options: [
      '1/4 cup',
      '3/8 cup',
      '1/2 cup',
      '1/8 cup'
    ],
    correctIndex: 1,
    explanation: 'Half of 3/4 means 3/4 ÷ 2, which is the same as 3/4 × 1/2 = 3/8. You can also think of it as finding half of each fourth: half of 3 fourths is 3 eighths.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-6',
    category: 'math',
    difficulty: 'medium',
    question: 'Look at the fraction bars below. Which fraction is shown?\n\n[Bar divided into 6 equal parts with 4 parts shaded]',
    options: [
      '2/3',
      '4/6',
      'Both A and B are correct',
      'Neither A nor B is correct'
    ],
    correctIndex: 2,
    explanation: 'The bar shows 4 out of 6 parts shaded, which is 4/6. However, 4/6 can be simplified to 2/3 by dividing both numerator and denominator by 2. Both fractions represent the same amount.',
    ageMin: 9,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        {
          label: 'Fraction shown',
          totalParts: 6,
          shadedParts: 4,
          color: '#4A90E2'
        }
      ]
    }
  },
  {
    id: 'g4-math-7',
    category: 'math',
    difficulty: 'easy',
    question: 'Compare the shaded portions. Which bar has more shaded?\n\n[Bar A: 5 parts divided, 3 shaded]\n[Bar B: 4 parts divided, 2 shaded]',
    options: [
      'Bar A has more shaded',
      'Bar B has more shaded',
      'They have the same amount shaded',
      'Cannot be determined'
    ],
    correctIndex: 0,
    explanation: 'Bar A shows 3/5 shaded, and Bar B shows 2/4 (or 1/2) shaded. Converting to common denominators: 3/5 = 6/10 and 1/2 = 5/10. Since 6/10 > 5/10, Bar A has more shaded.',
    ageMin: 9,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        {
          label: 'Bar A',
          totalParts: 5,
          shadedParts: 3,
          color: '#E74C3C'
        },
        {
          label: 'Bar B',
          totalParts: 4,
          shadedParts: 2,
          color: '#2ECC71'
        }
      ]
    }
  },
  {
    id: 'g4-math-8',
    category: 'math',
    difficulty: 'medium',
    question: 'If the whole bar represents 1, what fraction is shaded?\n\n[Bar divided into 8 parts, 5 parts shaded]',
    options: [
      '3/8',
      '5/8',
      '5/3',
      '8/5'
    ],
    correctIndex: 1,
    explanation: 'The bar is divided into 8 equal parts, and 5 of those parts are shaded. This represents the fraction 5/8 (5 parts out of 8 total parts).',
    ageMin: 9,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        {
          label: 'Whole = 1',
          totalParts: 8,
          shadedParts: 5,
          color: '#9B59B6'
        }
      ]
    }
  },
  {
    id: 'g4-math-9',
    category: 'math',
    difficulty: 'hard',
    question: 'The diagram shows two fraction bars. What fraction must be added to Bar A to equal Bar B?\n\n[Bar A: 10 parts, 3 shaded]\n[Bar B: 10 parts, 7 shaded]',
    options: [
      '3/10',
      '4/10',
      '7/10',
      '10/10'
    ],
    correctIndex: 1,
    explanation: 'Bar A shows 3/10 and Bar B shows 7/10. To find what must be added: 7/10 - 3/10 = 4/10. You need to add 4 more tenths to Bar A to equal Bar B.',
    ageMin: 9,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        {
          label: 'Bar A',
          totalParts: 10,
          shadedParts: 3,
          color: '#F39C12'
        },
        {
          label: 'Bar B',
          totalParts: 10,
          shadedParts: 7,
          color: '#F39C12'
        }
      ]
    }
  },
  {
    id: 'g4-math-10',
    category: 'math',
    difficulty: 'medium',
    question: 'Which two fraction bars show equivalent fractions?\n\n[Bar A: 4 parts, 2 shaded]\n[Bar B: 6 parts, 3 shaded]\n[Bar C: 8 parts, 3 shaded]',
    options: [
      'Bar A and Bar B',
      'Bar B and Bar C',
      'Bar A and Bar C',
      'None are equivalent'
    ],
    correctIndex: 0,
    explanation: 'Bar A shows 2/4 and Bar B shows 3/6. Both simplify to 1/2, making them equivalent. Bar C shows 3/8, which is different. 2/4 = 3/6 = 1/2.',
    ageMin: 9,
    ageMax: 10,
    diagram: {
      type: 'fraction-bars',
      bars: [
        {
          label: 'Bar A',
          totalParts: 4,
          shadedParts: 2,
          color: '#1ABC9C'
        },
        {
          label: 'Bar B',
          totalParts: 6,
          shadedParts: 3,
          color: '#3498DB'
        },
        {
          label: 'Bar C',
          totalParts: 8,
          shadedParts: 3,
          color: '#E67E22'
        }
      ]
    }
  },
  {
    id: 'g4-math-11',
    category: 'math',
    difficulty: 'medium',
    question: 'What is 0.7 written as a fraction in simplest form?',
    options: [
      '7/100',
      '7/10',
      '70/100',
      '0.7/1'
    ],
    correctIndex: 1,
    explanation: '0.7 means 7 tenths, which is written as 7/10. This is already in simplest form because 7 and 10 share no common factors other than 1.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-12',
    category: 'math',
    difficulty: 'hard',
    question: 'A bakery sold 2,485 cupcakes in June and 3,678 cupcakes in July. How many cupcakes did they sell in total?',
    options: [
      '5,163 cupcakes',
      '6,163 cupcakes',
      '6,063 cupcakes',
      '5,063 cupcakes'
    ],
    correctIndex: 1,
    explanation: 'Add the multi-digit numbers using place value: 2,485 + 3,678 = 6,163. Line up the digits by place value and add each column, regrouping as needed (5+8=13, regroup 1 ten; 8+7+1=16, regroup 1 hundred; 4+6+1=11, regroup 1 thousand; 2+3+1=6).',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-13',
    category: 'math',
    difficulty: 'medium',
    question: 'A rectangular garden has a length of 12 feet and a width of 8 feet. What is its perimeter?',
    options: [
      '20 feet',
      '40 feet',
      '96 feet',
      '32 feet'
    ],
    correctIndex: 1,
    explanation: 'Perimeter is the distance around a shape. For a rectangle: P = 2(length + width) = 2(12 + 8) = 2(20) = 40 feet. Or add all four sides: 12 + 12 + 8 + 8 = 40 feet.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-14',
    category: 'math',
    difficulty: 'easy',
    question: 'Which of the following is a prime number?',
    options: [
      '12',
      '15',
      '17',
      '18'
    ],
    correctIndex: 2,
    explanation: 'A prime number has exactly two factors: 1 and itself. 17 only has factors 1 and 17, making it prime. 12 (1,2,3,4,6,12), 15 (1,3,5,15), and 18 (1,2,3,6,9,18) have more than two factors.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-15',
    category: 'math',
    difficulty: 'hard',
    question: 'Maria bought 3 boxes of markers with 24 markers in each box. She wants to give an equal number of markers to 8 students. How many markers will each student get?',
    options: [
      '6 markers',
      '8 markers',
      '9 markers',
      '12 markers'
    ],
    correctIndex: 2,
    explanation: 'This is a multi-step problem. First, find total markers: 3 × 24 = 72 markers. Then divide equally among 8 students: 72 ÷ 8 = 9 markers per student.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-16',
    category: 'math',
    difficulty: 'medium',
    question: 'What is the pattern rule for this sequence? 4, 8, 12, 16, 20, ___',
    options: [
      'Add 4 each time; next number is 24',
      'Multiply by 2 each time; next number is 40',
      'Add 6 each time; next number is 26',
      'Subtract 4 each time; next number is 16'
    ],
    correctIndex: 0,
    explanation: 'Each number increases by 4 (4+4=8, 8+4=12, 12+4=16, 16+4=20). Following this pattern, the next number is 20+4=24. This is also the pattern of counting by 4s.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-17',
    category: 'math',
    difficulty: 'easy',
    question: 'How many centimeters are in 3 meters?',
    options: [
      '30 centimeters',
      '300 centimeters',
      '3,000 centimeters',
      '3 centimeters'
    ],
    correctIndex: 1,
    explanation: 'There are 100 centimeters in 1 meter. To convert 3 meters to centimeters, multiply: 3 × 100 = 300 centimeters. This is converting from a larger unit to a smaller unit.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-18',
    category: 'math',
    difficulty: 'medium',
    question: 'An angle measures 90 degrees. What type of angle is it?',
    options: [
      'Acute angle',
      'Right angle',
      'Obtuse angle',
      'Straight angle'
    ],
    correctIndex: 1,
    explanation: 'A 90-degree angle is called a right angle. Acute angles are less than 90°, obtuse angles are between 90° and 180°, and straight angles are exactly 180°.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-19',
    category: 'math',
    difficulty: 'hard',
    question: 'What is 5,432 rounded to the nearest hundred?',
    options: [
      '5,000',
      '5,400',
      '5,500',
      '6,000'
    ],
    correctIndex: 1,
    explanation: 'To round to the nearest hundred, look at the tens digit (3). Since 3 < 5, round down. The hundreds digit stays 4, and all digits to the right become 0: 5,400.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-math-20',
    category: 'math',
    difficulty: 'medium',
    question: 'A rectangle has an area of 48 square inches and a width of 6 inches. What is its length?',
    options: [
      '6 inches',
      '7 inches',
      '8 inches',
      '9 inches'
    ],
    correctIndex: 2,
    explanation: 'Area of a rectangle = length × width. We know area = 48 and width = 6, so 48 = length × 6. Divide both sides by 6: length = 48 ÷ 6 = 8 inches.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-read-1',
    category: 'reading',
    difficulty: 'medium',
    question: 'What is the main idea of this passage?',
    options: [
      'The pyramids were built as tombs for pharaohs',
      'Ancient Egypt was located along the Nile River',
      'Ancient Egypt had a complex civilization with many achievements',
      'Hieroglyphics were a form of picture writing'
    ],
    correctIndex: 2,
    explanation: 'The passage discusses multiple aspects of Ancient Egyptian civilization including the Nile River, pyramids, hieroglyphics, and agricultural practices. The main idea encompasses all these details, showing Egypt\'s complex civilization and achievements.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ancient Egypt was one of the world\'s most fascinating civilizations. It flourished along the Nile River in northeastern Africa for over three thousand years. The Nile was essential to Egyptian life because it provided water for drinking and farming in an otherwise desert landscape. Each year, the river flooded, depositing rich, dark soil along its banks that made the land perfect for growing crops like wheat and barley.\n\nThe ancient Egyptians are famous for building massive stone pyramids as tombs for their pharaohs, or kings. The largest pyramid, the Great Pyramid of Giza, was built around 2560 BCE and originally stood 481 feet tall. It took approximately twenty years and thousands of workers to complete. The Egyptians also developed hieroglyphics, a complex system of writing that used pictures and symbols to represent words and sounds. These writings on temple walls and papyrus scrolls have helped modern scholars understand their advanced society, including their religious beliefs, mathematical knowledge, and medical practices.'
  },
  {
    id: 'g4-read-2',
    category: 'reading',
    difficulty: 'easy',
    question: 'According to the passage, why was the Nile River important to ancient Egyptians?',
    options: [
      'It was used for transportation only',
      'It provided water and fertile soil for farming',
      'It protected Egypt from invaders',
      'It was considered a god'
    ],
    correctIndex: 1,
    explanation: 'The passage explicitly states that the Nile \'provided water for drinking and farming\' and that yearly floods deposited \'rich, dark soil\' that made the land perfect for crops.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ancient Egypt was one of the world\'s most fascinating civilizations. It flourished along the Nile River in northeastern Africa for over three thousand years. The Nile was essential to Egyptian life because it provided water for drinking and farming in an otherwise desert landscape. Each year, the river flooded, depositing rich, dark soil along its banks that made the land perfect for growing crops like wheat and barley.\n\nThe ancient Egyptians are famous for building massive stone pyramids as tombs for their pharaohs, or kings. The largest pyramid, the Great Pyramid of Giza, was built around 2560 BCE and originally stood 481 feet tall. It took approximately twenty years and thousands of workers to complete. The Egyptians also developed hieroglyphics, a complex system of writing that used pictures and symbols to represent words and sounds. These writings on temple walls and papyrus scrolls have helped modern scholars understand their advanced society, including their religious beliefs, mathematical knowledge, and medical practices.'
  },
  {
    id: 'g4-read-3',
    category: 'reading',
    difficulty: 'medium',
    question: 'In this passage, the word \'flourished\' most likely means:',
    options: [
      'struggled to survive',
      'thrived and prospered',
      'traveled frequently',
      'built monuments'
    ],
    correctIndex: 1,
    explanation: 'Context clues show that Ancient Egypt was successful and long-lasting (\'over three thousand years\'), had advanced achievements, and developed a complex society. \'Flourished\' means to thrive and prosper, which fits this description.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ancient Egypt was one of the world\'s most fascinating civilizations. It flourished along the Nile River in northeastern Africa for over three thousand years. The Nile was essential to Egyptian life because it provided water for drinking and farming in an otherwise desert landscape. Each year, the river flooded, depositing rich, dark soil along its banks that made the land perfect for growing crops like wheat and barley.\n\nThe ancient Egyptians are famous for building massive stone pyramids as tombs for their pharaohs, or kings. The largest pyramid, the Great Pyramid of Giza, was built around 2560 BCE and originally stood 481 feet tall. It took approximately twenty years and thousands of workers to complete. The Egyptians also developed hieroglyphics, a complex system of writing that used pictures and symbols to represent words and sounds. These writings on temple walls and papyrus scrolls have helped modern scholars understand their advanced society, including their religious beliefs, mathematical knowledge, and medical practices.'
  },
  {
    id: 'g4-read-4',
    category: 'reading',
    difficulty: 'hard',
    question: 'Based on the passage, which inference can you make about hieroglyphics?',
    options: [
      'Only pharaohs could read hieroglyphics',
      'Hieroglyphics were easier to learn than modern alphabets',
      'Hieroglyphics preserved important information about Egyptian culture',
      'All ancient civilizations used hieroglyphics'
    ],
    correctIndex: 2,
    explanation: 'The passage states that hieroglyphic writings \'have helped modern scholars understand their advanced society, including their religious beliefs, mathematical knowledge, and medical practices.\' This shows that hieroglyphics preserved valuable cultural information.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ancient Egypt was one of the world\'s most fascinating civilizations. It flourished along the Nile River in northeastern Africa for over three thousand years. The Nile was essential to Egyptian life because it provided water for drinking and farming in an otherwise desert landscape. Each year, the river flooded, depositing rich, dark soil along its banks that made the land perfect for growing crops like wheat and barley.\n\nThe ancient Egyptians are famous for building massive stone pyramids as tombs for their pharaohs, or kings. The largest pyramid, the Great Pyramid of Giza, was built around 2560 BCE and originally stood 481 feet tall. It took approximately twenty years and thousands of workers to complete. The Egyptians also developed hieroglyphics, a complex system of writing that used pictures and symbols to represent words and sounds. These writings on temple walls and papyrus scrolls have helped modern scholars understand their advanced society, including their religious beliefs, mathematical knowledge, and medical practices.'
  },
  {
    id: 'g4-read-5',
    category: 'reading',
    difficulty: 'medium',
    question: 'What was the author\'s main purpose in writing this passage?',
    options: [
      'To persuade readers to visit Egypt',
      'To inform readers about ancient Egyptian civilization',
      'To entertain readers with fictional stories about pharaohs',
      'To compare ancient Egypt to other civilizations'
    ],
    correctIndex: 1,
    explanation: 'The passage presents factual information about various aspects of ancient Egyptian civilization (geography, agriculture, architecture, writing system). The author\'s purpose is to inform and educate readers, not to persuade, entertain, or compare.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ancient Egypt was one of the world\'s most fascinating civilizations. It flourished along the Nile River in northeastern Africa for over three thousand years. The Nile was essential to Egyptian life because it provided water for drinking and farming in an otherwise desert landscape. Each year, the river flooded, depositing rich, dark soil along its banks that made the land perfect for growing crops like wheat and barley.\n\nThe ancient Egyptians are famous for building massive stone pyramids as tombs for their pharaohs, or kings. The largest pyramid, the Great Pyramid of Giza, was built around 2560 BCE and originally stood 481 feet tall. It took approximately twenty years and thousands of workers to complete. The Egyptians also developed hieroglyphics, a complex system of writing that used pictures and symbols to represent words and sounds. These writings on temple walls and papyrus scrolls have helped modern scholars understand their advanced society, including their religious beliefs, mathematical knowledge, and medical practices.'
  },
  {
    id: 'g4-read-6',
    category: 'reading',
    difficulty: 'medium',
    question: 'What is the main problem in this passage?',
    options: [
      'The family didn\'t have enough food',
      'A hurricane was approaching their coastal town',
      'The family\'s house was destroyed',
      'The weather was too hot'
    ],
    correctIndex: 1,
    explanation: 'The passage clearly states in the first paragraph that \'the weather forecast warned of Hurricane Elena approaching their coastal town,\' which is the main problem driving the narrative.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ten-year-old Marcus pressed his face against the window, watching palm trees bend violently in the strengthening wind. The weather forecast warned of Hurricane Elena approaching their coastal town, and his family had only hours to prepare. His mother secured loose items in the yard while his father boarded up windows with thick plywood sheets. Marcus\'s job was to help his younger sister, Lily, pack emergency supplies: flashlights, batteries, canned food, bottled water, and their favorite stuffed animals.\n\nBy evening, the storm arrived with furious intensity. Rain pounded the roof like thousands of drumbeats, and wind howled through every crack in the house. The power went out, plunging them into darkness. Marcus held Lily\'s hand as they huddled with their parents in the hallway, the safest spot away from windows. Though frightened, Marcus remembered his father\'s words: \'Hurricanes are powerful, but we prepared well and we\'re together.\' After what seemed like forever, the roaring winds gradually softened. By morning, Elena had passed, leaving debris scattered everywhere but their home standing strong. Their preparation and unity had helped them survive nature\'s awesome force.'
  },
  {
    id: 'g4-read-7',
    category: 'reading',
    difficulty: 'easy',
    question: 'What detail from the passage shows that Marcus\'s family prepared for the hurricane?',
    options: [
      'They went to a hotel',
      'They boarded up windows and packed emergency supplies',
      'They left town before the storm arrived',
      'They called the weather station'
    ],
    correctIndex: 1,
    explanation: 'The passage provides specific details: the mother secured items in the yard, the father boarded up windows, and Marcus helped pack emergency supplies including flashlights, batteries, food, and water.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ten-year-old Marcus pressed his face against the window, watching palm trees bend violently in the strengthening wind. The weather forecast warned of Hurricane Elena approaching their coastal town, and his family had only hours to prepare. His mother secured loose items in the yard while his father boarded up windows with thick plywood sheets. Marcus\'s job was to help his younger sister, Lily, pack emergency supplies: flashlights, batteries, canned food, bottled water, and their favorite stuffed animals.\n\nBy evening, the storm arrived with furious intensity. Rain pounded the roof like thousands of drumbeats, and wind howled through every crack in the house. The power went out, plunging them into darkness. Marcus held Lily\'s hand as they huddled with their parents in the hallway, the safest spot away from windows. Though frightened, Marcus remembered his father\'s words: \'Hurricanes are powerful, but we prepared well and we\'re together.\' After what seemed like forever, the roaring winds gradually softened. By morning, Elena had passed, leaving debris scattered everywhere but their home standing strong. Their preparation and unity had helped them survive nature\'s awesome force.'
  },
  {
    id: 'g4-read-8',
    category: 'reading',
    difficulty: 'medium',
    question: 'In the passage, \'furious intensity\' most nearly means:',
    options: [
      'gentle and calm power',
      'extreme and violent strength',
      'confusing direction',
      'brief duration'
    ],
    correctIndex: 1,
    explanation: 'The context describes the storm with violent imagery: rain \'pounded like thousands of drumbeats\' and wind \'howled through every crack.\' \'Furious intensity\' describes extreme, violent strength, matching these descriptions.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ten-year-old Marcus pressed his face against the window, watching palm trees bend violently in the strengthening wind. The weather forecast warned of Hurricane Elena approaching their coastal town, and his family had only hours to prepare. His mother secured loose items in the yard while his father boarded up windows with thick plywood sheets. Marcus\'s job was to help his younger sister, Lily, pack emergency supplies: flashlights, batteries, canned food, bottled water, and their favorite stuffed animals.\n\nBy evening, the storm arrived with furious intensity. Rain pounded the roof like thousands of drumbeats, and wind howled through every crack in the house. The power went out, plunging them into darkness. Marcus held Lily\'s hand as they huddled with their parents in the hallway, the safest spot away from windows. Though frightened, Marcus remembered his father\'s words: \'Hurricanes are powerful, but we prepared well and we\'re together.\' After what seems like forever, the roaring winds gradually softened. By morning, Elena had passed, leaving debris scattered everywhere but their home standing strong. Their preparation and unity had helped them survive nature\'s awesome force.'
  },
  {
    id: 'g4-read-9',
    category: 'reading',
    difficulty: 'hard',
    question: 'What can you infer about Marcus based on his actions in the passage?',
    options: [
      'He was irresponsible and didn\'t help his family',
      'He was responsible and caring toward his younger sister',
      'He was afraid and refused to prepare',
      'He wanted to go outside during the storm'
    ],
    correctIndex: 1,
    explanation: 'Marcus helped pack emergency supplies, held his sister\'s hand during the scary storm, and remembered comforting words to help him stay brave. These actions show he was responsible and caring.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ten-year-old Marcus pressed his face against the window, watching palm trees bend violently in the strengthening wind. The weather forecast warned of Hurricane Elena approaching their coastal town, and his family had only hours to prepare. His mother secured loose items in the yard while his father boarded up windows with thick plywood sheets. Marcus\'s job was to help his younger sister, Lily, pack emergency supplies: flashlights, batteries, canned food, bottled water, and their favorite stuffed animals.\n\nBy evening, the storm arrived with furious intensity. Rain pounded the roof like thousands of drumbeats, and wind howled through every crack in the house. The power went out, plunging them into darkness. Marcus held Lily\'s hand as they huddled with their parents in the hallway, the safest spot away from windows. Though frightened, Marcus remembered his father\'s words: \'Hurricanes are powerful, but we prepared well and we\'re together.\' After what seemed like forever, the roaring winds gradually softened. By morning, Elena had passed, leaving debris scattered everywhere but their home standing strong. Their preparation and unity had helped them survive nature\'s awesome force.'
  },
  {
    id: 'g4-read-10',
    category: 'reading',
    difficulty: 'medium',
    question: 'Which sentence best describes the theme of this passage?',
    options: [
      'Hurricanes always destroy everything in their path',
      'Preparation and family unity help people overcome challenges',
      'Living near the coast is dangerous',
      'Children should not be involved in emergency preparation'
    ],
    correctIndex: 1,
    explanation: 'The passage emphasizes how the family\'s careful preparation and staying together helped them survive the hurricane. The father\'s words and the ending reinforce this theme of preparation and unity overcoming natural challenges.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Ten-year-old Marcus pressed his face against the window, watching palm trees bend violently in the strengthening wind. The weather forecast warned of Hurricane Elena approaching their coastal town, and his family had only hours to prepare. His mother secured loose items in the yard while his father boarded up windows with thick plywood sheets. Marcus\'s job was to help his younger sister, Lily, pack emergency supplies: flashlights, batteries, canned food, bottled water, and their favorite stuffed animals.\n\nBy evening, the storm arrived with furious intensity. Rain pounded the roof like thousands of drumbeats, and wind howled through every crack in the house. The power went out, plunging them into darkness. Marcus held Lily\'s hand as they huddled with their parents in the hallway, the safest spot away from windows. Though frightened, Marcus remembered his father\'s words: \'Hurricanes are powerful, but we prepared well and we\'re together.\' After what seemed like forever, the roaring winds gradually softened. By morning, Elena had passed, leaving debris scattered everywhere but their home standing strong. Their preparation and unity had helped them survive nature\'s awesome force.'
  },
  {
    id: 'g4-read-11',
    category: 'reading',
    difficulty: 'medium',
    question: 'What problem did Dr. Johnson face when inventing the steam engine?',
    options: [
      'She couldn\'t find any metal',
      'Early designs were too dangerous and inefficient',
      'Nobody believed in her abilities',
      'She didn\'t have a workshop'
    ],
    correctIndex: 1,
    explanation: 'The passage states that \'Her early designs were dangerous, with boilers that sometimes exploded, and engines that wasted enormous amounts of fuel.\' This describes the main problem she had to overcome.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Dr. Margaret Johnson was born in 1798 in a small English village, but her curious mind would eventually change the world. As a young girl, she spent countless hours in her father\'s workshop, fascinated by how machines worked. In an era when few women pursued science, Margaret defied expectations by studying mechanical engineering. Her greatest achievement came in 1835 when she invented an improved steam engine that revolutionized transportation and manufacturing.\n\nMargaret\'s journey wasn\'t easy. Her early designs were dangerous, with boilers that sometimes exploded, and engines that wasted enormous amounts of fuel. Through persistent experimentation, she discovered that using a separate condenser chamber and reinforced metal walls made engines both safer and more powerful. Her innovation allowed trains to travel faster and factories to produce goods more efficiently. Though she faced skepticism from male colleagues who doubted a woman\'s engineering abilities, Margaret earned respect through her brilliant work. By 1850, her steam engines powered over five hundred factories across Europe. Today, historians recognize Dr. Johnson as a pioneering inventor whose determination and ingenuity helped launch the Industrial Revolution.'
  },
  {
    id: 'g4-read-12',
    category: 'reading',
    difficulty: 'easy',
    question: 'According to the passage, what was Dr. Johnson\'s greatest achievement?',
    options: [
      'Opening a workshop',
      'Traveling across Europe',
      'Inventing an improved steam engine',
      'Writing about science'
    ],
    correctIndex: 2,
    explanation: 'The passage directly states: \'Her greatest achievement came in 1835 when she invented an improved steam engine that revolutionized transportation and manufacturing.\'',
    ageMin: 9,
    ageMax: 10,
    passage: 'Dr. Margaret Johnson was born in 1798 in a small English village, but her curious mind would eventually change the world. As a young girl, she spent countless hours in her father\'s workshop, fascinated by how machines worked. In an era when few women pursued science, Margaret defied expectations by studying mechanical engineering. Her greatest achievement came in 1835 when she invented an improved steam engine that revolutionized transportation and manufacturing.\n\nMargaret\'s journey wasn\'t easy. Her early designs were dangerous, with boilers that sometimes exploded, and engines that wasted enormous amounts of fuel. Through persistent experimentation, she discovered that using a separate condenser chamber and reinforced metal walls made engines both safer and more powerful. Her innovation allowed trains to travel faster and factories to produce goods more efficiently. Though she faced skepticism from male colleagues who doubted a woman\'s engineering abilities, Margaret earned respect through her brilliant work. By 1850, her steam engines powered over five hundred factories across Europe. Today, historians recognize Dr. Johnson as a pioneering inventor whose determination and ingenuity helped launch the Industrial Revolution.'
  },
  {
    id: 'g4-read-13',
    category: 'reading',
    difficulty: 'medium',
    question: 'What does the word \'skepticism\' mean in this passage?',
    options: [
      'Support and encouragement',
      'Doubt and disbelief',
      'Excitement and interest',
      'Anger and frustration'
    ],
    correctIndex: 1,
    explanation: 'The passage explains that skepticism came from colleagues \'who doubted a woman\'s engineering abilities.\' This context shows that skepticism means doubt and disbelief in her abilities.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Dr. Margaret Johnson was born in 1798 in a small English village, but her curious mind would eventually change the world. As a young girl, she spent countless hours in her father\'s workshop, fascinated by how machines worked. In an era when few women pursued science, Margaret defied expectations by studying mechanical engineering. Her greatest achievement came in 1835 when she invented an improved steam engine that revolutionized transportation and manufacturing.\n\nMargaret\'s journey wasn\'t easy. Her early designs were dangerous, with boilers that sometimes exploded, and engines that wasted enormous amounts of fuel. Through persistent experimentation, she discovered that using a separate condenser chamber and reinforced metal walls made engines both safer and more powerful. Her innovation allowed trains to travel faster and factories to produce goods more efficiently. Though she faced skepticism from male colleagues who doubted a woman\'s engineering abilities, Margaret earned respect through her brilliant work. By 1850, her steam engines powered over five hundred factories across Europe. Today, historians recognize Dr. Johnson as a pioneering inventor whose determination and ingenuity helped launch the Industrial Revolution.'
  },
  {
    id: 'g4-read-14',
    category: 'reading',
    difficulty: 'hard',
    question: 'Based on the passage, what can you conclude about Dr. Johnson\'s character?',
    options: [
      'She gave up easily when things were difficult',
      'She was persistent and determined despite obstacles',
      'She only cared about becoming famous',
      'She refused help from others'
    ],
    correctIndex: 1,
    explanation: 'The passage shows Dr. Johnson persevered through dangerous early failures, social barriers, and skepticism from colleagues. Words like \'persistent experimentation,\' \'determination,\' and \'defied expectations\' demonstrate her determined character.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Dr. Margaret Johnson was born in 1798 in a small English village, but her curious mind would eventually change the world. As a young girl, she spent countless hours in her father\'s workshop, fascinated by how machines worked. In an era when few women pursued science, Margaret defied expectations by studying mechanical engineering. Her greatest achievement came in 1835 when she invented an improved steam engine that revolutionized transportation and manufacturing.\n\nMargaret\'s journey wasn\'t easy. Her early designs were dangerous, with boilers that sometimes exploded, and engines that wasted enormous amounts of fuel. Through persistent experimentation, she discovered that using a separate condenser chamber and reinforced metal walls made engines both safer and more powerful. Her innovation allowed trains to travel faster and factories to produce goods more efficiently. Though she faced skepticism from male colleagues who doubted a woman\'s engineering abilities, Margaret earned respect through her brilliant work. By 1850, her steam engines powered over five hundred factories across Europe. Today, historians recognize Dr. Johnson as a pioneering inventor whose determination and ingenuity helped launch the Industrial Revolution.'
  },
  {
    id: 'g4-read-15',
    category: 'reading',
    difficulty: 'medium',
    question: 'What was the author\'s purpose for writing this passage?',
    options: [
      'To entertain readers with a fictional story',
      'To inform readers about an important inventor\'s life and contributions',
      'To persuade readers to become engineers',
      'To compare different types of engines'
    ],
    correctIndex: 1,
    explanation: 'The passage presents factual, biographical information about Dr. Johnson\'s life, inventions, and historical impact. The author\'s purpose is to inform readers about this pioneering inventor\'s contributions to the Industrial Revolution.',
    ageMin: 9,
    ageMax: 10,
    passage: 'Dr. Margaret Johnson was born in 1798 in a small English village, but her curious mind would eventually change the world. As a young girl, she spent countless hours in her father\'s workshop, fascinated by how machines worked. In an era when few women pursued science, Margaret defied expectations by studying mechanical engineering. Her greatest achievement came in 1835 when she invented an improved steam engine that revolutionized transportation and manufacturing.\n\nMargaret\'s journey wasn\'t easy. Her early designs were dangerous, with boilers that sometimes exploded, and engines that wasted enormous amounts of fuel. Through persistent experimentation, she discovered that using a separate condenser chamber and reinforced metal walls made engines both safer and more powerful. Her innovation allowed trains to travel faster and factories to produce goods more efficiently. Though she faced skepticism from male colleagues who doubted a woman\'s engineering abilities, Margaret earned respect through her brilliant work. By 1850, her steam engines powered over five hundred factories across Europe. Today, historians recognize Dr. Johnson as a pioneering inventor whose determination and ingenuity helped launch the Industrial Revolution.'
  },
  {
    id: 'g4-spell-1',
    category: 'spelling',
    difficulty: 'easy',
    question: 'Which word is spelled correctly?',
    options: [
      'becuase',
      'because',
      'becuse',
      'beacause'
    ],
    correctIndex: 1,
    explanation: '\'Because\' is spelled b-e-c-a-u-s-e. This is a commonly misspelled word. Remember: Big Elephants Can Always Understand Small Elephants.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-2',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which word is spelled correctly?',
    options: [
      'Febuary',
      'Feburary',
      'February',
      'Febrruary'
    ],
    correctIndex: 2,
    explanation: '\'February\' is spelled with two r\'s: F-e-b-r-u-a-r-y. Many people forget the first \'r\' in this commonly misspelled month name.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-3',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which word is spelled correctly?',
    options: [
      'seperate',
      'separete',
      'separate',
      'seprate'
    ],
    correctIndex: 2,
    explanation: '\'Separate\' is spelled s-e-p-a-r-a-t-e. Remember: there\'s \'a rat\' in separate to help you remember it\'s not \'seperate.\'',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-4',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word uses the correct -tion ending?',
    options: [
      'attension',
      'attenshen',
      'attenttion',
      'attention'
    ],
    correctIndex: 3,
    explanation: '\'Attention\' ends with -tion (pronounced \'shun\'). The root word is \'attent\' with the suffix \'-tion\' added. There\'s only one \'t\' before the suffix.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-5',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word uses the correct -sion ending?',
    options: [
      'confusion',
      'confution',
      'confushon',
      'confuzion'
    ],
    correctIndex: 0,
    explanation: '\'Confusion\' ends with -sion (also pronounced \'shun\'). Words ending in -sion often come from root words ending in \'d\' or \'s\', like \'confuse\' becoming \'confusion.\'',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-6',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which compound word is spelled correctly?',
    options: [
      'tooth brush',
      'toothbrush',
      'tooth-brush',
      'toothebrushe'
    ],
    correctIndex: 1,
    explanation: '\'Toothbrush\' is a compound word written as one word with no space or hyphen. It combines \'tooth\' and \'brush\' into a single word.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-7',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word with a Greek root meaning \'write\' is spelled correctly?',
    options: [
      'autograf',
      'autograph',
      'otograph',
      'autograff'
    ],
    correctIndex: 1,
    explanation: '\'Autograph\' combines the Greek roots \'auto\' (self) and \'graph\' (write), meaning to write one\'s own name. The \'ph\' makes the \'f\' sound in Greek-origin words.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-8',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word with the Latin root \'aud\' (hear) is spelled correctly?',
    options: [
      'audable',
      'awdible',
      'audible',
      'oddible'
    ],
    correctIndex: 2,
    explanation: '\'Audible\' comes from Latin \'aud\' (hear) + \'ible\' (able to), meaning able to be heard. It\'s spelled a-u-d-i-b-l-e.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-9',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which word with double letters is spelled correctly?',
    options: [
      'ocassion',
      'ocasion',
      'occasion',
      'occassion'
    ],
    correctIndex: 2,
    explanation: '\'Occasion\' has double \'c\' but single \'s\': o-c-c-a-s-i-o-n. This is a commonly misspelled word because people often double the wrong letter.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-spell-10',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word with the Greek root \'tele\' (far) is spelled correctly?',
    options: [
      'telefone',
      'telephone',
      'tellefone',
      'telaphone'
    ],
    correctIndex: 1,
    explanation: '\'Telephone\' combines Greek roots \'tele\' (far) and \'phone\' (sound), meaning sound from far away. Both parts use \'ph\' for the \'f\' sound, common in Greek-origin words.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-science-1',
    category: 'science',
    difficulty: 'medium',
    question: 'When you rub your hands together quickly, they feel warm. This is an example of:',
    options: [
      'Energy disappearing',
      'Motion energy changing to heat energy',
      'Heat energy changing to motion energy',
      'Energy being created from nothing'
    ],
    correctIndex: 1,
    explanation: 'Energy can be transferred from one form to another. When you rub your hands, the motion (kinetic) energy is converted into heat (thermal) energy through friction. Energy is not created or destroyed, only transformed.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-science-2',
    category: 'science',
    difficulty: 'medium',
    question: 'Sound travels in waves. Which statement about sound waves is true?',
    options: [
      'Sound waves can travel through empty space',
      'Sound waves need matter (like air, water, or solids) to travel',
      'Sound waves are a type of light',
      'Sound waves only travel through liquids'
    ],
    correctIndex: 1,
    explanation: 'Sound waves are vibrations that need matter (a medium) to travel through. They move through air, water, and solids by making particles vibrate. Sound cannot travel through empty space because there are no particles to vibrate.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-science-3',
    category: 'science',
    difficulty: 'hard',
    question: 'A large rock on a hillside breaks into smaller pieces over many years due to rain, ice, and temperature changes. This process is called:',
    options: [
      'Erosion',
      'Weathering',
      'Deposition',
      'Fossilization'
    ],
    correctIndex: 1,
    explanation: 'Weathering is the breaking down of rocks into smaller pieces by natural forces like water, ice, wind, and temperature changes. Erosion is the movement of those pieces. Weathering breaks down; erosion carries away.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-science-4',
    category: 'science',
    difficulty: 'medium',
    question: 'Which animal structure helps fish survive in water?',
    options: [
      'Wings for flying',
      'Gills for breathing underwater',
      'Legs for running',
      'Fur for staying warm'
    ],
    correctIndex: 1,
    explanation: 'Gills are specialized structures that allow fish to breathe underwater by extracting oxygen from water. This internal structure is essential for fish survival in their aquatic environment.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-science-5',
    category: 'science',
    difficulty: 'hard',
    question: 'Light waves differ from sound waves because light waves:',
    options: [
      'Cannot be reflected',
      'Can travel through empty space',
      'Only travel through solids',
      'Move slower than sound waves'
    ],
    correctIndex: 1,
    explanation: 'Unlike sound waves, light waves (electromagnetic waves) can travel through empty space (vacuum). This is why we can see light from the sun and stars, even though space has no air. Light travels much faster than sound and can be reflected.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-social-studies-1',
    category: 'social-studies',
    difficulty: 'medium',
    question: 'Which document begins with \'We the People\' and established the framework for the United States government?',
    options: [
      'The Declaration of Independence',
      'The Bill of Rights',
      'The Constitution',
      'The Gettysburg Address'
    ],
    correctIndex: 2,
    explanation: 'The U.S. Constitution begins with \'We the People\' and was written in 1787 to establish the structure of the federal government and define the relationship between the government and citizens.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-social-studies-2',
    category: 'social-studies',
    difficulty: 'easy',
    question: 'The three branches of the U.S. government are:',
    options: [
      'Federal, state, and local',
      'Legislative, executive, and judicial',
      'President, Congress, and citizens',
      'North, South, and West'
    ],
    correctIndex: 1,
    explanation: 'The Constitution divides the federal government into three branches: Legislative (makes laws - Congress), Executive (enforces laws - President), and Judicial (interprets laws - Supreme Court). This system provides checks and balances.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-social-studies-3',
    category: 'social-studies',
    difficulty: 'medium',
    question: 'Which is an example of a natural resource?',
    options: [
      'A bicycle',
      'Fresh water',
      'A computer',
      'A book'
    ],
    correctIndex: 1,
    explanation: 'Natural resources are materials found in nature that people use, such as water, air, soil, minerals, forests, and fossil fuels. Human-made objects like bicycles, computers, and books are not natural resources.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-social-studies-4',
    category: 'social-studies',
    difficulty: 'hard',
    question: 'In economics, \'scarcity\' means:',
    options: [
      'Having unlimited resources',
      'Resources are limited while wants are unlimited',
      'Everything is free',
      'No one wants anything'
    ],
    correctIndex: 1,
    explanation: 'Scarcity is a fundamental economic concept meaning that resources (like time, money, materials) are limited, but people\'s wants and needs are unlimited. This requires people to make choices about how to use resources.',
    ageMin: 9,
    ageMax: 10
  },
  {
    id: 'g4-social-studies-5',
    category: 'social-studies',
    difficulty: 'medium',
    question: 'What region of the United States is known for its many technology companies and is sometimes called \'Silicon Valley\'?',
    options: [
      'The Northeast',
      'The Southeast',
      'The West (California)',
      'The Midwest'
    ],
    correctIndex: 2,
    explanation: 'Silicon Valley is located in the western region of the United States, specifically in the San Francisco Bay Area of California. It became the center of technology and innovation, home to many computer and software companies.',
    ageMin: 9,
    ageMax: 10
  }
]
