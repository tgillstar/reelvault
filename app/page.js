import { fetchPopularMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';

export default async function Home() {
  const movies = await fetchPopularMovies();

  return (
    <main className="flex flex-wrap justify-center gap-6 p-8 bg-gray-900 min-h-screen">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </main>
  );
}
