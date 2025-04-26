import Image from 'next/image';
import { fetchPopularMovies } from '@/lib/tmdb';


export default async function Home() {
  const movies = await fetchPopularMovies();

  return (
    <main className="flex flex-wrap justify-center gap-6 p-8 bg-gray-900 min-h-screen">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-60 transform hover:scale-105 transition"
        >
          {movie.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="w-full h-80 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-2">{movie.title}</h2>
            <p className="text-gray-400 text-sm">Rating: {movie.vote_average}</p>
          </div>
        </div>
      ))}
    </main>
  );
}
