import Image from "next/image";

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  const imageBaseUrl = "https://image.tmdb.org/t/p/original"; // Use bigger image

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto p-6">
      <div className="relative bg-gray-600 rounded-lg w-full max-w-6xl overflow-hidden">

        {/* Top Banner Image */}
        <div className="relative h-[60vh] w-full">
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

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-6 text-white text-4xl font-bold z-10">&times;</button>

          {/* Title and Play Button */}
          <div className="absolute bottom-6 left-6 z-10">
            <h2 className="text-white text-5xl font-bold mb-4">{movie.title}</h2>
            <button className="bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200 transition">
              ▶ Play
            </button>
          </div>

          {/* Black overlay to darken background */}
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* Movie Details Section */}
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
      </div>
    </div>
  );
}
