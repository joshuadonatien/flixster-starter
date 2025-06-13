import React from 'react';

// MovieCard: This component is the blueprint for how a single movie should be displayed.
// It receives a 'movie' object as a prop and displays its title, poster, and vote average.
const MovieCard = ({ movie }) => {
  // Base URL for TMDB movie posters. Adjust size as needed (e.g., 'w500', 'original').
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className="Movie-Card">
      {movie.poster_path ? (
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="m"
          // Fallback for broken images
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `https://placehold.co/200x300/e0e0e0/555555?text=No+Poster`; // Placeholder image
          }}
        />
      ) : (
        <div className="rounded-lg mb-4 w-full h-auto max-w-xs flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-lg font-semibold" style={{height: '300px'}}>
          No Poster Available
        </div>
      )}
      <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">
        {movie.title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        <strong className="font-semibold">Vote Average:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
      </p>
    </div>
  );
};

export default MovieCard;