import React, { useState } from 'react'; // Import useState hook
import './MovieSearchSort.css'; // Import component-specific styles

/**
 * MovieSearchSort Component
 * This component provides user interface elements for:
 * - Searching movies by title.
 * - Clearing the search input.
 * - Sorting "Now Playing" movies by various criteria.
 * - Filtering "Now Playing" movies by genre.
 *
 * It manages its own local state for the search input and
 * communicates user actions (search, sort, filter) to its parent via props.
 */
const MovieSearchSort = ({ onSearch, sortBy, onSortChange, genre, onGenreChange, genres }) => {
    // Local state to hold the current value of the search input field.
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * handleSearchInput
     * Updates the local `searchQuery` state as the user types in the search box.
     * If the input becomes empty, it immediately triggers the `onSearch` callback
     * with an empty string, effectively clearing the search in the parent component.
     *
     * @param {Object} e - The event object from the input field.
     */
    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value); // Update local state with input value
        // If the user clears the search input, immediately notify the parent.
        if (e.target.value.trim() === '') {
            onSearch(''); // Call parent's onSearch with an empty query
        }
    };

    /**
     * handleSearchSubmit
     * Handles the form submission when the "Search" button is clicked or Enter is pressed.
     * Prevents the default form submission behavior (page reload) and
     * calls the `onSearch` callback with the current search query.
     *
     * @param {Object} e - The event object from the form submission.
     */
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)
        onSearch(searchQuery); // Call parent's onSearch with the current query
    };

    /**
     * handleClearSearch
     * Clears the local `searchQuery` state and notifies the parent component
     * (via `onSearch('')`) that the search has been cleared, which typically
     * causes the app to revert to displaying "Now Playing" movies.
     */
    const handleClearSearch = () => {
        setSearchQuery(''); // Clear the local search input state
        onSearch(''); // Notify parent to clear search (revert to "Now Playing")
    };

    // --- JSX (UI Rendering) ---

    return (
        // Main container for search, sort, and filter controls
        <div className="movie-search-sort-controls">
            {/* Search form group */}
            <form onSubmit={handleSearchSubmit} className="search-form">
                {/* Search input field */}
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={searchQuery} // Controlled component: input value tied to state
                    onChange={handleSearchInput} // Update state on input change
                    className="search-input"
                />
                {/* Clear search button (always visible as per user's request) */}
                <button type="button" onClick={handleClearSearch} className="clear-search-button">
                    Clear
                </button>
                {/* Search submit button */}
                <button type="submit" className="search-button">Search</button>
            </form>

            {/* Sort By dropdown group */}
            <div className="control-group">
                <label htmlFor="sort-by">Sort By:</label>
                {/* Select element for sorting options */}
                <select id="sort-by" value={sortBy} onChange={onSortChange} className="sort-select">
                    <option value="popularity.desc">Popularity (Default)</option>
                    <option value="title.asc">Title (A-Z)</option>
                    <option value="primary_release_date.desc">Release Date (Newest to Oldest)</option>
                    <option value="vote_average.desc">Vote Average (Highest to Lowest)</option>
                </select>
            </div>

            {/* Genre Filter dropdown group */}
            <div className="control-group">
                <label htmlFor="genre-filter">Genre:</label>
                {/* Select element for genre filtering options */}
                <select id="genre-filter" value={genre} onChange={onGenreChange} className="genre-select">
                    <option value="">All Genres</option>
                    {/* Dynamically render genre options from the 'genres' prop */}
                    {genres.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MovieSearchSort; // Export the component