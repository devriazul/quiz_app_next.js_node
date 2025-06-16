'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  type: 'multiple' | 'short';
  options?: string[];
  correctAnswer: string | number;
}

interface Quiz {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

// Sample questions for each quiz
const quizData: Record<string, Quiz> = {
  exam1: {
    id: 'exam1',
    title: 'EXAM-1',
    duration: 10, // 10 minutes
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
};

export default function Exam() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quiz') || 'exam1';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Calculate score
      const score = quizData[quizId].questions.reduce((acc, question, index) => {
        const userAnswer = answers[index];
        return acc + (userAnswer?.toLowerCase() === question.correctAnswer.toString().toLowerCase() ? 1 : 0);
      }, 0);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Save results
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId,
          score,
          totalQuestions: quizData[quizId].questions.length,
          answers
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save results');
      }

      // Redirect to results page
      router.push(`/results?quiz=${quizId}&score=${score}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  }, [isSubmitting, quizId, answers, router]);

  useEffect(() => {
    if (!quizData[quizId]) {
      router.replace('/dashboard');
      return;
    }
  }, [quizId, router]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData[quizId].questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
    }
  };

  if (!quizData[quizId]) {
    return null;
  }

  const quiz = quizData[quizId];
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const score = Object.entries(answers).reduce((acc, [index, answer]) => {
    return acc + (answer.toLowerCase() === quiz.questions[parseInt(index)].correctAnswer.toString().toLowerCase() ? 1 : 0);
  }, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-700 mt-1">Technical Assessment</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-700">Time Left</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">{score}</div>
                <div className="text-sm text-gray-700">Score</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{question.type === 'multiple' ? 'Multiple Choice' : 'Short Answer'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">{question.question}</h2>
            {question.type === 'multiple' ? (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50 text-gray-900'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="mr-3"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit Quiz</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 