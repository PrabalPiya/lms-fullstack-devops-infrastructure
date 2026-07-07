import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { Role, User } from '../types';

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('learnhub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<{ user: User }>('/auth/me');
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('learnhub_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  async function login(input: LoginInput) {
    const response = await api.post<{ token: string; user: User }>('/auth/login', input);
    localStorage.setItem('learnhub_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  }

  async function register(input: RegisterInput) {
    const response = await api.post<{ token: string; user: User }>('/auth/register', input);
    localStorage.setItem('learnhub_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem('learnhub_token');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
