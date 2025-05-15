'use client';

import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import {
  HeroBanner,
  Sidebar,
  MovieCard,
  MovieModal,
  ProfileModal
} from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoriteContext';

export default function HomeContent() {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const [userDoc, setUserDoc] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loader = useRef(null);

  // Fetch the user's Firestore doc (to know guest vs admin)
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        setUserDoc(snap.exists() ? snap.data() : null);
      } catch (err) {
        console.error('[HomeContent] Failed to fetch userDoc:', err);
        setUserDoc(null);
      }
    })();
  }, [user]);

  // Core fetch function for any page + filters
  const fetchPage = async (pageNum) => {
    setLoading(true);
    try {
      const genreQuery = selectedGenres.length
        ? `&with_genres=${selectedGenres.join(',')}`
        : '';
      const keywordQuery = selectedKeyword
        ? `&with_keywords=${selectedKeyword.id}`
        : '';

      const url = `https://api.themoviedb.org/3/discover/movie` +
        `?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}` +
        `&page=${pageNum}${genreQuery}${keywordQuery}`;

      console.log('[fetchPage] fetching:', url);
      const res = await fetch(url);
      const data = await res.json();

      const valid = data.results.filter(
        (m) => m.backdrop_path || m.poster_path
      );

      setTotalPages(data.total_pages);

      if (pageNum === 1) {
        setMovies(valid);
        // pick a hero if none yet
        if (valid.length && !featuredMovie) {
          setFeaturedMovie(valid[Math.floor(Math.random() * valid.length)]);
        }
      } else {
        // Deduplicate while merging previous movies + new filtered movies
        setMovies((prev) => {
          const map = new Map();
          [...prev, ...valid].forEach((m) => map.set(m.id, m));
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.error('[fetchPage] error:', err);
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  // When genres or keyword change (and NOT favorites-only), reset & load page 1
  useEffect(() => {
    if (showingFavoritesOnly) return;
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(null);
    fetchPage(1);
  }, [selectedGenres, selectedKeyword, showingFavoritesOnly]);

  // When currentPage bumps (and NOT favorites-only), load that page
  useEffect(() => {
    if (showingFavoritesOnly) return;
    if (currentPage === 1) return;           // already loaded by filter effect
    if (totalPages && currentPage > totalPages) return;
    fetchPage(currentPage);
  }, [currentPage, showingFavoritesOnly, totalPages]);

  /** 
   * Using IntersectionObserver to trigger page increments for the 
   * infinite scrolling of movies.
   * Nudge page++ when sentinel comes into view.
  **/
  useEffect(() => {
    if (showingFavoritesOnly) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          if (!totalPages || currentPage < totalPages) {
            setCurrentPage((p) => p + 1);
          }
        }
      },
      { threshold: 1 }
    );
    if (loader.current) obs.observe(loader.current);
    return () => {
      if (loader.current) obs.unobserve(loader.current);
    };
  }, [loading, showingFavoritesOnly, totalPages, currentPage]);

  // Favorites-only view
  const onShowFavorites = async () => {
    if (!user || !favorites.size) return;
    setShowingFavoritesOnly(true);
    setLoading(true);
    try {
      const favIds = Array.from(favorites);
      const favMovies = [];
      for (let id of favIds) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}` +
          `?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const m = await res.json();
        if (m.id) favMovies.push(m);
      }
      setMovies(favMovies);
    } catch (err) {
      console.error('[HomeContent] Failed to load favorites:', err);
      setError('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  // “All Movies” resets filters & keyword & leaves infinite scroll on
  const onShowAll = () => {
    setSelectedGenres([]);
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(null);
    setShowingFavoritesOnly(false);
    setSelectedKeyword(null);
  };

  return (
    <main className="w-full flex flex-col sm:flex-row bg-gray-900 min-h-screen">

      {/* Sidebar navigation */}
      <Sidebar
        selectedGenres={selectedGenres}
        onGenreToggle={setSelectedGenres}
        onShowFavorites={onShowFavorites}
        onShowAll={onShowAll}
        onShowProfile={() => setShowProfile(true)}
        onKeywordSelect={setSelectedKeyword}
      />

      <div className="flex-1 flex flex-col items-center gap-6">
        {featuredMovie && (
          <div className="w-full mb-8">
            <HeroBanner movie={featuredMovie} />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        <div className="w-full px-6">
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7">
            {movies.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                handleClick={setSelectedMovie}
              />
            ))}
          </div>
        </div>

        <div ref={loader} className="h-10" />
        {loading && <p className="text-white">Loading more movies...</p>}

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}

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
