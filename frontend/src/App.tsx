import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// Auth Components
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';

// Layout & Admin Components
import { AdminLayout } from './components/Layout/AdminLayout';

// Quiz Components
import { QuizListPage } from './components/Quiz/QuizListPage';
import { QuizTakePage } from './components/Quiz/QuizTakePage';
import { QuizResultsPage } from './components/Quiz/QuizResultsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={QuizListPage} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/quiz/:id" component={QuizTakePage} />
            <Route path="/quiz/:id/results" component={QuizResultsPage} />
            
            {/* Admin Routes - All /admin routes go to AdminLayout */}
            <Route path="/admin">
              <AdminLayout />
            </Route>
            <Route path="/admin/:any*">
              <AdminLayout />
            </Route>
            
            {/* 404 Page */}
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="text-blue-600 hover:text-blue-500">
                    Go back home
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;