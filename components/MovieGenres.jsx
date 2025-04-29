'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react'; // Lightweight React icon set

export default function MovieGenres({ selectedGenres, onGenreToggle }) {
  const [genres, setGenres] = useState([]);
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

  const handleGenreClick = (genreId) => {
    if (genreId === null) {
      onGenreToggle([]); // Clear all genres if 'All' clicked
    } else {
      if (selectedGenres.includes(genreId)) {
        onGenreToggle(selectedGenres.filter((id) => id !== genreId)); // Remove genre
      } else {
        onGenreToggle([...selectedGenres, genreId]); // Add genre
      }
    }
  };

  const handleDropdownChange = (e) => {
    const selectedId = parseInt(e.target.value);
    if (selectedId === -1) {
      onGenreToggle([]);
    } else {
      onGenreToggle([selectedId]); // In mobile, treat it as single selection
    }
  };

  const clearFilters = () => {
    onGenreToggle([]);
  };  

  return (
    <div className="w-full px-6 mb-4">
      {isMobile ? (
         <>
          <select
            multiple
            value={selectedGenres}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
              onGenreToggle(selectedOptions);
            }}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id ?? ''}>
                {genre.name}
              </option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="self-start mt-2 text-sm text-red-500 underline"
          >
            Clear Filters
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-wrap gap-3 pb-2 items-center overflow-x-auto sm:overflow-visible whitespace-nowrap sm:whitespace-normal">
            {genres.map((genre) => (
              <li
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`px-4 py-2 rounded-full cursor-pointer text-sm border ${
                  (genre.id === null && selectedGenres.length === 0) || selectedGenres.includes(genre.id)
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-gray-200 text-black border-gray-400 hover:bg-gray-300'
                }`}
              >
                {genre.name}
              </li>
            ))}

            {selectedGenres.length > 0 && (
              <li>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-gray-400 text-gray-600 hover:bg-gray-200 transition"
                >
                  <X size={16} />
                  Clear
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
