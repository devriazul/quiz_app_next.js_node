'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Result {
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: Record<number, string>;
  completedAt: string;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quiz');
  const score = searchParams.get('score');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/');
          return;
        }

        const response = await fetch(`/api/results?quizId=${quizId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchResult();
    }
  }, [quizId, router]);

  if (loading) {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find any results for this quiz.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPassing = percentage >= 60;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Quiz Results</h1>
            <p className="text-gray-700">You&apos;ve completed the quiz! Here&apos;s your performance summary.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Score Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-medium text-gray-900">{result.totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Correct Answers</span>
                  <span className="font-medium text-gray-900">{result.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Percentage</span>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                    {isPassing ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Completion Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quiz ID</span>
                  <span className="font-medium text-gray-900">{result.quizId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed At</span>
                  <span className="font-medium text-gray-900">
                    {new Date(result.completedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push(`/exam?quiz=${result.quizId}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading results...</span>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
} 