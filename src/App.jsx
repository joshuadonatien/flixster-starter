import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import MovieSearchSort from './Components/MovieSearchSort/MovieSearchSort.jsx';
import MovieList from './Components/MovieList/MovieList.jsx';
import './App.css'; // Assuming you have an App.css for global styles

function App() {
    // Existing states
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentSearchQuery, setCurrentSearchQuery] = useState('');

    // New states for Sorting and Filtering
    const [sortBy, setSortBy] = useState('popularity.desc'); // Default sort by popularity
    const [genre, setGenre] = useState(''); // Selected genre ID
    const [genres, setGenres] = useState([]); // List of all genres

    // API Key (centralize it, assuming VITE_API_KEY is available)
    // IMPORTANT: Replace 'YOUR_TMDB_API_KEY' with your actual TMDb API key.
    // If you're using Vite, ensure VITE_API_KEY is correctly set in a .env file.
    const apiToken = import.meta.env.VITE_API_KEY || 'YOUR_TMDB_API_KEY';

    // Function to fetch genres once on component mount
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
    }, [apiToken]); // Depend on apiToken, though it's likely static

    // Handle search results from MovieSearchSort
    const handleSearchResults = useCallback(async (query) => {
        // When a search is performed (or cleared)
        setCurrentSearchQuery(query);

        if (query && query.trim() !== '') {
            setIsSearching(true);
            // App.jsx fetches search results to control the lifecycle
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/search/movie?api_key=${apiToken}&query=${encodeURIComponent(query)}&page=1`
                );
                setSearchResults(response.data.results);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setSearchResults([]);
            }
        } else {
            // If query is empty, go back to "Now Playing" mode
            setIsSearching(false);
            setSearchResults([]); // Clear previous search results
            setCurrentSearchQuery(''); // Clear search query
            // Reset sort and genre when going back to "Now Playing" mode to default state
            setSortBy('popularity.desc');
            setGenre('');
        }
    }, [apiToken]);


    // Handlers for sort and genre changes in MovieSearchSort
    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
        // When sort or filter changes, switch to "Now Playing" mode
        // if we were previously searching, or simply apply to "Now Playing".
        if (isSearching) {
            setIsSearching(false);
            setSearchResults([]); // Clear search results
            setCurrentSearchQuery(''); // Clear search query
        }
    }, [isSearching]);

    const handleGenreChange = useCallback((e) => {
        setGenre(e.target.value);
        if (isSearching) {
            setIsSearching(false);
            setSearchResults([]); // Clear search results
            setCurrentSearchQuery(''); // Clear search query
        }
    }, [isSearching]);

    return (
        <div className="App bg-gray-900 min-h-screen text-white font-inter">
            <header className="App-header bg-gray-800 p-4 shadow-md rounded-b-lg mb-8">
                <h1 className="text-3xl font-bold text-center text-red-500 mb-4">Flixter</h1>
                <MovieSearchSort
                    onSearch={handleSearchResults}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    genre={genre}
                    onGenreChange={handleGenreChange}
                    genres={genres}
                />
            </header>
            <main className="container mx-auto px-4 py-8">
                {isSearching ? (
                    <MovieList
                        movies={searchResults}
                        showLoadMore={false}
                        currentSearchQuery={currentSearchQuery}
                        // When in search mode, sorting/filtering props are not directly used by MovieList
                        // as search results are pre-fetched by App.jsx.
                        sortBy={null}
                        genre={null}
                    />
                ) : (
                    <MovieList
                        showLoadMore={true}
                        sortBy={sortBy} // Pass current sort option to MovieList for "Now Playing"
                        genre={genre} // Pass current genre filter to MovieList for "Now Playing"
                        currentSearchQuery={null} // Not relevant for "Now Playing"
                    />
                )}
            </main>
        </div>
    );
}

export default App;


















// function App() {
//   // State to store the movies returned from a search query.
//   const [searchResults, setSearchResults] = useState([]);
//   // State to track if the application is currently displaying search results.
//   // True when a search has been performed and results are to be shown.
//   // False when displaying the default "Now Playing" movies.
//   const [isSearching, setIsSearching] = useState(false);
//   // State to store the actual search query to differentiate between
//   // an empty search (which should go back to "Now Playing") and no results found.
//   const [currentSearchQuery, setCurrentSearchQuery] = useState('');

//   /**
//    * handleSearchResults
//    * This callback function is passed to MovieSearchSort.
//    * It's called when a search is performed, receiving the results array.
//    * It updates the searchResults state and sets the application to "searching" mode.
//    * @param {Array} results - An array of movie objects from the search API.
//    * @param {string} query - The search query that yielded these results.
//    */
//   const handleSearchResults = (results, query) => {
//     setSearchResults(results); // Update the search results state
//     setCurrentSearchQuery(query); // Store the current search query

//     // Set isSearching to true if there's a non-empty query.
//     // If the query is empty (e.g., search cleared), revert to "Now Playing" mode.
//     if (query && query.trim() !== '') {
//       setIsSearching(true);
//     } else {
//       setIsSearching(false); // Go back to "Now Playing" if search query is empty
//     }
//   };

//   return (
//     <div className="App bg-gray-900 min-h-screen text-white font-inter">
//       <header className="App-header bg-gray-800 p-4 shadow-md rounded-b-lg mb-8">
//         <h1 className="text-3xl font-bold text-center text-red-500 mb-4">Flixter</h1>
//         {/*
//           MovieSearchSort component:
//           It takes a callback 'onSearch' which will be triggered when a search is submitted.
//           The callback will receive the search results and the query.
//         */}
//         <MovieSearchSort onSearch={handleSearchResults} />
//       </header>
//       <main className="container mx-auto px-4 py-8">
//         {/*
//           MovieList component:
//           It conditionally receives props based on whether the app is in search mode or not.

//           If isSearching is true:
//           - 'movies' prop is set to 'searchResults'.
//           - 'showLoadMore' is set to false (because search results are not paginated via "Load More").

//           If isSearching is false:
//           - 'movies' prop is not passed (or defaults to empty array in MovieList).
//           - 'showLoadMore' is set to true (Movie List will fetch its own "Now Playing" with pagination).
//         */}
//         {isSearching ? (
//           <MovieList
//             movies={searchResults}
//             showLoadMore={false}
//             // Pass the current search query to MovieList for displaying "No results" message
//             currentSearchQuery={currentSearchQuery}
//           />
//         ) : (
//           <MovieList
//             showLoadMore={true}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;