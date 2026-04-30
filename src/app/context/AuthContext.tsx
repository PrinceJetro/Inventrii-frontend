import { createContext, useContext, useState } from 'react';
import type { AppUser } from '../data/mockData';

interface AuthContextType {
  currentUser: AppUser | null;
  login: (user: AppUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const stored = localStorage.getItem('inventrii_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const login = (user: AppUser) => {
    setCurrentUser(user);
    localStorage.setItem('inventrii_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('inventrii_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
