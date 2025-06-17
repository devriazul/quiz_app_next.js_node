import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create exam1 quiz
  await prisma.quiz.upsert({
    where: { id: 'exam1' },
    update: {},
    create: {
      id: 'exam1',
      title: 'EXAM-1',
      questions: [
        {
          id: 1,
          question: 'What is the capital of France?',
          type: 'multiple',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris'
        },
        {
          id: 2,
          question: 'What is 2 + 2?',
          type: 'short',
          correctAnswer: '4'
        },
        {
          id: 3,
          question: 'Which planet is known as the Red Planet?',
          type: 'multiple',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 'Mars'
        },
        {
          id: 4,
          question: 'What is the largest mammal in the world?',
          type: 'short',
          correctAnswer: 'Blue Whale'
        },
        {
          id: 5,
          question: 'What is the main component of the Sun?',
          type: 'multiple',
          options: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'],
          correctAnswer: 'Hydrogen'
        }
      ]
    }
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 