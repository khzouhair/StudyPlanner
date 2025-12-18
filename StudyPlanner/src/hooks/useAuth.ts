import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
};

const STORAGE_KEY = 'studyplanner_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        if (parsed?.isAuthenticated) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
      const userData: User = { username, isAuthenticated: true };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (username: string, password: string): boolean => {
    // Demo seulement : on n'autorise que le compte de test
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
      const userData: User = { username, isAuthenticated: true };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
