import { createContext, useContext, useEffect, useState } from 'react';
import { AppContext } from "@/components/UserContext"; 

type User = {
  id: string;
  name: string;
  role: string;
  // Add more user-related fields as needed
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { decodedToken } = useContext(AppContext);

  // Simulate authentication and user loading (replace with actual authentication logic)
  useEffect(() => {
    if (decodedToken) {
      // Example: Fetch user data from backend or local storage
      const userData: User = {
        id: decodedToken.sub,
        name: decodedToken.name,
        role: decodedToken.role, // Replace with actual role fetched from backend or token
      };

      setUser(userData);
      setIsAuthenticated(true); // For simplicity, assume authenticated
    }
  }, [decodedToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
