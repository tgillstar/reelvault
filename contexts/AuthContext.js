'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
  
      const tokenResult = await getIdTokenResult(firebaseUser);
      const claims = tokenResult.claims;
  
      if (claims?.role === 'admin') setRole('admin');
      else if (claims?.role === 'guest') setRole('guest');
      else setRole(null);
  
      setUser(firebaseUser);
      setLoading(false);
    });
  
    return () => unsub();
  }, []);  

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);