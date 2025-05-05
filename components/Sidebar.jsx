'use client';

import { useState } from 'react';
import MovieGenres from './MovieGenres';
import { useFavorites } from '@/contexts/FavoriteContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react'; 

export default function Sidebar({ selectedGenres, onGenreToggle, onShowFavorites, onShowAll, onShowProfile }) {
  const { favoritesCount } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const { userDoc } = useAuth();

  const isGuest = userDoc?.isGuest;

  return (
    <>
      {/* Sticky hamburger icon - visible at all times */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-700 text-white rounded shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sticky inner wrapper for full-height sidebar scroll if needed */}
        <div className="flex flex-col h-full p-4 relative overflow-y-auto">

          {/* Close icon */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={20} />
          </button>

          {/* Menu items start below toggle area */}
          <div className="mt-12">
            <nav className="mb-6 flex flex-col gap-4">
              <button onClick={onShowProfile} className="text-left hover:underline">
                My Profile
              </button>
              {userDoc?.isGuest === false && (
                <button onClick={onShowFavorites} className="text-left hover:underline">
                  My Favorites ({favoritesCount})
                </button>
              )}
              <button onClick={onShowAll} className="text-left hover:underline">
                All Movies
              </button>
            </nav>

            {/* Genre Grid */}
            <MovieGenres selectedGenres={selectedGenres} onGenreToggle={onGenreToggle} />
          </div>
        </div>
      </aside>
    </>
  );
}
