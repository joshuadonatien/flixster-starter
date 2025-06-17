import React, { useState } from 'react';
import './MovieSearchSort.css'; // Your existing CSS for this component

const MovieSearchSort = ({ onSearch, sortBy, onSortChange, genre, onGenreChange, genres }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
        // If the search input is cleared, immediately trigger a search with empty query
        if (e.target.value.trim() === '') {
            onSearch(''); // Inform App.jsx that search is cleared
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // This component only handles the search query input and passes it up.
        // The actual search API call logic is in App.jsx's handleSearchResults.
        onSearch(searchQuery);
    };

    // New handler for the clear button
    const handleClearSearch = () => {
        setSearchQuery(''); // Clear the local search input state
        onSearch(''); // Inform App.jsx to reset search (go back to "Now Playing")
    };

    return (
        <div className="movie-search-sort-controls">
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    className="search-input"
                />
                {/* Clear button is now always rendered */}
                <button type="button" onClick={handleClearSearch} className="clear-search-button">
                    Clear
                </button>
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="control-group">
                <label htmlFor="sort-by">Sort By:</label>
                <select id="sort-by" value={sortBy} onChange={onSortChange} className="sort-select">
                    <option value="popularity.desc">Popularity (Default)</option>
                    <option value="title.asc">Title (A-Z)</option>
                    <option value="primary_release_date.desc">Release Date (Newest to Oldest)</option>
                    <option value="vote_average.desc">Vote Average (Highest to Lowest)</option>
                </select>
            </div>

            <div className="control-group">
                <label htmlFor="genre-filter">Genre:</label>
                <select id="genre-filter" value={genre} onChange={onGenreChange} className="genre-select">
                    <option value="">All Genres</option>
                    {genres.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MovieSearchSort;