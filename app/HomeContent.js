'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
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
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const [error, setError] = useState(null);

  const uniqueMovies = useMemo(
    () => Array.from(new Map(movies.map(m => [m.id, m])).values()),
    [movies]
  );

  // When genres or keyword change (and NOT favorites-only), reset & load page 1
  useEffect(() => {
    if (showingFavoritesOnly) return;
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(null);
  }, [selectedGenres, selectedKeyword, showingFavoritesOnly]);  

  // Function for user authorization.
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

  // Helper: discover/movie with filters
  const fetchDiscover = async (page) => {
    const genreQuery = selectedGenres.length
      ? `&with_genres=${selectedGenres.join(',')}`
      : '';
    const keywordQuery = selectedKeyword
      ? `&with_keywords=${selectedKeyword.id}`
      : '';

    const url =
      `https://api.themoviedb.org/3/discover/movie` +
      `?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}` +
      `&page=${page}${genreQuery}${keywordQuery}`;

    const res = await fetch(url);
    const json = await res.json();
    return json;
  };

  // Whenever filters or "favorites only" toggle, reset + fetch page 1
  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(null);
    setError(null);

    const loadFirstPage = async () => {
      setLoading(true);
      try {
        if (showingFavoritesOnly) {
          // load from user favorites
          const favIds = Array.from(favorites);
          const favs = await Promise.all(
            favIds.map(async (id) => {
              const r = await fetch(
                `https://api.themoviedb.org/3/movie/${id}` +
                  `?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
              );
              return r.json();
            })
          );
          setMovies(favs.filter((m) => m && m.id));
        } else {
          // discover / popular
          const data = await fetchDiscover(1);
          setMovies(data.results || []);
          setTotalPages(data.total_pages);
          setCurrentPage(2);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load movies.');
      } finally {
        setLoading(false);
      }
    };

    loadFirstPage();
  }, [selectedGenres, selectedKeyword, showingFavoritesOnly, favorites]);

  // Infinite scroll: fetch next page when you bump currentPage
  useEffect(() => {
    if (showingFavoritesOnly) return;
    if (currentPage === 1 || (totalPages && currentPage > totalPages)) return;

    const loadNext = async () => {
      setLoading(true);
      try {
        const data = await fetchDiscover(currentPage);
        setMovies((prev) => [...prev, ...(data.results || [])]);
        setCurrentPage((p) => p + 1);
      } catch (err) {
        console.error(err);
        setError('Failed to load more movies.');
      } finally {
        setLoading(false);
      }
    };

    loadNext();
  }, [currentPage, totalPages, selectedGenres, selectedKeyword, showingFavoritesOnly]);

  // IntersectionObserver to bump currentPage
  useEffect(() => {
    if (showingFavoritesOnly) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setCurrentPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) obs.observe(loader.current);
    return () => loader.current && obs.unobserve(loader.current);
  }, [loading, showingFavoritesOnly]);
 
  // Function to display the favorites of the admin users.
  const onShowFavorites = async () => {
    if (!user || favorites.size === 0) return;
  
    setLoading(true);
    setShowingFavoritesOnly(true); // Disable genre filters and infinite scroll
  
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
      console.error('[HomeContent] Failed to load favorite movies:', err);
      setError("Failed to load your favorites.");
    } finally {
      setLoading(false);
    }
  };

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

  // “All Movies” resets filters & keyword & leaves infinite scroll on
  const onShowAll = () => {
    setShowingFavoritesOnly(false);
    setSelectedGenres([]);
    setSelectedKeyword(null);
  };

  const handleShowFavorites = () => {
    setShowingFavoritesOnly(true);
  };
    
  return (
    <main className="w-full flex flex-col sm:flex-row bg-gray-900 min-h-screen">
  
      {/* Sidebar navigation */}
       <Sidebar
        selectedGenres={selectedGenres}
        onGenreToggle={setSelectedGenres}
        onShowFavorites={handleShowFavorites}
        onShowAll={onShowAll}
        onShowProfile={() => setShowProfile(true)}
        onKeywordSelect={setSelectedKeyword}
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
            {/* //----- Change #8.c Use this instead ------*/}
              {uniqueMovies.map((movie, idx) => (
                <MovieCard
                  key={`${movie.id}-${idx}`}
                  movie={movie}
                  handleClick={setSelectedMovie}
                />
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