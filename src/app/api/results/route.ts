import { NextResponse } from 'next/server';
import { verifyToken } from '../auth/verify';

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

    // In a real application, you would save this to a database
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      data: {
        quizId,
        score,
        totalQuestions,
        percentage: (score / totalQuestions) * 100,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz results' },
      { status: 500 }
    );
  }
} 