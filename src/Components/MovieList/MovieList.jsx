// src/Components/MovieList/MovieList.jsx
import React,{useState, useEffect} from "react";
import axios from "axios";
import MovieCard from "../MovieCard/MovieCard";
import MovieModal from "../MovieModal/MovieModal";
import './MovieList.css'; // Ensure you have this CSS file

// MovieList now accepts 'movies' prop (for search results) and 'showLoadMore' prop
const MovieList = ({ movies: externalMovies = [], showLoadMore }) => {
  const [internalMovies,setInternalMovies] = useState([]) // Movies fetched internally (Now Playing)
  const [page,setPage] = useState(1) // Current page for internal fetching
  const [hasMoreMovies,setHasMoreMovies] = useState(true) // For "Now Playing" pagination
  const [loading,setLoading] = useState(false); // Loading state for internal fetches
  const [showModal,setShowModal] = useState(false); // Modal visibility
  const [selectedMovie,setSelectedMovie] = useState(null); // Movie for the modal

  const apiToken = import.meta.env.VITE_API_KEY;

  // This variable determines which movie array is rendered
  const moviesToDisplay = showLoadMore ? internalMovies : externalMovies;
  
  // Effect to fetch "Now Playing" movies
  useEffect(() => {
    // Only run this effect if in "Now Playing" mode
    if (showLoadMore) {
        const fetchNowPlayingMovies = async () => {
            setLoading(true); // Set loading true when starting fetch
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${apiToken}&page=${page}`
                );

                if (page === 1) {
                    setInternalMovies(response.data.results); // Replace for first page
                } else {
                    setInternalMovies(prevMovies => [...prevMovies, ...response.data.results]); // Append for subsequent pages
                }
                
                // Determine if there are more pages
                if (response.data.page >= response.data.total_pages || response.data.results.length === 0) {
                    setHasMoreMovies(false);
                } else {
                    setHasMoreMovies(true);
                }
            } catch (err) {
                console.error("Error fetching now playing movies:", err);
                setHasMoreMovies(false); // Disable load more on error
            } finally {
                setLoading(false); // Set loading false after fetch completes
            }
        };
        fetchNowPlayingMovies();
    }
    // Dependencies: re-run when 'page' or 'showLoadMore' changes
  }, [page, showLoadMore, apiToken]);

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
  }

  // Handler for closing the modal
  const handleCloseModal = () => { // Renamed from handleClose to avoid potential confusion
    setShowModal(false);
    setSelectedMovie(null); // Clear selected movie when closing
  }

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
        <p>
            {showLoadMore ?
                (loading ? "Loading now playing movies..." : "No now playing movies to show.") :
                (loading ? "Searching..." : (externalMovies.length === 0 && !loading) ? "No search results found. Try a different search term." : "Search for a movie above.")
            }
        </p>
      )}

      {/* The "Load More" button and its messages - only shown if showLoadMore is true */}
      {showLoadMore && (
        <div className="load-more-section">
          {loading && <p>Loading more...</p>}
          {hasMoreMovies && !loading && (
            <button onClick={handleLoadMore}>Load More</button>
          )}
          {!hasMoreMovies && !loading && <p>No more movies to show.</p>}
        </div>
      )}

      {/* MovieModal component */}
      <MovieModal
        show={showModal}
        onClose={handleCloseModal} // Use the renamed handler
        movie={selectedMovie}
      />
    </div>
  );
};

export default MovieList;