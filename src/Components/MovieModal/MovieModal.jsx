import React from 'react'; // Import React library
import './MovieModal.css'; // Import component-specific styles

/**
 * MovieModal Component
 * Displays a detailed view of a selected movie in a modal window.
 * Shows movie title, poster, release date, overview, genres, rating, and a trailer link.
 *
 * It controls its visibility based on the `show` prop and handles closing via `onClose` callback.
 */
const MovieModal = ({ show, onClose, movie }) => {
    // If `show` prop is false, the modal should not be rendered, so return null.
    if (!show) {
        return null;
    }

    // Determine the image URL for the modal poster.
    // Uses a larger size (w780) for better detail in the modal view.
    // Fallbacks to a placeholder if the poster path is not available.
    const imageUrl = movie?.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : 'https://via.placeholder.com/300x450?text=No+Image';

    // --- JSX (UI Rendering) ---

    return (
        // Modal overlay: Covers the entire screen, provides a dimmed background.
        // Clicking on the overlay outside the modal content will close the modal.
        <div className="modal-overlay" onClick={onClose}>
            {/* Modal content area: Contains all movie details. */}
            {/* `e.stopPropagation()` prevents clicks on the content from bubbling up to the overlay,
                which would cause the modal to close if clicked inside. */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Conditional rendering: Display movie details if 'movie' prop is available,
                    otherwise show a loading message. */}
                {movie ? (
                    <>
                        {/* Movie Title */}
                        <h2 className="modal-movie-title">{movie.title}</h2>

                        {/* Container for the movie poster image */}
                        <div className="modal-movie-image-container">
                            <img src={imageUrl} alt={movie.title} className="modal-movie-poster" />
                        </div>

                        {/* Section for movie details (textual information) */}
                        <div className="modal-details">
                            <p><strong>Release Date:</strong> {movie.release_date}</p>
                            <p><strong>Overview:</strong> {movie.overview}</p>
                            <p><strong>Runtime:</strong> {movie.runtime}</p>
                            {/* Display genres, joining them with ', ' or 'N/A' if none */}
                            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
                            {/* Display rating, formatted to 2 decimal places */}
                            <p><strong>Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(2) : 'N/A'} ({movie.vote_count} votes)</p>

                            {/* Conditional rendering for the trailer link */}
                            {/* If `movie.trailerUrl` exists, render a clickable "Watch Trailer" link. */}
                            {/* Otherwise, display a "No trailer available." message. */}
                            {movie.trailerUrl ? (
                                <p><a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="modal-trailer-link">Watch Trailer</a></p>
                            ) : (
                                <p className="no-trailer-message">No trailer available.</p>
                            )}
                        </div>
                    </>
                ) : (
                    // Displayed while movie details are being fetched
                    <p className="modal-loading-message">Loading movie details...</p>
                )}

                {/* Close button for the modal, positioned at the bottom center */}
                <button className="modal-close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default MovieModal; // Export the component
