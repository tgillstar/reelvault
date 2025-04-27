const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  
  if (!res.ok) {
    // TMDB returned error (like 404)
    console.error("TMDB API Error:", res.status, res.statusText);
    return { results: [], total_pages: 0 };
  }

  const data = await res.json();
  return data;
};
