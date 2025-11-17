import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await authAPI.getMe();
        setAdmin(response.data.admin);
        console.log('✅ Auth check successful:', response.data.admin);
      } else {
        setAdmin(null);
      }
    } catch (error: any) {
      console.log('❌ Not authenticated:', error.response?.data?.error || error.message);
      localStorage.removeItem('auth_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { admin, token } = response.data;
      
      // Store the token
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      setAdmin(admin);
      console.log('✅ Login successful:', admin);
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.error || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.register(name, email, password);
      const { admin, token } = response.data;
      
      // Store the token
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      setAdmin(admin);
      console.log('✅ Registration successful:', admin);
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data?.error || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('auth_token');
      setAdmin(null);
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      localStorage.removeItem('auth_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
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