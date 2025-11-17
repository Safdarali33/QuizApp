import React from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../services/api';

interface QuizResults {
  score: number;
  totalPoints: number;
  percentage: number;
  results: Array<{
    questionId: string;
    questionText: string;
    type: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
  }>;
}

export const QuizResultsPage: React.FC = () => {
  const [match, params] = useRoute('/quiz/:id/results');
  const [location] = useLocation();
  
  // Try to get results from location state first (if navigated from quiz)
  const locationState = useLocation()[1] as any; // Get navigation state
  const resultsFromState = locationState?.state?.results as QuizResults;

  // If no results in state, try to get from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const score = urlParams.get('score');
  const totalPoints = urlParams.get('total');
  const percentage = urlParams.get('percentage');

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', params?.id],
    queryFn: () => quizAPI.getById(params!.id).then(res => res.data),
    enabled: !!params?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use results from state if available, otherwise from URL params
  const numericScore = resultsFromState?.score || (score ? parseInt(score) : 0);
  const numericTotal = resultsFromState?.totalPoints || (totalPoints ? parseInt(totalPoints) : 0);
  const numericPercentage = resultsFromState?.percentage || (percentage ? parseInt(percentage) : 0);

  const getResultColor = () => {
    if (numericPercentage >= 80) return 'text-green-600 bg-green-100';
    if (numericPercentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getResultMessage = () => {
    if (numericPercentage >= 90) return 'Excellent! 🎉';
    if (numericPercentage >= 80) return 'Great job! 👍';
    if (numericPercentage >= 70) return 'Good work! 😊';
    if (numericPercentage >= 60) return 'Not bad! 👌';
    if (numericPercentage >= 50) return 'You passed! ✅';
    return 'Keep practicing! 📚';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
          <div className="text-6xl mb-4">
            {numericPercentage >= 70 ? '🏆' : numericPercentage >= 50 ? '✅' : '📚'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
          <p className="text-xl text-gray-600 mb-6">{getResultMessage()}</p>

          {/* Score Display */}
          <div className="inline-flex flex-col items-center bg-white border border-gray-200 rounded-lg p-6">
            <div className={`text-4xl font-bold ${getResultColor()} px-6 py-3 rounded-full mb-4`}>
              {numericPercentage}%
            </div>
            <div className="text-lg text-gray-700">
              You scored <span className="font-bold">{numericScore}</span> out of <span className="font-bold">{numericTotal}</span> points
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        {quiz && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Quiz Title</h3>
                <p className="text-gray-900">{quiz.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Created By</h3>
                <p className="text-gray-900">{quiz.createdBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Total Questions</h3>
                <p className="text-gray-900">{quiz.questions.length}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Total Points</h3>
                <p className="text-gray-900">{numericTotal}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <a className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center">
              Take Another Quiz
            </a>
          </Link>
          {quiz && (
            <button
              onClick={() => window.location.href = `/quiz/${quiz._id}`}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
            >
              Retry This Quiz
            </button>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Want to create your own quizzes?</h3>
          <p className="text-blue-800 mb-4">
            Become an admin and create custom quizzes with multiple question types!
          </p>
          <Link href="/register">
            <a className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
              Become an Admin
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};