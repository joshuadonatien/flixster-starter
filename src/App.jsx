import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import MovieSearchSort from './Components/MovieSearchSort/MovieSearchSort.jsx'; 
import MovieList from './Components/MovieList/MovieList.jsx'; 
import './App.css'; 

/**
 * App Component
 * This is the main component of the Flixter application.
 * It manages the global state related to movie display, including:
 * - Search results and active search mode.
 * - Current sorting criteria (e.g., by popularity, title).
 * - Current genre filter.
 * - List of available genres.
 * It orchestrates data flow by passing state and callback functions to its children.
 */
function App() {
  // --- State Variables ---

  // State to store the movies returned from a search query.
  // This array holds results when a user actively searches for movies.
  const [searchResults, setSearchResults] = useState([]);

  // State to track if the application is currently displaying search results.
  // True when a search has been performed and results are to be shown.
  // False when displaying the default "Now Playing" movies with sorting/filtering.
  const [isSearching, setIsSearching] = useState(false);

  // State to store the actual search query string (e.g., "Matrix").
  // This helps differentiate between an empty search (which reverts to "Now Playing")
  // and a search that yielded no results.
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  // State to store the currently selected sorting criterion for "Now Playing" movies.
  // Defaulted to 'popularity.desc' (most popular first).
  // This value is used directly in TMDb API requests.
  const [sortBy, setSortBy] = useState('popularity.desc');

  // State to store the currently selected genre ID for filtering "Now Playing" movies.
  // Defaulted to '' (empty string), meaning no genre filter is applied ("All Genres").
  // This value is used directly in TMDb API requests.
  const [genre, setGenre] = useState('');

  // State to store the full list of movie genres fetched from TMDb.
  // This array is used to populate the dropdown menu in MovieSearchSort.
  const [genres, setGenres] = useState([]);

  // API Key for TMDb. It attempts to get it from environment variables (Vite_API_KEY)
  // or falls back to a placeholder. Remember to replace 'YOUR_TMDB_API_KEY' with your actual key.
  const apiToken = import.meta.env.VITE_API_KEY || 'YOUR_TMDB_API_KEY';

  // --- useEffect Hook for Initial Data Fetching ---

  /**
   * useEffect to fetch all available movie genres from TMDb.
   * This effect runs only once after the initial render of the App component.
   * It populates the `genres` state, which is then used by the MovieSearchSort component
   * to display the genre filter options.
   *
   * Dependencies: [apiToken] - Ensures it re-runs if apiToken ever changes (though it's typically static).
   */
  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiToken}&language=en-US`
        );
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchAllGenres();
  }, [apiToken]); // Runs once on mount (or if apiToken changes)

  // --- Callback Functions for Child Components ---

  /**
   * handleSearchResults
   * Callback function passed to MovieSearchSort.
   * This function is triggered when a user performs a search (types and submits, or clears the search).
   * It updates the application's search state and fetches search results from TMDb.
   *
   * @param {string} query - The search query string provided by the user.
   
   */
  const handleSearchResults = async (query) => {
    setCurrentSearchQuery(query); // Update the stored search query

    if (query && query.trim() !== '') { // If the query is not empty (a real search)
      setIsSearching(true); // Set app to search mode
      try {
        // Fetch search results from TMDb's search endpoint
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiToken}&query=${encodeURIComponent(query)}&page=1`
        );
        setSearchResults(response.data.results); // Update search results state
      } catch (err) {
        console.error("Error fetching search results:", err);
        setSearchResults([]); // Clear results on error
      }
    } else { // If the query is empty (search was cleared or empty submission)
      setIsSearching(false); // Revert to "Now Playing" mode
      setSearchResults([]); // Clear any previous search results
      setCurrentSearchQuery(''); // Clear the search query string
      // IMPORTANT: Reset sortBy and genre to their defaults when going back to "Now Playing" mode.
      // This ensures the default movie list is displayed correctly after a search is cleared.
      setSortBy('popularity.desc');
      setGenre('');
    }
  };

  /**
   * handleSortChange
   * Callback function passed to MovieSearchSort.
   * Triggered when the user selects a new sorting option from the dropdown.
   * It updates the `sortBy` state and ensures the app is in "Now Playing" mode.
   *
   * @param {Object} e - The event object from the select element.
   *
   */
  const handleSortChange = (e) => {
    setSortBy(e.target.value); // Update the sortBy state with the new value
    // Sorting/filtering applies to the "Now Playing" discover endpoint, not search results.
    if (isSearching) {
      setIsSearching(false); // Exit search mode
      setSearchResults([]); 
      setCurrentSearchQuery(''); 
    }
  };
  /**
   * handleGenreChange
   * Callback function passed to MovieSearchSort.
   * Triggered when the user selects a new genre from the dropdown.
   * It updates the `genre` state and ensures the app is in "Now Playing" mode.
   *
   * @param {Object} e - The event object from the select element.
   *
   */
  const handleGenreChange = (e) => {
    setGenre(e.target.value); // Update the genre state with the new value
    // Similar to sorting, if in search mode, switch back to "Now Playing".
    if (isSearching) {
      setIsSearching(false); // Exit search mode
      setSearchResults([]); // Clear old search results
      setCurrentSearchQuery(''); // Clear old search query
    }
  };

  // --- JSX (UI Rendering) ---

  // src/App.jsx

// ... (existing imports and App function definition) ...

  return (
    <div className="App bg-gray-900 min-h-screen text-white font-inter">
      {/* HEADER SECTION - This remains as your main Flixter title area */}
      <header className="App-header bg-gray-800 p-4 shadow-md rounded-b-lg"> {/* Removed mb-8 from here */}
        <h1 className="text-3xl font-bold text-center text-red-500 mb-4">Flixter</h1>
      </header>

      {/* BANNER SECTION - This new section will contain your search/sort/filter bar */}
      {/* It will visually blend with the header due to MovieSearchSort's own styling */}
      <section className="App-banner-section mb-8"> {/* Added a new class and margin-bottom */}
        <MovieSearchSort
          onSearch={handleSearchResults}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          genre={genre}
          onGenreChange={handleGenreChange}
          genres={genres}
        />
      </section>

      <main className="container mx-auto px-4 py-8 flex-grow"> {/* Added flex-grow here */}
        {isSearching ? (
          <MovieList
            movies={searchResults}
            showLoadMore={false}
            currentSearchQuery={currentSearchQuery}
            sortBy={null}
            genre={null}
          />
        ) : (
          <MovieList
            showLoadMore={true}
            sortBy={sortBy}
            genre={genre}
            currentSearchQuery={null}
          />
        )}
      </main>

      {/* FOOTER SECTION - New footer at the bottom */}
      <footer className="App-footer bg-gray-800 p-4 text-center text-gray-400 text-sm mt-auto"> {/* Added mt-auto */}
        <p>Made by Joshua</p>
      </footer>
    </div>
  );
}

export default App; // Export the App component as the default export