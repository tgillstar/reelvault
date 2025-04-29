import React from 'react';
import { useState } from "react";
import Image from "next/image";

export default function MovieModal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!movie) return null;

  const imageBaseUrl = "https://image.tmdb.org/t/p/original"; // Use bigger image

  const fetchTrailer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
      const data = await response.json();

      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setTrailerKey(null);
        setError("Trailer not available.");
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setError("Error loading trailer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-6">
      <div className="relative bg-gray-600 rounded-lg w-full max-w-6xl overflow-hidden">

        {/* Top Section */}
        <div className="relative h-[60vh] w-full">
          {/* If trailer is playing */}
          {trailerKey ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube trailer player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            // If loading spinner or fallback image
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  {(movie.backdrop_path || movie.poster_path) ? (
                    <Image
                      rel="preload"
                      src={`${imageBaseUrl}${movie.backdrop_path || movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                  ) : (
                    <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                      <p className="text-white">No Image Available</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-1 right-55 text-white text-4xl font-bold z-10">&times;</button>

          {/* Title and Play Button */}
          {!trailerKey && !isLoading && (
            <div className="absolute bottom-6 left-6 z-10">
              <h2 className="text-white text-5xl font-bold mb-4">{movie.title}</h2>
              <button
                onClick={fetchTrailer}
                className="bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200 transition"
              >
                ▶ Play
              </button>
              {/* If error after trying to load trailer */}
              {error && <p className="text-red-400 mt-2">{error}</p>}
            </div>
          )}

          {/* Black overlay to darken background */}
          {!trailerKey && (
            <div className="absolute inset-0 bg-black/10"></div>
          )}
        </div>

        {/* Movie Details Section */}
        {!trailerKey && !isLoading && (
          <div className="p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400 text-sm mb-6">
              <span>{movie.release_date?.split("-")[0]}</span>
              <span>•</span>
              <span>{Math.round(movie.runtime / 60) || "2"}h {movie.runtime % 60 || "0"}m</span>
              <span>•</span>
              <span>HD</span>
            </div>
            <p className="mb-4 text-gray-300">{movie.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
}
