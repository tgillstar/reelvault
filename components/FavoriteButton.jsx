'use client';

import { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

export default function FavoriteButton({ movie }) {
  const { user, role } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid || role !== 'admin') {
      console.log('Skipping checkFavorite: No UID or not admin');
      return;
    }

    const checkFavorite = async () => {
      try {
        const ref = doc(db, 'users', uid, 'favorites', movie.id.toString());
        console.log(`🔍 Checking if movie ${movie.id} is a favorite for UID ${uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          console.log(`✅ Movie ${movie.id} is already a favorite`);
        } else {
          console.log(`🆕 Movie ${movie.id} is not yet a favorite`);
        }

        setIsFavorite(snap.exists());
      } catch (err) {
        console.error('❌ Error checking favorite status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkFavorite();
  }, [uid, movie.id, role]);

  const toggleFavorite = async () => {
    if (!uid || role !== 'admin') {
      console.log('⛔️ Toggle skipped: not logged in or not admin');
      return;
    }

    const ref = doc(db, 'users', uid, 'favorites', movie.id.toString());

    try {
      if (isFavorite) {
        console.log(`🗑 Removing movie ${movie.id} from favorites`);
        await deleteDoc(ref);
        console.log('✅ Successfully removed');
      } else {
        console.log(`💾 Adding movie ${movie.id} to favorites`);
        await setDoc(ref, {
          ...movie,
          addedAt: Date.now(),
        });
        console.log('✅ Successfully added');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('❌ Error toggling favorite:', err);
    }
  };

  if (!user || role !== 'admin') {
    console.log('🔒 FavoriteButton hidden: No user or not admin');
    return null;
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`absolute top-2 right-2 text-2xl transition-transform duration-200 ${
        isFavorite ? 'text-red-500' : 'text-white/80 hover:text-red-400'
      }`}
      aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
