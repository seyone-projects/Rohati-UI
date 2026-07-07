import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our user object
type User = {
  id: string;
  username: string;
  email: string;
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
    // When the app starts, check if we have a secure token stored
    // In a real app with your backend, you would use expo-secure-store here to fetch the JWT
    // and validate it with your server.
    const checkUserStatus = async () => {
      try {
        // Simulated network request
        await new Promise(resolve => setTimeout(resolve, 500));
        // For now, we start unauthenticated
        setUser(null);
      } catch (error) {
        console.error("Failed to check auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (token: string, userData: User) => {
    // 1. Securely store the token (e.g., SecureStore.setItemAsync('userToken', token))
    // 2. Set the user in state to update the UI
    setUser(userData);
  };

  const logout = async () => {
    // 1. Remove the secure token (e.g., SecureStore.deleteItemAsync('userToken'))
    // 2. Clear user state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
