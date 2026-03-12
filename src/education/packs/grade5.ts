/**
 * Grade 5 Question Bank
 *
 * Aligned with Common Core State Standards for Grade 5
 * Age Range: 10-11 years
 *
 * Standards covered:
 * - Math: Order of operations, fractions (addition, subtraction, multiplication, division),
 *   decimals, volume, measurement conversions, coordinate planes, geometry
 * - Reading: Main idea, inference, vocabulary in context, text structure, character analysis
 * - Spelling: Prefixes, suffixes, silent letters, commonly confused words, word analysis
 * - Science: Chemical vs physical changes, water cycle, energy transfer, astronomy
 * - Social Studies: U.S. Government branches, Constitution, American Revolution,
 *   Civil War era, Native American civilizations
 */

import type { Question } from '@/types'

export const grade5Questions: Question[] = [
  {
    id: "g5-math-1",
    category: "math",
    difficulty: "easy",
    question: "What is the value of the expression: 3 + 4 × 2?",
    options: ["14", "11", "10", "8"],
    correctIndex: 1,
    explanation: "Following the order of operations (PEMDAS), we multiply first: 4 × 2 = 8, then add: 3 + 8 = 11.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-2",
    category: "math",
    difficulty: "medium",
    question: "Solve: (15 - 3) ÷ 4 + 2",
    options: ["5", "6", "3.5", "8"],
    correctIndex: 0,
    explanation: "First, solve the parentheses: 15 - 3 = 12. Then divide: 12 ÷ 4 = 3. Finally, add: 3 + 2 = 5.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-3",
    category: "math",
    difficulty: "medium",
    question: "What is 2/3 + 1/4?",
    options: ["3/7", "11/12", "3/12", "8/12"],
    correctIndex: 1,
    explanation: "To add fractions with unlike denominators, find the common denominator (12). Convert: 2/3 = 8/12 and 1/4 = 3/12. Then add: 8/12 + 3/12 = 11/12.",
    ageMin: 10,
    ageMax: 11,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "2/3",
          totalParts: 12,
          shadedParts: 8,
          color: "#4CAF50"
        },
        {
          label: "1/4",
          totalParts: 12,
          shadedParts: 3,
          color: "#2196F3"
        }
      ]
    }
  },
  {
    id: "g5-math-4",
    category: "math",
    difficulty: "hard",
    question: "Calculate: 5/6 - 2/9",
    options: ["3/3", "11/18", "1/2", "7/18"],
    correctIndex: 1,
    explanation: "Find the common denominator (18). Convert: 5/6 = 15/18 and 2/9 = 4/18. Then subtract: 15/18 - 4/18 = 11/18.",
    ageMin: 10,
    ageMax: 11,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "5/6",
          totalParts: 18,
          shadedParts: 15,
          color: "#FF5722"
        },
        {
          label: "2/9",
          totalParts: 18,
          shadedParts: 4,
          color: "#9C27B0"
        }
      ]
    }
  },
  {
    id: "g5-math-5",
    category: "math",
    difficulty: "medium",
    question: "What is 3/4 × 2/5?",
    options: ["6/20", "5/9", "6/9", "3/10"],
    correctIndex: 3,
    explanation: "To multiply fractions, multiply the numerators and denominators: (3 × 2)/(4 × 5) = 6/20. Simplify by dividing both by 2: 6/20 = 3/10.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-6",
    category: "math",
    difficulty: "hard",
    question: "Calculate: 2/3 × 5/8",
    options: ["10/24", "7/11", "5/12", "10/11"],
    correctIndex: 2,
    explanation: "Multiply numerators and denominators: (2 × 5)/(3 × 8) = 10/24. Simplify by dividing both by 2: 10/24 = 5/12.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-7",
    category: "math",
    difficulty: "hard",
    question: "What is 1/2 ÷ 1/4?",
    options: ["1/8", "2", "1/6", "4"],
    correctIndex: 1,
    explanation: "To divide fractions, multiply by the reciprocal: 1/2 × 4/1 = 4/2 = 2. This means 1/2 contains two 1/4 pieces.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-8",
    category: "math",
    difficulty: "medium",
    question: "What is the place value of 7 in 3.457?",
    options: ["Tenths", "Hundredths", "Thousandths", "Ones"],
    correctIndex: 2,
    explanation: "In the decimal 3.457, the digit 7 is in the third position after the decimal point, which is the thousandths place.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-9",
    category: "math",
    difficulty: "easy",
    question: "What is 0.6 + 0.35?",
    options: ["0.95", "0.65", "0.9", "1.0"],
    correctIndex: 0,
    explanation: "Line up the decimals: 0.60 + 0.35 = 0.95. Adding tenths and hundredths carefully gives us 95 hundredths.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-10",
    category: "math",
    difficulty: "medium",
    question: "Calculate: 4.2 × 10",
    options: ["420", "42", "0.42", "4.20"],
    correctIndex: 1,
    explanation: "When multiplying by 10, move the decimal point one place to the right: 4.2 × 10 = 42.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-11",
    category: "math",
    difficulty: "hard",
    question: "What is 8.5 ÷ 100?",
    options: ["850", "0.85", "0.085", "85"],
    correctIndex: 2,
    explanation: "When dividing by 100, move the decimal point two places to the left: 8.5 ÷ 100 = 0.085.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-12",
    category: "math",
    difficulty: "medium",
    question: "If a box is 5 cm long, 4 cm wide, and 3 cm tall, what is its volume?",
    options: ["12 cubic cm", "60 cubic cm", "20 cubic cm", "15 cubic cm"],
    correctIndex: 1,
    explanation: "Volume = length × width × height = 5 × 4 × 3 = 60 cubic centimeters.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-13",
    category: "math",
    difficulty: "hard",
    question: "A rectangular prism has a base area of 12 square inches and a height of 5 inches. What is its volume?",
    options: ["17 cubic inches", "60 cubic inches", "24 cubic inches", "50 cubic inches"],
    correctIndex: 1,
    explanation: "Volume = base area × height = 12 × 5 = 60 cubic inches.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-14",
    category: "math",
    difficulty: "easy",
    question: "How many feet are in 4 yards?",
    options: ["8 feet", "12 feet", "16 feet", "48 feet"],
    correctIndex: 1,
    explanation: "Since 1 yard = 3 feet, then 4 yards = 4 × 3 = 12 feet.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-15",
    category: "math",
    difficulty: "medium",
    question: "What point is located at coordinates (3, 5) on a coordinate plane?",
    options: ["3 units right, 5 units up from origin", "5 units right, 3 units up from origin", "3 units left, 5 units down from origin", "5 units left, 3 units down from origin"],
    correctIndex: 0,
    explanation: "In coordinate notation (x, y), the first number is the x-coordinate (horizontal) and the second is the y-coordinate (vertical). So (3, 5) means 3 units right and 5 units up.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-16",
    category: "math",
    difficulty: "medium",
    question: "Which shape has exactly 4 right angles and 4 equal sides?",
    options: ["Rectangle", "Square", "Rhombus", "Trapezoid"],
    correctIndex: 1,
    explanation: "A square has 4 right angles (90 degrees each) and all 4 sides are equal in length. A rectangle has 4 right angles but sides aren't all equal.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-17",
    category: "math",
    difficulty: "hard",
    question: "Look at the diagram. What is 3/4 + 5/6?",
    options: ["8/10", "19/12", "9/12", "1 7/12"],
    correctIndex: 3,
    explanation: "Find common denominator (12): 3/4 = 9/12 and 5/6 = 10/12. Add: 9/12 + 10/12 = 19/12. Convert to mixed number: 1 7/12.",
    ageMin: 10,
    ageMax: 11,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "3/4",
          totalParts: 12,
          shadedParts: 9,
          color: "#FF9800"
        },
        {
          label: "5/6",
          totalParts: 12,
          shadedParts: 10,
          color: "#00BCD4"
        }
      ]
    }
  },
  {
    id: "g5-math-18",
    category: "math",
    difficulty: "hard",
    question: "Using the diagram, what is 7/8 - 1/3?",
    options: ["6/5", "13/24", "5/8", "2/5"],
    correctIndex: 1,
    explanation: "Find common denominator (24): 7/8 = 21/24 and 1/3 = 8/24. Subtract: 21/24 - 8/24 = 13/24.",
    ageMin: 10,
    ageMax: 11,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "7/8",
          totalParts: 24,
          shadedParts: 21,
          color: "#E91E63"
        },
        {
          label: "1/3",
          totalParts: 24,
          shadedParts: 8,
          color: "#3F51B5"
        }
      ]
    }
  },
  {
    id: "g5-math-19",
    category: "math",
    difficulty: "medium",
    question: "What is 12.45 - 7.8?",
    options: ["4.65", "5.65", "4.55", "5.45"],
    correctIndex: 0,
    explanation: "Line up decimals: 12.45 - 7.80 = 4.65. Borrow when needed and subtract column by column.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-math-20",
    category: "math",
    difficulty: "hard",
    question: "Examine the fraction bars. What is 2/3 + 3/5?",
    options: ["5/8", "1 4/15", "5/15", "19/15"],
    correctIndex: 1,
    explanation: "Find common denominator (15): 2/3 = 10/15 and 3/5 = 9/15. Add: 10/15 + 9/15 = 19/15 = 1 4/15.",
    ageMin: 10,
    ageMax: 11,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "2/3",
          totalParts: 15,
          shadedParts: 10,
          color: "#8BC34A"
        },
        {
          label: "3/5",
          totalParts: 15,
          shadedParts: 9,
          color: "#FFC107"
        }
      ]
    }
  },
  {
    id: "g5-read-1",
    category: "reading",
    difficulty: "medium",
    question: "What is the main idea of this passage?",
    options: ["Marie Curie won two Nobel Prizes", "Radium is a dangerous element", "Marie Curie's groundbreaking work in radioactivity changed science forever", "Women were not allowed in universities in the 1800s"],
    correctIndex: 2,
    explanation: "The passage focuses on Marie Curie's revolutionary discoveries and their lasting impact on science, not just individual facts about her life.",
    ageMin: 10,
    ageMax: 11,
    passage: `Marie Curie: Pioneer of Radioactivity

In 1867, Maria Sklodowska was born in Warsaw, Poland, at a time when women were discouraged from pursuing science. Despite these obstacles, Maria's passion for learning never wavered. She moved to Paris in 1891 to study physics and mathematics at the Sorbonne University, where she later became the first female professor.

Maria, who married Pierre Curie and became known as Marie Curie, made history with her research on radioactivity—a term she coined herself. Working in a cramped, poorly-equipped laboratory, Marie and Pierre discovered two new elements: polonium, named after her homeland, and radium. Their work was so groundbreaking that they shared the 1903 Nobel Prize in Physics.

Tragedy struck in 1906 when Pierre died in a carriage accident, but Marie continued their research with fierce determination. In 1911, she won a second Nobel Prize, this time in Chemistry, becoming the first person ever to win Nobel Prizes in two different sciences. Her discoveries led to revolutionary medical treatments, including radiation therapy for cancer. Marie Curie's legacy reminds us that perseverance and curiosity can overcome any barrier.`
  },
  {
    id: "g5-read-2",
    category: "reading",
    difficulty: "easy",
    question: "According to the passage, what element did Marie name after her homeland?",
    options: ["Radium", "Uranium", "Polonium", "Curium"],
    correctIndex: 2,
    explanation: "The passage explicitly states that Marie discovered polonium and named it 'after her homeland' (Poland).",
    ageMin: 10,
    ageMax: 11,
    passage: `Marie Curie: Pioneer of Radioactivity

In 1867, Maria Sklodowska was born in Warsaw, Poland, at a time when women were discouraged from pursuing science. Despite these obstacles, Maria's passion for learning never wavered. She moved to Paris in 1891 to study physics and mathematics at the Sorbonne University, where she later became the first female professor.

Maria, who married Pierre Curie and became known as Marie Curie, made history with her research on radioactivity—a term she coined herself. Working in a cramped, poorly-equipped laboratory, Marie and Pierre discovered two new elements: polonium, named after her homeland, and radium. Their work was so groundbreaking that they shared the 1903 Nobel Prize in Physics.

Tragedy struck in 1906 when Pierre died in a carriage accident, but Marie continued their research with fierce determination. In 1911, she won a second Nobel Prize, this time in Chemistry, becoming the first person ever to win Nobel Prizes in two different sciences. Her discoveries led to revolutionary medical treatments, including radiation therapy for cancer. Marie Curie's legacy reminds us that perseverance and curiosity can overcome any barrier.`
  },
  {
    id: "g5-read-3",
    category: "reading",
    difficulty: "hard",
    question: "Based on the passage, what does the word 'coined' most likely mean?",
    options: ["Collected money", "Created or invented a new term", "Discovered by accident", "Borrowed from another language"],
    correctIndex: 1,
    explanation: "In context, 'coined' refers to Marie creating the term 'radioactivity.' To coin a term means to invent or create a new word or phrase.",
    ageMin: 10,
    ageMax: 11,
    passage: `Marie Curie: Pioneer of Radioactivity

In 1867, Maria Sklodowska was born in Warsaw, Poland, at a time when women were discouraged from pursuing science. Despite these obstacles, Maria's passion for learning never wavered. She moved to Paris in 1891 to study physics and mathematics at the Sorbonne University, where she later became the first female professor.

Maria, who married Pierre Curie and became known as Marie Curie, made history with her research on radioactivity—a term she coined herself. Working in a cramped, poorly-equipped laboratory, Marie and Pierre discovered two new elements: polonium, named after her homeland, and radium. Their work was so groundbreaking that they shared the 1903 Nobel Prize in Physics.

Tragedy struck in 1906 when Pierre died in a carriage accident, but Marie continued their research with fierce determination. In 1911, she won a second Nobel Prize, this time in Chemistry, becoming the first person ever to win Nobel Prizes in two different sciences. Her discoveries led to revolutionary medical treatments, including radiation therapy for cancer. Marie Curie's legacy reminds us that perseverance and curiosity can overcome any barrier.`
  },
  {
    id: "g5-read-4",
    category: "reading",
    difficulty: "medium",
    question: "How is this passage organized?",
    options: ["Problem and solution", "Cause and effect", "Chronological order", "Compare and contrast"],
    correctIndex: 2,
    explanation: "The passage follows Marie Curie's life from birth (1867) through her education, discoveries, and awards in time order—this is chronological structure.",
    ageMin: 10,
    ageMax: 11,
    passage: `Marie Curie: Pioneer of Radioactivity

In 1867, Maria Sklodowska was born in Warsaw, Poland, at a time when women were discouraged from pursuing science. Despite these obstacles, Maria's passion for learning never wavered. She moved to Paris in 1891 to study physics and mathematics at the Sorbonne University, where she later became the first female professor.

Maria, who married Pierre Curie and became known as Marie Curie, made history with her research on radioactivity—a term she coined herself. Working in a cramped, poorly-equipped laboratory, Marie and Pierre discovered two new elements: polonium, named after her homeland, and radium. Their work was so groundbreaking that they shared the 1903 Nobel Prize in Physics.

Tragedy struck in 1906 when Pierre died in a carriage accident, but Marie continued their research with fierce determination. In 1911, she won a second Nobel Prize, this time in Chemistry, becoming the first person ever to win Nobel Prizes in two different sciences. Her discoveries led to revolutionary medical treatments, including radiation therapy for cancer. Marie Curie's legacy reminds us that perseverance and curiosity can overcome any barrier.`
  },
  {
    id: "g5-read-5",
    category: "reading",
    difficulty: "hard",
    question: "What can you infer about Marie Curie's character from the passage?",
    options: ["She was only interested in winning awards", "She was determined and resilient in the face of challenges", "She preferred working alone rather than with partners", "She was primarily motivated by becoming wealthy"],
    correctIndex: 1,
    explanation: "The passage describes Marie overcoming obstacles (gender barriers, poor equipment, Pierre's death) and continuing her work 'with fierce determination,' showing resilience.",
    ageMin: 10,
    ageMax: 11,
    passage: `Marie Curie: Pioneer of Radioactivity

In 1867, Maria Sklodowska was born in Warsaw, Poland, at a time when women were discouraged from pursuing science. Despite these obstacles, Maria's passion for learning never wavered. She moved to Paris in 1891 to study physics and mathematics at the Sorbonne University, where she later became the first female professor.

Maria, who married Pierre Curie and became known as Marie Curie, made history with her research on radioactivity—a term she coined herself. Working in a cramped, poorly-equipped laboratory, Marie and Pierre discovered two new elements: polonium, named after her homeland, and radium. Their work was so groundbreaking that they shared the 1903 Nobel Prize in Physics.

Tragedy struck in 1906 when Pierre died in a carriage accident, but Marie continued their research with fierce determination. In 1911, she won a second Nobel Prize, this time in Chemistry, becoming the first person ever to win Nobel Prizes in two different sciences. Her discoveries led to revolutionary medical treatments, including radiation therapy for cancer. Marie Curie's legacy reminds us that perseverance and curiosity can overcome any barrier.`
  },
  {
    id: "g5-read-6",
    category: "reading",
    difficulty: "medium",
    question: "What is the central theme of this passage?",
    options: ["Survival skills are easy to learn", "Quick thinking and resourcefulness can save your life in dangerous situations", "Hiking in winter is too dangerous", "Always bring a friend when hiking"],
    correctIndex: 1,
    explanation: "The passage illustrates how Alex's knowledge and quick decisions (shelter, fire, signaling) helped her survive—emphasizing resourcefulness in emergencies.",
    ageMin: 10,
    ageMax: 11,
    passage: `Survival on Storm Peak

Twelve-year-old Alex Chen had hiked Storm Peak dozens of times with her family, but never alone. When an unexpected blizzard rolled in during her solo trek, visibility dropped to mere feet. Her phone had no signal. Alex remembered her father's survival advice: 'Stay calm, assess your situation, and use your resources.'

Alex found a rocky overhang and quickly built a shelter using fallen pine branches, packing snow around the edges to block the wind. She knew that staying dry was critical—hypothermia could set in within hours. From her backpack, she pulled out an emergency blanket, granola bars, and a water bottle. She also had waterproof matches, which her mother had insisted she carry.

As darkness fell, Alex built a small fire using dry twigs from beneath the overhang. The fire provided warmth and could serve as a signal. Every hour, she added green pine branches to create smoke—a distress signal that search teams could spot. She rationed her food carefully, eating just enough to maintain energy.

Just after dawn, Alex heard the distant whir of helicopter blades. She threw handfuls of green branches onto her fire, creating thick white smoke. The helicopter circled twice, then landed in a nearby clearing. The search team marveled at her resourcefulness. 'Your preparation and clear thinking saved your life,' the lead rescuer told her. Alex smiled, knowing her parents' lessons had made all the difference.`
  },
  {
    id: "g5-read-7",
    category: "reading",
    difficulty: "easy",
    question: "According to the passage, what did Alex use to create a distress signal?",
    options: ["Her phone flashlight", "Green pine branches on the fire to make smoke", "A whistle from her backpack", "Reflected sunlight from her emergency blanket"],
    correctIndex: 1,
    explanation: "The passage clearly states Alex 'added green pine branches to create smoke—a distress signal that search teams could spot.'",
    ageMin: 10,
    ageMax: 11,
    passage: `Survival on Storm Peak

Twelve-year-old Alex Chen had hiked Storm Peak dozens of times with her family, but never alone. When an unexpected blizzard rolled in during her solo trek, visibility dropped to mere feet. Her phone had no signal. Alex remembered her father's survival advice: 'Stay calm, assess your situation, and use your resources.'

Alex found a rocky overhang and quickly built a shelter using fallen pine branches, packing snow around the edges to block the wind. She knew that staying dry was critical—hypothermia could set in within hours. From her backpack, she pulled out an emergency blanket, granola bars, and a water bottle. She also had waterproof matches, which her mother had insisted she carry.

As darkness fell, Alex built a small fire using dry twigs from beneath the overhang. The fire provided warmth and could serve as a signal. Every hour, she added green pine branches to create smoke—a distress signal that search teams could spot. She rationed her food carefully, eating just enough to maintain energy.

Just after dawn, Alex heard the distant whir of helicopter blades. She threw handfuls of green branches onto her fire, creating thick white smoke. The helicopter circled twice, then landed in a nearby clearing. The search team marveled at her resourcefulness. 'Your preparation and clear thinking saved your life,' the lead rescuer told her. Alex smiled, knowing her parents' lessons had made all the difference.`
  },
  {
    id: "g5-read-8",
    category: "reading",
    difficulty: "medium",
    question: "What does the word 'rationed' mean in this context?",
    options: ["Ate quickly without thinking", "Carefully controlled and limited consumption", "Shared with others", "Cooked over the fire"],
    correctIndex: 1,
    explanation: "'Rationed' means to carefully control and limit the use of something. Alex ate 'just enough to maintain energy,' showing she conserved her food supply.",
    ageMin: 10,
    ageMax: 11,
    passage: `Survival on Storm Peak

Twelve-year-old Alex Chen had hiked Storm Peak dozens of times with her family, but never alone. When an unexpected blizzard rolled in during her solo trek, visibility dropped to mere feet. Her phone had no signal. Alex remembered her father's survival advice: 'Stay calm, assess your situation, and use your resources.'

Alex found a rocky overhang and quickly built a shelter using fallen pine branches, packing snow around the edges to block the wind. She knew that staying dry was critical—hypothermia could set in within hours. From her backpack, she pulled out an emergency blanket, granola bars, and a water bottle. She also had waterproof matches, which her mother had insisted she carry.

As darkness fell, Alex built a small fire using dry twigs from beneath the overhang. The fire provided warmth and could serve as a signal. Every hour, she added green pine branches to create smoke—a distress signal that search teams could spot. She rationed her food carefully, eating just enough to maintain energy.

Just after dawn, Alex heard the distant whir of helicopter blades. She threw handfuls of green branches onto her fire, creating thick white smoke. The helicopter circled twice, then landed in a nearby clearing. The search team marveled at her resourcefulness. 'Your preparation and clear thinking saved your life,' the lead rescuer told her. Alex smiled, knowing her parents' lessons had made all the difference.`
  },
  {
    id: "g5-read-9",
    category: "reading",
    difficulty: "hard",
    question: "Which detail from the passage best supports the idea that Alex was well-prepared?",
    options: ["She had hiked Storm Peak dozens of times before", "She carried waterproof matches that her mother insisted she bring", "The helicopter circled twice before landing", "She built a shelter using fallen pine branches"],
    correctIndex: 1,
    explanation: "Having waterproof matches (at her mother's insistence) shows advance preparation with proper emergency supplies, which directly enabled her survival.",
    ageMin: 10,
    ageMax: 11,
    passage: `Survival on Storm Peak

Twelve-year-old Alex Chen had hiked Storm Peak dozens of times with her family, but never alone. When an unexpected blizzard rolled in during her solo trek, visibility dropped to mere feet. Her phone had no signal. Alex remembered her father's survival advice: 'Stay calm, assess your situation, and use your resources.'

Alex found a rocky overhang and quickly built a shelter using fallen pine branches, packing snow around the edges to block the wind. She knew that staying dry was critical—hypothermia could set in within hours. From her backpack, she pulled out an emergency blanket, granola bars, and a water bottle. She also had waterproof matches, which her mother had insisted she carry.

As darkness fell, Alex built a small fire using dry twigs from beneath the overhang. The fire provided warmth and could serve as a signal. Every hour, she added green pine branches to create smoke—a distress signal that search teams could spot. She rationed her food carefully, eating just enough to maintain energy.

Just after dawn, Alex heard the distant whir of helicopter blades. She threw handfuls of green branches onto her fire, creating thick white smoke. The helicopter circled twice, then landed in a nearby clearing. The search team marveled at her resourcefulness. 'Your preparation and clear thinking saved your life,' the lead rescuer told her. Alex smiled, knowing her parents' lessons had made all the difference.`
  },
  {
    id: "g5-read-10",
    category: "reading",
    difficulty: "hard",
    question: "What can you infer about why Alex's survival knowledge was so effective?",
    options: ["She had read about survival in books", "She learned from direct teaching and experience with her family", "She was naturally talented at outdoor skills", "She had taken a survival course at school"],
    correctIndex: 1,
    explanation: "The passage mentions her father's advice, her mother's insistence on matches, and hiking with family 'dozens of times'—showing she learned through family teaching and experience.",
    ageMin: 10,
    ageMax: 11,
    passage: `Survival on Storm Peak

Twelve-year-old Alex Chen had hiked Storm Peak dozens of times with her family, but never alone. When an unexpected blizzard rolled in during her solo trek, visibility dropped to mere feet. Her phone had no signal. Alex remembered her father's survival advice: 'Stay calm, assess your situation, and use your resources.'

Alex found a rocky overhang and quickly built a shelter using fallen pine branches, packing snow around the edges to block the wind. She knew that staying dry was critical—hypothermia could set in within hours. From her backpack, she pulled out an emergency blanket, granola bars, and a water bottle. She also had waterproof matches, which her mother had insisted she carry.

As darkness fell, Alex built a small fire using dry twigs from beneath the overhang. The fire provided warmth and could serve as a signal. Every hour, she added green pine branches to create smoke—a distress signal that search teams could spot. She rationed her food carefully, eating just enough to maintain energy.

Just after dawn, Alex heard the distant whir of helicopter blades. She threw handfuls of green branches onto her fire, creating thick white smoke. The helicopter circled twice, then landed in a nearby clearing. The search team marveled at her resourcefulness. 'Your preparation and clear thinking saved your life,' the lead rescuer told her. Alex smiled, knowing her parents' lessons had made all the difference.`
  },
  {
    id: "g5-read-11",
    category: "reading",
    difficulty: "medium",
    question: "What is the main idea of this passage?",
    options: ["The Montgomery Bus Boycott lasted 381 days", "Rosa Parks' courageous act sparked a movement that changed American civil rights history", "Bus segregation was common in the 1950s", "Martin Luther King Jr. was a famous leader"],
    correctIndex: 1,
    explanation: "The passage focuses on how Rosa Parks' individual act of courage led to a broader movement that changed civil rights laws and inspired future activism.",
    ageMin: 10,
    ageMax: 11,
    passage: `Rosa Parks and the Montgomery Bus Boycott

On December 1, 1955, in Montgomery, Alabama, a quiet seamstress named Rosa Parks made a decision that would change American history. After a long day of work, she boarded a city bus and sat in the first row of the 'colored section.' When a white passenger boarded and the driver demanded she give up her seat, Rosa Parks refused. Her simple act of defiance led to her arrest—and ignited a revolution.

At that time, segregation laws in the South forced African Americans to sit in the back of buses and give up their seats to white passengers on demand. These unjust laws were part of the 'Jim Crow' system that enforced racial separation. Rosa Parks was not the first person to resist bus segregation, but her arrest became a rallying point for change.

African American leaders in Montgomery, including a young minister named Dr. Martin Luther King Jr., organized a bus boycott. For 381 days, thousands of Black citizens refused to ride city buses, walking miles to work or organizing carpools instead. The boycott caused severe financial losses for the bus company. Finally, in November 1956, the Supreme Court ruled that bus segregation was unconstitutional.

The Montgomery Bus Boycott proved that peaceful protest could bring about real change. It launched the Civil Rights Movement and made Dr. King a national leader. Rosa Parks' courage showed that one person standing up for justice can inspire thousands to join the fight for equality.`
  },
  {
    id: "g5-read-12",
    category: "reading",
    difficulty: "easy",
    question: "According to the passage, how long did the Montgomery Bus Boycott last?",
    options: ["381 days", "One year", "Six months", "100 days"],
    correctIndex: 0,
    explanation: "The passage explicitly states 'For 381 days, thousands of Black citizens refused to ride city buses.'",
    ageMin: 10,
    ageMax: 11,
    passage: `Rosa Parks and the Montgomery Bus Boycott

On December 1, 1955, in Montgomery, Alabama, a quiet seamstress named Rosa Parks made a decision that would change American history. After a long day of work, she boarded a city bus and sat in the first row of the 'colored section.' When a white passenger boarded and the driver demanded she give up her seat, Rosa Parks refused. Her simple act of defiance led to her arrest—and ignited a revolution.

At that time, segregation laws in the South forced African Americans to sit in the back of buses and give up their seats to white passengers on demand. These unjust laws were part of the 'Jim Crow' system that enforced racial separation. Rosa Parks was not the first person to resist bus segregation, but her arrest became a rallying point for change.

African American leaders in Montgomery, including a young minister named Dr. Martin Luther King Jr., organized a bus boycott. For 381 days, thousands of Black citizens refused to ride city buses, walking miles to work or organizing carpools instead. The boycott caused severe financial losses for the bus company. Finally, in November 1956, the Supreme Court ruled that bus segregation was unconstitutional.

The Montgomery Bus Boycott proved that peaceful protest could bring about real change. It launched the Civil Rights Movement and made Dr. King a national leader. Rosa Parks' courage showed that one person standing up for justice can inspire thousands to join the fight for equality.`
  },
  {
    id: "g5-read-13",
    category: "reading",
    difficulty: "medium",
    question: "What does the word 'defiance' mean in this passage?",
    options: ["Agreement with rules", "Bold resistance or disobedience", "Fear of consequences", "Confusion about directions"],
    correctIndex: 1,
    explanation: "Rosa Parks' 'act of defiance' refers to her refusal to obey the unjust bus segregation law—defiance means bold resistance to authority.",
    ageMin: 10,
    ageMax: 11,
    passage: `Rosa Parks and the Montgomery Bus Boycott

On December 1, 1955, in Montgomery, Alabama, a quiet seamstress named Rosa Parks made a decision that would change American history. After a long day of work, she boarded a city bus and sat in the first row of the 'colored section.' When a white passenger boarded and the driver demanded she give up her seat, Rosa Parks refused. Her simple act of defiance led to her arrest—and ignited a revolution.

At that time, segregation laws in the South forced African Americans to sit in the back of buses and give up their seats to white passengers on demand. These unjust laws were part of the 'Jim Crow' system that enforced racial separation. Rosa Parks was not the first person to resist bus segregation, but her arrest became a rallying point for change.

African American leaders in Montgomery, including a young minister named Dr. Martin Luther King Jr., organized a bus boycott. For 381 days, thousands of Black citizens refused to ride city buses, walking miles to work or organizing carpools instead. The boycott caused severe financial losses for the bus company. Finally, in November 1956, the Supreme Court ruled that bus segregation was unconstitutional.

The Montgomery Bus Boycott proved that peaceful protest could bring about real change. It launched the Civil Rights Movement and made Dr. King a national leader. Rosa Parks' courage showed that one person standing up for justice can inspire thousands to join the fight for equality.`
  },
  {
    id: "g5-read-14",
    category: "reading",
    difficulty: "hard",
    question: "Which sentence best supports the idea that the boycott was effective?",
    options: ["Rosa Parks sat in the first row of the 'colored section'", "The boycott caused severe financial losses for the bus company", "Dr. Martin Luther King Jr. was a young minister", "African Americans had to sit in the back of buses"],
    correctIndex: 1,
    explanation: "The boycott's effectiveness is proven by the 'severe financial losses' it caused, which pressured the bus company and contributed to changing the law.",
    ageMin: 10,
    ageMax: 11,
    passage: `Rosa Parks and the Montgomery Bus Boycott

On December 1, 1955, in Montgomery, Alabama, a quiet seamstress named Rosa Parks made a decision that would change American history. After a long day of work, she boarded a city bus and sat in the first row of the 'colored section.' When a white passenger boarded and the driver demanded she give up her seat, Rosa Parks refused. Her simple act of defiance led to her arrest—and ignited a revolution.

At that time, segregation laws in the South forced African Americans to sit in the back of buses and give up their seats to white passengers on demand. These unjust laws were part of the 'Jim Crow' system that enforced racial separation. Rosa Parks was not the first person to resist bus segregation, but her arrest became a rallying point for change.

African American leaders in Montgomery, including a young minister named Dr. Martin Luther King Jr., organized a bus boycott. For 381 days, thousands of Black citizens refused to ride city buses, walking miles to work or organizing carpools instead. The boycott caused severe financial losses for the bus company. Finally, in November 1956, the Supreme Court ruled that bus segregation was unconstitutional.

The Montgomery Bus Boycott proved that peaceful protest could bring about real change. It launched the Civil Rights Movement and made Dr. King a national leader. Rosa Parks' courage showed that one person standing up for justice can inspire thousands to join the fight for equality.`
  },
  {
    id: "g5-read-15",
    category: "reading",
    difficulty: "hard",
    question: "Based on the passage, what can you infer about why Rosa Parks' arrest became a 'rallying point'?",
    options: ["She was the first person to ever resist segregation", "Her arrest represented the injustice many people experienced and motivated them to organize", "She was a famous leader before the arrest", "The bus driver apologized after her arrest"],
    correctIndex: 1,
    explanation: "Though the passage notes she 'was not the first person to resist,' her arrest became a symbol of widespread injustice that galvanized the community into organized action.",
    ageMin: 10,
    ageMax: 11,
    passage: `Rosa Parks and the Montgomery Bus Boycott

On December 1, 1955, in Montgomery, Alabama, a quiet seamstress named Rosa Parks made a decision that would change American history. After a long day of work, she boarded a city bus and sat in the first row of the 'colored section.' When a white passenger boarded and the driver demanded she give up her seat, Rosa Parks refused. Her simple act of defiance led to her arrest—and ignited a revolution.

At that time, segregation laws in the South forced African Americans to sit in the back of buses and give up their seats to white passengers on demand. These unjust laws were part of the 'Jim Crow' system that enforced racial separation. Rosa Parks was not the first person to resist bus segregation, but her arrest became a rallying point for change.

African American leaders in Montgomery, including a young minister named Dr. Martin Luther King Jr., organized a bus boycott. For 381 days, thousands of Black citizens refused to ride city buses, walking miles to work or organizing carpools instead. The boycott caused severe financial losses for the bus company. Finally, in November 1956, the Supreme Court ruled that bus segregation was unconstitutional.

The Montgomery Bus Boycott proved that peaceful protest could bring about real change. It launched the Civil Rights Movement and made Dr. King a national leader. Rosa Parks' courage showed that one person standing up for justice can inspire thousands to join the fight for equality.`
  },
  {
    id: "g5-spell-1",
    category: "spelling",
    difficulty: "easy",
    question: "Which word is spelled correctly?",
    options: ["antifreaze", "antifreeze", "antyfreeze", "antefreeze"],
    correctIndex: 1,
    explanation: "The correct spelling is 'antifreeze' (anti- meaning 'against' + freeze). The prefix 'anti-' means against or opposite.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-2",
    category: "spelling",
    difficulty: "medium",
    question: "Choose the correctly spelled word with the prefix meaning 'between or among':",
    options: ["international", "internasional", "inturnational", "internatinal"],
    correctIndex: 0,
    explanation: "'International' is correct (inter- meaning 'between' + national). The prefix 'inter-' means between or among.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-3",
    category: "spelling",
    difficulty: "hard",
    question: "Which word is spelled correctly?",
    options: ["transportation", "transportasion", "transpirtation", "transporation"],
    correctIndex: 0,
    explanation: "'Transportation' is correct (trans- meaning 'across' + port meaning 'carry' + -ation). The prefix 'trans-' means across or beyond.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-4",
    category: "spelling",
    difficulty: "medium",
    question: "Which word correctly uses the suffix -able?",
    options: ["responsable", "responsible", "responsibile", "responsibal"],
    correctIndex: 1,
    explanation: "'Responsible' is correct, using the suffix -ible (not -able). Words ending in -ible/-able mean 'capable of being.'",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-5",
    category: "spelling",
    difficulty: "hard",
    question: "Choose the correctly spelled word with the suffix meaning 'state or quality of':",
    options: ["independance", "independense", "independence", "independents"],
    correctIndex: 2,
    explanation: "'Independence' is correct, using the suffix -ence (meaning 'state of'). Remember: depend-ence, not depend-ance.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-6",
    category: "spelling",
    difficulty: "hard",
    question: "Which sentence uses 'affect' or 'effect' correctly?",
    options: ["The storm will affect our travel plans.", "The storm will effect our travel plans.", "The affect of the storm was severe.", "The medicine had no affect on my headache."],
    correctIndex: 0,
    explanation: "'Affect' (verb) means to influence. 'Effect' (noun) means result. The storm will affect (influence) our plans.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-7",
    category: "spelling",
    difficulty: "medium",
    question: "Which sentence uses 'principal' or 'principle' correctly?",
    options: ["The principle of our school is very kind.", "Our principle rule is to be respectful.", "The principal of our school is very kind.", "She follows the principals of honesty."],
    correctIndex: 2,
    explanation: "'Principal' = school leader or main. 'Principle' = a fundamental rule or belief. The principal (leader) of our school is kind.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-8",
    category: "spelling",
    difficulty: "easy",
    question: "Which word with a silent letter is spelled correctly?",
    options: ["nife", "knife", "knive", "nighf"],
    correctIndex: 1,
    explanation: "'Knife' is correct, with a silent 'k.' Many words beginning with 'kn-' have a silent k (know, knock, knee).",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-9",
    category: "spelling",
    difficulty: "medium",
    question: "Which word with a silent letter is spelled correctly?",
    options: ["listin", "lissen", "listen", "listan"],
    correctIndex: 2,
    explanation: "'Listen' is correct, with a silent 't.' Other words with silent 't' include fasten, castle, and whistle.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-spell-10",
    category: "spelling",
    difficulty: "hard",
    question: "Fill in the blank with the correctly spelled word: 'The scientist tried to _____ the experiment results.'",
    options: ["analize", "analyse", "analyze", "analise"],
    correctIndex: 2,
    explanation: "In American English, 'analyze' is correct (with a 'z'). The suffix -lyze comes from Greek, meaning 'to break down or examine.'",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-sci-1",
    category: "science",
    difficulty: "medium",
    question: "Which of the following is an example of a chemical change?",
    options: ["Ice melting into water", "Wood burning into ash and smoke", "Sugar dissolving in tea", "Breaking a glass bottle"],
    correctIndex: 1,
    explanation: "Burning wood is a chemical change because new substances (ash, smoke, gases) are formed that cannot be reversed. The other examples are physical changes.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-sci-2",
    category: "science",
    difficulty: "hard",
    question: "A student mixes baking soda and vinegar. Bubbles form and the mixture feels cold. What evidence shows this is a chemical change?",
    options: ["The mixture changes color only", "Gas (bubbles) is produced and temperature changes", "The mixture can be easily separated", "The substances keep their original properties"],
    correctIndex: 1,
    explanation: "Chemical changes produce new substances and often show signs like gas production (bubbles), temperature change, color change, or odor. This reaction shows multiple signs.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-sci-3",
    category: "science",
    difficulty: "medium",
    question: "What role does the sun play in the water cycle?",
    options: ["It freezes water in the oceans", "It provides energy that causes evaporation", "It creates clouds directly", "It pulls water up into the atmosphere"],
    correctIndex: 1,
    explanation: "The sun provides heat energy that causes water to evaporate from oceans, lakes, and rivers, turning liquid water into water vapor—the first step of the water cycle.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-sci-4",
    category: "science",
    difficulty: "hard",
    question: "In a food web, what happens to energy as it moves from plants to herbivores to carnivores?",
    options: ["Energy increases at each level", "Energy stays exactly the same at each level", "Energy decreases at each level, with some lost as heat", "Energy disappears completely"],
    correctIndex: 2,
    explanation: "Energy decreases at each level of a food web because organisms use energy for life processes, and some is lost as heat. Only about 10% of energy passes to the next level.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-sci-5",
    category: "science",
    difficulty: "medium",
    question: "What is the main difference between a star and a planet?",
    options: ["Stars are bigger than planets", "Stars produce their own light through nuclear fusion; planets reflect light", "Planets are hotter than stars", "Stars orbit planets"],
    correctIndex: 1,
    explanation: "Stars produce their own light through nuclear fusion (combining hydrogen into helium), while planets do not produce light—they only reflect light from stars like the sun.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-soc-1",
    category: "social-studies",
    difficulty: "medium",
    question: "Which of the following best describes the three branches of the U.S. government?",
    options: ["President, Congress, and States", "Legislative, Executive, and Judicial", "Senate, House, and Courts", "Federal, State, and Local"],
    correctIndex: 1,
    explanation: "The U.S. government has three branches: Legislative (makes laws - Congress), Executive (enforces laws - President), and Judicial (interprets laws - Courts).",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-soc-2",
    category: "social-studies",
    difficulty: "easy",
    question: "What document begins with 'We the People' and established the framework for U.S. government?",
    options: ["The Declaration of Independence", "The Bill of Rights", "The Constitution", "The Emancipation Proclamation"],
    correctIndex: 2,
    explanation: "The U.S. Constitution begins with 'We the People' and established the structure of the federal government and its relationship with states and citizens.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-soc-3",
    category: "social-studies",
    difficulty: "hard",
    question: "During the American Revolution, which event demonstrated colonists' protest against British taxation without representation?",
    options: ["The signing of the Declaration of Independence", "The Boston Tea Party", "The Battle of Lexington and Concord", "The Constitutional Convention"],
    correctIndex: 1,
    explanation: "The Boston Tea Party (1773) was when colonists dumped British tea into Boston Harbor to protest the Tea Act and taxation without representation.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-soc-4",
    category: "social-studies",
    difficulty: "medium",
    question: "What was the primary purpose of the Underground Railroad before the Civil War?",
    options: ["A subway system in major cities", "A network to help enslaved people escape to freedom", "A railroad company that transported goods", "A secret government communication system"],
    correctIndex: 1,
    explanation: "The Underground Railroad was a secret network of routes and safe houses that helped enslaved African Americans escape to free states and Canada before the Civil War.",
    ageMin: 10,
    ageMax: 11
  },
  {
    id: "g5-soc-5",
    category: "social-studies",
    difficulty: "hard",
    question: "Which geographic feature most influenced early Native American civilizations' development in different regions?",
    options: ["The color of the soil", "The availability of natural resources like water, animals, and plants", "The distance from Europe", "The temperature in summer only"],
    correctIndex: 1,
    explanation: "Native American civilizations developed differently based on their environment's natural resources—coastal tribes fished, plains tribes hunted buffalo, and southwestern tribes farmed using irrigation.",
    ageMin: 10,
    ageMax: 11
  }
]
