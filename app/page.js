'use client'

import React from 'react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchPopularMovies } from '@/lib/tmdb';
import { HeroBanner, MovieCard, MovieModal, MovieGenres } from '@/components';

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
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

      // Filter movies by select genre
      const url = selectedGenre
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${selectedGenre}&page=${currentPage}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}`;

      const res = await fetch(url);
      const data = await res.json();

  
      // Filter movies with a valid image
      const filteredMovies = data.results.filter(
        (movie) => movie.backdrop_path || movie.poster_path
      );
  
      // Deduplicate while merging previous movies + new filtered movies
      setMovies((prev) => {
        const movieMap = new Map();
        
        [...prev, ...filteredMovies].forEach((movie) => {
          movieMap.set(movie.id, movie); // overwrite duplicates based on ID
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
  
  // Use these effects to trigger movie loading and movie genre selection.
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);  

  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(null);
  }, [selectedGenre]);
  

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

  /** 
   * Function to set the featuredMovie in the hero banner.
   * Only pick a movie to be featured after movies have been fetched and set it only once.
  **/
  useEffect(() => {
    if (movies.length > 0 && !featuredMovie) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setFeaturedMovie(movies[randomIndex]);
    }
  }, [movies, featuredMovie]);

  return (
    <main className="w-full flex flex-col items-center gap-6 bg-gray-900 min-h-screen">

      {/* Hero Banner */}
      <div className="w-full mb-8">
        {featuredMovie && (
          <HeroBanner movie={featuredMovie} />
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* Movie Genre selection */}
      <MovieGenres onGenreSelect={setSelectedGenre} />

      {/* Movie Grid */}
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
