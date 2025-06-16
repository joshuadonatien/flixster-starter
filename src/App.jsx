import React, { useState } from 'react';
import MovieSearchSort from './Components/MovieSearchSort/MovieSearchSort.jsx';
import MovieList from './Components/MovieList/MovieList.jsx';
import './App.css'; // Assuming you have an App.css for global styles


function App() {
  // State to store the movies returned from a search query.
  const [searchResults, setSearchResults] = useState([]);
  // State to track if the application is currently displaying search results.
  // True when a search has been performed and results are to be shown.
  // False when displaying the default "Now Playing" movies.
  const [isSearching, setIsSearching] = useState(false);
  // State to store the actual search query to differentiate between
  // an empty search (which should go back to "Now Playing") and no results found.
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  /**
   * handleSearchResults
   * This callback function is passed to MovieSearchSort.
   * It's called when a search is performed, receiving the results array.
   * It updates the searchResults state and sets the application to "searching" mode.
   * @param {Array} results - An array of movie objects from the search API.
   * @param {string} query - The search query that yielded these results.
   */
  const handleSearchResults = (results, query) => {
    setSearchResults(results); // Update the search results state
    setCurrentSearchQuery(query); // Store the current search query

    // Set isSearching to true if there's a non-empty query.
    // If the query is empty (e.g., search cleared), revert to "Now Playing" mode.
    if (query && query.trim() !== '') {
      setIsSearching(true);
    } else {
      setIsSearching(false); // Go back to "Now Playing" if search query is empty
    }
  };

  return (
    <div className="App bg-gray-900 min-h-screen text-white font-inter">
      <header className="App-header bg-gray-800 p-4 shadow-md rounded-b-lg mb-8">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-4">Flixter</h1>
        {/*
          MovieSearchSort component:
          It takes a callback 'onSearch' which will be triggered when a search is submitted.
          The callback will receive the search results and the query.
        */}
        <MovieSearchSort onSearch={handleSearchResults} />
      </header>
      <main className="container mx-auto px-4 py-8">
        {/*
          MovieList component:
          It conditionally receives props based on whether the app is in search mode or not.

          If isSearching is true:
          - 'movies' prop is set to 'searchResults'.
          - 'showLoadMore' is set to false (because search results are not paginated via "Load More").

          If isSearching is false:
          - 'movies' prop is not passed (or defaults to empty array in MovieList).
          - 'showLoadMore' is set to true (Movie List will fetch its own "Now Playing" with pagination).
        */}
        {isSearching ? (
          <MovieList
            movies={searchResults}
            showLoadMore={false}
            // Pass the current search query to MovieList for displaying "No results" message
            currentSearchQuery={currentSearchQuery}
          />
        ) : (
          <MovieList
            showLoadMore={true}
          />
        )}
      </main>
    </div>
  );
}

export default App;