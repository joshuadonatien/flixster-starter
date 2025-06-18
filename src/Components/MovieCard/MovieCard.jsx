import React from 'react'; // Import React library
import './MovieCard.css'; // Import component-specific styles

/**
 * MovieCard Component
 * Renders a single movie card in the grid.
 * Displays the movie poster, title, and rating.
 * Handles click events to open the movie details modal.
 */
const MovieCard = ({ movie, onClick }) => {
    // Construct the URL for the movie poster.
    // If `movie.poster_path` is available, use TMDb's image URL.
    // Otherwise, use a placeholder image URL.
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // TMDb image base URL + poster path
        : 'https://via.placeholder.com/180x270?text=No+Image'; // Placeholder for missing images

    // --- JSX (UI Rendering) ---

    return (
        // The main container for the movie card.
        // `onClick` prop makes the entire card clickable to open the modal.
        <div className="movie-card-wrapper" onClick={onClick}>
            {/* Container specifically for the movie poster image */}
            <div className="movie-card-image-container">
                <img src={imageUrl} alt={movie.title} /> {/* Movie poster image */}
            </div>
            {/* Container for the movie title and rating (the white box below the image) */}
            <div className="movie-card-info-box">
                {/* Movie Title: Uses an h3 tag for semantic heading */}
                <h3 className="movie-title">{movie.title}</h3>
                {/* Movie Rating: Displays "Rating: X.XXX" or "N/A" if rating is missing */}
                {/* `toFixed(3)` formats the number to 3 decimal places for consistency */}
                <p className="movie-rating">Rating: {movie.vote_average ? movie.vote_average.toFixed(3) : 'N/A'}</p>
            </div>
        </div>
    );
};

export default MovieCard; // Export the component