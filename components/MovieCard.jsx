'use client';

import Image from 'next/image';

export default function MovieCard({ movie }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transform transition duration-300">
      <Image
        src={`${imageBaseUrl}${movie.poster_path}`}
        alt={movie.title}
        width={500}
        height={750}
        className="w-full h-auto"
      />
      <div className="p-2 text-center">
        <h2 className="text-white text-lg font-semibold">{movie.title}</h2>
        <p className="text-gray-400 text-sm mt-1">
          ⭐ {movie.vote_average.toFixed(1)} / 10
        </p>
      </div>
    </div>
  );
}
