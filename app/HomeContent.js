'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
//import { fetchPopularMovies } from '../lib/tmdb';
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

  //----- Change #8.a Use this  ------
  const uniqueMovies = useMemo(
    () => Array.from(new Map(movies.map(m => [m.id, m])).values()),
    [movies]
  );

  //----- Change #3.a = Comment this out and use fetchPage() ------
  /**
   * Sets up the function to fetch movies dynamically.
   * First try to call TMDB API with the current page number then
   * appends new movies to existing list (doesn’t overwrite!).
   * It also shows "loading" state when fetching.
   */

  /*
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

      const keywordQuery = selectedKeyword
        ? `&with_keywords=${selectedKeyword.id}`
        : '';

      //----Change #1.a = Don't use this ------
      
      //const url = `https://api.themoviedb.org/3/${
        selectedGenres.length > 0 
        ? 'discover/movie' 
        : 'movie/popular'
      }?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}${genreQuery}${keywordQuery}`;
      

      //----Change #1.b = Use this one instead 
      //    Change #2.a = Don't use this version now ------
      //const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}${genreQuery}${keywordQuery}`;

      //    Change #2.b = Use this version ------
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}` +
              genreQuery +
              keywordQuery;

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
  }, [currentPage, totalPages, selectedGenres, selectedKeyword]);
  */

  //----- Change #7.f Don't use this instead fetchDiscover now ------
  //----- Change #3.b = Use this instead of loadMovies() ------
  // Core fetch function for any page + filters
  /*const fetchPage = async (pageNum) => {
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
  }; */

  //----- Change #4.a = Don't use these ------
  /*
    // Use these two effects to trigger movie loading and movie genre selection.
    useEffect(() => {
      loadMovies();
    }, [loadMovies]);  

    useEffect(() => {
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(null);
    }, [selectedGenres, selectedKeyword]);  
  */

  //----- Change #4.b Use this instead ------
  // When genres or keyword change (and NOT favorites-only), reset & load page 1
  useEffect(() => {
    if (showingFavoritesOnly) return;
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(null);
    //fetchPage(1);
  }, [selectedGenres, selectedKeyword, showingFavoritesOnly]);  

  //----- Change #5.a Don't use this observer and use currentPage constant to keep track instead ------
  /** 
   * Using IntersectionObserver to trigger page increments for the 
   * infinite scrolling of movies.
   * Watch thr "sentinel" element at bottom of page.
   * If the sentinel is in view and not currently fetching multiple pages then load 
   * the next page of movies.
  **/
 /*
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
  */

  /** 
   * Function for user authorization.
  **/
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

  //----- Change #7.a Don't use these two effects now ------
  /*
  //----- Change #5.b Use these two effects so that currentPage constant can keep track of infinite scroll ------
  // When currentPage bumps (and NOT favorites-only), load that page
  useEffect(() => {
    if (showingFavoritesOnly) return;
    if (currentPage === 1) return;           // already loaded by filter effect
    if (totalPages && currentPage > totalPages) return;
    fetchPage(currentPage);
  }, [currentPage, showingFavoritesOnly, totalPages]);

  // Infinity scroll: nudge page++ when sentinel comes into view
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
  */

  //----- Change #7.b Use this and the three effects below instead to fix Favorites issue ------
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

  // 1️⃣ Whenever filters or "favorites only" toggle, reset + fetch page 1
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

  // 2️⃣ Infinite scroll: fetch next page when you bump currentPage
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

  // 3️⃣ IntersectionObserver to bump currentPage
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

  /** 
   * Function to display the favorites of the admin users.
  **/
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


  //----- Change #6.a Use this ------
  // “All Movies” resets filters & keyword & leaves infinite scroll on
  const onShowAll = () => {
    setShowingFavoritesOnly(false);
    setSelectedGenres([]);
    setSelectedKeyword(null);
  };

  //----- Change #7.c Add this constant ------
  const handleShowFavorites = () => {
    setShowingFavoritesOnly(true);
  };
    
  return (
    <main className="w-full flex flex-col sm:flex-row bg-gray-900 min-h-screen">
  
      {/* Sidebar navigation */}
      {/* //----- Change #6.b Don't use this ------ */
      /*
      <Sidebar
        selectedGenres={selectedGenres}
        onGenreToggle={setSelectedGenres}
        onShowFavorites={onShowFavorites}
        onShowAll={() => {
          setSelectedGenres([]);         // Restore default genre
          setSelectedKeyword(null);      // Clear selected keyword
          setMovies([]);                 // Clear current movie grid
          setCurrentPage(1);             // Restart pagination
          setTotalPages(null);
          setShowingFavoritesOnly(false);
        }}
        onShowProfile={() => setShowProfile(true)}
        onKeywordSelect={setSelectedKeyword}
      />
      */
      }

      {/* 
      //----- Change #7.d Don't use this ------
      //----- Change #6.c Use this instead ------ 
      <Sidebar
        selectedGenres={selectedGenres}
        onGenreToggle={setSelectedGenres}
        onShowFavorites={onShowFavorites}
        onShowAll={onShowAll}
        onShowProfile={() => setShowProfile(true)}
        onKeywordSelect={setSelectedKeyword}
      />
      */}

      {/* //----- Change #7.e Use this instead ------*/}
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
            {/* //----- Change #8.b Don't use this ------*/}
            {/* 
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} handleClick={setSelectedMovie} />
            ))*/}

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