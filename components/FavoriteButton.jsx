'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoriteContext';

export default function FavoriteButton({ movie }) {
  const { user, role } = useAuth();
  const { favorites, addFavorite, removeFavorite, loadingFavorites } = useFavorites();

  const isFavorite = favorites.has(movie.id.toString());

  const toggleFavorite = () => {
    if (!user || role !== 'admin') return;
    if (isFavorite) {
      removeFavorite(movie.id.toString());
    } else {
      addFavorite(movie);
    }
  };

  if (!user || role !== 'admin') return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loadingFavorites}
      className={`absolute top-2 right-2 text-2xl transition-transform duration-200 ${
        isFavorite ? 'text-red-500' : 'text-white/80 hover:text-red-400'
      }`}
      aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
