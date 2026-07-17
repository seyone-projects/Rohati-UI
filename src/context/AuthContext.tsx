import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our user object
type User = {
  id: string;
  name: string;
  email: string;
  familyName?: string;
  countryCode?: string;
  phoneNumber?: string;
  role?: string;
  avatarUrl?: string;
} | null;

// Define the shape of our authentication context
interface AuthContextType {
  user: User;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// Hook to allow screens to easily consume the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When the app starts, check if we have a secure token and user profile stored
    const checkUserStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user session:", error);
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      const { logout: clearSession } = await import('../services/authService');
      await clearSession();
    } catch (error) {
      console.error("Failed to clear session on backend:", error);
    }
    try {
      await AsyncStorage.multiRemove(['accessToken', 'user']);
    } catch (error) {
      console.error("Failed to remove user session:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
