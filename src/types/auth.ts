export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}