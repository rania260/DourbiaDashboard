'use client';

import { createContext, useState, useEffect, useContext } from 'react';

type User = {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  token?: string;
  phone?: string;
  country?: string;
  region?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  setIsLoggedIn: (val: boolean) => void;
  setUser: (user: User | null) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
  fetchProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
  login: () => {},
  logout: () => {},
  token: null,
  setToken: () => {},
  fetchProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: User, token: string) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
          
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
  };

const fetchProfile = async () => {
  try {
    const jwt = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!jwt) return;
    const response = await fetch('http://localhost:8000/auth/profile', {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
   else {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
  };
  }, []);


  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user,
      setIsLoggedIn, 
      setUser,
      login,
      logout,
      token,
      setToken,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}