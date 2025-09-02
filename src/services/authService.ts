import { supabase } from './supabase';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';

export class AuthService {
  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        created_at: user.created_at!,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Register new user
  static async register(credentials: RegisterCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Registration failed' };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: credentials.name,
        created_at: data.user.created_at!,
      };

      return { user, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, error: 'Registration failed' };
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Login failed' };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        created_at: data.user.created_at!,
      };

      return { user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Login failed' };
    }
  }

  // Logout user
  static async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: 'Logout failed' };
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          created_at: session.user.created_at!,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}