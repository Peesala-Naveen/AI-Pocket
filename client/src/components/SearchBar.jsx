import { useState } from 'react';
import { useModels } from '../context/ModelContext';
import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useModels();
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value);
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <span className="search-icon">
          <HiSearch />
        </span>

        <input
          className="search-input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search by use case, feature, or model name..."
        />

        {inputValue.length > 0 && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear search">
            <HiX />
          </button>
        )}
      </div>

      {isSearching && (
        <div className="search-results-count">
          Found {searchResults.length} model{searchResults.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
