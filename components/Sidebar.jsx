'use client';

import { useContext, useState } from 'react';
import MovieGenres from './MovieGenres';
import { useFavorites } from '@/contexts/FavoriteContext';

export default function Sidebar({ selectedGenres, onGenreToggle, onShowFavorites, onShowAll, onShowProfile }) {
  const { favoritesCount } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <aside
        className={`fixed sm:static z-40 top-0 left-0 h-full sm:h-auto sm:w-1/5 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        } transition-transform duration-300 ease-in-out p-4`}
      >
        {/* Close button for mobile */}
        <div className="flex justify-end sm:hidden">
          <button onClick={() => setIsOpen(false)} className="text-white text-xl">
            ×
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mb-6 flex flex-col gap-4">
          <button onClick={onShowProfile} className="text-left hover:underline">
            My Profile
          </button>
          <button onClick={onShowFavorites} className="text-left hover:underline">
            Your Favorites ({favoritesCount})
          </button>
          <button onClick={onShowAll} className="text-left hover:underline">
            All Movies
          </button>
        </nav>

        {/* Genre Grid */}
        <MovieGenres selectedGenres={selectedGenres} onGenreToggle={onGenreToggle} />
      </aside>
    </>
  );
}
