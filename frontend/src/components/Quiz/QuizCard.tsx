import React from 'react';
import { Link } from 'wouter';

interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    description?: string;
    questions: any[];
    createdAt: string;
    createdBy?: {
      name: string;
    };
  };
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  quiz, 
  showActions = false,
  onDelete 
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setIsDeleting(true);
      await onDelete(quiz._id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {quiz.title}
            </h3>
            {quiz.description && (
              <p className="text-gray-600 mb-3 line-clamp-2">
                {quiz.description}
              </p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{quiz.questions.length} questions</span>
              <span>•</span>
              <span>
                {new Date(quiz.createdAt).toLocaleDateString()}
              </span>
              {quiz.createdBy && (
                <>
                  <span>•</span>
                  <span>By {quiz.createdBy.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link href={`/quiz/${quiz._id}`}>
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Take Quiz
            </a>
          </Link>

          {showActions && (
            <div className="flex items-center space-x-2">
              <Link href={`/admin/edit/${quiz._id}`}>
                <a className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit
                </a>
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};