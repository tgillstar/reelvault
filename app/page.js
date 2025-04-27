'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchPopularMovies } from '@/lib/tmdb';
import { MovieCard } from '@/components';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  /**
   * Sets up the function to fetch movies dynamically.
   * First try to call TMDB API with the current page number then
   * appends new movies to existing list (doesn’t overwrite!).
   * It also shows "loading" state when fetching.
   */
  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPopularMovies(page);
      setMovies((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

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
          setPage((prev) => prev + 1);
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
    <main className="flex flex-col items-center gap-6 p-8 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id + Math.random()} movie={movie} />
        ))}
      </div>

       {/* Sentinel div that triggers infinite scroll */}
      <div ref={loader} className="h-10" />

      {loading && <p className="text-white">Loading more movies...</p>}
    </main>
  );
}
