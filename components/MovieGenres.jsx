'use client'

import React from 'react';
import { useEffect, useState } from 'react';

export default function MovieGenres({ onGenreSelect }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fetch genres only once
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await res.json();
        setGenres([{ id: null, name: 'All' }, ...data.genres]);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    // Detect screen width for responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (genreId) => {
    setSelectedGenreId(genreId);
    onGenreSelect(genreId);
  };

  return (
    <div className="w-full px-6 mb-4">
      {isMobile ? (
        <select
          value={selectedGenreId ?? ''}
          onChange={(e) => handleChange(e.target.value || null)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id ?? ''}>
              {genre.name}
            </option>
          ))}
        </select>
      ) : (
        <ul className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2">
          {genres.map((genre) => (
            <li
              key={genre.id}
              onClick={() => handleChange(genre.id)}
              className={`px-4 py-2 rounded-full cursor-pointer text-sm border ${
                selectedGenreId === genre.id
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-gray-200 text-black border-gray-400 hover:bg-gray-300'
              }`}
            >
              {genre.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
