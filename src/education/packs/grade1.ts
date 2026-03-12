/**
 * Grade 1 Educational Questions
 *
 * Standards covered:
 * - Math: Addition and subtraction within 20, place value, measurement, geometry, time
 * - Reading: Main idea, details, vocabulary, sequencing, inference, comprehension
 * - Spelling: CVC words, sight words, common spelling patterns
 * - Science: Living vs. non-living things, basic needs, plant parts, seasons, states of matter
 * - Social Studies: Rules and citizenship, community helpers, maps, holidays
 *
 * Age Range: 6-7 years (Grade 1)
 */

import type { Question } from '@/types'

export const grade1Questions: Question[] = [
  {
    id: "g1-math-1",
    category: "math",
    difficulty: "easy",
    question: "What is 5 + 3?",
    options: ["6", "7", "8", "9"],
    correctIndex: 2,
    explanation: "When you count 5 objects and add 3 more objects, you have 8 objects total.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-2",
    category: "math",
    difficulty: "easy",
    question: "What is 9 - 4?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "If you start with 9 and take away 4, you are left with 5.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-3",
    category: "math",
    difficulty: "medium",
    question: "What is 7 + 8?",
    options: ["13", "14", "15", "16"],
    correctIndex: 2,
    explanation: "You can make 10 by taking 3 from the 8, so 7+3=10, then add the remaining 5 to get 15.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-4",
    category: "math",
    difficulty: "medium",
    question: "What is 12 - 7?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    explanation: "If you count back 7 from 12, or think 7 + 5 = 12, you get 5.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-5",
    category: "math",
    difficulty: "hard",
    question: "What is 9 + 9?",
    options: ["16", "17", "18", "19"],
    correctIndex: 2,
    explanation: "9 + 9 is the same as 10 + 8, which equals 18.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-6",
    category: "math",
    difficulty: "hard",
    question: "What is 16 - 9?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    explanation: "Think: 9 + 7 = 16, so 16 - 9 = 7.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-7",
    category: "math",
    difficulty: "easy",
    question: "The number 25 has how many tens?",
    options: ["1 ten", "2 tens", "3 tens", "5 tens"],
    correctIndex: 1,
    explanation: "The number 25 is made of 2 tens and 5 ones.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-8",
    category: "math",
    difficulty: "medium",
    question: "What number is the same as 3 tens and 7 ones?",
    options: ["73", "37", "307", "3007"],
    correctIndex: 1,
    explanation: "3 tens is 30, and 7 ones is 7, so together that makes 37.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-9",
    category: "math",
    difficulty: "medium",
    question: "Which number is greater: 42 or 38?",
    options: ["42", "38", "They are equal", "Cannot tell"],
    correctIndex: 0,
    explanation: "42 has 4 tens while 38 has only 3 tens, so 42 is greater.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-10",
    category: "math",
    difficulty: "hard",
    question: "What is 10 more than 56?",
    options: ["57", "65", "66", "66"],
    correctIndex: 2,
    explanation: "Adding 10 means adding one more ten, so 56 becomes 66.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-11",
    category: "math",
    difficulty: "easy",
    question: "Look at the bars below. How many circles are there in total?\n\n[Bar 1: 5 circles]\n[Bar 2: 3 circles]",
    options: ["6", "7", "8", "9"],
    correctIndex: 2,
    explanation: "Count all the circles: 5 in the first bar and 3 in the second bar equals 8 total.",
    ageMin: 6,
    ageMax: 7,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "Bar 1",
          totalParts: 5,
          shadedParts: 5,
          color: "blue"
        },
        {
          label: "Bar 2",
          totalParts: 3,
          shadedParts: 3,
          color: "green"
        }
      ]
    }
  },
  {
    id: "g1-math-12",
    category: "math",
    difficulty: "medium",
    question: "The bar shows 10 squares. How many squares are shaded?\n\n[Bar: 10 squares total, 6 shaded]",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    explanation: "Count the shaded squares carefully. There are 6 shaded squares.",
    ageMin: 6,
    ageMax: 7,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "Shaded Squares",
          totalParts: 10,
          shadedParts: 6,
          color: "orange"
        }
      ]
    }
  },
  {
    id: "g1-math-13",
    category: "math",
    difficulty: "medium",
    question: "Two groups of apples are shown. How many apples are there altogether?\n\n[Group 1: 7 apples]\n[Group 2: 5 apples]",
    options: ["11", "12", "13", "14"],
    correctIndex: 1,
    explanation: "7 apples plus 5 apples equals 12 apples total.",
    ageMin: 6,
    ageMax: 7,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "Group 1",
          totalParts: 7,
          shadedParts: 7,
          color: "red"
        },
        {
          label: "Group 2",
          totalParts: 5,
          shadedParts: 5,
          color: "red"
        }
      ]
    }
  },
  {
    id: "g1-math-14",
    category: "math",
    difficulty: "hard",
    question: "The bar shows 15 stars. If 8 stars are NOT shaded, how many stars ARE shaded?",
    options: ["6", "7", "8", "9"],
    correctIndex: 1,
    explanation: "If 15 total stars and 8 are not shaded, then 15 - 8 = 7 stars are shaded.",
    ageMin: 6,
    ageMax: 7,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "Stars",
          totalParts: 15,
          shadedParts: 7,
          color: "yellow"
        }
      ]
    }
  },
  {
    id: "g1-math-15",
    category: "math",
    difficulty: "hard",
    question: "Look at the two bars. How many more circles does Bar A have than Bar B?\n\n[Bar A: 9 circles]\n[Bar B: 4 circles]",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "Bar A has 9 circles and Bar B has 4 circles. 9 - 4 = 5 more circles.",
    ageMin: 6,
    ageMax: 7,
    diagram: {
      type: "fraction-bars",
      bars: [
        {
          label: "Bar A",
          totalParts: 9,
          shadedParts: 9,
          color: "purple"
        },
        {
          label: "Bar B",
          totalParts: 4,
          shadedParts: 4,
          color: "pink"
        }
      ]
    }
  },
  {
    id: "g1-math-16",
    category: "math",
    difficulty: "easy",
    question: "What time does the clock show when the short hand is on 3 and the long hand is on 12?",
    options: ["12:00", "3:00", "6:00", "9:00"],
    correctIndex: 1,
    explanation: "When the short hand points to 3 and the long hand points to 12, it is 3 o'clock.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-17",
    category: "math",
    difficulty: "medium",
    question: "Which object is the longest?",
    options: ["A pencil that is 5 paper clips long", "A crayon that is 7 paper clips long", "An eraser that is 3 paper clips long", "A pen that is 6 paper clips long"],
    correctIndex: 1,
    explanation: "The crayon is 7 paper clips long, which is longer than all the other objects.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-18",
    category: "math",
    difficulty: "easy",
    question: "How many sides does a triangle have?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation: "A triangle always has exactly 3 sides.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-19",
    category: "math",
    difficulty: "medium",
    question: "Which shape has 4 equal sides and 4 corners?",
    options: ["Circle", "Triangle", "Square", "Rectangle"],
    correctIndex: 2,
    explanation: "A square has 4 sides that are all the same length and 4 corners.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-math-20",
    category: "math",
    difficulty: "hard",
    question: "If you cut a square in half diagonally, what two shapes do you get?",
    options: ["Two circles", "Two rectangles", "Two triangles", "Two squares"],
    correctIndex: 2,
    explanation: "When you cut a square from corner to corner, you make two triangles.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-read-1",
    category: "reading",
    difficulty: "easy",
    question: "What is this story mostly about?",
    options: ["A dog who likes to play", "A cat who is scared", "A bird who can sing", "A fish who can swim"],
    correctIndex: 0,
    explanation: "The story is mainly about Max the dog and all the fun things he likes to do.",
    ageMin: 6,
    ageMax: 7,
    passage: "Max is a brown dog. He is very happy. Max likes to run in the park. He likes to chase his red ball. Max also likes to dig holes in the yard. His favorite thing is to play with other dogs. At the end of the day, Max is tired. He sleeps on his soft bed. Max dreams about playing all day long. He wags his tail even when he sleeps!"
  },
  {
    id: "g1-read-2",
    category: "reading",
    difficulty: "easy",
    question: "What color is Max?",
    options: ["Black", "Brown", "White", "Yellow"],
    correctIndex: 1,
    explanation: "The story says 'Max is a brown dog' at the very beginning.",
    ageMin: 6,
    ageMax: 7,
    passage: "Max is a brown dog. He is very happy. Max likes to run in the park. He likes to chase his red ball. Max also likes to dig holes in the yard. His favorite thing is to play with other dogs. At the end of the day, Max is tired. He sleeps on his soft bed. Max dreams about playing all day long. He wags his tail even when he sleeps!"
  },
  {
    id: "g1-read-3",
    category: "reading",
    difficulty: "medium",
    question: "What does the word 'chase' mean in this story?",
    options: ["To sleep on something", "To run after something", "To eat something", "To throw something"],
    correctIndex: 1,
    explanation: "When you chase something, you run after it to try to catch it.",
    ageMin: 6,
    ageMax: 7,
    passage: "Max is a brown dog. He is very happy. Max likes to run in the park. He likes to chase his red ball. Max also likes to dig holes in the yard. His favorite thing is to play with other dogs. At the end of the day, Max is tired. He sleeps on his soft bed. Max dreams about playing all day long. He wags his tail even when he sleeps!"
  },
  {
    id: "g1-read-4",
    category: "reading",
    difficulty: "medium",
    question: "What does Max do at the end of the day?",
    options: ["He runs in the park", "He digs holes", "He sleeps on his bed", "He plays with other dogs"],
    correctIndex: 2,
    explanation: "The story says 'At the end of the day, Max is tired. He sleeps on his soft bed.'",
    ageMin: 6,
    ageMax: 7,
    passage: "Max is a brown dog. He is very happy. Max likes to run in the park. He likes to chase his red ball. Max also likes to dig holes in the yard. His favorite thing is to play with other dogs. At the end of the day, Max is tired. He sleeps on his soft bed. Max dreams about playing all day long. He wags his tail even when he sleeps!"
  },
  {
    id: "g1-read-5",
    category: "reading",
    difficulty: "hard",
    question: "Based on the story, how does Max probably feel about his life?",
    options: ["Sad and lonely", "Happy and playful", "Angry and mean", "Scared and quiet"],
    correctIndex: 1,
    explanation: "The story says Max 'is very happy' and describes all the fun things he does, so he is happy and playful.",
    ageMin: 6,
    ageMax: 7,
    passage: "Max is a brown dog. He is very happy. Max likes to run in the park. He likes to chase his red ball. Max also likes to dig holes in the yard. His favorite thing is to play with other dogs. At the end of the day, Max is tired. He sleeps on his soft bed. Max dreams about playing all day long. He wags his tail even when he sleeps!"
  },
  {
    id: "g1-read-6",
    category: "reading",
    difficulty: "easy",
    question: "What is this story mostly about?",
    options: ["Different kinds of clouds", "How rain falls from the sky", "What happens in different weather", "Why the sun is hot"],
    correctIndex: 2,
    explanation: "The story describes sunny days, rainy days, snowy days, and windy days - different types of weather.",
    ageMin: 6,
    ageMax: 7,
    passage: "Weather changes every day. Sometimes it is sunny. The sun is bright and warm. We can play outside when it is sunny. Other days it rains. Rain falls from the clouds. We use umbrellas to stay dry. In winter, it might snow. Snow is cold and white. We can make snowmen! On some days, the wind blows. The wind makes the trees move. What is your favorite kind of weather?"
  },
  {
    id: "g1-read-7",
    category: "reading",
    difficulty: "easy",
    question: "What do we use to stay dry when it rains?",
    options: ["Snowmen", "Trees", "Umbrellas", "Clouds"],
    correctIndex: 2,
    explanation: "The story says 'We use umbrellas to stay dry' when it rains.",
    ageMin: 6,
    ageMax: 7,
    passage: "Weather changes every day. Sometimes it is sunny. The sun is bright and warm. We can play outside when it is sunny. Other days it rains. Rain falls from the clouds. We use umbrellas to stay dry. In winter, it might snow. Snow is cold and white. We can make snowmen! On some days, the wind blows. The wind makes the trees move. What is your favorite kind of weather?"
  },
  {
    id: "g1-read-8",
    category: "reading",
    difficulty: "medium",
    question: "What does the word 'bright' mean in this story?",
    options: ["Very dark", "Very loud", "Giving off a lot of light", "Very cold"],
    correctIndex: 2,
    explanation: "When something is bright, it gives off a lot of light. The sun is bright because it shines with lots of light.",
    ageMin: 6,
    ageMax: 7,
    passage: "Weather changes every day. Sometimes it is sunny. The sun is bright and warm. We can play outside when it is sunny. Other days it rains. Rain falls from the clouds. We use umbrellas to stay dry. In winter, it might snow. Snow is cold and white. We can make snowmen! On some days, the wind blows. The wind makes the trees move. What is your favorite kind of weather?"
  },
  {
    id: "g1-read-9",
    category: "reading",
    difficulty: "medium",
    question: "When does it snow, according to the story?",
    options: ["In summer", "In winter", "When it rains", "On windy days"],
    correctIndex: 1,
    explanation: "The story says 'In winter, it might snow.'",
    ageMin: 6,
    ageMax: 7,
    passage: "Weather changes every day. Sometimes it is sunny. The sun is bright and warm. We can play outside when it is sunny. Other days it rains. Rain falls from the clouds. We use umbrellas to stay dry. In winter, it might snow. Snow is cold and white. We can make snowmen! On some days, the wind blows. The wind makes the trees move. What is your favorite kind of weather?"
  },
  {
    id: "g1-read-10",
    category: "reading",
    difficulty: "hard",
    question: "What can you infer about sunny weather from the story?",
    options: ["It is good weather for playing outside", "It always rains on sunny days", "You need an umbrella on sunny days", "The wind blows hard on sunny days"],
    correctIndex: 0,
    explanation: "The story says 'We can play outside when it is sunny,' which tells us sunny weather is good for outdoor play.",
    ageMin: 6,
    ageMax: 7,
    passage: "Weather changes every day. Sometimes it is sunny. The sun is bright and warm. We can play outside when it is sunny. Other days it rains. Rain falls from the clouds. We use umbrellas to stay dry. In winter, it might snow. Snow is cold and white. We can make snowmen! On some days, the wind blows. The wind makes the trees move. What is your favorite kind of weather?"
  },
  {
    id: "g1-read-11",
    category: "reading",
    difficulty: "easy",
    question: "What is this story mostly about?",
    options: ["Two friends who help each other", "A girl who likes to draw", "A boy who builds things", "Animals in the forest"],
    correctIndex: 0,
    explanation: "The story is about Emma and Liam, two friends who do things together and help each other.",
    ageMin: 6,
    ageMax: 7,
    passage: "Emma and Liam are best friends. They live next door to each other. Every day after school, they play together. Emma likes to draw pictures. Liam likes to build with blocks. Sometimes Emma draws pictures of the towers Liam builds. Sometimes Liam builds frames for Emma's drawings. They share their snacks and help each other. When Emma fell and hurt her knee, Liam got a bandage. When Liam lost his toy car, Emma helped him look for it. Best friends help each other!"
  },
  {
    id: "g1-read-12",
    category: "reading",
    difficulty: "easy",
    question: "What does Emma like to do?",
    options: ["Build with blocks", "Draw pictures", "Play with toy cars", "Run in the park"],
    correctIndex: 1,
    explanation: "The story clearly states 'Emma likes to draw pictures.'",
    ageMin: 6,
    ageMax: 7,
    passage: "Emma and Liam are best friends. They live next door to each other. Every day after school, they play together. Emma likes to draw pictures. Liam likes to build with blocks. Sometimes Emma draws pictures of the towers Liam builds. Sometimes Liam builds frames for Emma's drawings. They share their snacks and help each other. When Emma fell and hurt her knee, Liam got a bandage. When Liam lost his toy car, Emma helped him look for it. Best friends help each other!"
  },
  {
    id: "g1-read-13",
    category: "reading",
    difficulty: "medium",
    question: "What does the word 'share' mean in this story?",
    options: ["To keep everything for yourself", "To give some of what you have to others", "To hide things from friends", "To throw things away"],
    correctIndex: 1,
    explanation: "When you share, you give some of what you have to someone else. The friends share their snacks with each other.",
    ageMin: 6,
    ageMax: 7,
    passage: "Emma and Liam are best friends. They live next door to each other. Every day after school, they play together. Emma likes to draw pictures. Liam likes to build with blocks. Sometimes Emma draws pictures of the towers Liam builds. Sometimes Liam builds frames for Emma's drawings. They share their snacks and help each other. When Emma fell and hurt her knee, Liam got a bandage. When Liam lost his toy car, Emma helped him look for it. Best friends help each other!"
  },
  {
    id: "g1-read-14",
    category: "reading",
    difficulty: "medium",
    question: "What happened FIRST in the story?",
    options: ["Emma fell and hurt her knee", "Emma and Liam play together after school", "Liam lost his toy car", "Liam got a bandage"],
    correctIndex: 1,
    explanation: "The story says 'Every day after school, they play together' near the beginning, before the other events.",
    ageMin: 6,
    ageMax: 7,
    passage: "Emma and Liam are best friends. They live next door to each other. Every day after school, they play together. Emma likes to draw pictures. Liam likes to build with blocks. Sometimes Emma draws pictures of the towers Liam builds. Sometimes Liam builds frames for Emma's drawings. They share their snacks and help each other. When Emma fell and hurt her knee, Liam got a bandage. When Liam lost his toy car, Emma helped him look for it. Best friends help each other!"
  },
  {
    id: "g1-read-15",
    category: "reading",
    difficulty: "hard",
    question: "What lesson does this story teach?",
    options: ["Always draw pictures", "Build with blocks every day", "Good friends help and care for each other", "Play alone is more fun"],
    correctIndex: 2,
    explanation: "The story shows Emma and Liam helping each other in different ways, and ends with 'Best friends help each other!'",
    ageMin: 6,
    ageMax: 7,
    passage: "Emma and Liam are best friends. They live next door to each other. Every day after school, they play together. Emma likes to draw pictures. Liam likes to build with blocks. Sometimes Emma draws pictures of the towers Liam builds. Sometimes Liam builds frames for Emma's drawings. They share their snacks and help each other. When Emma fell and hurt her knee, Liam got a bandage. When Liam lost his toy car, Emma helped him look for it. Best friends help each other!"
  },
  {
    id: "g1-spell-1",
    category: "spelling",
    difficulty: "easy",
    question: "Which word is spelled correctly?",
    options: ["kat", "cat", "catt", "cot"],
    correctIndex: 1,
    explanation: "The correct spelling is 'cat' with a c, a, and t.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-2",
    category: "spelling",
    difficulty: "easy",
    question: "Which is the correct spelling?",
    options: ["dag", "dug", "dig", "dog"],
    correctIndex: 3,
    explanation: "The word for the animal is spelled 'd-o-g'.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-3",
    category: "spelling",
    difficulty: "easy",
    question: "Which word is spelled correctly?",
    options: ["run", "run", "rnu", "urn"],
    correctIndex: 0,
    explanation: "The correct spelling is 'run' with r, u, and n in that order.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-4",
    category: "spelling",
    difficulty: "medium",
    question: "Which is the correct spelling of the word that means 'to leap'?",
    options: ["jomp", "jump", "jamp", "jup"],
    correctIndex: 1,
    explanation: "The word 'jump' is spelled j-u-m-p.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-5",
    category: "spelling",
    difficulty: "medium",
    question: "Which word is spelled correctly?",
    options: ["sed", "sayd", "said", "siad"],
    correctIndex: 2,
    explanation: "The sight word is spelled 's-a-i-d'. This is a tricky word to remember!",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-6",
    category: "spelling",
    difficulty: "medium",
    question: "Which is the correct spelling?",
    options: ["thay", "they", "thei", "tha"],
    correctIndex: 1,
    explanation: "The word 'they' is spelled t-h-e-y.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-7",
    category: "spelling",
    difficulty: "hard",
    question: "Which word is spelled correctly?",
    options: ["wher", "were", "whare", "wre"],
    correctIndex: 1,
    explanation: "The correct spelling is 'were' with w-e-r-e.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-8",
    category: "spelling",
    difficulty: "hard",
    question: "Which is the correct spelling of the word meaning 'to possess'?",
    options: ["hav", "have", "hafe", "haiv"],
    correctIndex: 1,
    explanation: "The word 'have' is spelled h-a-v-e with a silent 'e' at the end.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-9",
    category: "spelling",
    difficulty: "easy",
    question: "Which word is spelled correctly?",
    options: ["the", "teh", "tha", "thee"],
    correctIndex: 0,
    explanation: "This common sight word is spelled 't-h-e'.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-spell-10",
    category: "spelling",
    difficulty: "medium",
    question: "Which is the correct spelling?",
    options: ["kom", "cum", "come", "cume"],
    correctIndex: 2,
    explanation: "The word 'come' is spelled c-o-m-e with a silent 'e'.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-science-1",
    category: "science",
    difficulty: "easy",
    question: "Which of these is a living thing?",
    options: ["A rock", "A tree", "A toy car", "A chair"],
    correctIndex: 1,
    explanation: "A tree is alive. It grows, needs water and sunlight, and makes new trees. Rocks, toys, and chairs are not alive.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-science-2",
    category: "science",
    difficulty: "medium",
    question: "What do all animals need to stay alive?",
    options: ["Food, water, and air", "Only toys", "Only a house", "Only clothes"],
    correctIndex: 0,
    explanation: "All animals need food to eat, water to drink, and air to breathe in order to live.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-science-3",
    category: "science",
    difficulty: "medium",
    question: "What part of a plant takes in water from the soil?",
    options: ["Leaves", "Flowers", "Roots", "Stem"],
    correctIndex: 2,
    explanation: "The roots grow underground and take in water and nutrients from the soil.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-science-4",
    category: "science",
    difficulty: "hard",
    question: "Which season comes after winter?",
    options: ["Summer", "Fall", "Spring", "Winter again"],
    correctIndex: 2,
    explanation: "Spring comes after winter. The order is winter, spring, summer, fall, and then winter again.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-science-5",
    category: "science",
    difficulty: "hard",
    question: "What happens to water when it gets very cold?",
    options: ["It turns into ice", "It disappears", "It turns into juice", "It gets warmer"],
    correctIndex: 0,
    explanation: "When water gets cold enough (freezes), it turns into ice, which is solid.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-social-1",
    category: "social-studies",
    difficulty: "easy",
    question: "What is a rule?",
    options: ["Something you eat", "Something you must follow", "A type of game", "A color"],
    correctIndex: 1,
    explanation: "A rule is something you are supposed to follow. Rules help keep everyone safe and fair.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-social-2",
    category: "social-studies",
    difficulty: "easy",
    question: "Who helps people when they are sick?",
    options: ["A teacher", "A doctor", "A chef", "A driver"],
    correctIndex: 1,
    explanation: "Doctors are helpers in our community who take care of people when they are sick or hurt.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-social-3",
    category: "social-studies",
    difficulty: "medium",
    question: "What does it mean to be a good citizen?",
    options: ["To follow rules and help others", "To only think about yourself", "To break rules when you want", "To never share with anyone"],
    correctIndex: 0,
    explanation: "A good citizen follows rules, helps others, and is kind to people in their community.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-social-4",
    category: "social-studies",
    difficulty: "medium",
    question: "What is a map used for?",
    options: ["To cook food", "To show where places are", "To tell time", "To measure things"],
    correctIndex: 1,
    explanation: "A map is a drawing that shows where different places are located.",
    ageMin: 6,
    ageMax: 7
  },
  {
    id: "g1-social-5",
    category: "social-studies",
    difficulty: "hard",
    question: "Why do we celebrate holidays?",
    options: ["To remember important events and people", "To sleep all day", "To forget the past", "To be alone"],
    correctIndex: 0,
    explanation: "We celebrate holidays to remember important events, people, and traditions that are special to us.",
    ageMin: 6,
    ageMax: 7
  }
]
