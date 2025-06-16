import React, { useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import './MovieSearchSort.css'

const apiToken = import.meta.env.VITE_API_KEY

function MovieSearchSort() {
    const [searchQuery, setSearchQuery] = useState ('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const[movies, setMovies] = useState([]);
    // Define onSearchResults within this component's scope
  const onSearchResults = (results) => {
    // This function will handle the search results,
    // e.g., update a state variable in MovieSearchSort,
    // or pass them to another child component
    setMovies(results); // <--- Key change: Update state
    console.log("Search results received and set to state:", results);
    // You would typically set a state here to display the results
    // For example: setMovies(results);
  };


    const handleSearchChange = (event) => {
    // 'event.target.value' gives you the current value of the input field
    setSearchQuery(event.target.value);
    console.log("Current search term:", event.target.value);
    // You might also trigger a search API call here based on the new value
  };
    
    const handleClearSearch = (event) =>{
        setSearchQuery('');
    }
    const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior (page reload)
    setLoading(true);
    setError(null);
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiToken}&query=${encodedQuery}&language=en-US`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Pass the results back up to the parent component
      // The `results` array will contain movie objects if found, or be empty.
      console.log(data);
      onSearchResults(data.results || []);

    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again later.");
      onSearchResults([]); // Clear previous results on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a movie..."
      />
      <button type="submit">Search</button>
        <button type="button" onClick={handleClearSearch}>Clear</button>
      </form>
{/* Loading and Error Message Section */}
      {loading && <p className="">Loading movies...</p>}
      {error && <p className="">{error}</p>}

      {/* Movie Results Display Section */}
      <div className="">
        {/* Check if there are movies in the 'movies' state array */}
        {movies.length > 0 ? (
          // Map over the 'movies' array to render a MovieCard for each movie
          movies.map(movie => (
            // The 'key' prop is essential for list rendering in React
            // The 'movie' prop passes the individual movie object to MovieCard
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          // Display a message if no movies are found, and we're not loading, not in an error state, and a search query exists
          !loading && !error && searchQuery && (
            <p className="">No movies found for "{searchQuery}".</p>
          )
        )}
        {/* Display a prompt if no search has been performed yet */}
        {!searchQuery && !loading && !error && movies.length === 0 && (
            <p className="">Start by searching for a movie!</p>
        )}
      </div>
      </div>
  );
}
 
  export default MovieSearchSort;