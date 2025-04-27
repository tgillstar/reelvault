export default function MovieModal({ movie, onClose }) {
    if (!movie) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
          <h2 className="text-white text-2xl mb-4">{movie.title}</h2>
          <p className="text-gray-300 mb-2">{movie.overview}</p>
          <p className="text-gray-400 text-sm">Release Date: {movie.release_date}</p>
          <p className="text-gray-400 text-sm">Rating: ⭐ {movie.vote_average.toFixed(1)} / 10</p>
        </div>
      </div>
    );
  }
  