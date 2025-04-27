'use client';

import Image from 'next/image';

export default function MovieCard({ movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-60 transform hover:scale-105 transition">
      {movie.poster_path && (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12P4/w8AAgUBAc1kpJoAAAAASUVORK5CYII="
          className="w-full h-80 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-white text-lg font-semibold mb-2">{movie.title}</h2>
        <p className="text-gray-400 text-sm">Rating: {movie.vote_average}</p>
      </div>
    </div>
  );
}
