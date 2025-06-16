// src/Components/MovieCard/MovieCard.jsx
import React from 'react';
import "./MovieCard.css"

// MovieCard now accepts an 'onClick' prop
const MovieCard = ({ movie, onClick }) => { // Added onClick prop
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    // Add onClick handler to the main movie-card div
    <div className="movie-card" onClick={onClick}>
      {movie.poster_path ? (
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="movie-card-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/200x300/e0e0e0/555555?text=No+Poster`;
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