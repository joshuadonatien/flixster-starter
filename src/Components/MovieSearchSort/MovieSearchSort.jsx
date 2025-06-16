// src/Components/MovieSearchSort/MovieSearchSort.jsx
import React, { useState } from "react";
// FIX: Ensure explicit .css extension for the CSS import path.
import './MovieSearchSort.css'; // Ensure this CSS file exists in the same directory as MovieSearchSort.jsx
import axios from "axios"; // Ensure axios is imported if used for fetch

// Define API token once (outside component or as a constant inside if preferred)
// WARNING: The "import.meta" syntax relies on your build tool (e.g., Vite) correctly
// injecting environment variables. Ensure your .env file is set up with VITE_API_KEY.
const apiToken = import.meta.env.VITE_API_KEY;

/**
 * MovieSearchSort Component
 * Handles user input for searching movies and triggers the search API call.
 * It passes the search results and the query back to its parent component.
 * @param {object} props - Component props.
 * @param {function(Array<Object>, string): void} props.onSearch - Callback function to pass search results and query to the parent.
 */
function MovieSearchSort({ onSearch }) {
   const [searchQuery, setSearchQuery] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   // Handler for when the search input value changes
   const handleSearchChange = (event) => {
     setSearchQuery(event.target.value);
   };
  
   // Handler for clearing the search input
   const handleClearSearch = () => {
       setSearchQuery('');
       // When search is cleared, also inform the parent to clear results
       // and potentially switch back to "Now Playing" mode
       onSearch([], ''); // Pass empty array and empty query
   };

   // Handler for form submission (when user clicks Search button or presses Enter)
   const handleSubmit = async (event) => {
       event.preventDefault(); // Prevent default form submission (page reload)
       setLoading(true);
       setError(null);

       // If search query is empty, treat it as a clear search
       if (searchQuery.trim() === '') {
           handleClearSearch();
           setLoading(false);
           return;
       }

       try {
           const encodedQuery = encodeURIComponent(searchQuery);
           const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiToken}&query=${encodedQuery}&language=en-US`;

           // Using axios here for consistency with MovieList, but native fetch works too
           const response = await axios.get(url); 

           // Ensure the response is OK before processing
           if (response.status !== 200) {
             throw new Error(`HTTP error! Status: ${response.status}`);
           }

           const data = response.data; // Axios automatically parses JSON to data.data

           // Pass the results and the original query back to the parent component
           onSearch(data.results || [], searchQuery);

       } catch (err) {
           console.error("Failed to fetch movies:", err);
           setError("Failed to load movies. Please try again later.");
           // Pass empty results but retain query for error message context if needed in parent
           onSearch([], searchQuery); 
       } finally {
           setLoading(false);
       }
   };

   return (
       <div className="p-4 bg-gray-700 rounded-lg shadow-md flex flex-col items-center">
           <form onSubmit={handleSubmit} className="w-full max-w-md flex space-x-2 mb-4">
               <input
                   type="text"
                   value={searchQuery}
                   onChange={handleSearchChange}
                   placeholder="Search for a movie..."
                   className="flex-grow p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
               />
               <button
                   type="submit"
                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
               >
                   Search
               </button>
               <button
                   type="button"
                   onClick={handleClearSearch}
                   className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
               >
                   Clear
               </button>
           </form>

           {loading && <p className="text-blue-300 text-center">Loading movies...</p>}
           {error && <p className="text-red-400 text-center">{error}</p>}
       </div>
   );
}

export default MovieSearchSort;