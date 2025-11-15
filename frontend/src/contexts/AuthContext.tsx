import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // TODO: Implement actual API call
    console.log('Login:', email, password);
    setTimeout(() => {
      setAdmin({ id: '1', email, name: 'Test Admin' });
      setLoading(false);
    }, 1000);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    // TODO: Implement actual API call
    console.log('Register:', name, email, password);
    setTimeout(() => {
      setAdmin({ id: '1', email, name });
      setLoading(false);
    }, 1000);
  };

  const logout = async () => {
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};