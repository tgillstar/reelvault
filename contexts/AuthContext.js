'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";

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

      const docRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await signOut(auth);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const data = snapshot.data();
      const isGuest = data?.isGuest === true;
      const createdAt = data.createdAt;

      // Guest expiration logic
      if (isGuest && createdAt && typeof createdAt.toMillis === 'function') {
        const expiresAt = createdAt.toMillis() + 30 * 60 * 1000; // 30 minutes
        if (Date.now() > expiresAt) {
          await signOut(auth);
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }
        setUser(firebaseUser);
        setRole('guest');
        setLoading(false);
        return;
      }

      // Admin/default user
      setUser(firebaseUser);
      setRole('admin');
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
