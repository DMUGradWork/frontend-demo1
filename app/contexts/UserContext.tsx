import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: number | null;
  setUserId: (id: number) => void;
  clearUserId: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserIdState] = useState<number | null>(null);

  const setUserId = (id: number) => {
    setUserIdState(id);
    console.log(`🔑 User ID set to: ${id}`);
  };

  const clearUserId = () => {
    setUserIdState(null);
    console.log('🔑 User ID cleared');
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, clearUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 