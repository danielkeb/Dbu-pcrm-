"use client"
import { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

// Define the type for your context
interface DAppContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  decodedToken: { [key: string]: any } | null;
  setDecodedToken: React.Dispatch<React.SetStateAction<{ [key: string]: any } | null>>;
}

// Create the context with the specified type
export const AppContext = createContext<DAppContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
  decodedToken: null,
  setDecodedToken: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwt.decode(storedToken);
          if (decoded && typeof decoded === 'object') {
            setDecodedToken(decoded as { [key: string]: any });
          } else {
            setDecodedToken(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setDecodedToken(null);
        }
      } else {
        setToken(null);
        setDecodedToken(null);
      }
    }
  }, []);

  const logout = () => {
    setToken(null);
    setDecodedToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  return (
    <AppContext.Provider value={{ token, setToken, logout, decodedToken, setDecodedToken }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);
