'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firestore';
import { doc, getDocs, collection, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const { user, role } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || role !== 'admin') {
        console.log('[FavoriteContext] Skipping fetch: no user or not admin');
        setFavorites(new Set());
        setLoadingFavorites(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'favorites'));
        const favIds = new Set();
        snapshot.forEach(doc => favIds.add(doc.id));
        console.log('[FavoriteContext] ✅ Favorites loaded:', favIds);
        setFavorites(favIds);
      } catch (err) {
        console.error('[FavoriteContext] ❌ Failed to fetch favorites:', err);
        setFavorites(new Set());
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [user, role]);

  const addFavorite = async (movie) => {
    if (!user || role !== 'admin') return;

    try {
      const ref = doc(db, 'users', user.uid, 'favorites', movie.id.toString());
      await setDoc(ref, {
        ...movie,
        addedAt: Date.now()
      });
      setFavorites(prev => new Set(prev).add(movie.id.toString()));
      console.log(`[FavoriteContext] ➕ Added favorite: ${movie.id}`);
    } catch (err) {
      console.error('[FavoriteContext] ❌ Failed to add favorite:', err);
    }
  };

  const removeFavorite = async (movieId) => {
    if (!user || role !== 'admin') return;

    try {
      const ref = doc(db, 'users', user.uid, 'favorites', movieId.toString());
      await deleteDoc(ref);
      setFavorites(prev => {
        const updated = new Set(prev);
        updated.delete(movieId.toString());
        return updated;
      });
      console.log(`[FavoriteContext] ❌ Removed favorite: ${movieId}`);
    } catch (err) {
      console.error('[FavoriteContext] ❌ Failed to remove favorite:', err);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        loadingFavorites,
        favoritesArray: Array.from(favorites),
        favoritesCount: favorites.size || 0,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

// Safe custom hook with error guard
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
