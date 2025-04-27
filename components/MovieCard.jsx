'use client';

import Image from 'next/image';

export default function MovieCard({ movie, handleClick }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div 
      onClick={() => handleClick(movie)} 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative w-full aspect-[2/3]">
      <Image
          src={`${imageBaseUrl}${movie.poster_path}`}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw,
                 (max-width: 768px) 33vw,
                 (max-width: 1024px) 25vw,
                 (max-width: 1280px) 20vw,
                 16vw"
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="p-2 text-center">
        <h2 className="text-white text-base font-semibold truncate">{movie.title}</h2>
        <p className="text-gray-400 text-sm mt-1">
          ⭐ {movie.vote_average.toFixed(1)} / 10
        </p>
      </div>
    </div>
  );
}
