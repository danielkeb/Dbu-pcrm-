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
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || "";
    }
    return null;
  });

  const [decodedToken, setDecodedToken] = useState<{ [key: string]: any } | null>(() => {
    try {
      if (token) {
        return jwt.decode(token);
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  });

  const logout = () => {
    setToken(null);
    setDecodedToken(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', "");
      router.push('/login');
    }
  };

  return (
    <AppContext.Provider value={{ token, setToken, logout, decodedToken, setDecodedToken }}>
      {children}
    </AppContext.Provider>
  );
}
