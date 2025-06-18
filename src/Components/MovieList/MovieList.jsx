import React, { useState, useEffect } from "react"; // Removed useRef import
import axios from "axios"; // Import Axios for HTTP requests
import MovieCard from "../MovieCard/MovieCard"; // Import MovieCard component
import MovieModal from "../MovieModal/MovieModal"; // Import MovieModal component
import './MovieList.css'; // Import component-specific styles

/**
 * MovieList Component
 * This component is responsible for displaying a list of movies.
 * It can operate in two modes:
 * 1. "Now Playing" mode: It fetches and paginates movies internally based on sort/genre props.
 * 2. Search results mode: It displays movies passed as a prop from the parent (App.jsx).
 * It also handles opening a modal to show movie details.
 */
const MovieList = ({ movies: externalMovies = [], showLoadMore, currentSearchQuery, sortBy, genre }) => {
    // --- State Variables ---

    // `internalMovies` stores the list of movies fetched when in "Now Playing" mode.
    const [internalMovies, setInternalMovies] = useState([]);

    // `page` tracks the current page number for pagination in "Now Playing" mode.
    const [page, setPage] = useState(1);

    // `hasMoreMovies` indicates if there are more pages of "Now Playing" movies to load.
    const [hasMoreMovies, setHasMoreMovies] = useState(true);

    // `loading` is a boolean flag to indicate if a movie fetch operation is in progress.
    // Used to show loading messages and disable the "Load More" button.
    const [loading, setLoading] = useState(false);

    // `showModal` controls the visibility of the MovieModal.
    const [showModal, setShowModal] = useState(false);

    // `selectedMovie` stores the detailed information of the movie selected for the modal.
    const [selectedMovie, setSelectedMovie] = useState(null);

    // API Key for TMDb.
    const apiToken = import.meta.env.VITE_API_KEY || 'YOUR_TMDB_API_KEY';

    // This variable determines which array of movies is actually rendered.
    // If `showLoadMore` is true (Now Playing mode), we use `internalMovies`.
    // Otherwise (search results mode), we use `externalMovies` passed from App.jsx.
    const moviesToDisplay = showLoadMore ? internalMovies : externalMovies;

    // --- useEffect Hook for "Now Playing" Movie Fetching ---

    /**
     * useEffect to fetch "Now Playing" movies.
     * This effect is triggered when:
     * - The component first mounts (if `showLoadMore` is true).
     * - The `page` state changes (when "Load More" is clicked).
     * - The `sortBy` prop changes.
     * - The `genre` prop changes.
     * - The `showLoadMore` prop changes (e.g., switching from search to Now Playing).
     *
     * Dependencies: [page, showLoadMore, sortBy, genre, apiToken] - Ensures it re-runs when any of these change.
     */
    useEffect(() => {

      if (showLoadMore) {
            const fetchNowPlayingMovies = async () => {
                setLoading(true); 
                try {

                    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiToken}&page=${page}`;

                    if (sortBy) {
                        url += `&sort_by=${sortBy}`;
                    }
                    if (genre) {
                        url += `&with_genres=${genre}`;
                    }

                    
                    const response = await axios.get(url);

                    // Logic for updating internalMovies:
                    // If it's the first page (page === 1), replace the existing movies.
                    // This handles initial load and also resets the list when sortBy/genre changes
                    // (since App.jsx resets `page` to 1 when sortBy/genre changes).
                    if (page === 1) {
                        setInternalMovies(response.data.results);
                        // No explicit page reset here as it's assumed App.jsx sets page to 1
                        // before these props trigger this effect for new sort/genre criteria.
                    } else {
                        // If it's a subsequent page (Load More), append the new results to the existing ones.
                        setInternalMovies(prevMovies => [...prevMovies, ...response.data.results]);
                    }

                    // Update `hasMoreMovies` based on the total pages from the API response.
                    // `response.data.results.length === 0` also handles cases where a filter yields no results.
                    setHasMoreMovies(response.data.page < response.data.total_pages && response.data.results.length > 0);

                } catch (err) {
                    console.error("Error fetching now playing movies:", err);
                    setHasMoreMovies(false); // Disable load more on error
                    if (page === 1) {
                        setInternalMovies([]); // Clear movies on error for initial/new criteria fetch
                    }
                } finally {
                    setLoading(false); // Indicate that loading has finished
                }
            };
            fetchNowPlayingMovies();
        }
    }, [page, showLoadMore, sortBy, genre, apiToken]); // Effect dependencies

    /**
     * handleLoadMore
     * Callback function for the "Load More" button.
     * Increments the `page` state, which in turn triggers the `useEffect`
     * to fetch the next page of "Now Playing" movies.
     * It prevents multiple rapid clicks while loading or if no more movies are available.
     */
    const handleLoadMore = () => {
        if (!loading && hasMoreMovies) { // Only load more if not already loading and more movies exist
            setPage(prevPage => prevPage + 1); // Increment page to trigger useEffect
        }
    };

    /**
     * handleCardClick
     * Callback function for when a MovieCard is clicked.
     * It opens the MovieModal and fetches detailed information (including trailers)
     * for the selected movie.
     *
     * @param {number} movieId - The ID of the clicked movie.
     */
    const handleCardClick = async (movieId) => {
        setShowModal(true); 
        setSelectedMovie(null); 
        try {
            const movieDetailsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiToken}`
            );
            const movieDetails = movieDetailsResponse.data;

            const movieVideosResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiToken}`
            );
            const videos = movieVideosResponse.data.results;

            const trailer = videos.find(
                (vid) => vid.site === "YouTube" && vid.type === "Trailer" && vid.official === true
            );

            const fallbackTrailer = videos.find(
                (vid) => vid.site === "YouTube" && vid.type === "Trailer"
            );

            const trailerUrl = trailer
                ? `https://www.youtube.com/watch?v=${trailer.key}`
                : fallbackTrailer
                ? `https://www.youtube.com/watch?v=${fallbackTrailer.key}`
                : null;

            setSelectedMovie({ ...movieDetails, trailerUrl });

        } catch (err) {
            console.error(`Error fetching movie details/videos for ID ${movieId}:`, err);
            setShowModal(false); // Hide modal on error
        }
    };

    /**
     * handleCloseModal
     * Closes the MovieModal and clears the selected movie details.
     */
    const handleCloseModal = () => {
        setShowModal(false); // Hide the modal
        setSelectedMovie(null); // Clear selected movie details
    };

    // --- JSX (UI Rendering) ---

    return (
        <div className="movie-list">
            {/* Conditional rendering of movie cards or messages */}
            {moviesToDisplay.length > 0 ? (
                // Map through the moviesToDisplay array and render a MovieCard for each movie
                moviesToDisplay.map(m => (
                    <MovieCard
                        key={m.id} // Unique key for React list rendering optimization
                        movie={m} // Pass the entire movie object as prop
                        onClick={() => handleCardClick(m.id)} // Pass callback for card click
                    />
                ))
            ) : (
                // Display messages based on current mode (Now Playing vs. Search) and loading state
                <p className="message-text">
                    {showLoadMore ? // If in "Now Playing" mode
                        (loading ? "Loading now playing movies..." : "No now playing movies to show with current filters/sort.") : // Messages for Now Playing
                        (loading ? "Searching..." : // If in Search mode and loading
                            (externalMovies.length === 0 && currentSearchQuery && currentSearchQuery.trim() !== '') ?
                                "No search results found. Try a different search term." : // No search results for a non-empty query
                                (currentSearchQuery ? "" : "Search for a movie above to get started.") // Initial message or no query
                        )
                    }
                </p>
            )}

            {/* "Load More" section, only shown if in "Now Playing" mode */}
            {showLoadMore && (
                <div className="load-more-section">
                    {loading && <p className="loading-message">Loading more...</p>} {/* Loading indicator */}
                    {hasMoreMovies && !loading && ( // Show button if more movies and not loading
                        <button onClick={handleLoadMore} className="load-more-button">Load More</button>
                    )}
                    {/* Message when all movies are loaded and no more pages */}
                    {!hasMoreMovies && !loading && moviesToDisplay.length > 0 && <p className="no-more-message">You've reached the end of the movies.</p>}
                </div>
            )}

            {/* MovieModal Component */}
            {/* Renders the modal if `showModal` is true */}
            <MovieModal
                show={showModal} // Control modal visibility
                onClose={handleCloseModal} // Callback to close modal
                movie={selectedMovie} // Movie details to display in the modal
            />
        </div>
    );
};

export default MovieList; // Export the component