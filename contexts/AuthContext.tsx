'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserFromToken } from '@/lib/auth';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'operator' | 'superadmin';
  operatorId?: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
  isOperator: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000';

  const fetchUserProfile = async (authToken: string): Promise<User | null> => {
    try {
      const response = await fetch(`${DJANGO_API_URL}/api/auth/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role || 'user',
          operatorId: data.operator_id,
          isActive: data.is_active !== false,
        };
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        // Try to get user from token first (faster)
        let fetchedUser = getUserFromToken(storedToken);
        
        // If token doesn't have complete user info, fetch from API
        if (!fetchedUser || !fetchedUser.role) {
          fetchedUser = await fetchUserProfile(storedToken);
        }
        
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          // Token might be expired or invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadAuthData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${DJANGO_API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.access || data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        
        // Get user from response or token
        let fetchedUser = data.user;
        if (!fetchedUser) {
          fetchedUser = await fetchUserProfile(newToken);
        }
        
        if (fetchedUser) {
          setUser(fetchedUser);
          setIsLoading(false);
          return true;
        } else {
          // Failed to fetch user profile after successful login
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return false;
        }
      } else {
        console.error('Login failed:', response.statusText);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, role: string = 'user'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${DJANGO_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.access || data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);

        let fetchedUser = data.user;
        if (!fetchedUser) {
          fetchedUser = await fetchUserProfile(newToken);
        }
        
        if (fetchedUser) {
          setUser(fetchedUser);
          setIsLoading(false);
          return true;
        } else {
          // Failed to fetch user profile after successful registration
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return false;
        }
      } else {
        console.error('Registration failed:', response.statusText);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const isOperator = (): boolean => {
    return hasRole(['operator', 'superadmin']);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('superadmin');
  };

  // Set cookie for middleware
  useEffect(() => {
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isLoading, 
      hasRole, 
      isOperator, 
      isSuperAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};