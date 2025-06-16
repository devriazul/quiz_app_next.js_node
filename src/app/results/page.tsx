'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
}

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const quizId = searchParams.get('quiz');
    const score = searchParams.get('score');

    if (!quizId || !score) {
      router.replace('/dashboard');
      return;
    }

    const totalQuestions = 5; // Hardcoded for now, should come from the quiz data
    const percentage = (parseInt(score) / totalQuestions) * 100;

    setResult({
      quizId,
      score: parseInt(score),
      totalQuestions,
      percentage,
      timestamp: new Date().toISOString()
    });
    setIsLoading(false);
  }, [searchParams, router]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading results...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
            <p className="text-gray-600 mt-2">
              You&apos;ve completed the quiz! Here&apos;s your performance summary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">{result.totalQuestions}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">{result.score}</div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className={`text-2xl font-bold mb-1 ${getScoreColor(result.percentage)}`}>
                {result.percentage.toFixed(1)}%
              </div>
              <div className="text-gray-600">Score</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Performance</span>
              <span>{result.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  result.percentage >= 80 ? 'bg-green-500' :
                  result.percentage >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/exam?quiz=exam1')}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 