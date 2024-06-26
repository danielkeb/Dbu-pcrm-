import { createContext, useContext, useState, useEffect } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";

// Define the type for your context
// Define the type for your context
interface DAppContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  decodedToken: string | JwtPayload | null;
  setDecodedToken: React.Dispatch<React.SetStateAction<string | JwtPayload | null>>;
}

// // Create the context with the specified type
export const AppContext = createContext<DAppContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
  decodedToken: null,
  setDecodedToken: () => {},
});


// export const AppContext = createContext({});
export function AppWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || null;
    }
    return null;
  });


  const [decodedToken, setDecodedToken] = useState<string | JwtPayload | null>("")

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('authToken');
  //   if (storedToken) {
  //     setToken(storedToken);
  //     try {
  //       const decoded = jwt.decode(storedToken);
  //       if (decoded && typeof decoded === 'object') {
  //         setDecodedToken(decoded as { [key: string]: any });
  //       } else {
  //         setDecodedToken(null);
  //       }
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //       setDecodedToken(null);
  //     }
  //   }
  // }, []);

  const logout = () => {
    setToken(null);
    setDecodedToken(null);
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <AppContext.Provider value={{ token, setToken, logout, decodedToken, setDecodedToken }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);
