import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { user: loggedInUser, error } = await AuthService.login({ email, password });
    
    if (loggedInUser) {
      setUser(loggedInUser);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: error || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    const { user: newUser, error } = await AuthService.register({ email, password, name });
    
    if (newUser) {
      setUser(newUser);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: error || 'Registration failed' };
    }
  };

  const logout = async () => {
    setLoading(true);
    await AuthService.logout();
    setUser(null);
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};