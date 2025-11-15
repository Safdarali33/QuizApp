import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            <Route path="/" component={() => <div>Home Page - Coming Soon</div>} />
            <Route path="/login" component={() => <div>Login - Coming Soon</div>} />
            <Route>404 - Page Not Found</Route>
          </Switch>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;