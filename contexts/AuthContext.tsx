
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('chainRepairUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

const login = (userData: any) => {
  const normalizedUser: User = {
    id: userData._id || userData.id, // ensure it's `id`
    name: userData.name,
    email: userData.email,
    contactNumber: userData.contactNumber,
    role: userData.role,
    walletAddress: userData.walletAddress,
    // add other fields as needed
  };

  setUser(normalizedUser);
  localStorage.setItem('chainRepairUser', JSON.stringify(normalizedUser));
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('chainRepairUser');
    // Could also navigate to login page here if not handled by router
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
