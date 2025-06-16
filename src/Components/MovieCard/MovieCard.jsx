import React from 'react';
import "./MovieCard.css"
// MovieCard: This component is the blueprint for how a single movie should be displayed.
// It receives a 'movie' object as a prop and displays its title, poster, and vote average.
const MovieCard = ({ movie }) => {
  // Base URL for TMDB movie posters. Adjust size as needed (e.g., 'w500', 'original').
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="movie-card-poster"
          // Fallback for broken images
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `https://placehold.co/200x300/e0e0e0/555555?text=No+Poster`; // Placeholder image
          }}
        />
      ) : (
        <div className="movie-card-poster-fallback">
          No Poster Available
        </div>
      )}
      <h2 className="movie-card-title">
        {movie.title}
      </h2>
      <p className="movie-card-vote-average">
        <strong className="movie-card-vote-label">Vote Average:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
      </p>
    </div>
  );
};

export default MovieCard;