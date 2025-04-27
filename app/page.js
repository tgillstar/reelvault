'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchPopularMovies } from '@/lib/tmdb';
import { MovieCard, MovieModal } from '@/components';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const [error, setError] = useState(null);

  /**
   * Sets up the function to fetch movies dynamically.
   * First try to call TMDB API with the current page number then
   * appends new movies to existing list (doesn’t overwrite!).
   * It also shows "loading" state when fetching.
   */
  const loadMovies = useCallback(async () => {
    if (totalPages && currentPage > totalPages) {
      console.log("All pages loaded, stopping fetch.");
      setLoading(false);
      return;
    }
  
    try {
      const data = await fetchPopularMovies(currentPage);

      //setMovies((prev) => [...prev, ...data.results]);
      setMovies((prev) => {
        const movieMap = new Map();
        
        [...prev, ...data.results].forEach((movie) => {
          movieMap.set(movie.id, movie); // ✅ overwrite duplicates
        });
        
        return Array.from(movieMap.values());
      });
      
      setTotalPages(data.total_pages);
      setCurrentPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, totalPages]);  

  // Trigger loadMovies() when page changes
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  /** 
   * Using IntersectionObserver to trigger page increments for the 
   * infinite scrolling of movies.
   * Watch thr "sentinel" element at bottom of page.
   * If the sentinel is in view and not currently fetching multiple pages then load 
   * the next page of movies.
**/
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMovies();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading]);

  return (
    <main className="w-full flex flex-col items-center gap-6 p-8 bg-gray-900 min-h-screen">

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      <div className="w-full px-6">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} handleClick={setSelectedMovie} />
          ))}
        </div>
      </div>

       {/* Sentinel div that triggers infinite scroll */}
      <div ref={loader} className="h-10" />

      {loading && <p className="text-white">Loading more movies...</p>}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

    </main>
  );
}
