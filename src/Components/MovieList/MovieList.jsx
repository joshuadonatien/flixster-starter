import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MovieCard from "../MovieCard/MovieCard";
import MovieModal from "../MovieModal/MovieModal";
import './MovieList.css'; // Ensure you have this CSS file

// MovieList now accepts 'movies' prop (for search results) and 'showLoadMore' prop
const MovieList = ({ movies: externalMovies = [], showLoadMore, currentSearchQuery, sortBy, genre }) => {
    const [internalMovies, setInternalMovies] = useState([]); // Movies fetched internally (Now Playing)
    const [page, setPage] = useState(1); // Current page for internal fetching
    const [hasMoreMovies, setHasMoreMovies] = useState(true); // For "Now Playing" pagination
    const [loading, setLoading] = useState(false); // Loading state for internal fetches
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [selectedMovie, setSelectedMovie] = useState(null); // Movie for the modal

    const apiToken = import.meta.env.VITE_API_KEY || 'YOUR_TMDB_API_KEY';

    // Ref to track if sortBy or genre has genuinely changed to trigger a reset
    const prevSortByRef = useRef(sortBy);
    const prevGenreRef = useRef(genre);

    // This variable determines which movie array is rendered
    const moviesToDisplay = showLoadMore ? internalMovies : externalMovies;

    // Effect to fetch "Now Playing" movies
    useEffect(() => {
        // Only run this effect if in "Now Playing" mode
        if (showLoadMore) {
            const fetchNowPlayingMovies = async () => {
                setLoading(true); // Set loading true when starting fetch
                try {
                    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiToken}&page=${page}`;

                    if (sortBy) {
                        url += `&sort_by=${sortBy}`;
                    }
                    if (genre) {
                        url += `&with_genres=${genre}`;
                    }

                    const response = await axios.get(url);

                    // If sort/genre changed, or it's the first page (new criteria or initial load)
                    const isNewCriteria = (sortBy !== prevSortByRef.current || genre !== prevGenreRef.current);

                    if (page === 1 || isNewCriteria) {
                        setInternalMovies(response.data.results); // Replace for first page or new criteria
                        setPage(1); // Ensure page is reset for new criteria
                        prevSortByRef.current = sortBy; // Update refs
                        prevGenreRef.current = genre;
                    } else {
                        setInternalMovies(prevMovies => [...prevMovies, ...response.data.results]); // Append for subsequent pages
                    }

                    // Determine if there are more pages
                    setHasMoreMovies(response.data.page < response.data.total_pages && response.data.results.length > 0);

                } catch (err) {
                    console.error("Error fetching now playing movies:", err);
                    setHasMoreMovies(false); // Disable load more on error
                    if (page === 1) { // Clear movies on error for initial/new criteria fetch
                        setInternalMovies([]);
                    }
                } finally {
                    setLoading(false); // Set loading false after fetch completes
                }
            };
            fetchNowPlayingMovies();
        }
        // Dependencies: re-run when 'page', 'showLoadMore', 'sortBy', or 'genre' changes
    }, [page, showLoadMore, sortBy, genre, apiToken]);

    // This useEffect handles resetting the page/movies when sortBy/genre changes in App.jsx
    // and showLoadMore is true, ensuring a fresh fetch from page 1.
    useEffect(() => {
        if (showLoadMore && (sortBy !== prevSortByRef.current || genre !== prevGenreRef.current)) {
            // Only reset if a change in sort/genre is detected that wasn't initiated by load more
            // and we are in "Now Playing" mode.
            if (page !== 1) { // If not already on page 1, reset it
                setPage(1);
            } else { // If already on page 1, trigger the fetch immediately as useEffect dependency won't fire for page=1 changing to page=1
                 // We don't need to manually trigger fetch here, as the main useEffect for [page, sortBy, genre] will handle it
                 // once page is set to 1. The `isNewCriteria` in the main effect will handle the replacement logic.
                 // This block is mostly for ensuring the visual state (clearing movies) before the fetch happens.
                 setInternalMovies([]); // Clear movies for visual feedback
            }
        }
    }, [sortBy, genre, showLoadMore, page]);


    // Handler for "Load More" button
    const handleLoadMore = () => {
        if (!loading && hasMoreMovies) {
            setPage(prevPage => prevPage + 1); // Increment page to trigger useEffect
        }
    };

    // Handler for clicking a MovieCard to show modal
    const handleCardClick = async (movieId) => {
        setShowModal(true);
        setSelectedMovie(null); // Clear previous movie while loading new one
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiToken}`
            );
            setSelectedMovie(data); // Set the full movie details
        } catch (err) {
            console.error(`Error fetching movie details for ID ${movieId}:`, err);
            setShowModal(false); // Close modal or handle error display
        }
    };

    // Handler for closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMovie(null); // Clear selected movie when closing
    };

    return (
        <div className="movie-list">
            {moviesToDisplay.length > 0 ? (
                moviesToDisplay.map(m => (
                    <MovieCard
                        key={m.id}
                        movie={m} // Pass the entire movie object
                        onClick={() => handleCardClick(m.id)} // Pass the movie ID
                    />
                ))
            ) : (
                // Conditional message based on mode and state
                <p className="message-text">
                    {showLoadMore ?
                        (loading ? "Loading now playing movies..." : "No now playing movies to show with current filters/sort.") :
                        (loading ? "Searching..." : (externalMovies.length === 0 && currentSearchQuery && currentSearchQuery.trim() !== '') ? "No search results found. Try a different search term." : (currentSearchQuery ? "" : "Search for a movie above to get started."))
                    }
                </p>
            )}

            {/* The "Load More" button and its messages - only shown if showLoadMore is true */}
            {showLoadMore && (
                <div className="load-more-section">
                    {loading && <p className="loading-message">Loading more...</p>}
                    {hasMoreMovies && !loading && (
                        <button onClick={handleLoadMore} className="load-more-button">Load More</button>
                    )}
                    {!hasMoreMovies && !loading && moviesToDisplay.length > 0 && <p className="no-more-message">You've reached the end of the movies.</p>}
                </div>
            )}

            {/* MovieModal component */}
            <MovieModal
                show={showModal}
                onClose={handleCloseModal}
                movie={selectedMovie}
            />
        </div>
    );
};

export default MovieList;
