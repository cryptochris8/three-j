import type { Question } from '@/types'

/**
 * Grade 6 Common Core Aligned Questions
 *
 * Standards Coverage:
 * - Math (6.RP, 6.NS, 6.EE, 6.SP, 6.G): 20 questions
 *   - Ratios and proportional relationships
 *   - Negative numbers, absolute value, fractions
 *   - Expressions, equations, variables
 *   - Statistics (mean, median, mode)
 *   - Area, volume, surface area
 * - Reading (RL.6, RI.6): 15 questions (3 passages, 5 questions each)
 * - Spelling: 10 questions (prefixes, Latin roots, academic vocabulary)
 * - Science (MS-LS1, MS-ESS2, MS-PS3): 5 questions
 *
 * Age Range: 11-12 years old
 * Total Questions: 50
 */

export const grade6Questions: Question[] = [
  // MATH QUESTIONS (20 total)
  // Ratios and Proportions (6.RP)
  {
    id: 'g6-math-1',
    category: 'math',
    difficulty: 'medium',
    question: 'A recipe calls for 3 cups of flour for every 2 cups of sugar. If you use 9 cups of flour, how many cups of sugar do you need?',
    options: ['4 cups', '6 cups', '8 cups', '12 cups'],
    correctIndex: 1,
    explanation: 'The ratio is 3:2 (flour:sugar). If flour is tripled (3×3=9), sugar must also be tripled (2×3=6).',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-2',
    category: 'math',
    difficulty: 'medium',
    question: 'A car travels 240 miles in 4 hours. At this rate, how far will it travel in 7 hours?',
    options: ['360 miles', '420 miles', '480 miles', '520 miles'],
    correctIndex: 1,
    explanation: 'Rate = 240÷4 = 60 miles per hour. Distance in 7 hours = 60×7 = 420 miles.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-3',
    category: 'math',
    difficulty: 'hard',
    question: 'In a classroom, the ratio of boys to girls is 5:3. If there are 15 boys, what is the total number of students?',
    options: ['18', '24', '27', '30'],
    correctIndex: 1,
    explanation: 'If 5 parts = 15 boys, then 1 part = 3. Girls = 3 parts = 3×3 = 9. Total = 15+9 = 24 students.',
    ageMin: 11,
    ageMax: 12
  },

  // Negative Numbers and Fractions (6.NS)
  {
    id: 'g6-math-4',
    category: 'math',
    difficulty: 'medium',
    question: 'What is the absolute value of -15?',
    options: ['-15', '0', '15', '30'],
    correctIndex: 2,
    explanation: 'Absolute value is the distance from zero on a number line, always positive. |-15| = 15.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-5',
    category: 'math',
    difficulty: 'medium',
    question: 'Calculate: -8 + 12',
    options: ['-20', '-4', '4', '20'],
    correctIndex: 2,
    explanation: 'Adding a positive to a negative: start at -8, move 12 steps right to reach 4.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-6',
    category: 'math',
    difficulty: 'hard',
    question: 'What is 2/3 ÷ 1/6?',
    options: ['1/9', '2/18', '4', '8'],
    correctIndex: 2,
    explanation: 'Dividing fractions: multiply by the reciprocal. 2/3 × 6/1 = 12/3 = 4.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-7',
    category: 'math',
    difficulty: 'medium',
    question: 'What is 3.5 × 2.4?',
    options: ['7.4', '8.2', '8.4', '8.6'],
    correctIndex: 2,
    explanation: '35 × 24 = 840. Since we have 2 decimal places total, the answer is 8.40 or 8.4.',
    ageMin: 11,
    ageMax: 12,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: '3.5', totalParts: 10, shadedParts: 7, color: '#3b82f6' },
        { label: '×2.4', totalParts: 10, shadedParts: 5, color: '#10b981' }
      ]
    }
  },

  // Expressions and Equations (6.EE)
  {
    id: 'g6-math-8',
    category: 'math',
    difficulty: 'medium',
    question: 'Solve for x: 3x + 7 = 22',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
    correctIndex: 1,
    explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-9',
    category: 'math',
    difficulty: 'medium',
    question: 'Evaluate the expression 4(2 + 3) - 6',
    options: ['8', '14', '20', '26'],
    correctIndex: 1,
    explanation: 'Order of operations: 4(5) - 6 = 20 - 6 = 14.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-10',
    category: 'math',
    difficulty: 'hard',
    question: 'If y = 2x - 5 and x = 6, what is the value of y?',
    options: ['7', '8', '12', '17'],
    correctIndex: 0,
    explanation: 'Substitute x = 6 into the equation: y = 2(6) - 5 = 12 - 5 = 7.',
    ageMin: 11,
    ageMax: 12
  },

  // Statistics (6.SP)
  {
    id: 'g6-math-11',
    category: 'math',
    difficulty: 'medium',
    question: 'Find the mean of this data set: 12, 15, 18, 20, 25',
    options: ['15', '18', '20', '22'],
    correctIndex: 1,
    explanation: 'Mean = sum ÷ count = (12+15+18+20+25) ÷ 5 = 90 ÷ 5 = 18.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-12',
    category: 'math',
    difficulty: 'medium',
    question: 'What is the median of: 7, 3, 9, 12, 5?',
    options: ['5', '7', '9', '12'],
    correctIndex: 1,
    explanation: 'First, order the data: 3, 5, 7, 9, 12. The middle value (median) is 7.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-13',
    category: 'math',
    difficulty: 'hard',
    question: 'Find the mode of: 4, 7, 4, 9, 4, 11, 7',
    options: ['4', '7', '9', '11'],
    correctIndex: 0,
    explanation: 'Mode is the most frequent value. The number 4 appears three times, more than any other.',
    ageMin: 11,
    ageMax: 12
  },

  // Geometry - Area, Volume, Surface Area (6.G)
  {
    id: 'g6-math-14',
    category: 'math',
    difficulty: 'medium',
    question: 'What is the area of a triangle with base 10 cm and height 6 cm?',
    options: ['16 cm²', '30 cm²', '60 cm²', '120 cm²'],
    correctIndex: 1,
    explanation: 'Area of triangle = 1/2 × base × height = 1/2 × 10 × 6 = 30 cm².',
    ageMin: 11,
    ageMax: 12,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: 'Base: 10cm', totalParts: 10, shadedParts: 10, color: '#f59e0b' },
        { label: 'Height: 6cm', totalParts: 10, shadedParts: 6, color: '#8b5cf6' }
      ]
    }
  },
  {
    id: 'g6-math-15',
    category: 'math',
    difficulty: 'hard',
    question: 'A rectangular prism has length 8 cm, width 5 cm, and height 3 cm. What is its volume?',
    options: ['40 cm³', '80 cm³', '120 cm³', '160 cm³'],
    correctIndex: 2,
    explanation: 'Volume = length × width × height = 8 × 5 × 3 = 120 cm³.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-16',
    category: 'math',
    difficulty: 'hard',
    question: 'What is the surface area of a cube with side length 4 cm?',
    options: ['64 cm²', '72 cm²', '84 cm²', '96 cm²'],
    correctIndex: 3,
    explanation: 'A cube has 6 faces. Surface area = 6 × (side²) = 6 × (4²) = 6 × 16 = 96 cm².',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-17',
    category: 'math',
    difficulty: 'medium',
    question: 'A circle has a radius of 7 cm. What is its circumference? (Use π ≈ 3.14)',
    options: ['21.98 cm', '43.96 cm', '153.86 cm', '307.72 cm'],
    correctIndex: 1,
    explanation: 'Circumference = 2πr = 2 × 3.14 × 7 = 43.96 cm.',
    ageMin: 11,
    ageMax: 12,
    diagram: {
      type: 'fraction-bars',
      bars: [
        { label: 'Radius: 7cm', totalParts: 10, shadedParts: 7, color: '#ef4444' }
      ]
    }
  },
  {
    id: 'g6-math-18',
    category: 'math',
    difficulty: 'medium',
    question: 'What is 15% of 80?',
    options: ['10', '12', '15', '20'],
    correctIndex: 1,
    explanation: '15% = 0.15. Multiply: 0.15 × 80 = 12.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-19',
    category: 'math',
    difficulty: 'hard',
    question: 'A shirt originally costs $45. It is on sale for 20% off. What is the sale price?',
    options: ['$9', '$25', '$36', '$40'],
    correctIndex: 2,
    explanation: 'Discount = 20% of $45 = 0.20 × 45 = $9. Sale price = $45 - $9 = $36.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-math-20',
    category: 'math',
    difficulty: 'hard',
    question: 'If a rectangular garden is 12 feet long and 8 feet wide, what is the length of fencing needed to enclose it?',
    options: ['20 feet', '40 feet', '48 feet', '96 feet'],
    correctIndex: 1,
    explanation: 'Perimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40 feet.',
    ageMin: 11,
    ageMax: 12
  },

  // READING QUESTIONS (15 total - 3 passages with 5 questions each)
  // Passage 1: Technology Debate
  {
    id: 'g6-reading-1',
    category: 'reading',
    difficulty: 'medium',
    question: 'What is the main argument presented in this passage?',
    options: [
      'Technology should be banned in schools',
      'Technology has both benefits and drawbacks in education',
      'Students should only use technology at home',
      'Teachers are against all forms of technology'
    ],
    correctIndex: 1,
    explanation: 'The passage presents a balanced view, discussing both advantages (access to information, engagement) and disadvantages (distraction, reduced face-to-face interaction) of technology in education.',
    ageMin: 11,
    ageMax: 12,
    passage: `The debate over technology in education continues to evolve as schools integrate more digital tools into their classrooms. Proponents argue that technology provides students with instant access to vast amounts of information, encourages engagement through interactive learning, and prepares them for a technology-driven workforce. Digital devices can personalize learning experiences, allowing students to progress at their own pace and explore subjects that interest them beyond the standard curriculum.

However, critics raise valid concerns about this digital transformation. They point to studies showing that excessive screen time can lead to decreased attention spans and reduced critical thinking skills. Some educators worry that students become overly dependent on search engines, losing the ability to conduct deep research or think independently. Additionally, the constant connectivity can be distracting, with social media and games competing for students' focus during class time.

The reality likely lies somewhere in the middle. Technology is neither a perfect solution nor a fundamental problem—it\'s a tool that requires thoughtful implementation. Successful integration depends on teacher training, appropriate usage guidelines, and maintaining a balance between digital and traditional learning methods. Schools must ensure that technology enhances education rather than replacing essential human interaction and hands-on learning experiences.`
  },
  {
    id: 'g6-reading-2',
    category: 'reading',
    difficulty: 'medium',
    question: 'According to the passage, what is one benefit of technology in education?',
    options: [
      'It eliminates the need for teachers',
      'It allows personalized learning at individual paces',
      'It prevents students from being distracted',
      'It reduces homework requirements'
    ],
    correctIndex: 1,
    explanation: 'The passage explicitly states that "digital devices can personalize learning experiences, allowing students to progress at their own pace."',
    ageMin: 11,
    ageMax: 12,
    passage: `The debate over technology in education continues to evolve as schools integrate more digital tools into their classrooms. Proponents argue that technology provides students with instant access to vast amounts of information, encourages engagement through interactive learning, and prepares them for a technology-driven workforce. Digital devices can personalize learning experiences, allowing students to progress at their own pace and explore subjects that interest them beyond the standard curriculum.

However, critics raise valid concerns about this digital transformation. They point to studies showing that excessive screen time can lead to decreased attention spans and reduced critical thinking skills. Some educators worry that students become overly dependent on search engines, losing the ability to conduct deep research or think independently. Additionally, the constant connectivity can be distracting, with social media and games competing for students' focus during class time.

The reality likely lies somewhere in the middle. Technology is neither a perfect solution nor a fundamental problem—it\'s a tool that requires thoughtful implementation. Successful integration depends on teacher training, appropriate usage guidelines, and maintaining a balance between digital and traditional learning methods. Schools must ensure that technology enhances education rather than replacing essential human interaction and hands-on learning experiences.`
  },
  {
    id: 'g6-reading-3',
    category: 'reading',
    difficulty: 'hard',
    question: 'What concern do critics have about students using search engines?',
    options: [
      'Search engines are too expensive',
      'Students might lose the ability to conduct deep research independently',
      'Search engines provide incorrect information',
      'Students prefer libraries to search engines'
    ],
    correctIndex: 1,
    explanation: 'The passage states that "educators worry that students become overly dependent on search engines, losing the ability to conduct deep research or think independently."',
    ageMin: 11,
    ageMax: 12,
    passage: `The debate over technology in education continues to evolve as schools integrate more digital tools into their classrooms. Proponents argue that technology provides students with instant access to vast amounts of information, encourages engagement through interactive learning, and prepares them for a technology-driven workforce. Digital devices can personalize learning experiences, allowing students to progress at their own pace and explore subjects that interest them beyond the standard curriculum.

However, critics raise valid concerns about this digital transformation. They point to studies showing that excessive screen time can lead to decreased attention spans and reduced critical thinking skills. Some educators worry that students become overly dependent on search engines, losing the ability to conduct deep research or think independently. Additionally, the constant connectivity can be distracting, with social media and games competing for students' focus during class time.

The reality likely lies somewhere in the middle. Technology is neither a perfect solution nor a fundamental problem—it\'s a tool that requires thoughtful implementation. Successful integration depends on teacher training, appropriate usage guidelines, and maintaining a balance between digital and traditional learning methods. Schools must ensure that technology enhances education rather than replacing essential human interaction and hands-on learning experiences.`
  },
  {
    id: 'g6-reading-4',
    category: 'reading',
    difficulty: 'medium',
    question: 'What does the author suggest is necessary for successful technology integration?',
    options: [
      'Replacing all traditional methods with digital ones',
      'Teacher training and maintaining balance between digital and traditional methods',
      'Limiting technology use to one hour per day',
      'Only allowing technology in high school'
    ],
    correctIndex: 1,
    explanation: 'The passage concludes that "successful integration depends on teacher training, appropriate usage guidelines, and maintaining a balance between digital and traditional learning methods."',
    ageMin: 11,
    ageMax: 12,
    passage: `The debate over technology in education continues to evolve as schools integrate more digital tools into their classrooms. Proponents argue that technology provides students with instant access to vast amounts of information, encourages engagement through interactive learning, and prepares them for a technology-driven workforce. Digital devices can personalize learning experiences, allowing students to progress at their own pace and explore subjects that interest them beyond the standard curriculum.

However, critics raise valid concerns about this digital transformation. They point to studies showing that excessive screen time can lead to decreased attention spans and reduced critical thinking skills. Some educators worry that students become overly dependent on search engines, losing the ability to conduct deep research or think independently. Additionally, the constant connectivity can be distracting, with social media and games competing for students' focus during class time.

The reality likely lies somewhere in the middle. Technology is neither a perfect solution nor a fundamental problem—it\'s a tool that requires thoughtful implementation. Successful integration depends on teacher training, appropriate usage guidelines, and maintaining a balance between digital and traditional learning methods. Schools must ensure that technology enhances education rather than replacing essential human interaction and hands-on learning experiences.`
  },
  {
    id: 'g6-reading-5',
    category: 'reading',
    difficulty: 'hard',
    question: 'Based on the passage, what is the author\'s tone regarding technology in education?',
    options: [
      'Completely supportive',
      'Entirely opposed',
      'Balanced and thoughtful',
      'Confused and uncertain'
    ],
    correctIndex: 2,
    explanation: 'The author presents both sides of the argument and concludes that "the reality likely lies somewhere in the middle," showing a balanced, thoughtful approach.',
    ageMin: 11,
    ageMax: 12,
    passage: `The debate over technology in education continues to evolve as schools integrate more digital tools into their classrooms. Proponents argue that technology provides students with instant access to vast amounts of information, encourages engagement through interactive learning, and prepares them for a technology-driven workforce. Digital devices can personalize learning experiences, allowing students to progress at their own pace and explore subjects that interest them beyond the standard curriculum.

However, critics raise valid concerns about this digital transformation. They point to studies showing that excessive screen time can lead to decreased attention spans and reduced critical thinking skills. Some educators worry that students become overly dependent on search engines, losing the ability to conduct deep research or think independently. Additionally, the constant connectivity can be distracting, with social media and games competing for students' focus during class time.

The reality likely lies somewhere in the middle. Technology is neither a perfect solution nor a fundamental problem—it\'s a tool that requires thoughtful implementation. Successful integration depends on teacher training, appropriate usage guidelines, and maintaining a balance between digital and traditional learning methods. Schools must ensure that technology enhances education rather than replacing essential human interaction and hands-on learning experiences.`
  },

  // Passage 2: Environmental Issue
  {
    id: 'g6-reading-6',
    category: 'reading',
    difficulty: 'medium',
    question: 'What is the primary purpose of this passage?',
    options: [
      'To describe different types of ocean animals',
      'To explain the problem of plastic pollution in oceans and its effects',
      'To teach readers how to recycle',
      'To compare oceans to landfills'
    ],
    correctIndex: 1,
    explanation: 'The passage focuses on explaining the serious issue of plastic pollution in oceans, its impact on marine life, and the urgent need for action.',
    ageMin: 11,
    ageMax: 12,
    passage: `Ocean plastic pollution has become one of the most pressing environmental challenges of our time. Every year, approximately 8 million metric tons of plastic waste enter our oceans, accumulating in massive garbage patches and threatening marine ecosystems worldwide. This plastic doesn\'t simply disappear—it breaks down into smaller pieces called microplastics, which persist in the environment for hundreds of years and enter the food chain at every level.

The impact on marine life is devastating. Sea turtles mistake plastic bags for jellyfish and consume them, leading to blocked digestive systems and starvation. Seabirds feed plastic fragments to their chicks, believing them to be food. Fish and other marine organisms ingest microplastics, which then accumulate toxins that can harm not only the animals themselves but also the humans who consume seafood. Scientists estimate that by 2050, there could be more plastic than fish in our oceans by weight if current trends continue.

Addressing this crisis requires action at multiple levels. Individuals can reduce single-use plastics, participate in beach cleanups, and properly dispose of waste. Governments must implement stronger regulations on plastic production and disposal, while industries need to develop sustainable alternatives and take responsibility for the entire lifecycle of their products. Innovation in biodegradable materials and improved recycling technologies offers hope, but the window for effective action is narrowing rapidly.`
  },
  {
    id: 'g6-reading-7',
    category: 'reading',
    difficulty: 'medium',
    question: 'According to the passage, what are microplastics?',
    options: [
      'Tiny organisms that live in the ocean',
      'Small pieces that plastic breaks down into',
      'A type of plankton',
      'Microscopes used to study plastic'
    ],
    correctIndex: 1,
    explanation: 'The passage defines microplastics as smaller pieces that plastic "breaks down into," which "persist in the environment for hundreds of years."',
    ageMin: 11,
    ageMax: 12,
    passage: `Ocean plastic pollution has become one of the most pressing environmental challenges of our time. Every year, approximately 8 million metric tons of plastic waste enter our oceans, accumulating in massive garbage patches and threatening marine ecosystems worldwide. This plastic doesn\'t simply disappear—it breaks down into smaller pieces called microplastics, which persist in the environment for hundreds of years and enter the food chain at every level.

The impact on marine life is devastating. Sea turtles mistake plastic bags for jellyfish and consume them, leading to blocked digestive systems and starvation. Seabirds feed plastic fragments to their chicks, believing them to be food. Fish and other marine organisms ingest microplastics, which then accumulate toxins that can harm not only the animals themselves but also the humans who consume seafood. Scientists estimate that by 2050, there could be more plastic than fish in our oceans by weight if current trends continue.

Addressing this crisis requires action at multiple levels. Individuals can reduce single-use plastics, participate in beach cleanups, and properly dispose of waste. Governments must implement stronger regulations on plastic production and disposal, while industries need to develop sustainable alternatives and take responsibility for the entire lifecycle of their products. Innovation in biodegradable materials and improved recycling technologies offers hope, but the window for effective action is narrowing rapidly.`
  },
  {
    id: 'g6-reading-8',
    category: 'reading',
    difficulty: 'hard',
    question: 'What prediction do scientists make about the year 2050?',
    options: [
      'All plastic will have decomposed',
      'There could be more plastic than fish in oceans by weight',
      'The ocean will be completely clean',
      'No more plastic will be produced'
    ],
    correctIndex: 1,
    explanation: 'The passage states that "scientists estimate that by 2050, there could be more plastic than fish in our oceans by weight if current trends continue."',
    ageMin: 11,
    ageMax: 12,
    passage: `Ocean plastic pollution has become one of the most pressing environmental challenges of our time. Every year, approximately 8 million metric tons of plastic waste enter our oceans, accumulating in massive garbage patches and threatening marine ecosystems worldwide. This plastic doesn\'t simply disappear—it breaks down into smaller pieces called microplastics, which persist in the environment for hundreds of years and enter the food chain at every level.

The impact on marine life is devastating. Sea turtles mistake plastic bags for jellyfish and consume them, leading to blocked digestive systems and starvation. Seabirds feed plastic fragments to their chicks, believing them to be food. Fish and other marine organisms ingest microplastics, which then accumulate toxins that can harm not only the animals themselves but also the humans who consume seafood. Scientists estimate that by 2050, there could be more plastic than fish in our oceans by weight if current trends continue.

Addressing this crisis requires action at multiple levels. Individuals can reduce single-use plastics, participate in beach cleanups, and properly dispose of waste. Governments must implement stronger regulations on plastic production and disposal, while industries need to develop sustainable alternatives and take responsibility for the entire lifecycle of their products. Innovation in biodegradable materials and improved recycling technologies offers hope, but the window for effective action is narrowing rapidly.`
  },
  {
    id: 'g6-reading-9',
    category: 'reading',
    difficulty: 'medium',
    question: 'How does plastic pollution affect sea turtles?',
    options: [
      'They use plastic to build nests',
      'They mistake plastic bags for jellyfish and eat them',
      'They avoid areas with plastic',
      'They are not affected by plastic'
    ],
    correctIndex: 1,
    explanation: 'The passage explains that "sea turtles mistake plastic bags for jellyfish and consume them, leading to blocked digestive systems and starvation."',
    ageMin: 11,
    ageMax: 12,
    passage: `Ocean plastic pollution has become one of the most pressing environmental challenges of our time. Every year, approximately 8 million metric tons of plastic waste enter our oceans, accumulating in massive garbage patches and threatening marine ecosystems worldwide. This plastic doesn\'t simply disappear—it breaks down into smaller pieces called microplastics, which persist in the environment for hundreds of years and enter the food chain at every level.

The impact on marine life is devastating. Sea turtles mistake plastic bags for jellyfish and consume them, leading to blocked digestive systems and starvation. Seabirds feed plastic fragments to their chicks, believing them to be food. Fish and other marine organisms ingest microplastics, which then accumulate toxins that can harm not only the animals themselves but also the humans who consume seafood. Scientists estimate that by 2050, there could be more plastic than fish in our oceans by weight if current trends continue.

Addressing this crisis requires action at multiple levels. Individuals can reduce single-use plastics, participate in beach cleanups, and properly dispose of waste. Governments must implement stronger regulations on plastic production and disposal, while industries need to develop sustainable alternatives and take responsibility for the entire lifecycle of their products. Innovation in biodegradable materials and improved recycling technologies offers hope, but the window for effective action is narrowing rapidly.`
  },
  {
    id: 'g6-reading-10',
    category: 'reading',
    difficulty: 'hard',
    question: 'According to the passage, what role should governments play in addressing plastic pollution?',
    options: [
      'Governments should ignore the issue',
      'Governments should only clean beaches',
      'Governments must implement stronger regulations on plastic production and disposal',
      'Governments should ban all fishing'
    ],
    correctIndex: 2,
    explanation: 'The passage states that "governments must implement stronger regulations on plastic production and disposal" as part of the multi-level solution.',
    ageMin: 11,
    ageMax: 12,
    passage: `Ocean plastic pollution has become one of the most pressing environmental challenges of our time. Every year, approximately 8 million metric tons of plastic waste enter our oceans, accumulating in massive garbage patches and threatening marine ecosystems worldwide. This plastic doesn\'t simply disappear—it breaks down into smaller pieces called microplastics, which persist in the environment for hundreds of years and enter the food chain at every level.

The impact on marine life is devastating. Sea turtles mistake plastic bags for jellyfish and consume them, leading to blocked digestive systems and starvation. Seabirds feed plastic fragments to their chicks, believing them to be food. Fish and other marine organisms ingest microplastics, which then accumulate toxins that can harm not only the animals themselves but also the humans who consume seafood. Scientists estimate that by 2050, there could be more plastic than fish in our oceans by weight if current trends continue.

Addressing this crisis requires action at multiple levels. Individuals can reduce single-use plastics, participate in beach cleanups, and properly dispose of waste. Governments must implement stronger regulations on plastic production and disposal, while industries need to develop sustainable alternatives and take responsibility for the entire lifecycle of their products. Innovation in biodegradable materials and improved recycling technologies offers hope, but the window for effective action is narrowing rapidly.`
  },

  // Passage 3: Historical Figure
  {
    id: 'g6-reading-11',
    category: 'reading',
    difficulty: 'medium',
    question: 'What was Katherine Johnson\'s primary contribution to space exploration?',
    options: [
      'She designed spacecraft',
      'She performed complex mathematical calculations for space missions',
      'She was the first woman in space',
      'She invented the computer'
    ],
    correctIndex: 1,
    explanation: 'The passage emphasizes that Katherine Johnson was a mathematician who performed "complex calculations that were critical to the success of early space missions."',
    ageMin: 11,
    ageMax: 12,
    passage: `Katherine Johnson was a brilliant mathematician whose calculations were critical to the success of early space missions, yet her contributions remained largely unrecognized for decades. Born in 1918 in West Virginia, Johnson displayed exceptional mathematical ability from a young age, graduating from high school at 14 and college at 18. In 1953, she began working at NASA\'s predecessor, NACA, where she faced the dual challenges of racial segregation and gender discrimination in a field dominated by white men.

Despite these obstacles, Johnson\'s talent was undeniable. Her precise calculations of orbital mechanics were essential for the success of the first American-crewed spaceflights. In 1962, when NASA prepared to launch astronaut John Glenn into orbit, the agency had begun using electronic computers for calculations. However, Glenn refused to fly unless Johnson personally verified the computer\'s numbers, saying "If she says they\'re good, then I\'m ready to go." Her calculations were perfect, and the mission succeeded, making Glenn the first American to orbit Earth.

Johnson continued to contribute to the space program for over three decades, working on the Apollo Moon landing missions and the Space Shuttle program. She retired in 1986, having broken barriers not just in space exploration but also for women and African Americans in STEM fields. In 2015, President Obama awarded her the Presidential Medal of Freedom, and her story gained widespread recognition through the book and film "Hidden Figures." Katherine Johnson passed away in 2020 at age 101, leaving a legacy that continues to inspire future generations of scientists and mathematicians.`
  },
  {
    id: 'g6-reading-12',
    category: 'reading',
    difficulty: 'medium',
    question: 'Why did astronaut John Glenn specifically request Katherine Johnson\'s verification?',
    options: [
      'She was his friend',
      'He trusted her calculations over the electronic computers',
      'She was the only mathematician available',
      'NASA required all astronauts to do this'
    ],
    correctIndex: 1,
    explanation: 'The passage states that Glenn "refused to fly unless Johnson personally verified the computer\'s numbers," showing his trust in her over the computers.',
    ageMin: 11,
    ageMax: 12,
    passage: `Katherine Johnson was a brilliant mathematician whose calculations were critical to the success of early space missions, yet her contributions remained largely unrecognized for decades. Born in 1918 in West Virginia, Johnson displayed exceptional mathematical ability from a young age, graduating from high school at 14 and college at 18. In 1953, she began working at NASA\'s predecessor, NACA, where she faced the dual challenges of racial segregation and gender discrimination in a field dominated by white men.

Despite these obstacles, Johnson\'s talent was undeniable. Her precise calculations of orbital mechanics were essential for the success of the first American-crewed spaceflights. In 1962, when NASA prepared to launch astronaut John Glenn into orbit, the agency had begun using electronic computers for calculations. However, Glenn refused to fly unless Johnson personally verified the computer\'s numbers, saying "If she says they\'re good, then I\'m ready to go." Her calculations were perfect, and the mission succeeded, making Glenn the first American to orbit Earth.

Johnson continued to contribute to the space program for over three decades, working on the Apollo Moon landing missions and the Space Shuttle program. She retired in 1986, having broken barriers not just in space exploration but also for women and African Americans in STEM fields. In 2015, President Obama awarded her the Presidential Medal of Freedom, and her story gained widespread recognition through the book and film "Hidden Figures." Katherine Johnson passed away in 2020 at age 101, leaving a legacy that continues to inspire future generations of scientists and mathematicians.`
  },
  {
    id: 'g6-reading-13',
    category: 'reading',
    difficulty: 'hard',
    question: 'What challenges did Katherine Johnson face in her career?',
    options: [
      'Lack of mathematical ability',
      'Racial segregation and gender discrimination',
      'Insufficient education',
      'Fear of flying'
    ],
    correctIndex: 1,
    explanation: 'The passage explicitly states she "faced the dual challenges of racial segregation and gender discrimination in a field dominated by white men."',
    ageMin: 11,
    ageMax: 12,
    passage: `Katherine Johnson was a brilliant mathematician whose calculations were critical to the success of early space missions, yet her contributions remained largely unrecognized for decades. Born in 1918 in West Virginia, Johnson displayed exceptional mathematical ability from a young age, graduating from high school at 14 and college at 18. In 1953, she began working at NASA\'s predecessor, NACA, where she faced the dual challenges of racial segregation and gender discrimination in a field dominated by white men.

Despite these obstacles, Johnson\'s talent was undeniable. Her precise calculations of orbital mechanics were essential for the success of the first American-crewed spaceflights. In 1962, when NASA prepared to launch astronaut John Glenn into orbit, the agency had begun using electronic computers for calculations. However, Glenn refused to fly unless Johnson personally verified the computer\'s numbers, saying "If she says they\'re good, then I\'m ready to go." Her calculations were perfect, and the mission succeeded, making Glenn the first American to orbit Earth.

Johnson continued to contribute to the space program for over three decades, working on the Apollo Moon landing missions and the Space Shuttle program. She retired in 1986, having broken barriers not just in space exploration but also for women and African Americans in STEM fields. In 2015, President Obama awarded her the Presidential Medal of Freedom, and her story gained widespread recognition through the book and film "Hidden Figures." Katherine Johnson passed away in 2020 at age 101, leaving a legacy that continues to inspire future generations of scientists and mathematicians.`
  },
  {
    id: 'g6-reading-14',
    category: 'reading',
    difficulty: 'medium',
    question: 'How old was Katherine Johnson when she graduated from college?',
    options: ['14', '18', '21', '25'],
    correctIndex: 1,
    explanation: 'The passage states she graduated "from high school at 14 and college at 18," showing her exceptional academic abilities.',
    ageMin: 11,
    ageMax: 12,
    passage: `Katherine Johnson was a brilliant mathematician whose calculations were critical to the success of early space missions, yet her contributions remained largely unrecognized for decades. Born in 1918 in West Virginia, Johnson displayed exceptional mathematical ability from a young age, graduating from high school at 14 and college at 18. In 1953, she began working at NASA\'s predecessor, NACA, where she faced the dual challenges of racial segregation and gender discrimination in a field dominated by white men.

Despite these obstacles, Johnson\'s talent was undeniable. Her precise calculations of orbital mechanics were essential for the success of the first American-crewed spaceflights. In 1962, when NASA prepared to launch astronaut John Glenn into orbit, the agency had begun using electronic computers for calculations. However, Glenn refused to fly unless Johnson personally verified the computer\'s numbers, saying "If she says they\'re good, then I\'m ready to go." Her calculations were perfect, and the mission succeeded, making Glenn the first American to orbit Earth.

Johnson continued to contribute to the space program for over three decades, working on the Apollo Moon landing missions and the Space Shuttle program. She retired in 1986, having broken barriers not just in space exploration but also for women and African Americans in STEM fields. In 2015, President Obama awarded her the Presidential Medal of Freedom, and her story gained widespread recognition through the book and film "Hidden Figures." Katherine Johnson passed away in 2020 at age 101, leaving a legacy that continues to inspire future generations of scientists and mathematicians.`
  },
  {
    id: 'g6-reading-15',
    category: 'reading',
    difficulty: 'hard',
    question: 'What honor did Katherine Johnson receive in 2015?',
    options: [
      'Nobel Prize',
      'Presidential Medal of Freedom',
      'Fields Medal',
      'Pulitzer Prize'
    ],
    correctIndex: 1,
    explanation: 'The passage states that "in 2015, President Obama awarded her the Presidential Medal of Freedom," one of the highest civilian honors.',
    ageMin: 11,
    ageMax: 12,
    passage: `Katherine Johnson was a brilliant mathematician whose calculations were critical to the success of early space missions, yet her contributions remained largely unrecognized for decades. Born in 1918 in West Virginia, Johnson displayed exceptional mathematical ability from a young age, graduating from high school at 14 and college at 18. In 1953, she began working at NASA\'s predecessor, NACA, where she faced the dual challenges of racial segregation and gender discrimination in a field dominated by white men.

Despite these obstacles, Johnson\'s talent was undeniable. Her precise calculations of orbital mechanics were essential for the success of the first American-crewed spaceflights. In 1962, when NASA prepared to launch astronaut John Glenn into orbit, the agency had begun using electronic computers for calculations. However, Glenn refused to fly unless Johnson personally verified the computer\'s numbers, saying "If she says they\'re good, then I\'m ready to go." Her calculations were perfect, and the mission succeeded, making Glenn the first American to orbit Earth.

Johnson continued to contribute to the space program for over three decades, working on the Apollo Moon landing missions and the Space Shuttle program. She retired in 1986, having broken barriers not just in space exploration but also for women and African Americans in STEM fields. In 2015, President Obama awarded her the Presidential Medal of Freedom, and her story gained widespread recognition through the book and film "Hidden Figures." Katherine Johnson passed away in 2020 at age 101, leaving a legacy that continues to inspire future generations of scientists and mathematicians.`
  },

  // SPELLING QUESTIONS (10 total)
  {
    id: 'g6-spelling-1',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which word means "to travel around"?',
    options: ['circumvent', 'circumnavigate', 'circumference', 'circumstance'],
    correctIndex: 1,
    explanation: 'Circumnavigate means to sail or travel all the way around something. The prefix "circum-" means around, and "navigate" means to travel.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-2',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Choose the correct spelling of the word meaning "badly behaved"?',
    options: ['mischievous', 'mischevious', 'mischeivous', 'mischievious'],
    correctIndex: 0,
    explanation: 'Mischievous is spelled with "ie" after the "ch" and ends in "-ous". Common mistake is adding an extra "i" before the ending.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-3',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word means "a proposed explanation for a phenomenon"?',
    options: ['hypothesis', 'hypothosis', 'hypotesis', 'hypothisis'],
    correctIndex: 0,
    explanation: 'Hypothesis is the correct spelling. It comes from Greek roots and is commonly used in scientific contexts.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-4',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Choose the correct word for the head of a school:',
    options: ['principle', 'principal', 'prinsiple', 'prinsipal'],
    correctIndex: 1,
    explanation: 'Principal is the head of a school. Remember: the principal is your "pal." Principle means a fundamental truth or rule.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-5',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which sentence uses "their" correctly?',
    options: [
      'Their going to the store.',
      'The book is over their.',
      'They brought their backpacks.',
      'Their are many options.'
    ],
    correctIndex: 2,
    explanation: 'Their shows possession (belonging to them). They\'re means "they are." There refers to a place or existence.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-6',
    category: 'spelling',
    difficulty: 'medium',
    question: 'What does the Latin root "bene-" mean?',
    options: ['bad', 'good', 'sound', 'light'],
    correctIndex: 1,
    explanation: 'The Latin root "bene-" means good or well, as in benefit, benevolent, and benediction.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-7',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Which word contains the Latin root "mal-" meaning bad?',
    options: ['melody', 'malfunction', 'mallet', 'mallard'],
    correctIndex: 1,
    explanation: 'Malfunction contains "mal-" (bad) + function, meaning something is working badly or incorrectly. Other "mal-" words include malicious, malady, and malnutrition.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-8',
    category: 'spelling',
    difficulty: 'medium',
    question: 'What does the Latin root "aud-" mean?',
    options: ['see', 'speak', 'hear', 'write'],
    correctIndex: 2,
    explanation: 'The Latin root "aud-" means hear, as in audio, auditorium, audible, and audience.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-9',
    category: 'spelling',
    difficulty: 'hard',
    question: 'Choose the correct spelling for "to examine in detail":',
    options: ['analise', 'analyze', 'analize', 'analyise'],
    correctIndex: 1,
    explanation: 'Analyze is the American spelling. British English uses "analyse." Both mean to examine something in detail.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-spelling-10',
    category: 'spelling',
    difficulty: 'medium',
    question: 'Which word is spelled correctly?',
    options: ['occurance', 'occurrance', 'occurrence', 'occurence'],
    correctIndex: 2,
    explanation: 'Occurrence is spelled with double "c" and double "r". It means something that happens or takes place.',
    ageMin: 11,
    ageMax: 12
  },

  // SCIENCE QUESTIONS (5 total)
  {
    id: 'g6-science-1',
    category: 'science',
    difficulty: 'medium',
    question: 'What is the basic unit of structure and function in all living organisms?',
    options: ['atom', 'cell', 'tissue', 'organ'],
    correctIndex: 1,
    explanation: 'The cell is the basic unit of life. All living things are made of one or more cells, and cells carry out all life processes.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-science-2',
    category: 'science',
    difficulty: 'hard',
    question: 'What process do plate tectonics help explain?',
    options: [
      'Cloud formation',
      'Earthquakes and volcanic activity',
      'Ocean currents',
      'Weather patterns'
    ],
    correctIndex: 1,
    explanation: 'Plate tectonics theory explains how Earth\'s lithosphere is divided into plates that move, causing earthquakes, volcanic activity, and mountain formation at plate boundaries.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-science-3',
    category: 'science',
    difficulty: 'medium',
    question: 'Which type of energy is stored in food?',
    options: ['kinetic energy', 'chemical energy', 'thermal energy', 'electrical energy'],
    correctIndex: 1,
    explanation: 'Chemical energy is stored in the bonds between atoms in molecules. Food stores chemical energy that our bodies convert to other forms of energy.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-science-4',
    category: 'science',
    difficulty: 'medium',
    question: 'What causes wind?',
    options: [
      'The rotation of Earth',
      'Differences in air pressure',
      'The ocean currents',
      'The moon\'s gravity'
    ],
    correctIndex: 1,
    explanation: 'Wind is caused by differences in air pressure. Air moves from areas of high pressure to areas of low pressure, creating wind.',
    ageMin: 11,
    ageMax: 12
  },
  {
    id: 'g6-science-5',
    category: 'science',
    difficulty: 'hard',
    question: 'In the engineering design process, what comes after identifying a problem?',
    options: [
      'Building the final solution',
      'Researching and brainstorming possible solutions',
      'Testing the solution',
      'Presenting the results'
    ],
    correctIndex: 1,
    explanation: 'After identifying a problem, engineers research and brainstorm possible solutions before designing, building, and testing prototypes.',
    ageMin: 11,
    ageMax: 12
  }
]
