'use client';

import Image from 'next/image';

export default function MovieCard({ movie, handleClick }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';

  return (
    <div 
      onClick={() => handleClick(movie)} 
      className="relative bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer group"
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

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white transition-opacity duration-300">
        <h2 className="text-lg font-bold mb-2 text-center px-2">{movie.title}</h2>
        <p className="text-sm flex items-center gap-2">
          ⭐ {movie.vote_average?.toFixed(1) || 'N/A'} • {releaseYear}
        </p>
      </div>
    </div>
  );
}
