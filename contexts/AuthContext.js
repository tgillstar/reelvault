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
      console.log('[Auth] Auth state changed:', firebaseUser);
  
      if (!firebaseUser) {
        console.log('[Auth] No user logged in');
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
  
      const docRef = doc(db, 'users', firebaseUser.uid);
      let snapshot;
  
      try {
        snapshot = await getDoc(docRef);
      } catch (err) {
        console.error('[Auth] 🔥 Error getting user doc:', err);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
  
      if (!snapshot.exists()) {
        console.warn('[Auth] ❗ User doc does not exist. Signing out.');
        await signOut(auth);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
  
      const data = snapshot.data();
      console.log('[Auth] ✅ User doc data:', data);
  
      const isGuest = data?.isGuest === true;
      const createdAt = data.createdAt;
  
      if (isGuest) {
        if (!createdAt || typeof createdAt.toMillis !== 'function') {
          console.warn('[Auth] Guest login missing or invalid createdAt.');
          await signOut(auth);
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }
  
        const expiresAt = createdAt.toMillis() + 30 * 60 * 1000;
        console.log('[Auth] Guest session expires at:', new Date(expiresAt).toLocaleTimeString());
  
        if (Date.now() > expiresAt) {
          console.warn('[Auth] Guest session expired.');
          await signOut(auth);
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }
  
        console.log('[Auth] 👤 Authenticated as guest');
        setUser(firebaseUser);
        setRole('guest');
        setLoading(false);
        return;
      }
  
      console.log('[Auth] 👤 Authenticated as admin');
      setUser(firebaseUser);
      setRole('admin');
      setLoading(false);
    });
  
    return () => unsub();
  }, []);
  
  // ✅ Display loader during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <span className="animate-pulse text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
