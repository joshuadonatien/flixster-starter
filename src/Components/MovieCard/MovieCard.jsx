import React from 'react';
import './MovieCard.css'; // Make sure this CSS file exists and is linked

const MovieCard = ({ movie, onClick }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image'; // Adjusted placeholder size

    return (
        // movie-card-wrapper will be the grid item, handling overall card appearance and click
        <div className="movie-card-wrapper" onClick={onClick}>
            {/* Image container to ensure consistent image size and overflow handling */}
            <div className="movie-card-image-container">
                <img src={imageUrl} alt={movie.title} />
            </div>
            {/* The white info box below the image */}
            <div className="movie-card-info-box">
                <h3 className="movie-title">{movie.title}</h3>
                {/* Displaying the rating with fixed decimal places */}
                <p className="movie-rating">Rating: {movie.vote_average ? movie.vote_average.toFixed(3) : 'N/A'}</p>
            </div>
        </div>
    );
};

export default MovieCard;