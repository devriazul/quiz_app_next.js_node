import { NextResponse } from 'next/server';
import { verifyToken } from '../auth/verify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get quizId from URL
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    // Get the latest attempt for this quiz by the user
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        userId: (decoded as any).userId,
        quizId: quizId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'No results found for this quiz' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quizId: attempt.quizId,
      score: attempt.score,
      totalQuestions: Object.keys(attempt.answers as object).length,
      answers: attempt.answers,
      completedAt: attempt.createdAt
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { quizId, score, totalQuestions, answers } = body;

    if (!quizId || typeof score !== 'number' || !totalQuestions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: (decoded as any).userId,
        quizId,
        score,
        answers
      }
    });

    return NextResponse.json({
      quizId: attempt.quizId,
      score: attempt.score,
      totalQuestions,
      answers: attempt.answers,
      completedAt: attempt.createdAt
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz results' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 