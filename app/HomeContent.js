'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { fetchPopularMovies } from '../lib/tmdb';
import { HeroBanner, Sidebar, MovieCard, MovieModal, ProfileModal } from '../components';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoriteContext';

export default function HomeContent() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();
  const [userDoc, setUserDoc] = useState(null);
  const { favorites } = useFavorites();
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
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

      setLoading(true);

      // Filter movies by select genre
      const genreQuery = selectedGenres.length > 0
        ? `&with_genres=${selectedGenres.join(',')}`
        : '';

      const url = `https://api.themoviedb.org/3/${
        selectedGenres.length > 0 ? 'discover/movie' : 'movie/popular'
      }?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}${genreQuery}`;

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
  }, [selectedGenres]);
  
  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!user) return;
  
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
  
        if (snap.exists()) {
          setUserDoc(snap.data());
        } else {
          console.warn('[HomeContent] No user document found');
          setUserDoc(null);
        }
      } catch (err) {
        console.error('[HomeContent] Failed to fetch userDoc:', err);
        setUserDoc(null);
      }
    };
  
    fetchUserDoc();
  }, [user]);  

  /** 
   * Using IntersectionObserver to trigger page increments for the 
   * infinite scrolling of movies.
   * Watch thr "sentinel" element at bottom of page.
   * If the sentinel is in view and not currently fetching multiple pages then load 
   * the next page of movies.
**/
useEffect(() => {
  if (showingFavoritesOnly) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMovies();
      }
    },
    { threshold: 1 }
  );

  if (loader.current) observer.observe(loader.current);

  return () => {
    if (loader.current) observer.unobserve(loader.current);
  };
}, [loading, showingFavoritesOnly]); 

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

  const onShowFavorites = async () => {
    if (!user || favorites.size === 0) return;
  
    setLoading(true);
    setShowingFavoritesOnly(true); // 🔒 Disable genre filters and infinite scroll
  
    try {
      const favIds = Array.from(favorites);
      const favMovies = [];
  
      for (const id of favIds) {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const movie = await res.json();
        if (movie && movie.id) favMovies.push(movie);
      }
  
      setMovies(favMovies);
    } catch (err) {
      console.error('[HomeContent] ❌ Failed to load favorite movies:', err);
      setError("Failed to load your favorites.");
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <main className="w-full flex flex-col sm:flex-row bg-gray-900 min-h-screen">
  
      {/* Sidebar navigation */}
      <Sidebar
        selectedGenres={selectedGenres}
        onGenreToggle={setSelectedGenres}
        onShowFavorites={onShowFavorites}
        onShowAll={() => {
          setSelectedGenres([]);         // Restore default genre
          setMovies([]);                 // Clear current movie grid
          setCurrentPage(1);             // Restart pagination
          setTotalPages(null);
          setShowingFavoritesOnly(false);
        }}
        onShowProfile={() => setShowProfile(true)}
      />
  
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center gap-6">
  
        {/* Hero Banner */}
        <div className="w-full mb-8">
          {featuredMovie && <HeroBanner movie={featuredMovie} />}
        </div>
  
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
  
        {/* Movie Grid */}
        <div className="w-full px-6">
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
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
  
        {/* Profile Modal */}
        {showProfile && (
          <ProfileModal
            user={user}
            userDoc={userDoc}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </main>
  );  
}