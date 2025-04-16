// 'use client';

// import { createContext, useState, useEffect, useContext } from 'react';

// type AuthContextType = {
//   isLoggedIn: boolean;
//   setIsLoggedIn: (val: boolean) => void;
// };

// export const AuthContext = createContext<AuthContextType>({
//   isLoggedIn: false,
//   setIsLoggedIn: () => {},
// });

// export const useAuth = () => useContext(AuthContext);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
//     setIsLoggedIn(loggedIn);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
// auth-context.ts
'use client';

import { createContext, useState, useEffect, useContext } from 'react';

type User = {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  setIsLoggedIn: (val: boolean) => void;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    setIsLoggedIn(loggedIn);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user,
      setIsLoggedIn, 
      setUser,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}